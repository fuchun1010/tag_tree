'use strict'

// module.exports = app => {
//   const mongoose = app.mongoose
//   const dirSchema = new mongoose.Schema({
//     category: { type:String, required:true },
//     dataSetDirs: { type: Array, required: true  }
//   }, { collection: "tab_dirs" })
//   return mongoose.model('dir', dirSchema)
// }

module.exports = app => {
  const mongoose = app.mongoose
  const dirSchema = new mongoose.Schema({
    tagId: {type: String, required:false},
    name: {type:String, required: false},
    pid: { type: String, required: false}
  }, { collection: "tab_dirs" })
  return mongoose.model('dir', dirSchema)
}