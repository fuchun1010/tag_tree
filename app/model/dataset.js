'use strict';
/* eslint-disable */
module.exports = app => {
  const mongoose = app.mongoose
  const datasetSchema = new mongoose.Schema({
    name: {type: String, required:true},
    isAgg: {type: Boolean, required: true},
    dirId:{type: String, required:false},
    dataSetId: {type: Number, required:true},
    isActive: {type: Boolean, required: true},
    fields: {type:Array, required:true}
  }, { collection: "tab_data_sets" })
  return mongoose.model('dataset', datasetSchema)
}