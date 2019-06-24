const Service = require('egg').Service;
const {createCronJob, deleteCronJob} = require('../common/cron-job')
const axios = require('axios')
const {findTargetDir, deleteDirsTag, enableTagOfDir} = require('../common/dir')
const {opts} = require('../common/utils')
const moment = require('moment')

class TagService extends Service {

  async saveTagSplit(tagId, tag) {
    const {model:{Taggroup}} = this.ctx
    const groupNum = (tag && tag.divedGroups && tag.divedGroups.split && tag.divedGroups.split.length) || 0
    let gp = {
      tagId,
      children: []
    }
    if(groupNum === 0) {
      gp.children.push(`${tagId}#1`)
    }
    else {
      for(let i = 1; i <= groupNum; i++){
        gp.children.push(`${tagId}#${i}`)
      }
    }
    //写入分组信息
    await Taggroup.insertMany(gp)
  }

  async save(data) {
    const {model:{Tag,Dir}} = this.ctx
    let {tagLevelId, name} = data
    let {privileges:{urls:{createItem}}} = this.config
    let targetDir = await Dir.findOne({_id:tagLevelId})
    let rs = void 0;
    if(targetDir) {
      if(!data.createDate) {
        data.createDate = new Date().getTime()
      }
      //按标签的分组存储分组id
      rs = await Tag.insertMany(data)
      let tagId = rs[0]._id.toString()
      let pid = tagLevelId
      //讲标签放入到目录
      let dir = {name, pid, tagId }
    
      let insertedResult = await Dir.insertMany(dir);
      debugger
      //调用java目录树加个节点
      let dirId = insertedResult[0]._id.toString()
      let item = {name, pid, tagId, id:dirId}
      let url = createItem
      debugger
      let tmpData = {
        method: 'POST',
        contentType: 'json',
        data: item,
        dataType: 'json',
      }
      debugger
      const result = await this.ctx.curl(createItem, tmpData);
      if(result) {
        this.logger.info("call java tree service created node")
      }
      else {
        this.logger.error("call java tree service failure")
      }
      debugger
    }
    else {
      throw new Error('创建标签的时候，选择的目录不存在')
    }
    debugger
    return rs
  }

  list() {
    const {model:{Tag}} = this.ctx
    return Tag.find({isActive:true},{_id:1, name:1})
  }

  queryTagById(id) {
    const {model:{Tag}} = this.ctx
    return Tag.findOne({_id: id, isActive:true})
  }

  updateCron(id, data) {
    const {model:{Tag}} = this.ctx
    return Tag.findOneAndUpdate({isActive:true, _id: id},{$set: data})
  }

  async update(id, data) {
    const {model:{Tag}} = this.ctx
    const newData =  {
      isActive: data.isActive,
      name: data.name,
      fromTable: data.fromTable,
      conditions: data.conditions,
      operator: data.operator,
      createUser: data.createUser
    }
    if(data.cron) {
      const tag = await Tag.findOne({_id: id})
      if (tag.cronJobId) {
        await deleteCronJob(tag.cronJobId)
      }
      const rs = await createCronJob(data.name, data.cron, id)
      if (rs.data.jobId) {
        newData.cronJobId = rs.data.jobId
      }
      newData.cron = data.cron
    }
    if (data.cronJobId) {
      newData.cronJobId = data.cronJobId
    }
    if(data.selectFields) {
      newData.selectFields = data.selectFields
    }
    if(data.divedGroups) {
      newData.divedGroups = data.divedGroups
    }
    //TODO
    
    return Tag.findOneAndUpdate({isActive:true, _id: id},{$set: Object.assign({}, newData)}, {upsert:false})
  }

  //删除标签
  async delete(id) {
    // 前端传送的tagId表达方式可能是tagId或者tagId@1
    const {model:{Tag,Dir}} = this.ctx
    let {privileges:{urls:{deleteTag, deleteItem}}}  = this.config
    let deleteTagUrl = deleteTag(id);
   
    //删除dc上对应的标签数据
    await this.deleteRedisTag(deleteTagUrl)

    //判断删除标签还是删除标签的一组数据
    const isDeleteGroup = id && id.indexOf('@') > 0

    if(isDeleteGroup) {
      //TODO 查询该组的分组是否有编号，没有加上
      const [head, tail] = id.split("@")
      const record = await this.queryTagById(head)
      if(record) {
        const targetGno = +tail[0]
        const groups = record.divedGroups.split
        const deletedIndex = groups.findIndex(g => g.gno === targetGno)
        if(deletedIndex > -1) {
          groups.splice(deletedIndex, 1)
          //更新组
          await Tag.findOneAndUpdate({_id:head},{$set: {divedGroups: record.divedGroups}}, opts)
        }
        else {
          throw new Error('请不要传入非法组号')
        }
        return "ok"
      }
      else {
        throw new Error('请不要传入组号不在的格式')
      }
    }
    else {
      // 删除普通的标签
      console.log('delete tag', Dir)
      //删除目录中的标签
      //通过标签id找到目录中的标签.
      const dir = await Dir.findOne({tagId:id})
      await Dir.deleteOne({tagId: id})
      //let deletedUrl = deleteItem(id);
      let deletedUrl = deleteItem(dir.id);
      

      //调用java目录树删除
      let tmpData = {
        method: 'delete',
        contentType: 'json',
        dataType: 'json',
      }
      let deletedResult = await this.ctx.curl(deletedUrl, tmpData);
      if(deletedResult) {
        this.logger.info("delete tag from tree")
      }

      return Tag.findOneAndUpdate({_id: id},{$set: {isActive:false}}, {upsert:false})
    }
    
  }

  //删除dc中redis的对应标签数据
  deleteRedisTag(url) {
    
    return new Promise((resolve, reject) => {
      axios.delete(url, {
        headers: {
            'Content-Type': 'application/json',
        }
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  async dynamicParseCondition(request) {
    
    /**
     * 如果含有isEnable的条件，就拿到相关信息
     * @param {*} conditions 
     */
    const existsEnable = (conditions) => {
      let  c = conditions || []
      let exists = c.map(condition => condition.field).includes("isEnable")
      let value = exists ? c.find(condition => condition.field === 'isEnable').values[0]:false
      let opt = exists ? c.find(condition => condition.field).opt: void 0

      return {exists, value, opt}
    }

    /**
     * 过滤一下isEnbale的信息
     * @param {*} tags 
     * @param {*} conditions 
     */
    const composeTags = (tags, conditions) => {

      let {exists, value, opt} = existsEnable(conditions)
      let rs = tags

      rs.forEach(tag => {
        //过期时间是否大于当前时间
         let isExpired = tag.expireDate ? new Date(tag.expireDate).getTime() > new Date().getTime():true
        //开始时间小于当前时间
         let startDate = tag.startDate ? new Date(tag.startDate).getTime() < new Date().getTime():true
        //是否被删除
        let isDeleted = tag.isActive
        tag.isEnable =  isExpired && startDate && isDeleted
      })
      
      if(exists) {
        debugger
        if(opt === 'eq') {
          rs = rs.filter(d => d.isEnable === value)
        }
        
      }
      debugger
      return rs
    }

    let query = {$and: []}
    let isContinued = true
    let {conditions} = request
    if(query.$and) {
      let size = (conditions || []).length
      debugger
      for(let i = 0; i < size ;i++) {
        let {field,values, opt} = conditions[i]
        if(field === "isEnable") {
          continue;
        }
        let item = {}
        item[field] = {
        } 
        let data = void 0
        opt = opt.toLowerCase()
        if(opt === 'between') {
          let min = Math.min(+values[0], +values[1])
          let max = Math.max(+values[0], +values[1])
          opt = "$gt"
          item[field][opt] = min
          query.$and.push(item)
          opt = "$lt"
          item[field][opt] = max
          query.$and.push(item)
          isContinued = false
          
        }
        else if(opt === 'like') {
          isContinued = true
          opt = "$regex"
          data = new RegExp(values[0], 'i')
        }
        else if(opt === 'start') {
          isContinued = true
          opt = "$regex"
          data = new RegExp(`^${values[0]}`, 'i')
        }
        else {
          isContinued = true
          opt = "$"+`${opt}`
          data = moment(values[0], "YYYY-MM-DD", true).isValid()? new Date(values[0]):values[0]
        }
        console.log(data, 'data')
        debugger
        if(isContinued) {
          item[field][opt] = data
          query.$and.push(item)
        }
      }
    }
    
    query.$and.push({
      "isActive":true
    })
    const {model:{Tag,Dir}} = this.ctx
    console.log('dynamic tag search:',JSON.stringify(query))
    //需要调用java的树
    debugger
    let {privileges:{urls:{tagTreeUrl}}} = this.config
    let tagLevel = await this.ctx.curl(tagTreeUrl, {dataType: 'json'});
    debugger
    let tags = await Tag.find(query).sort({"createDate": -1})
    tags = composeTags(tags, conditions)
    tags = tags.map(tag => {
      tag._doc.isEnable = tag.isEnable
      return tag._doc
    })
    debugger
    //const tagLevel = dataSetDirs
    //tagLevel = (tagLevel && tagLevel.data && tagLevel.data.root ) || []
    //return {tags, tagLevel}
    return {tags}
  }

  previewTag(url, body) {
    return new Promise((resolve, reject) => {
      axios.post(url, body, {
        headers: {
            'Content-Type': 'application/json',
        }
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  /**
   * 检查Tag的字段
   * @param {*} obj 
   * @param {*} fields 
   */
  checkTagFields(obj, fields) {
    if (!(Array.isArray(fields) && fields.length > 0)) {
      return {
        validate: false,
        errMsg: 'params fields is empty.'
      }
    }
    for(let i = 0; i < fields.length; i++) {
      const field = fields[i]
      if (!obj.hasOwnProperty(field)) {
        return {
          validate: false,
          errMsg: `field: ${field} is necessary`
        }
      }
    }
    return {
      validate: true
    }
  }

  /**
   * hiveBy与conditions二选一的有值
   * @param {*} obj 
   */
  checkConditionsOrHaving(obj) {
    let rs = false

    if(obj.hiveBy) {
      rs = Array.isArray(obj.hiveBy) && obj.hiveBy.length > 0
    }

    rs = rs || (Array.isArray(obj.conditions) && obj.conditions.length > 0)
    return rs
  }

  /**
   * 获取标签对应的用户数据
   * @param {*} tagId 
   * @param {*} pageCount 
   * @param {*} pageNum 
   */
  fetchTagMappedUsers(tagId, pageCount, pageNum) {
    let {privileges:{enable, dcEnable, urls:{tagMappedUsers}}}  = this.config
    let url = tagMappedUsers(tagId, pageCount, pageNum)
    return new Promise((resolve, reject) => {
      axios.get(url).then(d => resolve(d)).catch(err => reject(err))
    })  
  }
  
  async saveHistory(tags) {
    const {model:{Tag}} = this.ctx
    try {
      await Tag.insertMany(tags)
      return 'ok'
    } catch (error) {
      console.log(error.message)
      return 'import history failure'
    }
  }

  /**
   * 删除目中的标签,该标签在标签表中不存在的
   */
  async deleteDirtyData() {
    const {model:{Tag,Dir}} = this.ctx
    
    const dir =  await Dir.findOne({"category":"tag_level"})
    const dataSetDirs = dir.dataSetDirs
    
    let dirTagIds = new Set();

    const  iterateDir = (tagLevel)  => {
      
      for(let item of tagLevel) {
        let existsChildren = item.children && item.children.length > 0
        if(existsChildren) {
          iterateDir(item.children)
        }
        else {
          if(item._id) {
            dirTagIds.add(item._id)
          }
        }
      }
        
    }

    
    iterateDir(dataSetDirs)
    
    //标签目录表
    let dirTags = []

    dirTagIds.forEach(d => dirTags.push(d))

    let allTags = await Tag.find({},{_id:1})

    

    //标签列表
    allTags = allTags.map(item => item._id.toString())

    console.log('all Tags length:', allTags.length)

    console.log('dir tags length:', dirTags.length)

    let rs = dirTags.filter(d => !allTags.includes(d))
    console.log('rs', rs.length)
    let differ = (rs || []).length 

    process.nextTick(async () => {

      // 循环删除
      rs.forEach(d => deleteDirsTag(dataSetDirs, d))
      console.log('delete')
      await Dir.findOneAndUpdate({_id: dir._id},{$set: {dataSetDirs}}, opts)
    })


    return {rs:differ}
  }

}

module.exports = TagService;