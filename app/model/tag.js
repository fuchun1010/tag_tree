const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  
  const TagSchema = new mongoose.Schema(
    {
      isActive: { type: Boolean, required: true  },
      tagLevelId: { type: String, required: false },
      count: { type: Number, required: false },
      name: {type: String, required: false },
      fromTable: {type: String, required: false },
      selectFields: {type: Array, required: true},
      conditions: { type: Array, required: false },
      operator: {type :String, required: true },
      cron: {type:String, required: false},
      startDate: { type:String, required: false},
      endDate: { type: String, required: false},
      expireDate: {type: Date, required: false},
      groupBy: {
        type: Array, required: false
      },
      hiveBy: {
        type: Array, required: false
      },
      divedGroups: {
        orderBy: {
          type: Array, required: false
        },
        limit: {
          type:Number, 
          required: false
        },
        split: {
          type: Array, required: false
        },
        required: false
      },
      cronJobId: {type: ObjectId, required: false},
      createUser: {
        userId: {
          type:String, required: false
        },
        userName: {
          type:String, required: false
        }
      },

      createDate: {type: Date, required: false},
      tagContent: {type: String, required: true},
      executeStatus: {type: String, required: false}
      
    }, 
    {
      collection: 'tab_tags'
    }
  );

  return mongoose.model('tag', TagSchema);
}
