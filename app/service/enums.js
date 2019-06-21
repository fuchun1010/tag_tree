const {Service} = require('egg')
const path = require('path')
const csvParser = require('csv-parse')
const fs = require('fs')
class EnumService extends Service {


  //mk_tag_transaction_order
  fetchEnumTableNames() {
    let names = {}
    names.aggSum = 'mem_market_tag_sum'
    names.orderTable = 'mk_tag_rchg_order'
    names.details = 'mk_tag_order_details'
    names.consOrder = 'mk_tag_cons_order'
    names.transOrder = 'mk_tag_transaction_order'
    return names;
  }


  /**
   * 统计枚举的数量
   */
  async countEnums() {
  
    const {model:{Enums}} = this.ctx
    return Enums.count()
  }

  readAllCsv(fileName, delimiter) {
    const csvPath = path.resolve('app/init', fileName)
    const lines = []
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
      .pipe(csvParser({delimiter}))
      .on('data', line => {
         lines.push(line)
      })
      .on('end',() => {
        resolve(lines)
      }).on('error', err => {
        reject(err)
      })
    })
  }

  async initMarket() {
    let lines = await this.extractLines('mem_market.csv', ',')
    lines = lines.map(d => {
      let item = {
        tableName: d[0],
        fieldName: d[1].toLowerCase(),
        code: d[2],
        desc: d[3]
      }
      return item
    }).filter(d => d.tableName && d.tableName.length > 0)
    return this.toFlatLine(lines)
  }

  async initMember() {
    let lines = await this.extractLines('member_level.csv', '\t')
    let tables = [this.fetchEnumTableNames().aggSum]
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'member_level_id',
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    
    return this.toFlatLine(rs)
  }

  async initCityTree() {
    let cityTree = await this.fruitTree('city.csv', ',')
    let fields = [
      'item_consume_city_code'
    ]
    let exists = cityTree && cityTree.length > 0
    let orderTableName = this.fetchEnumTableNames().orderTable
    let detailsTableName = this.fetchEnumTableNames().details
    let consOrderName = this.fetchEnumTableNames().consOrder
    let tables  = [detailsTableName]
    let data = []
    if(exists) {
      tables.forEach(t => {
        fields.forEach(f => {
          data.push({
            tableName: t,
            fieldName: f,
            category: 'tree',
            data: cityTree
          })
        })
      })
      
    }

    fields = [
      'register_city_code', 
      'last_consume_city_code', 
      'last_refund_city_code',
      'last_deposit_city_code'
    ]
    tables  = [this.fetchEnumTableNames().aggSum]
    tables.forEach(t => {
      fields.forEach(f => {
        data.push({
          tableName: t,
          fieldName: f,
          category: 'tree',
          data: cityTree
        })
      })
    })

    fields = [
      'rchg_city_code'
    ]
    tables  = [orderTableName]
    tables.forEach(t => {
      fields.forEach(f => {
        data.push({
          tableName: t,
          fieldName: f,
          category: 'tree',
          data: cityTree
        })
      })
    })

    fields = [
      'consume_city_code'
    ]
    tables  = [consOrderName]
    tables.forEach(t => {
      fields.forEach(f => {
        data.push({
          tableName: t,
          fieldName: f,
          category: 'tree',
          data: cityTree
        })
      })
    })

    return data
  }

  /**
   * 初始化性别
   */
  async initGender() {
    let lines = await this.extractLines('gender.csv', ',')
    let tables = [this.fetchEnumTableNames().aggSum]
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'member_sex',
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    
    return this.toFlatLine(rs)
  }


  async loadCsvLinesAndGenerateDataFields({filename, separator, fields, data, tables}) {
    let lines = await this.extractLines(filename, separator)
    tables.forEach(t => {
      fields.forEach(f => {
        lines.forEach(d => {
          data.push({
            tableName: t,
            fieldName: f,
            code: d[0],
            desc: d[1]
          })
        })
      })
    })
  }


  /**
   * 初始化第三方渠道
   */
  async initTppChannelKey() {
    let lines = await this.extractLines('last_deposit_channel.csv', ',')
    let transOrderName = this.fetchEnumTableNames().transOrder
    let tables = []
    let fields = ['last_deposit_channel']
    let data = []
    tables  = [this.fetchEnumTableNames().aggSum]
    tables.forEach(t => {
      fields.forEach(f => {
        lines.forEach(d => {
          data.push({
            tableName: t,
            fieldName: f,
            code: d[0],
            desc: d[1]
          })
        })
      })
    })
    fields = ['deposit_channel']
    tables = [transOrderName]
    tables.forEach(t => {
      fields.forEach(f => {
        lines.forEach(d => {
          data.push({
            tableName: t,
            fieldName: f,
            code: d[0],
            desc: d[1]
          })
        })
      })
    })

    await this.loadCsvLinesAndGenerateDataFields({
      filename: 'third_channel.csv',
      separator: ',',
      fields: ['last_consume_channel'],
      data,
      tables: [this.fetchEnumTableNames().aggSum],
    })

    await this.loadCsvLinesAndGenerateDataFields({
      filename: 'tpp_payment_type.csv',
      separator: ',',
      fields: ['tpp_payment_type'],
      data,
      tables: [this.fetchEnumTableNames().consOrder],
    })

    await this.loadCsvLinesAndGenerateDataFields({
      filename: 'last_refund_channel.csv',
      separator: ',',
      fields: ['last_refund_channel'],
      data,
      tables: [this.fetchEnumTableNames().aggSum],
    })

    await this.loadCsvLinesAndGenerateDataFields({
      filename: 'refund_channel.csv',
      separator: ',',
      fields: ['refund_channel'],
      data,
      tables: [this.fetchEnumTableNames().consOrder],
    })

    //rchg_channel
    await this.loadCsvLinesAndGenerateDataFields({
      filename: 'member_chongzhi.csv',
      separator: ',',
      fields: ['rchg_channel'],
      data,
      tables: [this.fetchEnumTableNames().orderTable]
    })

    return this.toFlatLine(data)
  }

  /**
   * tppPaymentType
   */
  async initTppPaymentType() {
    let lines = await this.extractLines('tpp_payment_type.csv', ',')
    let detailsTableName = this.fetchEnumTableNames().details
    let tables = [detailsTableName]
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'item_tpp_payment_type',
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  /**
   * 初始化渠道
   */
  async initChannel() {
    let data = []
    let fields = ['consume_channel']
    let lines = await this.readAllCsv('third_channel.csv', ',')
    let register_channelLines = await this.readAllCsv('register_channel.csv', ',')
    let consume_channelLines = await this.readAllCsv('consume_channel.csv', ',')
    let aggTableName = this.fetchEnumTableNames().aggSum
    let detailTableName = this.fetchEnumTableNames().details
    let consOrderName = this.fetchEnumTableNames().consOrder

    fields.forEach(f => {
      let c1 = consume_channelLines.map(d => {
        let item = {
          tableName: consOrderName,
          fieldName: f.toLowerCase(),
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      data = data.concat(this.toFlatLine(c1))
    })

    fields = ['register_channel']
    
    fields.forEach(f => {
       let c2 = register_channelLines.map(d => {
        let item = {
          tableName: aggTableName,
          fieldName: f.toLowerCase(),
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      let rs = this.toFlatLine(c2)
      data = data.concat(rs)
    })

    fields = ['item_consume_channel']
    fields.forEach(f => {
       let c2 = consume_channelLines.map(d => {
        let item = {
          tableName: detailTableName,
          fieldName: f.toLowerCase(),
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      let rs = this.toFlatLine(c2)
      data = data.concat(rs)
    })
    
    return data
  }

  async initEnums() {

    const num = await this.countEnums()
    
    if(num === 0) {
      let detailTableName = this.fetchEnumTableNames().details
      let data = []
      let rs = await this.initMarket()
      data  = data.concat(rs)
      
      //会员等级
      rs = await this.initMember()
      data = data.concat(rs)
      
      //城市树
      rs = await this.initCityTree()
      data  = data.concat(rs)

      //创建配送中心树枚举
      let orgData = await this.storeTree()
      let isExists = orgData && orgData.length > 0
      if(isExists) {
        //字段不一致,但是都是对应相同的门店树
        let storedFields = [
          'item_consume_store_code',
          'item_consume_org_code'
        ]
        storedFields.forEach(store => {
          data.push({
            tableName: detailTableName,
            fieldName: store.toLowerCase(),
            category: 'tree',
            data: orgData
          })
        })
        
        storedFields = [
          'register_store_code',
          'register_org_code', 
          'first_login_store', 
          'last_consume_store_code',
          'last_deposit_store_code',
          'last_refund_store_code',
          'last_consume_org_code',
          'last_deposit_org_code',
          'last_refund_org_code'
        ]
        let aggTableName = this.fetchEnumTableNames().aggSum
        let orderTableName = this.fetchEnumTableNames().orderTable
        let consOrderName = this.fetchEnumTableNames().consOrder
        storedFields.forEach(store => {
          data.push({
            tableName: aggTableName,
            fieldName: store.toLowerCase(),
            category: 'tree',
            data: orgData
          })
        })
        
        storedFields = [
          'rchg_store_code',
          'rchg_org_code'
        ]
        
        storedFields.forEach(store => {
          data.push({
            tableName: orderTableName,
            fieldName: store.toLowerCase(),
            category: 'tree',
            data: orgData
          })
        })

        storedFields = [
          'consume_store_code',
          'consume_org_code'
        ]
        storedFields.forEach(store => {
          data.push({
            tableName: consOrderName,
            fieldName: store.toLowerCase(),
            category: 'tree',
            data: orgData
          })
        })
      }
      
      //创建水果种类🌲枚举
      let fruitData = await this.fruitTree('fruit.csv', ',')
      let itemCodeData = await this.fruitTree('itemcode.csv', ',')
      isExists = fruitData && fruitData.length > 0
      
      if(isExists) {
        let goods = ['small_type_code', 'middle_type_code']

        goods.forEach(g => {
          data.push({
            tableName: detailTableName,
            fieldName: g,
            category: 'tree',
            data: fruitData
          })
        })
        goods = ['itemcode']
        goods.forEach(g => {
          data.push({
            tableName: detailTableName,
            fieldName: g,
            category: 'tree',
            data: itemCodeData
          })
        })
        
      }

      //生成渠道 to 问题
      let channelData = await this.initChannel()
      if(channelData && channelData.length > 0) {
        data = data.concat(channelData)
      }

      //业务类型
      let businessTypeData = await this.initBusinessType()
      if(businessTypeData && businessTypeData.length > 0) {
        data = data.concat(businessTypeData)
      }

      //星期类型
      let shopCycle = await this.initShopCycle()
      if(shopCycle && shopCycle.length > 0) {
        data = data.concat(shopCycle)
      }

      //周期类型
      let shopPeriod = await this.initShopPeriod()
      if(shopPeriod && shopPeriod.length > 0) {
        data = data.concat(shopPeriod)
      }

      //第三方渠道
      let thirdChannels = await this.initTppChannelKey()
      if(thirdChannels && Array.isArray(thirdChannels) && thirdChannels.length > 0) {
        data = data.concat(thirdChannels)
      }

      //支付方式
      let payWays = await this.initPayWay()
      if(payWays && Array.isArray(payWays) && payWays.length > 0) {
        data = data.concat(payWays)
      }

      //支付方式1
      let pay1 = await this.initOrderDetailPayWay()
      if(pay1 && Array.isArray(pay1) && pay1.length > 0) {
        data = data.concat(pay1)
      }

      //tppPaymentType
      let tppPaymentType =await this.initTppPaymentType()
      if(tppPaymentType && Array.isArray(tppPaymentType) && tppPaymentType.length > 0) {
        data = data.concat(tppPaymentType)
      }

      //sex channel
      let genders = await this.initGender()
      if(genders && Array.isArray(genders) && genders.length > 0) {
        data = data.concat(genders)
      }

      //status chanel
      let statuses = await this.initStatus()
      if(statuses && Array.isArray(statuses) && statuses.length > 0) {
        data = data.concat(statuses)
      }

      //心享会员类型
      let enjoyType = await this.initHvipType()
      if(enjoyType && Array.isArray(enjoyType) && enjoyType.length > 0) {
        data = data.concat(enjoyType)
      }

      //心享开通渠道
      let enjoyChannel = await this.initEnjoyChannel()
      if(enjoyChannel && Array.isArray(enjoyChannel) && enjoyChannel.length > 0) {
        data = data.concat(enjoyChannel)
      }

      //心享核销渠道
      let enjoyHeXiao = await this.initEnjoyHeXiao();
      if(enjoyHeXiao && Array.isArray(enjoyHeXiao) && enjoyHeXiao.length > 0) {
        data = data.concat(enjoyHeXiao)
      }

      //开通心享门店
      let enjoyStore = await this.initEnjoyStore()
      if(enjoyStore && Array.isArray(enjoyStore) && enjoyStore.length > 0) {
        data = data.concat(enjoyStore)
      }

      //开通心享城市
      let enjoyCity = await this.initEnjoyCity()
      if(enjoyCity && Array.isArray(enjoyCity) && enjoyCity.length > 0) {
        data = data.concat(enjoyCity)
      }

      //开通心享区域
      let enjoyArea = await this.initEnjoyArea()
      if(enjoyArea && Array.isArray(enjoyArea) && enjoyArea.length > 0) {
        data = data.concat(enjoyArea)
      }

      //心享会员过期
      let expiredEnjoy = await this.initExpiredEnjoy()
      if(expiredEnjoy && Array.isArray(expiredEnjoy) && expiredEnjoy.length > 0) {
        data = data.concat(expiredEnjoy)
      }

      //临时新乡会员过期
      let tried = await this.initExpiredTryEnjoy()
      if(tried && Array.isArray(tried) && tried.length > 0) {
        data = data.concat(tried)
      }
      
      //mk_tag_mem_coupon_status => couponStatus
      let couponStatus = await this.initCouponStatus()
      if(couponStatus && Array.isArray(couponStatus) && couponStatus.length > 0) {
        data = data.concat(couponStatus)
      }

      //mk_tag_mem_coupon_status =>  couponType
      let couponType = await this.initCouponType()
      if(couponType && Array.isArray(couponType) && couponType.length > 0) {
        data = data.concat(couponType)
      }

      //mk_tag_mem_coupon_status =>  CouponWay
      let couponWay = await this.initCouponWay()
      if(couponWay && Array.isArray(couponWay) && couponWay.length > 0) {
        data = data.concat(couponWay)
      }
      //mk_tag_mem_coupon_status =>  ReceiveChannel
      let receiveChannel = await this.initReceiveChannel()
      if(receiveChannel && Array.isArray(receiveChannel) && receiveChannel.length > 0) {
        data = data.concat(receiveChannel)
      }

      const {model:{Enums}} = this.ctx
      return  Enums.insertMany(data)
    }
  }

  

  /**
   * 生成购买周期枚举
   */
  async initShopCycle() {
    let fields = ['shop_cycle']
    let lines = await this.readAllCsv('shopcycle.csv', ',')
    let aggTableName = this.fetchEnumTableNames().aggSum
    let detailTableName = this.fetchEnumTableNames().details
    let consOrderName = this.fetchEnumTableNames().consOrder
    let data = []
    fields.forEach(f => {
       let c1 = lines.map(d => {
        let item = {
          tableName: consOrderName,
          fieldName: f.toLowerCase(),
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      data = data.concat(this.toFlatLine(c1))
    })
    fields = ['last_3m_shop_cycle']
    fields.forEach(f => {
       let c2 = lines.map(d => {
        let item = {
          tableName: aggTableName,
          fieldName: f.toLowerCase(),
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      let rs = this.toFlatLine(c2)
      data = data.concat(rs)
    })

    fields = ['item_shop_cycle']
    fields.forEach(f => {
       let c2 = lines.map(d => {
        let item = {
          tableName: detailTableName,
          fieldName: f.toLowerCase(),
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      let rs = this.toFlatLine(c2)
      data = data.concat(rs)
    })
    return data
  }

  /**
   * 生成购买时间段枚举
   */
  async initShopPeriod() {
    //item_shop_cycle
    let fields = ['item_shop_period']
    let lines = await this.readAllCsv('shop_period.csv', ',')
    let detailTableName = this.fetchEnumTableNames().details
    let data = []
    fields.forEach(f => {
       let c1 = lines.map(d => {
        let item = {
          tableName: detailTableName,
          fieldName: f.toLowerCase(),
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      data = data.concat(this.toFlatLine(c1))
    })
    return data
  }

  /**
   * 初始化业务类型枚举
   */
  async initBusinessType() {
    let fields = ['busi_type']
    let lines = await this.readAllCsv('business_type.csv', ',')
    let transOrderName = this.fetchEnumTableNames().transOrder
    let data = []
    fields.forEach(f => {
      let c1 = lines.map(d => {
       let item = {
         tableName: transOrderName,
         fieldName: f.toLowerCase(),
         code: d[0],
         desc: d[1]
       }
       return item
     }).filter(d => d.tableName && d.tableName.length > 0)
     data = data.concat(this.toFlatLine(c1))
   })
    return data
  }

  /**
   * 初始化状态
   */
  async initStatus() {
    let aggTableName = this.fetchEnumTableNames().aggSum
    let tables = [aggTableName]
    let lines = await this.readAllCsv('status.csv', ',')
    let data = []
    tables.forEach(t => {
      let c1 = lines.map(d => {
       let item = {
         tableName: t,
         fieldName: 'status',
         code: d[0],
         desc: d[1]
       }
       return item
     }).filter(d => d.tableName && d.tableName.length > 0)
     data = data.concat(this.toFlatLine(c1))
   })
    return data
  }

  /**
   * 配送中心
   */
  async storeTree() {
    const lines = await this.readAllCsv('erp.csv',',')
    let [tail, ...stores] = lines
    
    stores = stores.map(d => {
      let item = {}
      item.orgCode = d[0]
      item.orgDesc = d[1]
      item.storeCode = d[2]
      item.storeDesc = d[3]
      return item
    })
    
    const searchNode = (node, orgCode) => {
      const targetCode = node.code 
      if(targetCode === orgCode) {
        return node
      }
      else {
        let len = (node.children && node.children.length) || 0
        for(let i = 0; i < len; i++) {
          let item = node.children[i]
          let target = searchNode(item, orgCode)
          if(target) {
            return target
          }
        }
      }

    }

    let data = []
    let p = data
    const convertToTree = (item) => {
      const isEmptyRoot = Object.keys(p).length === 0
      const {orgCode, orgDesc, storeCode, storeDesc} = item
      if(isEmptyRoot) {
        
        let item = {
          code: orgCode,
          desc: orgDesc,
          children: []
        }
        item.children.push({
          code: storeCode,
          desc: storeDesc
        })
        data.push(item)
        p = data
      }
      else {
        let target = void 0
        let len = data.length
        for(let i = 0; i < len ; i++) {
          let n = data[i]
          target = searchNode(n, orgCode)
          if(target) {
            break
          }
        }
        if(target) {
          p = target
          let tmp = {
            code: storeCode,
            desc: storeDesc
          }
          p.children && p.children.push(tmp)
        }
        else {
          p = data
          let tmp = {
            code: orgCode,
            desc: orgDesc,
            children: []
          }
          let item = {
            code: storeCode,
            desc: storeDesc
          }
          tmp.children.push(item)
          p.push(tmp)
          
        }
      }

    }

    stores.forEach(d => convertToTree(d))
    
    return data
  }

  async fruitTree(fileName, delimiter) {
    let lines = await this.readAllCsv(fileName, delimiter)
    let [head, ...tail] = lines
    let p  = {}
    let n = {}
    let root = []

    const searchNode = (item, targetCode) => {
      let isNotEmpty = 'code' in item
      if(isNotEmpty) {
        if(item.code === targetCode) {
          return item
        }
        else {
          let len = (item.children && item.children.length) || 0
          for(let i = 0; i < len; i++) {
            let n = item.children[i]
            let rs = searchNode(n, targetCode)
            if(rs) {
              return rs
            }
          }
        }
      }
    }

    let len = tail.length
    
    const startRoot = (code) => {
      for(let item of root) {
        if(item.code === code) {
          return item
        }
      }
    }

    for(let i = 0; i < tail.length; i++) {
      let record  = tail[i]
      //console.log('row num is:', i)
      // if(i > 810) {
      //   console.log('xx')
      // }
      for(let j = 0; j < record.length; j++) {
        
        let isCode = j % 2 === 0
        if(isCode) {
          let rs = void 0
          let tsLen = root.length
          for(let k = 0; k < tsLen; k++){
            let topCode = record[0]
            var topParent = startRoot(topCode)
            //rs = searchNode(root[k], record[j])
            if(!topParent) {
              break;
            }
            rs = searchNode(topParent, record[j])
            if(rs) {
              break
            }
          }
          if(rs) {
            if(rs.children) {
              n = rs.children
            }
            continue;
          }
          if(j === 0 && !rs) {
            p = {
              code: record[j],
              desc: record[j+1],
              children:[]
            }
            n = p.children
            root.push(p)
          }
          else if(j != record.length - 1) {
            let tmp = {
              code: record[j],
              desc: record[j+1],
              children: []
            }
            n.push(tmp)
            n = tmp.children
          }
          else {
            let tmp = {
              code: record[j],
              desc: record[j+1]
            }
            n.push(tmp)
          }
        }
        
      }
    }
    return root
  }

  async extractLines(filename, delimiter) {
    let lines =  await this.readAllCsv(filename,delimiter)
    return lines
  }

  /**
   * 支付方式
   */
  async initPayWay() {
    //pay_way
    let lines = await this.extractLines('pay_way.csv', ',')
    let tables = [this.fetchEnumTableNames().consOrder]
    let fields = ['pay_way']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'pay_way',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  async initOrderDetailPayWay() {
    //pay_way
    let lines = await this.extractLines('pay_way.csv', ',')
    let detailsTableName = this.fetchEnumTableNames().details
    let tables = [detailsTableName]
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'item_pay_way',
          code: d[0],
          desc: d[1]
        }
        return item
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    
    return this.toFlatLine(rs)
  }

  toFlatLine(lines) {
    let data = []
    let item = {}
    lines.forEach(d => {
      let {tableName, fieldName, code, desc} = d
      let tmp =data.filter(d => d.tableName === tableName && d.fieldName === fieldName) || []
      if(tmp.length === 0 ) {
        item = {
          tableName,
          fieldName: fieldName && fieldName.toLowerCase(),
          category: 'flat',
          data: []
        }
        item.data.push({
          code,
          desc
        })
        data.push(item)
      }
      else {
        tmp[0].data.push({
          code,
          desc
        })
      }

    })
    return data
  }

  /**
   * 心享会员
   */
  async initHvipType() {
    //
    let lines = await this.extractLines('hvip_type.csv', ',')
    let tables = ['mk_tag_mem_hvip_info']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'hvip_type',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  /**
   * 心享开通渠道
   */
  async initEnjoyChannel() {
    let lines = await this.extractLines('hvip_reg_chnl.csv', ',')
    let tables = ['mk_tag_mem_hvip_info']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'hvip_reg_chnl',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  /**
   * 心享开通渠道
   */
  async initEnjoyStore() {
    //
    console.log("**************initEnjoyStore******************")
    let stores = await this.fruitTree('erp.csv', ',')
    let exists = stores && stores.length > 0
    let fields = ['hvip_reg_store_code']
    let tables  = ['mk_tag_mem_hvip_info']
    let data = []
    if(exists) {
      tables.forEach(t => {
        fields.forEach(f => {
          data.push({
            tableName: t,
            fieldName: f,
            category: 'tree',
            data: stores
          })
        })
      })
      
    }

    return data;
  }

  /**
   * 开通心享城市
   */
  async initEnjoyCity() {
    debugger
    console.log('xxxxxxxxxxxinitEnjoyCityxxxxxxxxxxxxxxxxxxxx')
    let cityTree = await this.fruitTree('hvip_reg_city_code.csv', ',')
    let exists = cityTree && cityTree.length > 0
    let fields = ['hvip_reg_city_code']
    let tables  = ['mk_tag_mem_hvip_info']
    let data = []
    if(exists) {
      tables.forEach(t => {
        fields.forEach(f => {
          data.push({
            tableName: t,
            fieldName: f,
            category: 'tree',
            data: cityTree
          })
        })
      })
      
    }

    return data;

  }

  /**
   * 开通心享区域
   */
  async initEnjoyArea() {
    
    let stores = await this.fruitTree('erp.csv', ',')
    let exists = stores && stores.length > 0
    let fields = ['hvip_reg_regn_code']
    let tables  = ['mk_tag_mem_hvip_info']
    let data = []
    if(exists) {
      tables.forEach(t => {
        fields.forEach(f => {
          data.push({
            tableName: t,
            fieldName: f,
            category: 'tree',
            data: stores
          })
        })
      })
      
    }

    return data;
  }

  /**
   * 是否心享会员过期
   */
  async initExpiredEnjoy() {
    let lines = await this.extractLines('is_hvip_aged.csv', ',')
    let tables = ['mk_tag_mem_hvip_info']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'is_trial_aged',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  /**
   * 心享会员核销渠道
   */
  async initEnjoyHeXiao() {
    let lines = await this.extractLines('use_channel.csv', ',')
    let tables = ['mk_tag_mem_coupon_status']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'use_channel',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  //mk_tag_mem_coupon_status => status
  async initCouponStatus() {
    let lines = await this.extractLines('coupon_status.csv', ',')
    let tables = ['mk_tag_mem_coupon_status']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'status',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  //mk_tag_mem_coupon_status => coupon_type

  async initCouponType() {
    let lines = await this.extractLines('coupon_type.csv', ',')
    let tables = ['mk_tag_mem_coupon_status']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'coupon_type',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  //mk_tag_mem_coupon_status => coupon_way
  async initCouponWay() {
    let lines = await this.extractLines('coupon_way.csv', ',')
    let tables = ['mk_tag_mem_coupon_status']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'coupon_way',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  //mk_tag_mem_coupon_status => receive_channel
  async initReceiveChannel() {
    let lines = await this.extractLines('receive_channel.csv', ',')
    let tables = ['mk_tag_mem_coupon_status']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'receive_channel',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  /**
   * 是否试用心享会员过期
   */
  async initExpiredTryEnjoy() {
    let lines = await this.extractLines('is_trial_aged.csv', ',')
    let tables = ['mk_tag_mem_hvip_info']
    let rs  = tables.reduce((p, n) => {
      let tmp = lines.map(d => {
        let item = {
          tableName: n,
          fieldName: 'is_hvip_aged',
          code: d[0],
          desc: d[1]
        }
        return item
        
      }).filter(d => d.tableName && d.tableName.length > 0)
      return p.concat(tmp)
    },[])
    return this.toFlatLine(rs)
  }

  async findData(tableName, fieldName) {
    //curl -XGET "http://localhost:7001/mem_market_tag_sum/member_level_id/fieldData"
    const {model:{Enums,Dataset}} = this.ctx
    const {fields} = await Dataset.findOne({name: tableName})
    let field = fields.find(f => f.fieldName === fieldName)
    if(!field) {
      return {category: "", data:[]}
    }
    const rs = await Enums.findOne({tableName, fieldName}, { _id:0, __v: 0, tableName:0, fieldName:0})
    if(!rs) {
      return {category: "", data:[]}
    }
    const category = rs.category
    let data = rs.data
    if(field.fieldType === 'number') {
      data = data.map(d => {
        let code = +d.code
        return {
          desc: d.desc,
          code
        }
      })
    }
    return {category,data}
  }


}

module.exports = EnumService