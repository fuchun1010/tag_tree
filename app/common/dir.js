

const deleteDirTag = (dir, tagId) => {
  let len = dir.children && dir.children.length
  for(let i = 0; i < len; i++) {
    let item = dir.children[i]
    if(item._id === tagId) {
      dir.children.splice(i, 1)
      return 'ok'
    }
    else {
      let rs = deleteDirTag(item, tagId)
      if(rs) {
        return rs
      }
    }
  }
}

const findDir = (dir, dirId) => {

  if(dir.id && dir.id.toString() === dirId) {
    return dir
  }
  else {
    if(dir.children) {
      const len = dir.children.length
      for(let i = 0; i < len; i++) {
        let item = dir.children[i]
        let rs = findDir(item, dirId)
        if(rs) {
          return rs
        }
      }
    }
  }
}

const findTargetDir = (dirs, parentDirId) => {

  const isDirs = dirs && Array.isArray(dirs) && dirs.length > 0

  if(!isDirs) {
    throw new Error('不是目录结构')
  }
  let tmp = void 0
  for(let dir of dirs) {
    tmp = findDir(dir, parentDirId)
    if(tmp) {
      break
    }
  }
  return tmp
}

const findTargetDataSet = (dirs, dataSetId) => {

  if(!dirs) {
    return []
  }

  const findDataSet = (dir, dataSetId) => {
    if(dir._id == dataSetId) {
      return dir
    }
    else {
      if(dir.children) {
        for(let d of dir.children) {
          let rs = findDataSet(d, dataSetId)
          if(rs) {
            return rs
          }
        }
      }
    }
  }

  for(let dir of dirs) {
    let rs = findDataSet(dir, dataSetId)
    if(rs) {
      return rs
    }
  }

  return void 0
}

const findFirstDataSet = (dirs) => {

  const firstDataSet = (dir) => {

    if(dir._id) {
      return dir
    }
    else {
      if(dir.children) {
        for(let d of dir.children) {
          let rs = firstDataSet(d)
          if(rs) {
            return rs
          }
        }
      }
    }
    
  } 

  for(let dir of dirs) {
    let rs = firstDataSet(dir)
    if(rs) {
      return rs
    }
  }
}

const deleteDir = (dirs, dirId) =>{

  let tmpDir = void 0
  let len = dirs.length

  for(let i = 0; i < len;i++) {
    let node = dirs[i]
    if(node.id.toString() === dirId) {
      dirs.splice(i,1)
      return
    }
  }

  for(let dir of dirs) {
    tmpDir = findDir(dir, dirId)
    if(tmpDir) {
      tmpDir = dir
      break
    }
  }
  

  const del = (dir, id) => {
    let len = dir.children && dir.children.length
    for(let i = 0; i < len; i++){
      let node =  dir.children[i]
      debugger
      if(node.id.toString() === id) {
        dir.children.splice(i, 1)
        return
      }
      else {
        del(node, id)
      }
    }
  }

  if(tmpDir) {
    del(tmpDir, dirId)
  }

}

const deleteDirsTag = (dirs, tagId) => {
  for(let dir of dirs) {
    let rs = deleteDirTag(dir, tagId)
    if(rs) {
      break
    }
  }
}

const updateTargetDir = (dirs, dirId, name) => {

  for(let dir of dirs) {
    let tmp = findDir(dir, dirId)
    if(tmp) {
      tmp.name = name
      break
    }
  }

}

const enableTagOfDir = (dir) => {
  let len = dir.children && dir.children.length
  for(let i = 0; i < len; i++) {
    let item = dir.children[i]
    if(item.isActive === false) {
      dir.children.splice(i, 1)
      return 'ok'
    }
    else {
      let rs = deleteDirTag(item)
      if(rs) {
        return rs
      }
    }
  }
}

module.exports = {
  findTargetDir,
  findTargetDataSet,
  findFirstDataSet,
  deleteDir,
  updateTargetDir,
  deleteDirsTag,
  enableTagOfDir
}