const {Service} = require('egg')
const {opts} = require('../common/utils')
const { findTargetDir } = require('../common/dir')

class DataSetService extends Service {

  list() {
    const {model:{Dataset}} = this.ctx
    return Dataset.find({isActive:true},{"__v":0})
  }
  
  fields(name) {
    const {model:{Dataset}} = this.ctx
    return Dataset.findOne({name},{fields:1,name:1})
  }

  async addField(tableName, field) {
    const response =  await this.fields(tableName)
    const {model:{Dataset}} = this.ctx
    const {fields} = response
    if(fields) {
      fields.push(field)
    }
    return Dataset.findOneAndUpdate({isActive:true, name:tableName},{$set: {fields}}, {upsert:true})
  }


}

module.exports = DataSetService