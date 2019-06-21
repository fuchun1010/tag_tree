module.exports = app => {
  //永远不超时
  app.once('server', server => {
    server.timeout = 0
  })
  app.beforeStart(async () => {
    //初始化菜单和管理员账户
    //1. 如果菜单数据为空,加上初始化的菜单数据
    //2. 如果管理员账户为空,加上初始化的菜单数据
    const ctx = app.createAnonymousContext()
    await ctx.service.menu.init()
    console.log('...init menu complete....')
    // await ctx.service.user.init()
    // console.log('...init user complete....')
    // // let rs = await ctx.service.dir.init('dir')
    // // if(rs === 'ok') {
    // //   console.log('...init dir complete....')
    // // }
    // else {
    //   console.log('...init dir failure....')
    // }
    
    // await ctx.service.dir.init('tag_level')
    // console.log('...init tag level complete....')

    await ctx.service.enums.initEnums()
    console.log('...init field enums.....')
    
  }) 

}