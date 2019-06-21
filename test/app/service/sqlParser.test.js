const assert = require('assert')
const { app } = require('egg-mock/bootstrap')

describe('test/app/service/sqlParser.test.js', () => {
  
    it('subQuery and simple condition', () => {
      const tagJson = {
        "name": "一个测试标签",
        "cron": "* 1 * * *",
        "selectFields": [
          {
            "fieldName": "member_id",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "phone_num",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "wx_open_id",
            "fieldType": "text",
            "fun": ""
          }
        ],
        "fromTable": "mem_market_tag_datail_record",
        "conditions": [
          {
            "id": "C801DADEB96000015FBE1900673019D8",
            "conditions": [
              {
                "item": {
                  "fieldName": "c1",
                  "fieldType": "number"
                },
                "comparisonOperator": "IN_OPTIONS",
                "selectFields": [
                  {
                    "fieldName": "c1",
                    "fieldType": "text",
                    "fun": ""
                  }
                ],
                "fromTable": "mem_market_tag_datail_record",
                "nodeType": "condition",
                "conditions": [
                  {
                    "item": {
                      "fieldName": "c2",
                      "fieldType": "number"
                    },
                    "comparisonOperator": "eq",
                    "values": [
                      3
                    ]
                  }
                ],
                "groupBy": [
                  {
                    "fieldName": "c1"
                  }
                ],
                "hiveBy": [
                  {
                    "fieldName": "x1",
                    "fieldType": "number",
                    "fun": "sum",
                    "opt": "gt",
                    "values": [200]
                  }
                ]
              }
            ],
            "nodeType": "group",
            "operator": "and"
          },
          {
            "item": {
              "fieldName": "eb_total_consume_cnt",
              "fieldType": "number"
            },
            "comparisonOperator": "like",
            "values": [
              "0"
            ],
            "id": "C7FEFCFD9DA00001AD5872B1EAF51DAC",
            "nodeType": "condition"
          }
        ],
        "operator": "and",
        "groupBy": [
          {
            "fieldName": "member_id"
          },
          {
            "fieldName": "phone_num"
          },
          {
            "fieldName": "wx_open_id"
          }
        ],
        "isActive": true,
        "createUser": {
          "userName": "娄宏",
          "userId": "011738"
        },
        "divedGroups": {
          "split": [
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "1884",
              "category": "random"
            }
          ]
        },
        "startDate": "2017-01-28",
        "endDate": "2017-01-28",
        "expireDate": "2017-12-28"
      }
      const ctx = app.mockContext()
      const sql = ctx.service.sqlParser.toSql(tagJson)
      console.log('sqlA:', sql)
      let target = `select member_id,phone_num,wx_open_id from mem_market_tag_datail_record where   c1 in ( select c1 from mem_market_tag_datail_record where  c2 = 3 group by  c1 having sum(x1) > 200 ) and eb_total_consume_cnt like '0'  group by  member_id,phone_num,wx_open_id`
      let result = sql.split("\t")
      target = target.split("\t")
      assert(target.length  === result.length)
                     
    })

    it('simpleOne', () => {
      const tagJson = {
        "name": "一个测试标签",
        "cron": "* 1 * * *",
        "selectFields": [
          {
            "fieldName": "member_id",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "phone_num",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "wx_open_id",
            "fieldType": "text",
            "fun": ""
          }
        ],
        "fromTable": "mem_market_tag_datail_record",
        "conditions": [
          {
            "item": {
              "fieldName": "eb_total_consume_cnt",
              "fieldType": "number"
            },
            "comparisonOperator": "eq",
            "values": [
              "0"
            ],
            "id": "C7FEFCFD9DA00001AD5872B1EAF51DAC",
            "nodeType": "condition"
          },
          {
            "item": {
              "fieldName": "c1",
              "fieldType": "number"
            },
            "comparisonOperator": "eq",
            "values": [
              "100"
            ],
            "id": "C7FEFCFD9DA00001AD5872B1EAF51DAC",
            "nodeType": "condition"
          }
        ],
        "operator": "and",
        "groupBy": [
          {
            "fieldName": "member_id"
          },
          {
            "fieldName": "phone_num"
          },
          {
            "fieldName": "wx_open_id"
          }
        ],
        "isActive": true,
        "createUser": {
          "userName": "娄宏",
          "userId": "011738"
        },
        "divedGroups": {
          "split": [
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "1884",
              "category": "random"
            }
          ]
        },
        "isEnable": true,
        "startDate": "2017-01-28",
        "endDate": "2017-01-28",
        "expireDate": "2017-12-28"
      }
      const ctx = app.mockContext()
      const sql = ctx.service.sqlParser.toSql(tagJson)
      let target = 'select member_id,phone_num,wx_open_id from mem_market_tag_datail_record where  eb_total_consume_cnt = 0 and c1 = 100  group by  member_id,phone_num,wx_open_id'
      let result = sql.split("\t")
      target = target.split("\t")
      console.log('sqlB:', sql)
      assert(target.length  === result.length)
    })

    it('simpleOneWithOr', () => {
      const tagJson = {
        "name": "一个测试标签",
        "cron": "* 1 * * *",
        "selectFields": [
          {
            "fieldName": "member_id",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "phone_num",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "wx_open_id",
            "fieldType": "text",
            "fun": ""
          }
        ],
        "fromTable": "mem_market_tag_datail_record",
        "conditions": [
          {
            "item": {
              "fieldName": "eb_total_consume_cnt",
              "fieldType": "number"
            },
            "comparisonOperator": "eq",
            "values": [
              "0"
            ],
            "id": "C7FEFCFD9DA00001AD5872B1EAF51DAC",
            "nodeType": "condition"
          },
          {
            "item": {
              "fieldName": "c1",
              "fieldType": "number"
            },
            "comparisonOperator": "eq",
            "values": [
              "100"
            ],
            "id": "C7FEFCFD9DA00001AD5872B1EAF51DAC",
            "nodeType": "condition"
          }
        ],
        "operator": "or",
        "groupBy": [
          {
            "fieldName": "member_id"
          },
          {
            "fieldName": "phone_num"
          },
          {
            "fieldName": "wx_open_id"
          }
        ],
        "isActive": true,
        "createUser": {
          "userName": "娄宏",
          "userId": "011738"
        },
        "divedGroups": {
          "split": [
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "1884",
              "category": "random"
            }
          ]
        },
        "isEnable": true,
        "startDate": "2017-01-28",
        "endDate": "2017-01-28",
        "expireDate": "2017-12-28"
      }
      const ctx = app.mockContext()
      const sql = ctx.service.sqlParser.toSql(tagJson)
      let target = 'select member_id,phone_num,wx_open_id from mem_market_tag_datail_record where eb_total_consume_cnt = 0 or c1 = 100  group by  member_id,phone_num,wx_open_id'
      let result = sql.split("\t")
      target = target.split("\t")
      console.log('sqlC:', sql)
      assert(target.length  === result.length)
    })

    it('multiSub', () => {
      const tagJson = {
        "name": "一个测试标签",
        "cron": "* 1 * * *",
        "selectFields": [
          {
            "fieldName": "member_id",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "phone_num",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "wx_open_id",
            "fieldType": "text",
            "fun": ""
          }
        ],
        "fromTable": "mem_market_tag_datail_record",
        "conditions": [
          {
            "id": "C801DADEB96000015FBE1900673019D8",
            "conditions": [
              {
                "item": {
                  "fieldName": "c1",
                  "fieldType": "number"
                },
                "comparisonOperator": "IN_OPTIONS",
                "selectFields": [
                  {
                    "fieldName": "c1",
                    "fieldType": "text",
                    "fun": ""
                  }
                ],
                "fromTable": "mem_market_tag_datail_record",
                "nodeType": "condition",
                "conditions": [
                  {
                    "item": {
                      "fieldName": "c2",
                      "fieldType": "number"
                    },
                    "comparisonOperator": "eq",
                    "values": [
                      3
                    ]
                  }
                ],
                "groupBy": [
                  {
                    "fieldName": "c1"
                  }
                ],
                "hiveBy": [
                  {
                    "fieldName": "x1",
                    "fieldType": "number",
                    "fun": "sum",
                    "opt": "gt",
                    "values": [200]
                  }
                ]
              }
            ],
            "nodeType": "group",
            "operator": "and"
          },
          {
            "id": "C801DADEB96000015FBE1900673019D8",
            "conditions": [
              {
                "item": {
                  "fieldName": "c6",
                  "fieldType": "number"
                },
                "comparisonOperator": "IN_OPTIONS",
                "selectFields": [
                  {
                    "fieldName": "c7",
                    "fieldType": "text",
                    "fun": ""
                  }
                ],
                "fromTable": "mem_market_tag_datail_record",
                "nodeType": "condition",
                "conditions": [
                  {
                    "item": {
                      "fieldName": "c8",
                      "fieldType": "number"
                    },
                    "comparisonOperator": "eq",
                    "values": [
                      100
                    ]
                  }
                ],
                "groupBy": [
                  {
                    "fieldName": "c9"
                  }
                ],
                "hiveBy": [
                  {
                    "fieldName": "c1",
                    "fieldType": "number",
                    "fun": "sum",
                    "opt": "gt",
                    "values": [200]
                  }
                ]
              }
            ],
            "nodeType": "group",
            "operator": "and"
          }
        ],
        "operator": "and",
        "groupBy": [
          {
            "fieldName": "member_id"
          },
          {
            "fieldName": "phone_num"
          },
          {
            "fieldName": "wx_open_id"
          }
        ],
        "isActive": true,
        "createUser": {
          "userName": "娄宏",
          "userId": "011738"
        },
        "divedGroups": {
          "split": [
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "1884",
              "category": "random"
            }
          ]
        },
        "isEnable": true,
        "startDate": "2017-01-28",
        "endDate": "2017-01-28",
        "expireDate": "2017-12-28"
      }
      const ctx = app.mockContext()
      const sql = ctx.service.sqlParser.toSql(tagJson)
      let target = 'select member_id,phone_num,wx_open_id from mem_market_tag_datail_record where   c1 in ( select c1 from mem_market_tag_datail_record where  c2 = 3  group by  c1 having sum(x1) > 200 ) and   c6 in ( select c7 from mem_market_tag_datail_record where  c8 = 100  group by  c9 having sum(c1) > 200)  group by  member_id,phone_num,wx_open_id'
      let result = sql.split("\t")
      target = target.split("\t")
      console.log('sqlD:', sql)
      assert(target.length  === result.length)
    })

    it('multiSubWithOr', () => {
      const tagJson = {
        "name": "一个测试标签",
        "cron": "* 1 * * *",
        "selectFields": [
          {
            "fieldName": "member_id",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "phone_num",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "wx_open_id",
            "fieldType": "text",
            "fun": ""
          }
        ],
        "fromTable": "mem_market_tag_datail_record",
        "conditions": [
          {
            "id": "C801DADEB96000015FBE1900673019D8",
            "conditions": [
              {
                "item": {
                  "fieldName": "c1",
                  "fieldType": "number"
                },
                "comparisonOperator": "IN_OPTIONS",
                "selectFields": [
                  {
                    "fieldName": "c1",
                    "fieldType": "text",
                    "fun": ""
                  }
                ],
                "fromTable": "mem_market_tag_datail_record",
                "nodeType": "condition",
                "conditions": [
                  {
                    "item": {
                      "fieldName": "c2",
                      "fieldType": "number"
                    },
                    "comparisonOperator": "eq",
                    "values": [
                      3
                    ]
                  }
                ],
                "groupBy": [
                  {
                    "fieldName": "c1"
                  }
                ],
                "hiveBy": [
                  {
                    "fieldName": "x1",
                    "fieldType": "number",
                    "fun": "sum",
                    "opt": "gt",
                    "values": [200]
                  }
                ]
              }
            ],
            "nodeType": "group",
            "operator": "and"
          },
          {
            "id": "C801DADEB96000015FBE1900673019D8",
            "conditions": [
              {
                "item": {
                  "fieldName": "c6",
                  "fieldType": "number"
                },
                "comparisonOperator": "IN_OPTIONS",
                "selectFields": [
                  {
                    "fieldName": "c7",
                    "fieldType": "text",
                    "fun": ""
                  }
                ],
                "fromTable": "mem_market_tag_datail_record",
                "nodeType": "condition",
                "conditions": [
                  {
                    "item": {
                      "fieldName": "c8",
                      "fieldType": "number"
                    },
                    "comparisonOperator": "eq",
                    "values": [
                      100
                    ]
                  }
                ],
                "groupBy": [
                  {
                    "fieldName": "c9"
                  }
                ],
                "hiveBy": [
                  {
                    "fieldName": "c1",
                    "fieldType": "number",
                    "fun": "sum",
                    "opt": "gt",
                    "values": [200]
                  }
                ]
              }
            ],
            "nodeType": "group",
            "operator": "and"
          }
        ],
        "operator": "or",
        "groupBy": [
          {
            "fieldName": "member_id"
          },
          {
            "fieldName": "phone_num"
          },
          {
            "fieldName": "wx_open_id"
          }
        ],
        "isActive": true,
        "createUser": {
          "userName": "娄宏",
          "userId": "011738"
        },
        "divedGroups": {
          "split": [
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "1884",
              "category": "random"
            }
          ]
        },
        "isEnable": true,
        "startDate": "2017-01-28",
        "endDate": "2017-01-28",
        "expireDate": "2017-12-28"
      }
      const ctx = app.mockContext()
      const sql = ctx.service.sqlParser.toSql(tagJson)
      let target = 'select member_id,phone_num,wx_open_id from mem_market_tag_datail_record where   c1 in ( select c1 from mem_market_tag_datail_record where  c2 = 3  group by  c1 having sum(x1) > 200 ) or   c6 in ( select c7 from mem_market_tag_datail_record where  c8 = 100  group by  c9 having sum(c1) > 200 )  group by  member_id,phone_num,wx_open_id'
      let result = sql.split("\t")
      target = target.split("\t")
      console.log('sqlE:', sql)
      assert(target.length  === result.length)
    })

    it('nestedOnce', () => {
      const tagJson = {
        "name": "一个测试标签",
        "cron": "* 1 * * *",
        "selectFields": [
          {
            "fieldName": "member_id",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "phone_num",
            "fieldType": "text",
            "fun": ""
          },
          {
            "fieldName": "wx_open_id",
            "fieldType": "text",
            "fun": ""
          }
        ],
        "fromTable": "mem_market_tag_datail_record",
        "conditions": [
          {
            "id": "C801DADEB96000015FBE1900673019D8",
            "conditions": [
              {
                "item": {
                  "fieldName": "c1",
                  "fieldType": "number"
                },
                "comparisonOperator": "IN_OPTIONS",
                "selectFields": [
                  {
                    "fieldName": "c1",
                    "fieldType": "text",
                    "fun": ""
                  }
                ],
                "fromTable": "mem_market_tag_datail_record",
                "nodeType": "condition",
                "conditions": [
                  {
                    "item": {
                      "fieldName": "c2",
                      "fieldType": "number"
                    },
                    "comparisonOperator": "eq",
                    "values": [
                      3
                    ]
                  },
                  {
                    "id": "C801DADEB96000015FBE1900673019D8",
                    "conditions": [
                      {
                        "item": {
                          "fieldName": "c6",
                          "fieldType": "number"
                        },
                        "comparisonOperator": "IN_OPTIONS",
                        "selectFields": [
                          {
                            "fieldName": "c7",
                            "fieldType": "text",
                            "fun": ""
                          }
                        ],
                        "fromTable": "xx",
                        "nodeType": "condition",
                        "conditions": [
                          {
                            "item": {
                              "fieldName": "c8",
                              "fieldType": "number"
                            },
                            "comparisonOperator": "eq",
                            "values": [
                              100
                            ]
                          }
                        ],
                        "groupBy": [
                          {
                            "fieldName": "c9"
                          }
                        ],
                        "hiveBy": [
                          {
                            "fieldName": "c1",
                            "fieldType": "number",
                            "fun": "sum",
                            "opt": "gt",
                            "values": [
                              200
                            ]
                          }
                        ]
                      }
                    ],
                    "nodeType": "group",
                    "operator": "and"
                  }
                ],
                "groupBy": [
                  {
                    "fieldName": "c1"
                  }
                ],
                "hiveBy": [
                  {
                    "fieldName": "x1",
                    "fieldType": "number",
                    "fun": "sum",
                    "opt": "gt",
                    "values": [
                      200
                    ]
                  }
                ]
              }
            ],
            "nodeType": "group",
            "operator": "and"
          }
        ],
        "operator": "and",
        "groupBy": [
          {
            "fieldName": "member_id"
          },
          {
            "fieldName": "phone_num"
          },
          {
            "fieldName": "wx_open_id"
          }
        ],
        "isActive": true,
        "createUser": {
          "userName": "娄宏",
          "userId": "011738"
        },
        "divedGroups": {
          "split": [
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "2000",
              "category": "random"
            },
            {
              "number": "1884",
              "category": "random"
            }
          ]
        },
        "isEnable": true,
        "startDate": "2017-01-28",
        "endDate": "2017-01-28",
        "expireDate": "2017-12-28"
      }
      const ctx = app.mockContext()
      const sql = ctx.service.sqlParser.toSql(tagJson)
      let target = 'select member_id,phone_num,wx_open_id from mem_market_tag_datail_record where   c1 in ( select c1 from mem_market_tag_datail_record where  c2 = 3 and   c6 in ( select c7 from xx where  c8 = 100  group by  c9 having sum(c1) > 200 )  group by  c1 having sum(x1) > 200 )  group by  member_id,phone_num,wx_open_id'
      let result = sql.split("\t")
      target = target.split("\t")
      console.log('sqlF:', sql)
      assert(target.length  === result.length)
    })

    it('simple two condition', () => {
      const tagJson = { 
        "id": "xxx",
        "name" : "一个测试标签", 
        "tagLevelId" : "5b177fc2e0dc8359e294cbbe", 
        "fromTable" : "mem_market_tag_datail_record", 
        "operator" : "and", 
        "isActive" : true, 
        "startDate" : "2017-01-28", 
        "endDate" : "2017-01-28", 
        "expireDate" : "2018-12-28", 
        "createDate" : "2018-06-06", 
        "createUser" : {
            "userName" : "娄宏", 
            "userId" : "011738"
        }, 
        "divedGroups" : {
            "split" : [
                {
                    "category" : "random", 
                    "number" : "2000"
                }, 
                {
                    "category" : "random", 
                    "number" : "2000"
                }, 
                {
                    "category" : "random", 
                    "number" : "2000"
                }, 
                {
                    "category" : "random", 
                    "number" : "1884"
                }
            ], 
            "orderBy" : [
      
            ]
        }, 
        "hiveBy" : [
      
        ], 
        "groupBy" : [
            {
                "fieldName" : "member_id"
            }, 
            {
                "fieldName" : "phone_num"
            }, 
            {
                "fieldName" : "wx_open_id"
            }
        ], 
        "conditions" : [
            {
                "nodeType" : "condition", 
                "id" : "C7FEFCFD9DA00001AD5872B1EAF51DAC", 
                "values" : [
                    "C"
                ], 
                "comparisonOperator" : "eq", 
                "item" : {
                    "fieldType" : "text", 
                    "fieldName" : "busi_type"
                }
            }, 
            {
                "nodeType" : "condition", 
                "id" : "C7FEFCFD9DA00001AD5872B1EAF51DAC", 
                "values" : [
                    2
                ], 
                "comparisonOperator" : "eq", 
                "item" : {
                    "fieldType" : "number", 
                    "fieldName" : "member_level_id"
                }
            }
        ], 
        "selectFields" : [
            {
                "fun" : "", 
                "fieldType" : "text", 
                "fieldName" : "member_id"
            }, 
            {
                "fun" : "", 
                "fieldType" : "text", 
                "fieldName" : "phone_num"
            }, 
            {
                "fun" : "", 
                "fieldType" : "text", 
                "fieldName" : "wx_open_id"
            }
        ]
      }
      const ctx = app.mockContext()
      const sql = ctx.service.sqlParser.toSql(tagJson)
      let target = "select member_id,phone_num,wx_open_id from mem_market_tag_datail_record where  busi_type = 'C' and member_level_id = 2  group by  member_id,phone_num,wx_open_id"
      let result = sql.split("\t")
      target = target.split("\t")
      console.log('sqlE:', sql)
      assert(target.length  === result.length)
    })

  });