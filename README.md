# tag-service



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

```bash
curl -XPOST "http://localhost:7001/ui/login" -H "Content-Type:application/json" -d '{
	"username": "admin",
	"password": "admin"
}'

curl -XPOST "http://localhost:7001/ui/user/create" -H "Content-Type:application/json" -d '{
	"username": "lisi",
	"password": "tag123"
}'
```


#### 
```shell
curl -XDELETE "http://localhost:7001/tagLevel/5c9d8ca4ac28602bf800f114/delete" 

curl -XDELETE "http://localhost:7001/tagLevel/5c9ecf8a6ac0be483d6de400/delete"

curl -XDELETE "http://localhost:7001/tagLevel/5c9ed011c6cd6348804fc3be/delete"


curl -XPOST  "http://localhost:7001/tagLevel/create" -H "Content-Type:application/json" -d '{
	"name": "test dir 2"
}' 

curl -XPOST "http://localhost:7001/tagLevel/5c9ecf8a6ac0be483d6de400/create" -H "Content-Type:application/json" -d '{
	"name": "test dir 1-1"
}'

curl -XPOST "http://localhost:7001/tag/create" -H "Content-Type:application/json" -d '{ 
    
    "tagContent" : "会员类型=特殊会员。", 
    "count" : 3, 
    "executeStatus" : "wait", 
    "tagLevelId" : "5b1640eb8b1575610e620ba8", 
    "operator" : "and", 
    "fromTable" : "mem_market_tag_sum", 
    "name" : "标签测试11", 
    "isActive": true,
    "expireDate" : "2019-02-26", 
    "createDate" : "2019-02-25T14:06:18.589+0000", 
    "createUser" : {
        "userName" : "舒森", 
        "userId" : "012373"
    }, 
    "divedGroups" : {
        "split" : [

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
            "lat" : "mem_market_tag_sum", 
            "operator" : "and", 
            "nodeType" : "group", 
            "conditions" : [
                {
                    "nodeType" : "condition", 
                    "id" : "C858DACDF6E0000124121AD013601DD4", 
                    "values" : [
                        "S"
                    ], 
                    "comparisonOperator" : "IN_OPTIONS", 
                    "item" : {
                        "fieldType" : "text", 
                        "fieldName" : "member_type"
                    }
                }
            ], 
            "id" : "C858DACD3E1000016077188510801D81"
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
}'

```