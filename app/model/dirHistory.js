'use strict'

// module.exports = app => {
//   const mongoose = app.mongoose
//   const dirHistorySchema = new mongoose.Schema({
//     tagId: {type: String, required:false},
//     name: {type:String, required: false},
//     pid: { type: String, required: false}
//   }, { collection: "tab_dir_history" })
//   return mongoose.model('dirHistory', dirHistorySchema)
// }

module.exports = app => {
  const mongoose = app.mongoose
  const dirSchema = new mongoose.Schema({
    category: { type:String, required:true },
    dataSetDirs: { type: Array, required: true  }
  }, { collection: "tab_dirs_history" })
  return mongoose.model('dirHistory', dirSchema)
}