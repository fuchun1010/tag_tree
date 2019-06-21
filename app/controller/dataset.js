'use strict';

const Controller = require('egg').Controller;
const {initErrorMessage} = require('../common/utils')
/**
 * 数据集router
 */

class DataSetController extends Controller {


  /**
   * 查询所有的数据集
   * 这个需要向DC发送查询请求
   */
  async list() {
    try {
      const rs = await this.service.dataSet.list()
      this.ctx.status = 200
      this.ctx.body = {
        data:{
          customCode: 600,
          list: rs
        }
      }
    } catch (error) {
      this.ctx.status = 200
      this.logger.error(`query dataset list error`)
      const info = initErrorMessage(error.message, 601)
      this.ctx.body = {
        data: {...info}
      }
    }
  }

  async fieldsByName() {
    try {
      const {params:{name}} = this.ctx
      const {privileges:{ dcEnable,urls:{fieldsBy} } } = this.config
      const rs = await this.ctx.service.dataSet.fields(name)
      let fields = rs ? rs.fields: void 0
      const url =  fieldsBy(name)
      debugger
      let  response = await this.ctx.curl(url, {dataType: 'json'})
      if(dcEnable) {
        const isSuccess = response && response.status === 200
        if(!isSuccess) {
          this.ctx.body = {
            info: initErrorMessage(`fetch fields by data set ${name} error:`, 500)
          }
          this.ctx.status = 500
          return 
        }
        if(!fields || fields.length === 0) {
          fields = response.data.name.map(rs => {
            return {fieldName:rs.name, fieldType:rs.dataType, desc: ""}
          })
        }
        else {
          for(let d of response.data.fields) {
            let exists = rs.fields.findIndex(f => f.fieldName === d.name) > - 1
            if(!exists) {
              const {name, dataType} = d
              rs.fields.push({fieldName:name, fieldType:dataType, desc: ""})
            }
          }
        }
      }
     
      this.ctx.body = {
        data: {
          customCode: 603,
          name: response.data.name,
          fields
        }
      }
      this.ctx.status = 200
      
    } catch (error) {
      this.logger.error(`query fields by Id error:${error.message}`)
      const info = initErrorMessage('query fields of data set failure', 604)
      this.ctx.body = {
        data: {
          ...info
        }
      }
      this.ctx.status = 200
    }
  }

}

module.exports = DataSetController
