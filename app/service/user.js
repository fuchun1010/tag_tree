const Service = require('egg').Service;
const md5 = require('md5')

class UserService extends Service {
  
  count(options) {
    const {model:{User}} = this.ctx
    return new Promise((resolve, reject) => {
      User.count(options, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }

  async init() {
    const num = await this.count({})
    if(num === 0) {
      const admin = {
        name: 'admin',
        password: md5('admin')
      }
      return new Promise((resolve, reject) => {
        const {model:{User}} = this.ctx
        User.insertMany(admin).then(rs => resolve('ok')).catch(err => reject(err))
      })
    } 
    return new Promise((resolve, reject) => resolve('ok'))
  }

  async validateUser(name, password) {
    return new Promise((resolve, reject) => {
      const {model:{User}} = this.ctx
      User.findOne({name, password}, (err, data) => err ? reject(err): resolve(data))
    })
  }

  async findAdminId() {
    return new Promise((resolve, reject) => {
      const {model:{User}} = this.ctx
      User.findOne({name: 'admin'}, (err, data) => err ? reject(err): resolve(data.id))
    })
  }

  async findUser(id) {
    return new Promise((resolve, reject) => {
      const {model:{User}} = this.ctx
      User.findOne({_id: id}, (err, data) => err ? reject(err): resolve(data))
    })
  }

  async isExistedUser(name) {
    try {
      const num = await this.count({name})
      return num > 0
    } catch (err) {
      this.ctx.logger.error(`check user unique exception: {err.message}`)
      return false
    }
  }

  /**
   * 创建用户
   * @param {*} name 
   * @param {*} password 
   */
  async create(name, password) {
    return new Promise((resolve, reject) => {
      const {model:{User}} = this.ctx
      User.insertMany({name, password: md5(password)}).then(rs => resolve(rs)).catch(err => reject(err))
    })
  }

}

module.exports = UserService