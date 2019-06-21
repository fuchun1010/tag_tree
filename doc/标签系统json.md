#### 动态条件查询标签（已经完成）

```text
url: http://localhost:7001/tags/search
method: post
```
##### Request
| 字段名称            | 描述      | 可选值 |
| ------------------ | -------- | ---   |
| field          | 查询类型，可以同时查多个类型 | 如: 编码`id`、名称`name`、创建人`creator`、分类`tagLevel` |
| values            | 值   | `[]` |
| opt          | 匹配类型   | 模糊`like`、等于`eq`, `between`, 以什么开头`start`, `gt`大于 ,`gte`大于等于, `lt` 小于, `lte` 小于等于, `neq` 不等于 |

```json
{
  "conditions": [
    {
      "field": "id",
      "values": [
        "xxxx"
      ],
      "opt": "like"
    },
    {
      "field": "name",
      "values": [
        "tagName"
      ],
      "opt": "eq"
    },
    {
      "field": "creator",
      "values": [
        "xxx"
      ],
      "opt": "eq"
    },
    {
      "field": "tagLevelId",
      "values": [
        1
      ],
      "opt": "eq"
    },
    {
      "field": "isActive",
      "values": [
        true
      ],
      "opt": "eq"
    },
    {
      "field": "expireDate",
      "values": [
        "毫秒数",
        "毫秒数"
      ],
      "opt": "between"
    },
    {
      "filed": "字段名称",
      "values": ["xx"],
      "opt": "start"
    },
    {
      "field": "createUser.userName",
      "values": ["xx"],
      "opt": "eq"
    },
    {
      "field": "createDate",
      "values":["2016-07-05"],
      "opt":"gt"
    },
    {
      "field": "isEnable",
      "values": [true],
      "opt": "neq"
    }
  ]
}
```

##### Response

| 字段名称            | 描述      | 可选值 |
| ------------------ | -------- | ---   |
| tagLevel          | 标签层级关系 |  |
| tags            | 标签列表   | `[]` |

##### tagLevel

| 字段名称            | 描述      | 可选值 |
| ------------------ | -------- | ---   |
| id          | 标签层级 ID | `1` |
| name            | 标签层级名称   | `标签层级1` |
| children            | 子层级   | `[]` |

##### tagLevel - children

| 字段名称            | 描述      | 可选值 |
| ------------------ | -------- | ---   |
| id          | 标签层级 ID | `1` |
| name            | 标签层级名称   | `标签层级2` |
| owners            | 所有者   | type: 用户 `user`、 组`group`, id `5a9f54c614a4404865516573 ` |
| children            | 子层级   | `[]` |


```json
{
  "tagLevel": [
    {
      "id" : 1,
      "name" : "标签1", 
      "children" : [
          {
              "name" : "子目录1", 
              "owners" : [
                  {
                      "type" : "user", 
                      "id" : "5a9f54c614a4404865516573"
                  }
              ], 
              "children" : [
                  {
                      "tag_id" : "54495ad94c934721ede76d90"
                  },
                  {
                    "name" : "子目录2", 
                    "owners" : [
                        {
                            "type" : "user", 
                            "id" : "5a9f54c614a4404865516573"
                        }
                    ], 
                    "children" : [
                        {
                            "tag_id" : "54495ad94c934721ede76d90"
                        }
                    ], 
                    "id" : "101"
                  }
              ], 
              "id" : "100"
          }
      ]
    }, 
    {
        "id" : 2, 
        "name" : "门店", 
        "children" : [

        ]
    }, 
    {
        "id" :3, 
        "name" : "商品", 
        "children" : [

        ]
    }
  ],
  "tags": [{
    标签，结构详见379
  }]
}
```


* 说明: 所选时间的毫秒数, 服务端把创建时间存储成毫秒数

#### 查询所有标签(做了)

##### request

```url
method: get
url: http://localhost:7001/tags
```

```json
[
	{
		"id": "753d6724-a89a-4da9-8c95-c2d25a864c23",
		"name": "一个测试标签",
	}
]
```
> 注意该地方只查询isActive:true的数据

#### 查询对应标签的内容(ok)
##### request

```url
method: get
url: http://localhost:7001/:id/tag
```
##### response
```json
{
		"tagLevel": {

    },
    "tag": {
      "标签结构详见":"399行"
    }
	}
```

#### 更新tag（修改）

##### request
```url
method:put
url: http://localhost:7001/:id/tag
```

```json

```
##### response

```json
status: 200
```

> 更新完成，根据cron key决定是否需要异步通知DC刷新数据

#### 删除标签（需要调用DC接口）

##### request

```url
method: delete
url: http://localhost:7001/:id/tag
```

##### response
```json
status: 200
```

> 注意：异步通知DC将所有改标签对应的数据全部删除

#### 创建用户标签（需要检查一下mongoose的schema）

##### request

```url
method: post
url: http://localhost:7001/tag/create
```
##### 标签
| 字段名称            | 描述                    | 可选值 |
| ------------------ | ---------------------- | ---   |
| name               | 标签名称                | `''` |
|tagLevelId          | 标签层级ID              | |
|count               | 预览值，就是该标签有多少用户 | |
| operator           | 条件数组中的条件之间的关系 | `and`、`or` |
| groupType           | 条件数组中的条件之间的关系 | `and`、`or` |
| tagType           | 条件数组中的条件之间的关系 | `and`、`or` |
| conditions         | 条件数组                | `[]` |
| cron               | 定时启用标签             | 使用 Linux Crontab 格式如: `* 1 * * *` |
| startDate               | 开始执行时间             | 日期 |
| isActive           | 是否启用标签             | `true`、`false` |
| expireDate         | 过期时间                | 日期 |
| createUser         | 创建用户                | `''` |
| groupBy              | 分组字段名称        | fieldName，不是必须有的字段 |
| selectFields       | 需要查询的字段        | `{ uId, phone, openId }` |
| hiveBy              | 排序字段名称        | fieldName, 不是必须有的字段 | 
| nodeType          | 当前节点是条件还是条件组 | group/condition |
| split / type      | 分组类型  | random(随机) manul(排序)|
| divedGroups        | 分组字段 | 不是必须有的|
| limit              | 限制返回多少条|不是必须字段 |
| createDate         | 标签创建时间|这个前端不用处理时间，服务端自动赋值|

##### selectFields
| 字段名称            | 描述                    | 可选值 |
| ------------------ | -----------------------| ---   |
| fieldName       | 字段名称        | `''` |
| fieldType       | 需要查询的字段        | `Text` |
| fun       | 聚合方法        | `sum/max/avg` |

##### hive
| 字段名称            | 描述                    | 可选值 |
| ------------------ | -----------------------| ---   |
| fieldName       | 字段名称        | `''` |
| opt       | 操作符        | `gt/eq/gte/le/lte` |
| fun       | 聚合方法        | `sum/max/avg` |


##### 条件 (可嵌套 conditions)
| 字段名称            | 描述                    | 可选值 |
| ------------------ | -----------------------| ---   |
| id                 | 条件索引                | 如: `753d6724-a89a-4da9-8c95-c2d25a864c24`|
| operator           | 条件数组中的条件之间的关系 | `and`、`or`、`union` |
| conditions         | 条件数组                | `[]` |
| nodeType           | 条件类型                | 普通条件 `condition`、组合条件 `group` |
| comparisonOperator | 条件操作符              | `lt`、`lte`、`gt`、`gte`、`eq`、`IN_OPTIONS`、`NOT_IN_OPTIONS` |
| values             | 条件取值                | `["3"]`、`["北京", "深圳"]` |
| item               | 字段信息                | `[]` |

##### 字段信息
| 字段名称            | 描述      | 可选值 |
| ------------------ | -------- | ---   |
| fromTable          | 数据集名称 | 如: 22 |
| fieldType          | 字段类型   | `text`、`number`、`date` |
| displayName        | 字段名称   | 如: `location` |


##### divedGroups(不是必须有的)
| 字段名称            | 描述      | 可选值 |
| ------------------ | -------- | ---   |
| order              | 排序字段名称和排序类型 | fieldName, order: `desc`、`asc` |
| limit              | 限制返回的记录数, 属于option的 | |
| split              | 分组规则 | |


##### 操作符

#### operator

####1、数值

操作符  |  说明   
----|----
eq  | 等于
neq | 不等于
gt  | 大于
gte | 大于等于
lt  | 小于
lte | 小于等于
between    | 区间
not between    | 不在区间
is null   | 空
is not null   | 非空


####2、文本

操作符  |  说明   
----|----
eq  | 等于
neq | 不等于
is null   | 空
is not null    | 非空
IN_OPTIONS     | 包括
NOT_ IN_OPTIONS | 不包括


####3、日期

操作符  |  说明   
----|----
LIKE | 模糊查询
eq  | 等于
neq | 不等于
gt  | 大于
gte | 大于等于
lt  | 小于
lte | 小于等于
between  | 区间
not between | 不在区间
is null  | 空
is not null | 非空


### fun 这个这段是optional的

agg  |  说明
----|----
sum | 求和
avg | 平均
max | 最大值
min | 最小值
count  | 计数

| 字段名称 | 是否必填 |
| ------ | --------- |
| id     | 必须有值 |
| isActive | 必须有值 |
| tagLevelId | 可选的 |
| count | 不用传了 |
| name | 必须有值|
| fromTable | 必须有值 |
|selectFields | 必须有值  备注 fieldName必须有值 fieldType必须有值 fun的值必须填写，默认是空字符串|
| conditions |  必须有值，不允许是空数组 | 
| operator |  必须有值 |
| isEnable | 是否生效|
|cron      | 可选的 |
| createUser | 必须有 |
| expireDate | 可选的 |
| executeStatus | 默认是wait|
| groupBy | 可选的 |
| hiveBy | 可选的 |
| divedGroups | 可选的| 
| createDate | 这个不用前端的同事传的|

## 标签结构如下
```json
{
  "id": "753d6724-a89a-4da9-8c95-c2d25a864c23",
  "isActive":true,
  "tagLevelId": "xxxxx",
  "count": 0,
  "name": "一个测试标签",
  "fromTable": "tableName",
  "selectFields":[
    {
      "fieldName": "xxx",
      "fieldType": "Text",
      "fun": "sum/max/avg/xxx"
    }
  ],
  "conditions": [
    {
      "operator": "and",
      "id": "753d6724-a89a-4da9-8c95-c2d25a864c24",
      "conditions": [
        {
          "id": "e8a19125-bbac-4b1b-b69f-bfdce7233718",
          "nodeType": "condition",
          "comparisonOperator": "IN_OPTIONS",
          "values": [
            "Bj"
          ],
          "item": {
            "fieldName": "location",
            "fieldType": "Text"
          }
        },
        {
          "id": "5182b49b-5a0a-40d2-9ea1-b7aa29c7b45e",
          "nodeType": "condition",
          "comparisonOperator": "NOT_IN_OPTIONS",
          "values": [
            "Bj"
          ],
          "item": {
            "fieldType": "Text",
            "fieldName": "location"
          }
        },
        {
          "nodeType": "group",
          "operator": "or",
          "id": "7b17487d-e274-498b-b7b5-c847854c3376",
          "conditions": [
            {
              "id": "04839167-db37-4be0-92cf-3236291821ff",
              "nodeType": "condition",
              "comparisonOperator": "gt",
              "values": [
                "3000"
              ],
              "item": {
                "fieldType": "Numeric",
                "fieldName": "sales"
              }
            },
            {
              "id": "bf8ba526-9ed5-49eb-b0f4-e8f73093892e",
              "nodeType": "condition",
              "comparisonOperator": "eq",
              "values": [
                "3"
              ],
              "item": {
                "fieldType": "Numeric",
                "fieldName": "id"
              }
            }
          ]
        }
      ],
      "nodeType": "group"
    }
  ],
  "operator": "and",
  "cron": "* 1 * * *",
  "createUser": {
    "userId": "xxx",
    "userName": "xxxx"
  },
  "isEnable": true,
  "startDate": "2017-01-28",
  "endDate": "2017-01-28",
  "expireDate": "2017-12-28",
  "groupBy":[
    {
      "fieldName": "xxxxx"
    }
  ],
  "hiveBy": [
    {
      "fieldName": "x1",
      "fun": "sum/max/avg",
      "opt": "gt/eq/gte/le/lte",
      "values":200
    }
  ],
  "divedGroups":{
    "orderBy": [
      {
        "fieldName": "xxx",
        "order": "desc/asc"
      }
    ],
    "limit": 10,
    "split":[
      {
        "category": "manul",
        "number": 10,
        "gno": 1
      }
    ]
  },
  "createDate": 1522302048038
}
```

##### Respone
```json
[
	{
			"id": "6b7522ee5e5f2564db68680d"
	}
]
```

### 请求DC计算标签的值(没做)

```text
method: post
url: http://localhost:8080/tag/calculate
```
#### request
```json
标签，结构详见379
```
> 注意这个:tagId是中台的标签ID

#### response
```json
{
  "info":{
    "code": 201,
    "message": "正在计算中"
  }
}
```


### 标签结果查询API

1. 接口数据数据模型设计

```text
标签ID-[{ 用户ID, 微信openId, 手机号码 }]
用户ID-标签ID
```


#### 根据标签获取用户列表（分页查询）

##### REQUEST

```text
method: GET
url: http://localhost:7001/tags/:tagid/:pageCount/:pageNum     
```

```text
说明：
pageCount：每页分页条数,如果分页大小超过限制或是填空，给予默认值。
pageNum: 页码
```

##### RESPONSE  

```json
{
"info": {
  "code": 200,
  "message": ""
},
"count": "5000",
"pageCount": "1000",
"data": [
   "1",
   "2",
   "3",
   "4"
 ]
}
说明：
count: 数据总条数
pageCount: 每页分页条数,如果分页大小超过限制或是填空，给予默认值。
info: 状态信息
code: 200代表成功查询，500代表服务器查询错误
message: 详细信息
data: 用户唯一标识 (不一定是手机号)，数组形式
```

 
### 数据中心数据集元数据信息查询API

1. API接口数据模型 

```
数据源信息描述表
数据源与表空间对应关系表
表空间与数据表对应关系表
数据表与字段对应关系表
```

1. 接口通讯协议规范

- 查询所有数据集（分页查询,做了，目前直接限制100条）

 ###### REQUEST

 ```
 method: GET
 url: http://localhost:7001/datasets
 ```
 >url:http://localhost:8080/datasets?pageCount={pageCount}&pageNum={pageNum}是DC层暴露给标签层的API

 

 ##### Response(营销前端使用)
 ```json
 [{ 
    "_id" : "5ab10e421d8b900ce9c04a8c", 
    "name" : "person", 
    "isActive" : true, 
    "dataSetId" : 11, 
    "dirId": "",
    "isAgg": false,
    "fields" : [
        {
            "desc" : "名字", 
            "fieldType" : "text", 
            "fieldName" : "name"
        }
    ]
},{ 
    "_id" : "5ab10e421d8b900ce9c04a9c", 
    "name" : "person", 
    "isActive" : true, 
    "dataSetId" : 12, 
    "fields" : [
        {
            "desc" : "年龄", 
            "fieldType" : "number", 
            "fieldName" : "age"
        }
    ]
}]
 ```

 ​

- 查询数据集下的某张表所有字段信息(已经完成)

 ##### REQUEST

 ```
 method: GET
 url: http://127.0.0.1:7001/dataSet/{tableid}/fields
 ```

 ##### RESPONSE

 ```json
   {
    "fields": [
     {
       "fieldName": "c1",
       "fieldType": "number",
       "desc": "描述1"
     },
     {
       "fieldName": "c2",
       "fieldName": "text",
       "desc": "描述2"
     }
   ]
 }
 ```
 
 #### 预览数据（完成）
 
 ```text
 method: POST
 post: http://127.0.0.1:7001/tag/preview/numbers
 
 ```
 
##### Request

```json
标签结构详见:379行
```

##### Response
```json
{
	"info": {
    "code": 409,
    "message": "请勿重复提交"
  },
  "count": -1
}
```

#### 查询字段数据值枚举

```text
method: get
url: http://localhost:7001/:tableName/:fieldName/fieldData
```

##### Response

```json
{
  "category": "flat",
  "data": [
    {
      "code": "1001",
      "desc": "深圳"
    },
    {
      "code": "1002",
      "desc": "北京"
    }
  ]
}
```
或者如下
```json
{
  "category": "tree",
  "data":[
    {
      "code": "1001",
      "desc": "描述1",
      "children": [
        {
          "code": "1002",
          "desc": "描述2"
        },
        {
          "code": "1003",
          "desc": "描述3",
          "children": [

          ]
        }
      ]
    }
  ]
}
```

#### 查询所有的标签层级

##### Request
```json
method: get,
url: http://localhost:7001/tagLevel/List
```

##### Response
```json
{ 
    "_id" : "5a9fa733bc1b390d0408e35b",
    "dataSetDirs" : [
        {
            "children" : [
                {
                    "id" : "100", 
                    "children" : [
                        {
                            "_id" : "54495ad94c934721ede76d90", 
                            "isActive" : true, 
                            "isEnable": true,
                            "fields" : [
                                {
                                    "desc" : "描述2", 
                                    "fieldType" : "text", 
                                    "fieldName" : "c2", 
                                    "id" : "c1-02"
                                }
                            ], 
                            "data_set_name" : "客户基本属性", 
                            "source_table" : "x3", 
                            "createDate" : "2018-02-01", 
                            "creator" : "admin", 
                            "name" : "data_set_name_one", 
                            "data_set_id" : "54495ad94c934721ede76d90"
                        }
                    ], 
                    "owners" : [
                        {
                            "id" : "5a9f54c614a4404865516573", 
                            "type" : "user"
                        }
                    ], 
                    "name" : "子目录1"
                }
            ], 
            "name" : "客户", 
            "id" : 1
        }, 
        {
            "children" : [

            ], 
            "name" : "门店", 
            "id" :2
        }, 
        {
            "children" : [

            ], 
            "name" : "商品", 
            "id" : 3
        }, 
        {
            "children" : [

            ], 
            "name" : "test dir 1", 
            "id" : 4
        }
    ]
}
```


#### 创建标签根层级(已经开发完成)

```text
method: post
url: http://localhost:7001/tagLevel/create
```

##### Request

```json
{ 
    "name": "新建根层级名称",
    "category": "tag_level"
}
```

##### Response 
```json
{
  "id": "xxxxxxxx"
}
```

#### 创建标签子层级 （开发完成）
```text
method: post
url: http://localhost:7001/tagLevel/:parentId/create
```

##### Request
```json
{
  "name": "子层级1",
  "category":"tag_level", "默认是加标签层级"
}
```

##### Response
```json
{
  "id": "xxxxx"
}
```

#### 删除标签子层级（开发完成）
```text
method: delete
url: http://localhost:7001/tagLevel/:id/delete
```

##### Request
{
  "category": "tag_level"
}

##### Response

```text
status: 200
```
