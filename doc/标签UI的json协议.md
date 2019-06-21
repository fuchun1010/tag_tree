## 标签UI的json协议


#### 登录(ok)

```text
url: http://localhost:7001/ui/login
method: post
```
###### request
```json
{
	"username": "xxxx",
	"password": "xxxx"
}
```

##### success response
```json
{
	"userId": "xxxxxx"
}
```

##### error response

```json
{
	"error": {
		"code": 500,
		"message": "xxxx"
	}
}
```

#### 获取用户数据(ok)

```text
method: post
url: http://localhost:7001/ui/profile
```

##### Request
```json
{
	"name": "user_name"
}
```

##### success response

```json
{
	"menus": [
		{
			"id": 1,
			"name": "变量管理",
			"owners": [
				{
					"id": "u1",
					"type": "user"
				},
				{
					"id": "u2",
					"type": "group"
				}
			]
		},
		{
			"id": 2,
			"name": "标签管理",
			"owners":[]
		},
		{
			"id": 2,
			"name": "管理配置",
			"owners": []
		}
	],
	"dataSetDirs":[
		{
			"id": 1,
			"name": "客户",
			"children": [
				{
					"id": 2,
					"name": "购买行为特征",
					"owners": [],
					"children": [
						{
							"id":3,
							"name": "购买行为特征(月)"
						}
					]
				}
			]
		},
		{
			"id": 3,
			"name": "门店",
			"owners": [],
			"children": [
	
			]
		}
	],
	"defaultDataSet": {
		"id": "xxx",
		"creator": "xxx",
		"createDate": "2018-02-01",
		"source_table": "x3",
		"columns":[
		    {
		   		"title": "id",
		   		"dataIndex": "id",
		   		"key":"id"	
		    },
			{
				"title": "字段别名",
				"dataIndex": "alias",
				"key": "alias"
			},
			{
				"title": "原始字段",
				"dataIndex": "field",
				"key": "field"
			},
			{
				"title": "子段类型",
				"dataIndex": "dataType",
				"key": "dataType"
			}
		],
		"dataSource": [
			{
				"id": "x1",
				"alias": "字段别名",
				"field": "原始字段名",
				"dataType": "字段类型"
			}
		]
	}

}
```

##### error response
```json
{
	"error": {
		"code": 500,
		"message": "服务器异常",
		"detail": "exception....."
	}
}
```

#### 获取数据集信息(ok, 打开配置就可以了)

```text
url: http://localhost:7001/ui/:id/dataSet
method: get
```

##### Request
```json
{
	"id": 1
}
```

##### Respone
```json
{
	"id": "xxxx",
	"creator": "xxx",
	"createDate": "2018-02-01",
	"source_table": "x3",
	"data_set_name": "客户基本属性",
	"columns":[
		{
			"title": "id",
		   	"dataIndex": "id",
		   	"key":"id"	
		},
		{
			"title": "字段别名",
			"dataIndex": "alias",
			"key": "alias"
		},
		{
			"title": "原始字段",
			"dataIndex": "field",
			"key": "field"
		},
		{
			"title": "子段类型",
			"dataIndex": "dataType",
			"key": "dataType"
		}
	],
	"dataSource": [
		{
			"id": "x1",
			"alias": "字段别名",
			"field": "原始字段名",
			"dataType": "字段类型"
		}
	]
}
```

##### Error response
```json
{
	"error":{
		"code": 200,
		"message": "数据集id不存在"
	}
}
```

#### 修改数据集名称(ok)

```text
method: put
url: http://localhost:7001/ui/:dataSetId/changeDataSet
```

##### Request
```json
{
	"name": "new_name"
}
```

##### Response
```json
{
	"status": 200
}
```

#### 添加子目录(ok)

```text
method: post,
url:  http://localhost:7001/ui/:parentId/addDir
```

##### Request

```json
{
	
	"name": "sub dir name"
}
```

##### Response
```json
{
	"subDirId": "xxxxxxx"
}
```

#### 添加数据集(ok)
```text
method: POST,
url: http://localhost:7001/ui/:dirId/dataSet
```

##### Request

```json
{
	
	"dataSet": {
		"name": "data_set_name",
		"fields": [
			{
           "name": "c2",
           "type": "text",
           "desc": "描述2"
      }
		]
	}
}
```


##### Response

```json
{
	"dataSetId": "xxxx"
}
```

##### Error Response

```json
{
	"error": {
		"code": 500,
		"message": "具体什么错误后端返回看看"
	}
}

```

#### 创建用户(ok)
```text
method: post,
url: http://localhost:7001/ui/user/create
```

##### Request

```json
{
	"username": "xxx",
	"password": "xxx"
}
```

> password默认是tag123, 并且以md5形式存入数据库, username不能是空, username不能重复


##### Success Response

```json
{
	"status": 200
}
```

##### Error Respone

```json
{
	"code": 500,
	"message": "xxxx"
}
```


#### 获取所有数据集(ok)
```text
method: get,
url: http://localhost:7001/ui/dataSets
```

##### Response
```json
 {
   "info": {
  	  "code": 200,
  	  "message": ""
    },
   "count": "500",
   "pageCount": "100",
   "data": [
     {
       "tableid": "0001-01",
       "tablename": "member"
     }
   ]
 }
 ```

 - 查询数据集下的某张表所有字段信息(ok)

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
       "name": "c1",
       "dataType": "number",
       "desc": "描述1"
     },
     {
       "name": "c2",
       "dataType": "text",
       "desc": "描述2"
     }
   ]
 }
 ```











