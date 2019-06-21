'use strict';
/* eslint-disable */

const Service = require('egg').Service;

class SchemaService extends Service {
  
  save(d) {
    const data = Array.isArray(d) ? d:[d]
    return new Promise((resolve, reject) => {
      const {model:{Fun}} = this.ctx
      Fun.insertMany(data).then(rs => resolve(rs)).catch(err =>reject(err))
    })
  }
}

module.exports = SchemaService;

