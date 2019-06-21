'use strict';
/* eslint-disable */
const Controller = require('egg').Controller;

/**
 * 创建meta data schema in mongo 
 */
class SchemaController extends Controller {
  async index() {
    //TODO 创建方法
    const data = {
      desc: '求和',
      name: 'sum',
      parameters: [
        {
          inputType: 'n'
        }
      ]
    }
    const rs = await this.ctx.service.schema.save(data)
    this.ctx.body = {
      status: "schema ok"
    }
  }
}

module.exports = SchemaController;