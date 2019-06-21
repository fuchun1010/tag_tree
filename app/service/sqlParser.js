const Service = require('egg').Service;

/**
 * 将标签的json解析成sql语句
 */
class SqlParserService extends Service {

  toSql(tagJson) {

    /**
     * 将运算符号转成sql语句可以识别的符号
     * @param {*} op 
     */
    const convertComparator = (op) => {
			let key = op.toLowerCase()
			let obj = {
				in_options: {
					range: true,
					op: 'in'
				},
				not_in_options: {
					range: true,
					op: "not in"
				},
				eq: {
					range: false,
					op: '='
				},
				neq: {
					range: false,
					op: '!='
				},
				gte: {
					range: false,
					op: '>='
				},
				gt: {
					range: false,
					op: '>'
				},
				lte: {
					range: false,
					op: '<='
				},
				lt: {
					range: false,
					op: '<'
				},
				like: {
					range: false,
					op: 'like'
				},
				'not like': {
					range: false,
					op: 'not like'
				}
			}
			return obj[key]
    }

    /**
     * 将json中的values按照规则进行转换
     * @param {*} fieldType 
     * @param {*} range 
     * @param {*} values 
     */
    const convertValue = (fieldType, range, values, op) => {
			
			let isTextType = fieldType.toLowerCase() === 'text'
			let v = void 0
			if(range) {
				v = isTextType ? values.map(d => `'${d}'`): values
				v = `(${v.join(',')})`
			}
			else {
				v = isTextType ? values.map(d => (op === 'like' || op === 'not like') ? `${d}` : `'${d}'`).join(''): values.join('')
				if(op === 'like' || op === 'not like') {
					v = `'%${v}%'`
				}
			}
			return v
    }
    
    /**
     * 转成查询语句
     * @param {*} fields 
     */
    const toSelectFields = (fields) => {
			const isExistedSelectFields = fields && Array.isArray(fields) && fields.length > 0
			if(!isExistedSelectFields) {
				return ""
			}
			const rs = ["select"]
			let selectSmt = fields.map(field => {
				let {fieldName, fun} = field
				let f = fun && fun.trim().length > 0 ? `${fun}(${fieldName})`:`${fieldName}`
				return f
			}).join(",")
			rs.push(selectSmt)
			return  rs.join(" ")
		}
    
    /**
     * 转成table语句
     * @param {*} table 
     */
    const toFromTable = (table) =>  {
			if(!table) {
				return ""
			}
			const rs = ["from", table]
			return rs.join(" ")
    }
    
    /**
     * 转成sql认识的where条件
     * @param {*} c 
     */
    const toWhere = (c) => {
			
			if(!c){
				return ""
			}

			if(Object.keys(c).length === 0) {
				return ""
			}

			const  parse = (external, tmp) => {
				
				const {conditions, operator} = external

				let len = (conditions &&  conditions.length ) || 0
				if(len === 0) {
					return ''
				}
				let op = operator === 'and' ? "1=1 and": ""
				if(op.trim().length > 0){
					tmp.push(op)
				}

				for(let i = 0; i < len; i++) {
					let c = conditions[i]
					//debugger
					if(c.operator) {
						let op = c.operator === 'and' ? "1=1 and": ""
						if(op.trim().length > 0 ) {
							if(tmp.length > 0 && tmp[tmp.length - 1] != op) {
								tmp.push(op)
							}
							
						}
					}

					let isSubQuery = c.nodeType === 'group'

					if(isSubQuery) {
						//debugger
						let response =  parse(c, [])
						//debugger
						tmp.push(response)
					}
					else {
						let {item:{fieldName,fieldType}, comparisonOperator,selectFields, fromTable, nodeType,  groupBy, hiveBy, values } = c

						let {range, op} = convertComparator(comparisonOperator)
						
						tmp.push(fieldName)
						tmp.push(op)
						if(selectFields) {
							tmp.push("(")
							let s = toSelectFields(selectFields)
							tmp.push(s)
							let t = toFromTable(fromTable)
							tmp.push(t)

							if(c.conditions) {
								//debugger
								let tmpData = Object.assign({}, {conditions:c.conditions, operator})
								//debugger
								let response = parse(tmpData, ["where"])
								//debugger
								tmp.push(response)
							}
							else {
								//debugger
								let v = convertValue(fieldType,range, values, op)
								tmp.push(v)
							}

							tmp.push(toGroup(groupBy))

							tmp.push(toHive(hiveBy))

							tmp.push(")")
						}
						else {
							let v = convertValue(fieldType, range, values, op)
							tmp.push(v)
						}
					}
					//debugger
					//最后还要条条件需要补operator
					if(i != len - 1) {
						let op = (operator || c.operator) === 'and' ? 'and': 'or'
						if(op.trim().length > 0) {
							tmp.push(op)
						}
					}
				}

				return tmp.join(" ")

			} 
			//debugger
			let rs = parse(c, ["where"])
			rs = rs.replace(/1=1 and/g, '')
			if (/where\ +$/.test(rs)) {
				rs = ''
			}
			return rs
			
    }
    
    /**
     * 转成sql的group语句
     * @param {*} g 
     */
    const toGroup = (g) => {
			if(!g || g.length === 0) {
				return ""
			}
			let group = [" group by "]
			let d = g.map(d => d.fieldName).join(",")
			group.push(d)
			return  group.join(" ")
    }
    
    /**
     * 转成sql的hive语句
     * @param {*} h 
     */
    const toHive = (h) => {
			//debugger
			if(!h || h.length === 0) {
				return ""
			}
			let hive = ["having"]
			let rs = h.map(d => {
				let {fieldName, fun, opt, values, fieldType} = d
				let {range, op} = convertComparator(opt)
				let v = convertValue(fieldType, range, values, op)
				let rs = fun && fun.trim().length > 0 ? `${fun}(${fieldName}) ${op} ${v}`:`${fieldName} ${op} ${v}`
				return rs
			}).join(" and ")
			
			hive.push(rs)

			return hive.join(" ")
    }
    
    /**
     * 转成完整的sql语句
     * @param {*} smt 
     */
    const toSql = (smt) => {
			const {selectFields, fromTable, operator, conditions, groupBy, hiveBy} = smt
			const rs = []
			let selectSmt = toSelectFields(selectFields)
			rs.push(selectSmt)

			let fromSmt = toFromTable(fromTable)
			rs.push(fromSmt)


			let whereSmt = toWhere({operator, conditions})
			rs.push(whereSmt)

			rs.push(toGroup(groupBy))

			rs.push(toHive(hiveBy))

			return rs.length > 0 ? rs.join(" "): ""
    }
    
    const sql = toSql(tagJson)
    return sql
  }

}

module.exports = SqlParserService