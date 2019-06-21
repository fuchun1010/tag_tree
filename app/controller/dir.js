const Controller = require('egg').Controller;
const {dataSetResponse} = require('../common/dataSet')
const {initErrorMessage} = require('../common/utils')
class DirController extends Controller {

  /**
   * 添加子目录
   */
  async addDir() {
    let {params:{parentId}, request:{body:{name}}} = this.ctx
    //let userId = (this.ctx.session && this.ctx.session.userId) || '5a9f54c614a4404865516573'
    try {
      let rs = await this.ctx.service.dir.addSubDir(parentId, name)
      this.ctx.body = {
        data:{
          customCode:621,
          id: rs
        }
      }
      this.ctx.status = 200
    }
    catch(e) {
      this.ctx.status = 500
      this.logger.error(`添加子目录异常:${e.message}`)
      const info = initErrorMessage(e.message, 622)
      this.ctx.body = {
        data:{...info}
      }
    }
  }

  /**
   * 添加数据集
   */
  async addDataSet() {
    const {params:{dirId}, request:{body:{dataSet}}} = this.ctx
    try {
      const userId = this.ctx.session.userId
      const dataSetId = await this.ctx.service.dir.addDataSet(dirId, dataSet, userId)
      this.ctx.status = 200
      this.ctx.body = {
        data:{
          dataSetId
        }
      }
    } catch (err) {
      this.ctx.status = 500
      this.logger.error(`添加数据集异常:${err.message}`)
      const info = initErrorMessage(e.message)
      this.ctx.body = {...info}
    }
  }

  /**
   * 创建根目录
   */
  async createRootDir() {
    const {request:{body}} = this.ctx
    try {
      const id = await this.service.dir.createRootDir(body)
      this.ctx.status = 200
      this.ctx.body = {
        data:{
          customCode: 635,
          id
        }
      }
    } catch (error) {
      this.ctx.status = 200
      const info = initErrorMessage(error.message, 636)
      this.logger.error(`create root error:${error.message}`)
      this.ctx.body = {
        ...info
      }
    }
  }

  /**
   * 删除目录
   */
  async deleteTargetDir() {
    let {params:{id}} = this.ctx
    try {
      const  rs = await this.service.dir.deleteAssignDir(id)
      this.ctx.body = {
        data: {
          customCode: 630,
          message: 'delete success'
        }
      }
      this.ctx.status =  200
    } catch (error) {
      this.ctx.status = 200
      const info = initErrorMessage(error.message, 631)
      console.error(error.message)
      this.logger.error(`deleteTargetDir error`)
      this.ctx.body = {
        data:{...info}
      }
    }
    
  }

  /**
   * 修改目录
   */
  async changeTargetDir() {
    const {params:{id}, request:{body:{name}}} = this.ctx
    try {
      const rs =  await this.ctx.service.dir.updateDir(id, name)
      this.ctx.body = {
        data:{
          customCode: 632,
          message: 'change dir success'
        }
      }
      this.ctx.status = 200
    } catch (error) {
      console.error(error.message)
      const info = initErrorMessage(error.message,633)
      this.logger.error(`update target dir error:${error.message}`)
      this.ctx.status = 200
      this.ctx.body = {
        data:{...info}
      }
    }
    
  }

  /**
   * 标签列表
   */
  async tagLevelList() {
    try {
      // const rs =  await this.ctx.service.dir.tagLevelList()
      // this.ctx.status = 200
      // this.ctx.body = {
      //   data: {
      //     customCode: 615,
      //     list: rs
      //   }
      // }

      let {privileges:{urls:{tagTreeUrl}}} = this.config
      let tagLevel = await this.ctx.curl(tagTreeUrl, {dataType: 'json'});
      this.ctx.status = 200
      this.ctx.body = {
        data:{
          customCode: 615,
          list: tagLevel.data
        }
      }

    } catch (error) {
      console.error(error.message)
      const info = initErrorMessage(error.message, 616)
      this.logger.error(`list tag level error:${error.message}`)
      this.ctx.status = 200
      this.ctx.body = {
        data: {...info}
      }
    }
  }
}

module.exports = DirController;