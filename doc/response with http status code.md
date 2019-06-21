## response with http status code


#### 获取数据集

```url
curl -XGET "http://localhost:7001/datasets
```

##### response
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "_id": "5adde5d619145e4bc3db4f3c",
        "dirId": "5adde05ca72d514bc3c55e55",
        "dataSetId": 40841,
        "isAgg": true,
        "isActive": true,
        "name": "mem_market_tag_sum",
        "fields": [
          {
            "fieldName": "member_level_id",
            "fieldType": "number",
            "desc": "会员等级"
          },
          {
            "fieldName": "last_consume_time",
            "fieldType": "date",
            "desc": "最后消费日期"
          },
          {
            "fieldName": "eb_total_deposit_amt",
            "fieldType": "number",
            "desc": "电商累计充值金额"
          },
          {
            "fieldName": "eb_total_deposit_cnt",
            "fieldType": "number",
            "desc": "电商累计充值次数"
          },
          {
            "fieldName": "account_balance",
            "fieldType": "number",
            "desc": "账户余额"
          },
          {
            "fieldName": "growth_value",
            "fieldType": "number",
            "desc": "成长值"
          },
          {
            "fieldName": "wx_binding_status",
            "fieldType": "text",
            "desc": "微信绑定状态"
          },
          {
            "fieldName": "register_time",
            "fieldType": "date",
            "desc": "注册日期"
          },
          {
            "fieldName": "first_login_store",
            "fieldType": "text",
            "desc": "首次访问门店"
          },
          {
            "fieldName": "last_refund_store_code",
            "fieldType": "text",
            "desc": "最后退款门店"
          },
          {
            "fieldName": "register_org_code",
            "fieldType": "text",
            "desc": "注册配送中心"
          },
          {
            "fieldName": "register_channel",
            "fieldType": "text",
            "desc": "注册渠道"
          },
          {
            "fieldName": "register_duration",
            "fieldType": "number",
            "desc": "注册时长"
          },
          {
            "fieldName": "total_consume_cnt",
            "fieldType": "number",
            "desc": "累计消费次数"
          },
          {
            "fieldName": "total_consume_amt",
            "fieldType": "number",
            "desc": "累计消费金额"
          },
          {
            "fieldName": "last_consume_amt",
            "fieldType": "number",
            "desc": "最后消费金额"
          },
          {
            "fieldName": "last_consume_duration",
            "fieldType": "number",
            "desc": "最后消费时长"
          },
          {
            "fieldName": "last_consume_store_code",
            "fieldType": "text",
            "desc": "最后消费门店"
          },
          {
            "fieldName": "last_consume_city_code",
            "fieldType": "text",
            "desc": "最后消费城市"
          },
          {
            "fieldName": "eb_total_consume_amt",
            "fieldType": "number",
            "desc": "电商累计消费金额"
          },
          {
            "fieldName": "eb_total_consume_cnt",
            "fieldType": "number",
            "desc": "电商累计消费次数"
          },
          {
            "fieldName": "last_3m_shop_cycle",
            "fieldType": "number",
            "desc": "最近3个月购物周期"
          },
          {
            "fieldName": "last_3m_shop_period",
            "fieldType": "number",
            "desc": "最近3个月购物时段"
          },
          {
            "fieldName": "last_refund_time",
            "fieldType": "date",
            "desc": "最后退款日期"
          },
          {
            "fieldName": "last_refund_amt",
            "fieldType": "number",
            "desc": "最后退款金额"
          },
          {
            "fieldName": "total_refund_cnt",
            "fieldType": "number",
            "desc": "累计退款次数"
          },
          {
            "fieldName": "total_refund_amt",
            "fieldType": "number",
            "desc": "累计退款金额"
          },
          {
            "fieldName": "eb_total_refund_amt",
            "fieldType": "number",
            "desc": "电商累计退款金额"
          },
          {
            "fieldName": "eb_total_refund_cnt",
            "fieldType": "number",
            "desc": "电商累计退款次数"
          },
          {
            "fieldName": "total_deposit_amt",
            "fieldType": "number",
            "desc": "累计充值金额"
          },
          {
            "fieldName": "total_deposit_cnt",
            "fieldType": "number",
            "desc": "累计充值次数"
          },
          {
            "fieldName": "last_deposit_store_code",
            "fieldType": "text",
            "desc": "最后充值门店"
          },
          {
            "fieldName": "consume_store",
            "fieldType": "text",
            "desc": "消费门店代码"
          },
          {
            "fieldName": "last_deposit_city_code",
            "fieldType": "text",
            "desc": "最后充值城市"
          },
          {
            "fieldName": "member_type",
            "fieldType": "text",
            "desc": "会员类型"
          },
          {
            "fieldName": "last_deposit_amt",
            "fieldType": "number",
            "desc": "最后充值金额"
          },
          {
            "fieldName": "register_city_code",
            "fieldType": "text",
            "desc": "注册城市"
          },
          {
            "fieldName": "last_refund_city_code",
            "fieldType": "text",
            "desc": "最后退款城市"
          },
          {
            "fieldName": "last_consume_org_code",
            "fieldType": "text",
            "desc": "最后消费配送中心"
          },
          {
            "fieldName": "last_deposit_org_code",
            "fieldType": "text",
            "desc": "最后充值配送中心"
          },
          {
            "fieldName": "last_refund_org_code",
            "fieldType": "text",
            "desc": "最后退款配送中心"
          },
          {
            "fieldName": "last_consume_channel",
            "fieldType": "text",
            "desc": "最后消费渠道"
          },
          {
            "fieldName": "last_deposit_channel",
            "fieldType": "text",
            "desc": "最后充值渠道"
          },
          {
            "fieldName": "last_refund_channel",
            "fieldType": "text",
            "desc": "最后退款渠道"
          },
          {
            "fieldName": "tpp_total_consume_cnt",
            "fieldType": "number",
            "desc": "三方累计消费次数"
          },
          {
            "fieldName": "tpp_total_consume_amt",
            "fieldType": "number",
            "desc": "三方累计消费金额"
          },
          {
            "fieldName": "member_sex",
            "fieldType": "text",
            "desc": "会员性别"
          },
          {
            "fieldName": "status",
            "fieldType": "text",
            "desc": "状态"
          },
          {
            "fieldName": "register_store_code",
            "fieldType": "text",
            "desc": "注册门店"
          }
        ]
      },
      {
        "_id": "5adde96852b457571e894ebc",
        "dirId": "5adde05ca72d514bc3c55e55",
        "dataSetId": 41134,
        "isAgg": false,
        "isActive": true,
        "name": "mem_market_tag_datail_record",
        "fields": [
          {
            "fieldName": "itemname",
            "fieldType": "text",
            "desc": "商品名称"
          },
          {
            "fieldName": "register_store_code",
            "fieldType": "text",
            "desc": "注册门店"
          },
          {
            "fieldName": "member_level_id",
            "fieldType": "number",
            "desc": "会员等级"
          },
          {
            "fieldName": "member_type",
            "fieldType": "text",
            "desc": "会员类型"
          },
          {
            "fieldName": "account_balance",
            "fieldType": "number",
            "desc": "最新账户余额"
          },
          {
            "fieldName": "wx_binding_status",
            "fieldType": "text",
            "desc": "微信绑定状态"
          },
          {
            "fieldName": "register_duration",
            "fieldType": "number",
            "desc": "注册时长"
          },
          {
            "fieldName": "register_city_code",
            "fieldType": "text",
            "desc": "注册城市"
          },
          {
            "fieldName": "register_org_code",
            "fieldType": "text",
            "desc": "注册配送中心"
          },
          {
            "fieldName": "register_channel",
            "fieldType": "text",
            "desc": "注册渠道"
          },
          {
            "fieldName": "refund_amt",
            "fieldType": "number",
            "desc": "退款金额"
          },
          {
            "fieldName": "pay_way",
            "fieldType": "text",
            "desc": "支付方式"
          },
          {
            "fieldName": "consume_store_code",
            "fieldType": "text",
            "desc": "消费门店"
          },
          {
            "fieldName": "consume_city_code",
            "fieldType": "text",
            "desc": "消费城市"
          },
          {
            "fieldName": "consume_org_code",
            "fieldType": "text",
            "desc": "消费配送中心"
          },
          {
            "fieldName": "consume_channel",
            "fieldType": "text",
            "desc": "消费渠道"
          },
          {
            "fieldName": "coupon_batch_num",
            "fieldType": "text",
            "desc": "优惠券批次"
          },
          {
            "fieldName": "consume_amt",
            "fieldType": "number",
            "desc": "消费金额"
          },
          {
            "fieldName": "shop_cycle",
            "fieldType": "number",
            "desc": "购物周期"
          },
          {
            "fieldName": "shop_period",
            "fieldType": "number",
            "desc": "购物时段"
          },
          {
            "fieldName": "growth_value",
            "fieldType": "number",
            "desc": "成长值"
          },
          {
            "fieldName": "register_time",
            "fieldType": "date",
            "desc": "注册日期"
          },
          {
            "fieldName": "first_login_store",
            "fieldType": "text",
            "desc": "首次访问门店"
          },
          {
            "fieldName": "deposit_amt",
            "fieldType": "number",
            "desc": "充值金额"
          },
          {
            "fieldName": "refund_time",
            "fieldType": "date",
            "desc": "退款日期"
          },
          {
            "fieldName": "consume_time",
            "fieldType": "date",
            "desc": "消费时间"
          },
          {
            "fieldName": "small_type_code",
            "fieldType": "text",
            "desc": "消费品类"
          },
          {
            "fieldName": "deposit_cnt",
            "fieldType": "number",
            "desc": "充值次数"
          },
          {
            "fieldName": "consume_cnt",
            "fieldType": "number",
            "desc": "消费次数"
          },
          {
            "fieldName": "refund_cnt",
            "fieldType": "number",
            "desc": "退款次数"
          },
          {
            "fieldName": "single_integral_value",
            "fieldType": "number",
            "desc": "积分值"
          },
          {
            "fieldName": "single_integral_expire_time",
            "fieldType": "date",
            "desc": "积分过期日期"
          },
          {
            "fieldName": "single_integral_create_time",
            "fieldType": "date",
            "desc": "积分领取日期"
          },
          {
            "fieldName": "integral_account_balance",
            "fieldType": "number",
            "desc": "积分账户余额"
          },
          {
            "fieldName": "integral_account_total",
            "fieldType": "number",
            "desc": "积分账户总额"
          },
          {
            "fieldName": "tpp_consume_cnt",
            "fieldType": "number",
            "desc": "三方消费次数"
          },
          {
            "fieldName": "tpp_delivery_time",
            "fieldType": "date",
            "desc": "三方配送日期"
          },
          {
            "fieldName": "tpp_payment_time",
            "fieldType": "date",
            "desc": "三方消费日期"
          },
          {
            "fieldName": "tpp_channel_key",
            "fieldType": "text",
            "desc": "三方消费渠道"
          },
          {
            "fieldName": "tpp_store_code",
            "fieldType": "text",
            "desc": "三方消费门店"
          },
          {
            "fieldName": "tpp_city_code",
            "fieldType": "text",
            "desc": "三方消费城市"
          },
          {
            "fieldName": "tpp_org_code",
            "fieldType": "text",
            "desc": "三方消费配送中心"
          },
          {
            "fieldName": "tpp_payment_type",
            "fieldType": "text",
            "desc": "三方支付方式"
          },
          {
            "fieldName": "tpp_payment_way",
            "fieldType": "text",
            "desc": "三方支付渠道"
          },
          {
            "fieldName": "tpp_goods_name",
            "fieldType": "text",
            "desc": "三方商品名称"
          },
          {
            "fieldName": "tpp_consume_amt",
            "fieldType": "number",
            "desc": "三方消费金额"
          },
          {
            "fieldName": "deposit_time",
            "fieldType": "date",
            "desc": "充值日期"
          },
          {
            "fieldName": "member_sex",
            "fieldType": "text",
            "desc": "会员性别"
          },
          {
            "fieldName": "status",
            "fieldType": "text",
            "desc": "状态"
          }
        ]
      }
    ]
  }
}
```

#### 获取表对应的字段

##### Request
```url
curl -XGET "http://localhost:7001/dataset/mem_market_tag_datail_record/fields"
```

##### Response

```json
{
  "code": 200,
  "data": {
    "fields": [
      {
        "fieldName": "itemname",
        "fieldType": "text",
        "desc": "商品名称"
      },
      {
        "fieldName": "register_store_code",
        "fieldType": "text",
        "desc": "注册门店"
      },
      {
        "fieldName": "member_level_id",
        "fieldType": "number",
        "desc": "会员等级"
      },
      {
        "fieldName": "member_type",
        "fieldType": "text",
        "desc": "会员类型"
      },
      {
        "fieldName": "account_balance",
        "fieldType": "number",
        "desc": "最新账户余额"
      },
      {
        "fieldName": "wx_binding_status",
        "fieldType": "text",
        "desc": "微信绑定状态"
      },
      {
        "fieldName": "register_duration",
        "fieldType": "number",
        "desc": "注册时长"
      },
      {
        "fieldName": "register_city_code",
        "fieldType": "text",
        "desc": "注册城市"
      },
      {
        "fieldName": "register_org_code",
        "fieldType": "text",
        "desc": "注册配送中心"
      },
      {
        "fieldName": "register_channel",
        "fieldType": "text",
        "desc": "注册渠道"
      },
      {
        "fieldName": "refund_amt",
        "fieldType": "number",
        "desc": "退款金额"
      },
      {
        "fieldName": "pay_way",
        "fieldType": "text",
        "desc": "支付方式"
      },
      {
        "fieldName": "consume_store_code",
        "fieldType": "text",
        "desc": "消费门店"
      },
      {
        "fieldName": "consume_city_code",
        "fieldType": "text",
        "desc": "消费城市"
      },
      {
        "fieldName": "consume_org_code",
        "fieldType": "text",
        "desc": "消费配送中心"
      },
      {
        "fieldName": "consume_channel",
        "fieldType": "text",
        "desc": "消费渠道"
      },
      {
        "fieldName": "coupon_batch_num",
        "fieldType": "text",
        "desc": "优惠券批次"
      },
      {
        "fieldName": "consume_amt",
        "fieldType": "number",
        "desc": "消费金额"
      },
      {
        "fieldName": "shop_cycle",
        "fieldType": "number",
        "desc": "购物周期"
      },
      {
        "fieldName": "shop_period",
        "fieldType": "number",
        "desc": "购物时段"
      },
      {
        "fieldName": "growth_value",
        "fieldType": "number",
        "desc": "成长值"
      },
      {
        "fieldName": "register_time",
        "fieldType": "date",
        "desc": "注册日期"
      },
      {
        "fieldName": "first_login_store",
        "fieldType": "text",
        "desc": "首次访问门店"
      },
      {
        "fieldName": "deposit_amt",
        "fieldType": "number",
        "desc": "充值金额"
      },
      {
        "fieldName": "refund_time",
        "fieldType": "date",
        "desc": "退款日期"
      },
      {
        "fieldName": "consume_time",
        "fieldType": "date",
        "desc": "消费时间"
      },
      {
        "fieldName": "small_type_code",
        "fieldType": "text",
        "desc": "消费品类"
      },
      {
        "fieldName": "deposit_cnt",
        "fieldType": "number",
        "desc": "充值次数"
      },
      {
        "fieldName": "consume_cnt",
        "fieldType": "number",
        "desc": "消费次数"
      },
      {
        "fieldName": "refund_cnt",
        "fieldType": "number",
        "desc": "退款次数"
      },
      {
        "fieldName": "single_integral_value",
        "fieldType": "number",
        "desc": "积分值"
      },
      {
        "fieldName": "single_integral_expire_time",
        "fieldType": "date",
        "desc": "积分过期日期"
      },
      {
        "fieldName": "single_integral_create_time",
        "fieldType": "date",
        "desc": "积分领取日期"
      },
      {
        "fieldName": "integral_account_balance",
        "fieldType": "number",
        "desc": "积分账户余额"
      },
      {
        "fieldName": "integral_account_total",
        "fieldType": "number",
        "desc": "积分账户总额"
      },
      {
        "fieldName": "tpp_consume_cnt",
        "fieldType": "number",
        "desc": "三方消费次数"
      },
      {
        "fieldName": "tpp_delivery_time",
        "fieldType": "date",
        "desc": "三方配送日期"
      },
      {
        "fieldName": "tpp_payment_time",
        "fieldType": "date",
        "desc": "三方消费日期"
      },
      {
        "fieldName": "tpp_channel_key",
        "fieldType": "text",
        "desc": "三方消费渠道"
      },
      {
        "fieldName": "tpp_store_code",
        "fieldType": "text",
        "desc": "三方消费门店"
      },
      {
        "fieldName": "tpp_city_code",
        "fieldType": "text",
        "desc": "三方消费城市"
      },
      {
        "fieldName": "tpp_org_code",
        "fieldType": "text",
        "desc": "三方消费配送中心"
      },
      {
        "fieldName": "tpp_payment_type",
        "fieldType": "text",
        "desc": "三方支付方式"
      },
      {
        "fieldName": "tpp_payment_way",
        "fieldType": "text",
        "desc": "三方支付渠道"
      },
      {
        "fieldName": "tpp_goods_name",
        "fieldType": "text",
        "desc": "三方商品名称"
      },
      {
        "fieldName": "tpp_consume_amt",
        "fieldType": "number",
        "desc": "三方消费金额"
      },
      {
        "fieldName": "deposit_time",
        "fieldType": "date",
        "desc": "充值日期"
      },
      {
        "fieldName": "member_sex",
        "fieldType": "text",
        "desc": "会员性别"
      },
      {
        "fieldName": "status",
        "fieldType": "text",
        "desc": "状态"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "busi_type"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "coupon_name"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "deal_serial_num"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "itemcode"
      },
      {
        "desc": "",
        "fieldType": "obj",
        "fieldName": "member_id"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "middle_type_code"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "phone_num"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "small_item_name"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "tpp_goods_code"
      },
      {
        "desc": "",
        "fieldType": "text",
        "fieldName": "wx_open_id"
      }
    ],
    "name": "mem_market_tag_datail_record"
  }
}

```

#### 获取所有的标签列表

##### Request
```url
curl -XGET "http://localhost:7001/tags"
```

##### Response
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "5b4c06f46180ff519a5f4d32",
        "name": "是的"
      }
    ]
  }
}
```

##### 获取字段枚举
##### Request
```url
curl -XGET "http://localhost:7001/mem_market_tag_datail_record/member_type/fieldData"
```

##### Response 
```json
{
  "code": 200,
  "data": {
    "list": {
      "category": "flat",
      "data": [
        {
          "desc": "手机会员",
          "code": "P"
        },
        {
          "desc": "实体卡会员",
          "code": "C"
        },
        {
          "desc": "门店福利会员",
          "code": "F"
        },
        {
          "desc": "APP录单会员",
          "code": "A"
        },
        {
          "desc": "特殊会员",
          "code": "S"
        }
      ]
    }
  }
}
```

#### 获取所有的目录

##### Request
```url
curl -XGET "http://localhost:7001/tagLevel/List"
```

##### Response
```json 
{
  "code": 200,
  "data": {
    "list": {
      "_id": "5b1640eb4aa511610ee4adb3",
      "dataSetDirs": [
        {
          "children": [
            {
              "id": "5b1a79240901416188289908",
              "children": [],
              "owners": [
                {
                  "id": "5a9f54c614a4404865516573",
                  "type": "user"
                },
                {
                  "id": "5b1640eb4aa511610ee4adb1",
                  "type": "user"
                }
              ],
              "name": "新会员激活"
            }
          ],
          "name": "会员",
          "id": "5b1640eb8b1575610e620ba8"
        },
        {
          "children": [],
          "name": "门店",
          "id": "5b1640eb8b1575610e620ba9"
        },
        {
          "name": "商品",
          "children": [],
          "id": "5b19262c937ede686bb27048"
        }
      ]
    }
  }
}
```

#### 标签创建

##### Request
```
curl -XPOST "http://localhost:7001/tag/create" -H "Content-Type:application/json" -d '{....}'
```

##### Response
```json
{
	"code": 200,
	"data":{
	 "id": rs[0]._id.toString()
	}
}
```

#### 字段类型不匹配
```
{
	code: 400,
	message: 'lack field message'
}
```

#### 预览标签

##### Request

```url
curl -XPOST "http://localhost:7001/tag/preview/numbers" -H "Content-Type:application/json" -d '{}'
```

##### Response 
```json
{
	"code":200,
	"data":{
		"count": 100
	}
}
```

##### 少字段
```json
{
	"code": 400,
	"message": "lack field message"
}
```

##### 已经有相同查询在运行
```json
{
	code: 409,
	"message": "已经有相同查询在运行"
}
```


#### 创建目录
```url
curl -XPOST "http://localhost:7001/tagLevel/create" -H "Content-Type:application/json" -d '{}'	
```

```response
{
	"code":200,
   "data":{
      "id": "xxx"
   }
}
```


#### 创建目录下的子目录
```url
curl -XPOST "http://localhost:7001/tagLevel/0x93js238/create" -H "Content-Type:application/json" -d '{}'	
```

```response
{
	"code":200,
   "data":{
      "id": "xxx"
   }
}
```
#### 标签查询

##### Request

```url
curl -XPOST "http://localhost:7001/tags/search" -H "Content-Type:application/json" -d '{}'
```

##### Response

```json
{
  "code": 200,
  "data": {
    "response": {
      "tags": [
        {
          "selectFields": [
            {
              "fun": "",
              "fieldType": "text",
              "fieldName": "member_id"
            },
            {
              "fun": "",
              "fieldType": "text",
              "fieldName": "phone_num"
            },
            {
              "fun": "",
              "fieldType": "text",
              "fieldName": "wx_open_id"
            }
          ],
          "conditions": [
            {
              "operator": "and",
              "nodeType": "group",
              "conditions": [
                {
                  "nodeType": "condition",
                  "id": "C8109A8B6130000184F18A4110D714D3",
                  "values": [
                    4
                  ],
                  "comparisonOperator": "IN_OPTIONS",
                  "item": {
                    "fieldType": "number",
                    "fieldName": "member_level_id"
                  }
                }
              ],
              "id": "C8109A57CD400001AA441FB019221889"
            }
          ],
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
          "hiveBy": [],
          "divedGroups": {
            "orderBy": [],
            "split": []
          },
          "createUser": {
            "userId": "011737",
            "userName": "谢云"
          },
          "cronJobId": "5b4c06f457288378165833f2",
          "createDate": "2018-07-16T02:46:12.787Z",
          "startDate": "2018-07-16",
          "expireDate": "2018-07-26T00:00:00.000Z",
          "name": "是的",
          "fromTable": "mem_market_tag_sum",
          "operator": "and",
          "isActive": true,
          "tagLevelId": "5b4426a842fab82a4c42396d",
          "executeStatus": "wait",
          "endDate": "2018-07-24",
          "cron": "0 8 * * 1,2,3",
          "__v": 0,
          "_id": "5b4c06f46180ff519a5f4d32",
          "isEnable": true
        }
      ],
      "tagLevel": [
        {
          "id": "5b1640eb8b1575610e620ba8",
          "name": "会员",
          "children": [
            {
              "name": "新会员激活",
              "owners": [
                {
                  "type": "user",
                  "id": "5a9f54c614a4404865516573"
                },
                {
                  "type": "user",
                  "id": "5b1640eb4aa511610ee4adb1"
                }
              ],
              "children": [],
              "id": "5b1a79240901416188289908"
            }
          ]
        },
        {
          "id": "5b1640eb8b1575610e620ba9",
          "name": "门店",
          "children": []
        },
        {
          "id": "5b19262c937ede686bb27048",
          "children": [],
          "name": "商品"
        }
      ]
    }
  }
}
```





