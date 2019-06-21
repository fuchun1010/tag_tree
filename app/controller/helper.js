const Controller = require('egg').Controller;
class HelpController extends Controller {

  /**
   * 
   */
  async updateDir() {
    const {model:{Dir}} = this.ctx
    const {model:{Tag}} = this.ctx
    const dir = await Dir.findOne({category: "tag_level"})
    const assignDate = new Date('2018-08-29').getTime()
    const expireDate = '2018-01-21'
    const doc = dir._doc
    const _id = doc._id
    const dirs = doc.dataSetDirs || []
    dirs.forEach(d => this.compareCreateDateAndChange(d, assignDate, expireDate))
    const dataSetDirs = dirs
    await Dir.findOneAndUpdate({_id},{$set: {dataSetDirs}})
    let tags = await Tag.find()
    tags = tags.filter(d => d.createDate.getTime() < assignDate)
    for(let tag of tags) {
      await Tag.findOneAndUpdate({_id:tag._id},{$set:{expireDate}})
    }
    this.ctx.body = {
      process: "ok"
    }
  }

  compareCreateDateAndChange(dir, assignDate, expireDate) {
    const isExists = dir && Object.keys(dir).length > 0
    if(!isExists) {
      return void 0
    }
    const existsChildren = dir.children && dir.children.length > 0
    if(existsChildren) {
      for(let item of dir.children) {
        this.compareCreateDateAndChange(item,assignDate, expireDate)
      }
    }
    else {
      const isTag = dir.createDate
      if(isTag) {
        dir.expireDate =  dir.createDate < assignDate ? expireDate: dir.expireDate
      }
    }
    
  }

  
} 


module.exports = HelpController