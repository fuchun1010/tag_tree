'use strict';
/* eslint-disable */
module.exports = app => {
  const mongoose = app.mongoose
  const schema = new mongoose.Schema({
    name: String,
    password: String
  }, { collection: "tab_users" })
  return mongoose.model('user', schema)
}
