const Service = require('egg').Service;
var mongoose = require('mongoose');

class TagHelper extends Service {

    async tagLevelTree2Row() {
      let rs = []

      function convert(node, path) {
  
          let isNode = node.children && node.children.length > 0
          let {id, name, children, _id} = node;
          let cell = {id: (id && id.toString && id.toString()) || id, name}


          if(_id) {
            cell.tagId = _id;
            //后来加的
            cell.id = _id
          }
          path.push(cell)
          if(isNode) {
            let len = children.length
            for(let i = 0; i < len; i++) {
              let subNode = children[i]
              convert(subNode, path)
              //debugger
            }
            len = path.length 
            if(len > 0) {
              path.splice(len - 1)
            }
          }
          else {
            //debugger
            let tmpRow = []
            let len = path.length

            for(let index = 0; index < len; index++) {
              let cell = path[index]
              tmpRow.push(cell)
            }
            
            
            rs.push(tmpRow)
            tmpRow = []
            
            len = path.length
            if(len > 0) {
              path.splice(len - 1)
            }
          }
          
      }

      const {model:{DirHistory}} = this.ctx
      const tagDirTree = await DirHistory.findOne({category:"tag_level"})
      if(!tagDirTree) {
        throw new Error('tagDirTree not exists')
      }
      let isOk = tagDirTree.dataSetDirs && tagDirTree.dataSetDirs.length > 0
      if(tagDirTree.dataSetDirs) {
        const {dataSetDirs} = tagDirTree
        dataSetDirs.forEach(element => {
          convert(element, [])
          //console.log('xxx')
        });
      }
      
      //去重复
      let rows = this.toFlatRow(rs)
      let set  = new Set()
      let result = []
      for(let row of rows) {

        let key = row.id.toString()
        if(set.size == 0) {
          set.add(key)
          result.push(row)
        }
        else  {
          if(!set.has(key)) {
            result.push(row)
            set.add(key)
          }
        }
      }
      console.log('result length:',result.length)
      console.log('last length:',rows.length)
      return result
    }

    toFlatRow(content) {
      let rows = []
      for(let i =0, len = content.length; i < len; i++) {
        let group = content[i]
        let pid = null
        let index = 0
        for(let j =0, size = group.length; j < size; j++) {
          
          let {id, name, tagId} = group[j]
          let isNode = tagId ? false:true
          
          let pid = j == 0 ? null:group[j-1].id

          let tmpItem = {id, name, pid}

          if(tagId) {
            tmpItem.tagId = tagId
          }
          rows.push(tmpItem)				
        }
        pid = null

      }
      return rows
    }

}

module.exports = TagHelper;