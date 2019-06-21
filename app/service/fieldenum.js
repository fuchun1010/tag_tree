const {Service} = require('egg')
const path = require('path')
const csvParser = require('csv-parse')
const fs = require('fs')

class FieldEnumService extends Service {

  /**
   * 数据入口
   */
  async prepareData() {
    let data = await this.initFlatData()
    const marketData = await this.initMarket()
    const cityData = await this.initCityTree()
    const storeData = await this.storeTree()
    const rs = [data, marketData, cityData, storeData].reduce([], (p, n) => p.concat(n))
    console.log(rs)
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
    //console.log('data---->',JSON.stringify(data, null, 1))
    return data
  }

  async initCityTree() {
    let cityTree = await this.toTree('city.csv')
    let fields = [
      'item_consume_city_code'
    ]
    let exists = cityTree && cityTree.length > 0
    
    let tables  = ['mk_tag_order_details']
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
    tables  = ['mem_market_tag_sum']
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
      'order_city_code'
    ]
    tables  = ['mk_tag_transaction_order']
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

  async toTree(fileName, delimiter = ',') {
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
      if(i > 810) {
        console.log('xx')
      }
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

  async countEnums() {
    const {model:{Enums}} = this.ctx
    return Enums.count()
  }

  async isEmptyEnum() {
    const count = await this.countEnums()
    return count === 0
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

  async toFlatData(file,table,field, sep) {
    let lines = await this.extractLines(file, sep)
    let tables = [table]
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

  /**
   * 专门处理扁平数据
   */
  async initFlatData() {
    const flatData = [{
      file: 'member_level.csv',
      table: 'mem_market_tag_sum',
      field: 'member_level_id',
      sep: '\t'
    },{
      file: 'shopcycle.csv',
      table: 'mk_tag_transaction_order',
      field: 'shop_cycle',
      sep: ','
    },{
      file: 'shopcycle.csv',
      table: 'mem_market_tag_sum',
      field: 'last_3m_shop_cycle',
      sep: ','
    },{
      file: 'shopcycle.csv',
      table: 'mk_tag_order_details',
      field: 'item_shop_cycle',
      sep: ','
    },{
      file: 'shop_period.csv',
      table: 'mk_tag_order_details',
      field: 'item_shop_period',
      sep: ','
    },{
      file: 'business_type.csv',
      table: 'mk_tag_transaction_order',
      field: 'busi_type',
      sep: ','
    },{
      file: 'status.csv',
      table: 'mem_market_tag_sum',
      field: 'status',
      sep: ','
    },{
      file: 'pay_way.csv',
      table: 'mk_tag_transaction_order',
      field: 'pay_way',
      sep: ','
    },{
      file: 'pay_way.csv',
      table: 'mk_tag_order_details',
      field: 'item_pay_way',
      sep: ','
    },{
      file: 'tpp_payment_type.csv',
      table: 'mk_tag_order_details',
      field: 'item_tpp_payment_type',
      sep: ','
    },{
      file: 'gender.csv',
      table: 'mem_market_tag_sum',
      field: 'member_sex',
      sep: ','
    },{
      file: 'channel.csv',
      table: 'mk_tag_transaction_order',
      field: 'consume_channel',
      sep: ','
    },{
      file: 'channel.csv',
      table: 'mem_market_tag_sum',
      field: 'register_channel',
      sep: ','
    },{
      file: 'channel.csv',
      table: 'mk_tag_order_details',
      field: 'item_consume_channel',
      sep: ','
    },{
      file: 'last_deposit_channel.csv',
      table: 'mem_market_tag_sum',
      field: 'last_deposit_channel',
      sep: ','
    },{
      file: 'last_deposit_channel.csv',
      table: 'mk_tag_transaction_order',
      field: 'deposit_channel',
      sep: ','
    },{
      file: 'last_deposit_channel.csv',
      table: 'mk_tag_transaction_order',
      field: 'deposit_channel',
      sep: ','
    },{
      file: 'last_consume_channel.csv',
      table: 'mem_market_tag_sum',
      field: 'last_consume_channel',
      sep: ','
    },{
      file: 'tpp_payment_way.csv',
      sep: ',',
      field: ['tpp_payment_type'],
      table: ['mk_tag_transaction_order'],
    },{
      file: 'last_refund_channel.csv',
      sep: ',',
      field: ['last_refund_channel'],
      table: ['mem_market_tag_sum'],
    },{
      file: 'last_refund_channel.csv',
      sep: ',',
      field: ['refund_channel'],
      table: ['mk_tag_transaction_order'],
    }]

    const rs = flatData.map( async (f) => {
      let d  = await this.toFlatData(f.file,f.table,f.field,f.sep)
      return d
    }).reduce((p, n) => p.concat(n), [])
    
    return rs
  }

  async extractLines(filename, delimiter) {
    let lines =  await this.readAllCsv(filename,delimiter)
    return lines
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

}

module.exports = FieldEnumService