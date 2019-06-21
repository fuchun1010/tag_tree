const Controller = require('egg').Controller;
const {initErrorMessage} = require('../common/utils')
/**
 * 字段枚举
 */
class EnumsController extends Controller {

  async listEnums() {
    debugger
    const {params:{tableName, fieldName}} = this.ctx
    if(!tableName) {
      this.ctx.status = 200
      this.logger.error('table name is empty')
      const info = initErrorMessage('table name is empty', 610)
      this.ctx.body = {
        data:{...info}
      }
      return
    }
    if(!fieldName) {
      this.ctx.status = 200
      this.logger.error('field name is empty')
      const info = initErrorMessage('field name is empty', 611)
      this.ctx.body = {
        data:{...info}
      }
      return
    }
    try {
      const response = await this.service.enums.findData(tableName, fieldName)
      if(!response) {
        this.ctx.body = {
          data:{
            customCode: 612,
            list: []
          }
        }
        this.ctx.status = 200
        return
      }
      this.ctx.body = {
        data:{
          customCode: 613,
          list: response
        }
      }
      this.ctx.status = 200
    } catch (error) {
      const info = initErrorMessage(`fetch field enum error`,614)
      this.logger.error(`fetch field enum error: ${error.message}`)
      this.ctx.body = {
        data:{...info}
      }
      this.ctx.status = 200
    }

  }

}

module.exports = EnumsController