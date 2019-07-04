'use strict';
const axios = require('axios')
const Controller = require('egg').Controller
const parser = require('cron-parser')
const {initErrorMessage} = require('../common/utils')
const {createCronJob, notifyDC2Calculate} = require('../common/cron-job')
const ObjectId = require('mongodb').ObjectID
const moment = require('moment')
const fs = require('fs')
const path = require('path')
let historyPath = process.cwd() + "/" + "history" + "/" + "history_tag.json"
const historiesTag = require(historyPath)
var mongoose = require('mongoose');

/**
 * 标签router
 */
class TagController extends Controller {

  /**
   * 创建标签
   */
  async create() {
    try {
      const {request:{body}} = this.ctx
      
      let necessaryFields = [
        'isActive', 'tagLevelId', 'fromTable',
        'name', 'selectFields', 'conditions', 
        'createUser', 'expireDate', 'tagContent'
      ]

      if(body.cron) {
        necessaryFields.push('startDate');
      }

      let {validate, errMsg} = this.service.tag.checkTagFields(body, necessaryFields)
      validate = this.service.tag.checkConditionsOrHaving(body) && validate
      if(!validate) {
        this.ctx.status = 200
        let info = initErrorMessage(errMsg, 617)
        this.ctx.body =  {...info}
        return
      }
      const rs = await this.service.tag.save(body)
      debugger
      this.ctx.status = 201
      const that = this
      
      this.ctx.body = {
        data:{
          customCode: 618,
          id: rs[0]._id.toString()
        }
      }
      const tagId = rs[0]._id.toString()

      if (rs[0]._id) {
        if (body.cron) {
          //验证cron是否合法
          parser.parseExpression(body.cron)
          //发送到定时任务系统里面
          const rs1 = await createCronJob(body.name, body.cron, tagId)
          this.logger.info(`创建标签定时任务成功, tagId =>`, tagId)
          if (rs1.data.jobId) {
            await that.service.tag.updateCron(tagId, {cronJobId: rs1.data.jobId})
            this.logger.info(`更新标签定时任务cronJobId成功, tagId =>`, tagId, 'cronjobid =>', rs1.data.jobId)
          }
        } 
        //不管是否有定时器,都异步调用DC的API服务，将标签发送到DC,如果有cron根据定时机器调用DC
        body.id = tagId
        let {privileges:{enable, dcEnable, urls}}  = this.config
        let url = urls.createTag
        //解析sql
        let sql = this.ctx.service.sqlParser.toSql(body)
        //当前时间
        //let cDate = `${moment().format('YYYY-MM-DD')} 00:00:00`
        let dt = new Date()
        let cDate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() +" "+"00:"+"00:"+"00"
        let currentStamp = new Date(dt).getTime();
        let expireStamp = new Date(body.expireDate).getTime()
        let keepSeconds = Math.floor((expireStamp - currentStamp)/1000)
        let simpleSqlTag = {
          id:tagId,
          sql,
          keepSeconds
        }
        //如果有定时,送到dc的时候带上
        if(body.cron) {
          simpleSqlTag.cron = body.cron
        }
        //let existsDivedGroups = body.divedGroups && body.divedGroups.length > 0
        if(body.divedGroups) {
          simpleSqlTag.divedGroups = body.divedGroups
        }
        debugger
        const createdTag = JSON.stringify(simpleSqlTag)
        this.logger.info(`send created tag to dc:${createdTag}`)
        notifyDC2Calculate(simpleSqlTag, url).then((resp) => {
          this.logger.info(`tagId为[${rs[0]._id}]已通知dc`)
          this.logger.info(resp)
        })
        
      }
    } catch (error) {
      this.logger.error(`创建标签异常:${error.message}`,619)
      const info = initErrorMessage(`create tag error`)
      this.ctx.status = 200
      this.ctx.body =  {
        data: {
          ...info
        }
      }
      
    }
  }

  async tags() {
    try {
      const rs = await this.service.tag.list();
      const isExisted = rs && rs.length > 0
      this.ctx.status = 200
      if(isExisted) {
        let tagList = rs.map(d => {
          const data = {id: d._id.toString(), name: d.name};
          return data
        })
        this.ctx.body = {
          data: {
            customCode: 605,
            list: tagList
          }
        }
      }
      else {
        this.ctx.body = {
          customCode: 606,
          data: {
            list: []
          }
        }
      }
    } catch (error) {
      this.ctx.status = 200
      this.logger.error(`查询标签列表异常:${error.message}`)
      let info = initErrorMessage(`query tag list error`, 607)
      this.ctx.body = {
        ...info
      }
    }
    
  }

  /**
   *  查询对应标签的内容
   */
  async queryTagContent() {
    try {
      //TODO 这个地方需要修改tagLevel, 需要从java获取
      const {params:{id}} = this.ctx
      const tag = await this.service.tag.queryTagById(id)
      // const tagLevel = await this.service.dir.findDirLevel('tag_level')
      let {privileges:{urls:{tagTreeUrl}}} = this.config
      let tagLevel = await this.ctx.curl(tagTreeUrl, {dataType: 'json'});
      this.ctx.status = 200
      this.ctx.body = {
        data:{
          customCode: 608,
          tag,
          tagLevel: tagLevel.data
        }
      }
    } catch (error) {
      this.logger.error(`查询标签内容异常:${error.message}`)
      let info = initErrorMessage(`查询标签内容异常:${error.message}`, 609)
      this.ctx.body = {
        data: {
          ...info
        }
      }
      this.ctx.status = 200
    }
    
  }

  async delete() {
    try {
      const {params:{id},model:{Taggroup}} = this.ctx
      //TODO 从标签层级删除，要废弃
      const rs = await this.service.tag.delete(id)
      const ok = rs && !rs.error
      await Taggroup.remove({tagId: id})
      this.ctx.body = {
        data:{
          customCode: 625,
          message: '删除成功'
        }
      }
      this.ctx.status = 200
      //TODO 异步调用DC的API服务，将标签发送到DC,如果有cron根据定时机器调用DC
    } catch (error) {
      this.ctx.status = 200
      let info = initErrorMessage(`delete tag error`,626)
      this.logger.error(`删除标签异常:${error.message}`)
      this.ctx.body = {
        data:{...info}
      }
    }
  }

  
  /**
   * 预览标签
   */
  async preview() {
    //TODO这个需要从DC取出来
    const {request:{body}} = this.ctx
    let {privileges:{urls}}  = this.config
    //check tag some fields
    const necessaryFields = [
      'id', 'isActive', 'fromTable', 'selectFields', 'conditions', 'createUser'
    ]
    let {validate, errMsg} = this.service.tag.checkTagFields(body, necessaryFields)
    //debugger
    validate = this.service.tag.checkConditionsOrHaving(body) && validate
    if(!validate) {
      let info = initErrorMessage(errMsg, 400)
      this.ctx.body =  {...info}
      this.ctx.status = 200
      return
    }
    //=============================
    try {
      let sql = this.ctx.service.sqlParser.toSql(body)
      console.log('sql--->',sql)
      let id = body.id 
      //预览的时候不需要分组信息
      let sqlTag = {
        id,
        sql
      }
      //debugger
      const {data:{info,count}} = await this.service.tag.previewTag(urls.preview, sqlTag)
      if(info && info.code === 409) {
        this.ctx.body = {
          data:{
            customCode: 628,
            message: 'preview conflict'
          }
        }
        return 
      }

      let response_code = count === -1 ? 629 : 627
      this.ctx.body = {
        data:{
          customCode: response_code,
          count
        }
      }
      this.ctx.status = 200
    } catch (error) {
      console.error(`preview tag error:${error.message}`)
      this.logger.error(`preview tag error:${error.message}`)
      this.ctx.body = {
        data:{
          customCode: 629,
          message: `preview tag error`
        }
      }
      this.ctx.status = 200
    }
    
  }

  /**
   * 模糊匹配标签
   */
  async search() {
    //debugger
    const {request:{body}} = this.ctx
    try {
      const response = await this.service.tag.dynamicParseCondition(body)
      this.ctx.body = {
        data:{
          customCode: 623,
          response 
        }
      }
    } catch (error) {
      //debugger
      console.error(`search tag error:${error.message}`)
      this.logger.error(`search tag error:${error.message}`)
      let info = initErrorMessage(`search tag with regular failure`,624)
      this.ctx.body = {
        data: {...info}
      }
      this.ctx.status = 200
    }
    
  }

  /**
   * 通知dc生成最新的数据
   * 定时任务系统将会调用此api，然后此api将会通知dc去更新tagid对应的tag产生新的数据
   */
  async triggerTagCron() {
    const {request:{body: {tagId}}} = this.ctx
    let tag = void 0
    try {
      tag = await this.service.tag.queryTagById(tagId)
      if (tag && tag._doc && tag._doc.isActive && tag._doc.expireDate) {
        let {expireDate} = tag._doc
        expireDate = new Date(expireDate).getTime()
        let {isActive, startDate, divedGroups} = tag._doc
        let isDeleted = isActive
        let isNotExpired = new Date().getTime() <= expireDate
        let isValidateDate = isDeleted && isNotExpired && (new Date(startDate).getTime() <= new Date().getTime())
        if (!isValidateDate) {
          this.logger.error(tagId + '标签没有到期或者失效了')
          this.ctx.body = {
            err: tagId + '不在标签运行周期内'
          }
          this.ctx.status = 200
          return
        }
        tag._doc.id = tag._doc._id.toString()
        delete tag._doc._id
        let {privileges:{enable, dcEnable, urls}}  = this.config
        let url = urls.createTag
        //解析成对应的sql
        let sql = this.ctx.service.sqlParser.toSql(tag._doc)
        let simpleSqlTag = {
          id: tag._doc.id,
          sql
        }
        
        if(tag._doc.cron) {
          simpleSqlTag.cron = tag._doc.cron
        }

        //如果有分组带上
        if(divedGroups){
          simpleSqlTag.divedGroups = divedGroups
        }
        const that = this
        //异步发送消息
        process.nextTick(function() {
          notifyDC2Calculate(simpleSqlTag, url)
          .then(resp => {
            that.logger.info(`tagId为[${tag._doc.id}]已通知dc`)
            that.logger.info(resp)
          }).catch(err => that.logger.error(`async trigger cron exception:${err.message}`))
        })
        this.ctx.status = 200
      } else {
        this.logger.error(tagId + ':tagId不存在')
        this.ctx.body = {
          err: tagId + ':tagId不存在'
        }
        this.ctx.status = 200
      }
      
    } catch(e) {
      let errMsg = void 0
      if (tag) {
        errMsg = `触发tagId为[${tag._doc.id}]计算数据失败`
        this.logger.error(errMsg)
      }
      this.logger.error(e)
      let info = initErrorMessage(`触发tagId为[${tag._doc.id}]计算数据失败:${e.message}`)
      this.ctx.body = {
        info
      }
      this.ctx.status = 500
    }
  }

  /**
   * 根据标签获取用户列表
   */
  async queryTagMappedUserInfo () {
    let {params:{tagId, pageCount, pageNum}} = this.ctx
    try {
      let res = await this.service.tag.fetchTagMappedUsers(tagId, pageCount, pageNum)
      this.ctx.body = {
        data: {
          list: res.data
        }
      }
      this.ctx.status = 200
    } catch (error) {
      console.error(`queryTagMappedUserInfo  error:${error.message}`)
      this.logger.error(`queryTagMappedUserInfo  error:${error.message}`)
      let info = initErrorMessage(`queryTagMappedUserInfo:${error.message}`)
      this.ctx.body = {
        info
      }
      this.ctx.status = 200
    }
  }

  /**
   * controller 更改tag的count
   */
  async updateCount() {
    console.log('hello')
    try {
      const {request:{body: {data}}} = this.ctx
      const {model:{Tag}} = this.ctx
      debugger
      const bulk = Tag.collection.initializeUnorderedBulkOp()
      for(let d  of data) {
        bulk.find( { _id: ObjectId(d.tagId) } ).update( { $set: { count: d.count } } )
      }
      bulk.execute()
      this.ctx.status = 200
    }
    catch(e) {
      debugger
      this.ctx.status = 500
    }
  }

  /**
   * 导入历史标签
   */
  async importHistoryTag() {
    let tags = historiesTag.data
    let status = await this.service.tag.saveHistory(tags)
    if(status === 'ok') {
      this.ctx.body = 'import history ok'
    }
    else {
      this.ctx.body = 'import history failure'
    }
    
  }

  async deleteDirtyData() {
    
    let rs =  await this.service.tag.deleteDirtyData();
    this.ctx.body = {rs}
  }

  /**
   * 查询扁平化的标签
   */
  async queryAllTagPlanLevel() {
    let rows = [
      {"id":"1", "pid":null,"name":"目录1"},
      {"id":"2", "tagId": "tagA", name:"tagA", pid: "1"},
      {"id":"3", "pid":"1","name":"目录2"},
      {"id":"4", "tagId": "tagB", name:"tagB", pid: "3"}
    ]
    const {model:{Dir,Tag}} = this.ctx
    
    let response = await Dir.find()
    let result = []
    for(let item of response) {
      //debugger
      let id  = item.id.toString && item.id.toString()
      let pid = item.pid
      let name = item.name
      let tagId = item.tagId
      //计算标签是否失效
      if(tagId){
        //通过tagId查询到标签详情数据
        let tag =await Tag.findOne({_id:tagId})
        //在tab_tags表中可以找到对应的tag,则设置相应的isEnable状态
        if(tag){
          let {isActive,expireDate,createDate} = tag
          //过期时间是否大于当前时间
          let isExpired = expireDate ? new Date(expireDate).getTime() > new Date().getTime():true
          //开始时间是否小于当前时间
          let startDate = createDate ? new Date(createDate).getTime() < new Date().getTime():true
          //是否被删除
          let isDeleted = isActive
          let isEnable = isExpired && startDate && isDeleted
          result.push({id, pid, name, tagId, isEnable}) 
        }else{
          //如果在tab_tags表中没找到tag,则将isEnable设置为false.(不生效)
          let isEnable = false
          result.push({id, pid, name, tagId,isEnable})
        }
      }else{
        //目录结构不需要设置isEnable状态!
        result.push({id, pid, name, tagId}) 
      }
    }

    this.ctx.body = {
      records: result
    }

  }

  /**
   * 将历史层级标签转换成扁平标签
   */
  async importDirHistory() {
    let response = await this.service.tagHelper.tagLevelTree2Row()
    let values = response.map(d => {
      if(!d.id) {
        console.log(d)
      }
        let _id = mongoose.Types.ObjectId(d.id)
        let tagId = d.tagId
        let name = d.name
        let pid = d.pid
        return {_id, tagId, name, pid}
    })
    const {model:{Dir}} = this.ctx

    try {
      await Dir.insertMany(values);
      this.ctx.body = {
        "result": "import dir history ok, number is:" + values.length
      }
    } catch (error) {
      this.ctx.body = {
        "result": "import dir history failure" + error.message
      }
    }
  }
  
}

module.exports = TagController;