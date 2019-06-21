'use strict';
/* eslint-disable */
module.exports = app => {
  const mongoose = app.mongoose
  const schema = new mongoose.Schema({
    name: String,
    icon: String,
    owners: [{
      id:String,
      type: String
    }]
  }, { collection: "tab_menus" })
  return mongoose.model('menu', schema)
}

