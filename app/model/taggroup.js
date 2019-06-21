'use strict'
module.exports = app => {
  const mongoose = app.mongoose;
  
  const TagGroupSchema = new mongoose.Schema(
    {
      "tagId":{type:String, require:true},
      "children":{type:Array, required:true}
    }, 
    {
      collection: 'tab_tag_groups'
    }
  )
  return mongoose.model('tagGroup', TagGroupSchema);
}
