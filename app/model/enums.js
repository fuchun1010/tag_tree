'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const enumSchema = new mongoose.Schema({
    tableName: {type:String, required: true, index: true},
    fieldName: {type:String, required:true, index: true},
    category: { type:String, required:true },
    data: { type: Array, required: true  }
  }, { collection: "tab_field_enums" })
  return mongoose.model('enums', enumSchema)
}