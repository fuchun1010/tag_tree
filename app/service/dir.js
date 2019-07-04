'use strict';
/* eslint-disable */

const Service = require('egg').Service
const {
  findTargetDir, 
  findTargetDataSet, 
  findFirstDataSet, 
  deleteDir,
  updateTargetDir,
  enableTagOfDir
} = require('../common/dir')
const ObjectID = require("bson-objectid")
const {opts} = require('../common/utils')
const moment = require('moment')

class DirService extends Service {

  /**
   * 添加子目录
   * @param {*} userId 
   * @param {*} parentDirId 
   * 
   * @param {*} name 
   */
  async addSubDir(parentDirId, name) {
    
    const {model:{Dir}} = this.ctx
    let {privileges:{urls:{createItem}}} = this.config

    let data = {name, pid:parentDirId}
    let rs = await Dir.insertMany(data)
    let item = void 0
    if(rs) {
      let  subDirId = rs[0]._id.toString()
      //调用java服务,创建目录
      item = {name, pid:parentDirId,id:subDirId}
      let tmpData = {
        method: 'POST',
        contentType: 'json',
        data: item,
        dataType: 'json',
      }
      const result = await this.ctx.curl(createItem, tmpData);
      if(result) {
        this.logger.info("call java tree service created dir")
      }
      return subDirId
    }
    else {
      throw new Error("create dir error")
    }


  }


  /**
   * 创建根目录的标签层级
   * @param {*} data 
   */
  async createRootDir(data) {
    const {model:{Dir}} = this.ctx
    let {privileges:{urls:{createItem}}} = this.config
    let {name} = data
    let item = {name,pid: null}
    let rs = await Dir.insertMany(item);
    let id = rs[0]._id.toString();
    item.id = id
    let tmpData = {
      method: 'POST',
      contentType: 'json',
      data: item,
      dataType: 'json',
    }
    //调用java添加内存根节点
    const result = await this.ctx.curl(createItem, tmpData);
    if(result) {
      this.logger.info("call java tree service created dir")
    }
    return id 
    
    
  }

  

  /**
   * 删除
   * @param {*} dirId 
   */
  async deleteAssignDir(dirId) {
    const {model:{Dir,Tag}} = this.ctx
    let {privileges:{urls:{createItem,tagTreeUrl, deleteItem}}} = this.config
    let deletedUrl = deleteItem(dirId);
    console.log('deletedUrl', deletedUrl)
    let tmpData = {
      method: 'delete',
      contentType: 'json',
      dataType: 'json',
    }
    
    let _id = dirId
    let target = await Dir.findOne({_id});
    let isTag = target && target.tagId

    if(isTag) {
      //1. 删除记录
      //2. 调用java删除,调用返回java的tree树
      //调用java目录树删除
      let deletedResult = await this.ctx.curl(deletedUrl, tmpData);
      if(!deletedResult) {
        throw new Error('delete tag of dir failure')
      }
      else {
        await Tag.findOneAndUpdate({_id: target.tagId}, {$set:{isActive:false}})
        await Dir.deleteOne({_id})
        this.logger.info("delete tag from dir success")
      }
    }
    else {
      //删除目录
      let id =  dirId
      debugger
      let children = await Dir.find({pid:id})
      if(children.length > 0) {
        throw new Error('还有子数据,禁止删除')
      }
      else {
        let deletedResult = await this.ctx.curl(deletedUrl, tmpData);
        if(!deletedResult) {
          throw new Error('delete dir failure')
        }
        else {
          await Dir.deleteOne({_id:id})
        }
      }
     // 删除java缓存中的目录.
      // let deletedResult = await this.ctx.curl(deletedUrl, tmpData);
      // if(!deletedResult){
      //   throw new Error('delete dir failure')
      // }else{
      //   //递归删除目录.
      //    await this.recursionDeleteDirById(id)
      // }
    }

    let tree = await this.ctx.curl(tagTreeUrl, {dataType: 'json'});
    if(tree) {
      let {data:{root}} = tree
      return root
    }
    else {
      throw new Error("query tree from java exception")
    }
    
  }

  //递归删除目录
  // async recursionDeleteDirById (id) {
  //     const {model:{Dir}} = this.ctx
  //     let children = await Dir.find({pid:id})
  //     let len = children.length
  //     debugger
  //     for(let i = 0; i < len; i++){
  //       if(!children[i].tagId){
  //          await this.recursionDeleteDirById(id)
  //       }
  //     } 
  //     await Dir.deleteOne({_id:id})
  //   }

  async updateDir(dirId, name) {
    const {model:{Dir}} = this.ctx
    let {privileges:{urls:{updateItem}}} = this.config
    let updateUrl = updateItem(dirId,name)
    console.log('updateUrl', updateUrl)
    let tmpData = {
      method: 'put',
      contentType: 'json',
      dataType: 'json',
    }
    const rs = await Dir.findOneAndUpdate({_id:dirId},{$set: {name}}, opts)
    //调用java程序修改目录
    //debugger
    let result = await this.ctx.curl(updateUrl,tmpData)
    if(!result.status===200){
      console.error('update tee free java error!')
      throw new Error('update tree from java exception');
    }
    return rs
  }

  async tagLevelList() {
    let {privileges:{urls:{tagTreeUrl}}}  = this.config
    let response =   await this.ctx.curl(tagTreeUrl, {dataType: 'json'});
    return response.data;
  }

  async findTagLevelId(category) {
    const {model:{Dir}} = this.ctx
    const {_id} = await Dir.findOne({category})
    return _id
  }
}

module.exports = DirService;