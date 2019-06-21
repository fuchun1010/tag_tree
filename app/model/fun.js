'use strict';
/* eslint-disable */
module.exports = app => {
  const mongoose = app.mongoose
  const schema = new mongoose.Schema({
    desc: String,
    name: String,
    parameters: [{
      inputType:String
    }]
  }, { collection: "tab_functions" })
  return mongoose.model('fun', schema)
}

