'use strict'

const ms = require('ms')
const Controller =  require('egg').Controller
const md5 = require('md5')
const {dataSetResponse} = require('../common/dataSet')
class UserController extends Controller {

  /**
   * 验证用户
   */
  async validate() {
    const {request:{body:{username, password}}} = this.ctx
    console.log('username:'+username+" password:"+password)
    const isEmptyUser = username && username.length == 0
    const isEmptyPwd = password && password.length == 0
    const ctx = this.ctx
    const error = {code: 500, message: ''}
    if(isEmptyUser) {
      error.message = '用户名必填'
    }
    else if(isEmptyPwd) {
      error.message = '密码必填'
    }
    if(isEmptyPwd || isEmptyUser){
      ctx.body = {
        error
      }
    }
    else {
      const user =  await this.service.user.validateUser(username, md5(password))
      const existUser = user && user.id
      if(existUser) {
        ctx.session.userId = user.id
        ctx.session.maxAge = ms('1d')
        ctx.body = {
          userId: user.id
        }
      }
      else {
        error.message = '用户名密码不匹配'
        ctx.body = {
          error
        }
      }
    }
  }

  /**
   * 获取用户操作
   */
  async profile() {
    
    const isLoginUser = this.ctx.session.userId && this.ctx.session.userId.length > 0 
    
    if(isLoginUser) {
      let menus = await this.service.menu.selectMenusWith(this.ctx.session.userId)
      let dataSetDirs = await this.service.dir.filterPrivileges(this.ctx.session.userId)
      let defaultDataSet = await this.service.dir.findDataSet(void 0)
      defaultDataSet = dataSetResponse(defaultDataSet)
      console.log(JSON.stringify(defaultDataSet, null, 2))
      this.ctx.body = {
        menus,
        dataSetDirs,
        defaultDataSet
      
      }
    }
    else {
      this.ctx.body = {
        error:{
          code: 500,
          message: '非法登录用户'
        }
      }
      this.ctx.status = 500      
    }
  }

  /**
   * 创建用户
   */
  async create() {
    const {request:{body: { username, password }}} = this.ctx
    let isEmptyUser = username && username.trim().length === 0
    if(isEmptyUser){
      this.ctx.status = 500
      this.ctx.body = {
        code: 500,
        message: '用户名不允许是空'
      }
      return
    }

    let isExisted = await this.service.user.isExistedUser(username)
    if(isExisted) {
      this.ctx.status = 500
      this.ctx.body = {
        code: 500,
        message: `${username}已经存在`
      }
      return
    }

    try {
      await this.service.user.create(username, password)
      this.ctx.status = 200
    } catch (err) {
      this.ctx.status = 500
      this.logger.error(`创建用户异常:${err.message}`)
      this.ctx.body = {
        code: 500,
        message: `注册新用户失败:${err.message}`
      }
    }

  }

} 

module.exports = UserController