const Service = require('egg').Service

const {getMenus} = require('../common/menu')

class MenuService extends Service {

  count(options) {
    const {model:{Menu}} = this.ctx
    return new Promise((resolve, reject) => {
      Menu.count(options, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }

  select(options) {
    return new Promise((resolve, reject) => {
      const {model:{Menu}} = this.ctx
      Menu.find(options).select({ _id: 1, name: 1, owners: 1, icon:1}).exec((err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }

  async init() {
    const num = await this.count({})
    if(num === 0) {
      
      let menus = [{name: '变量管理', icon: 'data1'}, {name: '标签管理', icon: 'tag'}, {name:'管理配置', icon: 'config'}]
      menus = menus.map(menu => {
        return {
          name: menu.name,
          icon: menu.icon,
          owners: []
        }
      })
      return new Promise((resolve, reject) => {
        const {model:{Menu}} = this.ctx
        Menu.insertMany(menus).then(rs => resolve('ok')).catch(err => reject(err))
      })
    } 

    return new Promise((resolve, reject) => resolve('ok'))
    
  }

  async selectMenusWith(userId) {
    let menus = await this.select({})
    let isNotEmpty = menus && Array.isArray(menus) && menus.length > 0
    
    if(isNotEmpty) {
      menus = menus.map(m => {
        let obj = {id:m.id,owners:m.owners,name:m.name, icon: m.icon}
        return obj
      })
      menus = getMenus(menus, userId)
      return menus
    }
    else {
      return []
    }
    
  }
}

module.exports = MenuService