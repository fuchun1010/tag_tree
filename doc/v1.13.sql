CREATE TABLE IF NOT EXISTS ads.mk_tag_rchg_order(
     member_id 						BIGINT 	COMMENT '会员ID'
    ,rchg_deal_num 				    string 	COMMENT '交易序号'
    ,rchg_amt 					    double 	COMMENT '充值金额'
    ,rchg_cnt 					    int 	COMMENT '充值次数'
    ,rchg_time 					    BIGINT 	COMMENT '充值日期'
    ,rchg_channel 				    string 	COMMENT '充值渠道' #枚举
    ,rchg_store_code				string 	COMMENT '充值门店' #树枚举
    ,rchg_city_code 				string 	COMMENT '充值城市' #树枚举
    ,rchg_org_code 				    string 	COMMENT '充值配送中心' #树枚举
) 
COMMENT '会员模块-营销标签充值维度表' PARTITIONED BY(part_date string) 
ROW FORMAT delimited FIELDS TERMINATED BY '*' 
LINES TERMINATED BY '\n' STORED AS PARQUET
;


CREATE TABLE IF NOT EXISTS ads.mk_tag_cons_order(
    member_id 						BIGINT 	COMMENT '会员ID'
    ,consume_deal_serial_num 		string 	COMMENT '交易序号'
    ,consume_store_code				string 	COMMENT '消费门店' # 树枚举
    ,consume_city_code 				string 	COMMENT '消费城市' # 树枚举
    ,consume_org_code 				string 	COMMENT '消费配送中心'
    ,coupon_batch_num 				string 	COMMENT '消费优惠券批次'
    ,consume_amt 					double 	COMMENT '消费金额'
    ,consume_cnt 					int 	COMMENT '消费次数'
    ,consume_time 					BIGINT 	COMMENT '消费日期'
    ,pay_way 						string  COMMENT '订单支付渠道,一体化，三方合并' # 枚举值
    ,consume_channel 				string 	COMMENT '订单消费渠道,会员、三方渠道合并' # 枚举值
    ,shop_cycle 					int 	COMMENT '订单购物周期'   #枚举值
    ,shop_period 					int 	COMMENT '订单购物时段'   #枚举值
    ,consume_integral_value 		int 	COMMENT '订单积分值'
    ,consume_integral_expire_time 	BIGINT 	COMMENT '订单积分过期日期'
    ,consume_integral_create_time 	BIGINT 	COMMENT '订单积分领取日期'
    ,tpp_delivery_time 				BIGINT 	COMMENT '三方配送日期' 
    ,tpp_payment_type 				string	COMMENT '三方支付方式,线上,现金,到付' #枚举
    ,refund_cnt 					int 	COMMENT '订单退款次数'
    ,refund_amt 					double 	COMMENT '订单退款金额'
    ,refund_time 					BIGINT 	COMMENT '订单退款日期'
    ,refund_channel 				string 	COMMENT '订单退款渠道' #枚举
) COMMENT '会员模块-营销标签消费维度表' PARTITIONED BY(part_date string) ROW FORMAT delimited FIELDS TERMINATED BY '*' LINES TERMINATED BY '\n' STORED AS PARQUET;



CREATE TABLE IF NOT EXISTS ads.mk_tag_order_details (
    member_id                BIGINT COMMENT '会员ID',
    deal_serial_num          string COMMENT '交易序号',
    item_consume_store_code  string COMMENT '单品消费门店', # 树枚举
    item_consume_city_code   string COMMENT '单品消费城市',  # 树枚举
    item_consume_org_code    string COMMENT '单品消费配送中心', #树枚举
    item_tpp_payment_type    string COMMENT '三方支付方式、现金、线上、线下', #枚举
    item_pay_way             string COMMENT '单品支付渠道,一体化、三方渠道合并', #枚举
    item_consume_channel     string COMMENT '单品消费渠道,一体化、三方渠道合并', #枚举
    item_shop_cycle          int    COMMENT '单品购物周期', # 枚举值
    item_shop_period         int    COMMENT '单品购物时段', # 枚举值
    item_refund_time         BIGINT COMMENT '单品退款日期',
    item_consume_time        BIGINT COMMENT '单品消费日期',
    middle_type_code         string COMMENT '中类代码', # 树枚举
    small_type_code          string COMMENT '小类代码(消费品类)', # 树枚举
    itemcode                 string COMMENT '单品代码', # 树枚举
    itemname                 string COMMENT '单品名称',
    item_consume_amt         double COMMENT '单品消费金额',
    item_consume_cnt         int    COMMENT '单品消费次数',
    item_refund_amt          double COMMENT '单品退款金额',
    item_refund_cnt          int    COMMENT '单品退款次数',
    item_tpp_delivery_time   BIGINT COMMENT '单品三方配送日期'
) COMMENT '会员模块-营销标签会员订单明细表' PARTITIONED BY(part_date string) ROW FORMAT delimited FIELDS TERMINATED BY '*' LINES TERMINATED BY '\n' STORED AS PARQUET;





CREATE TABLE IF NOT EXISTS ads.mem_market_tag_sum (
    member_id BIGINT COMMENT '会员ID',
    member_type string COMMENT '会员类型 P: 手机会员 C: 实体卡会员',
    phone_num string COMMENT '手机号码',
    wx_open_id string COMMENT '微信OpenId',
    status string COMMENT '状态 N：正常 L：挂失 D：注销 S：锁定 U永久锁定',
    member_sex string COMMENT '会员性别 M：男 F：女', # 枚举
    account_balance int COMMENT '最新账户余额',
    integral_account_balance int COMMENT '最新积分账户余额',
    integral_account_total int COMMENT '最新积分账户总额',
    growth_value int COMMENT '成长值',
    wx_binding_status string COMMENT '微信绑定状态',
    register_time BIGINT COMMENT '注册日期',
    member_level_id int COMMENT '会员等级ID',
    register_store_code string COMMENT '注册门店代码',
    first_login_store string COMMENT '首次访问门店代码',
    register_city_code string COMMENT '注册城市', # 树枚举
    register_org_code string COMMENT '注册配送中心代码',
    register_channel string COMMENT '注册渠道代码', # 枚举
    register_duration int COMMENT '注册时长',
    total_consume_cnt int COMMENT '累计消费次数',
    total_consume_amt int COMMENT '累计消费金额',
    last_consume_amt int COMMENT '最后消费金额',
    last_consume_duration int COMMENT '最后消费时长',
    last_consume_time BIGINT COMMENT '最后消费日期',
    last_consume_store_code string COMMENT '最后消费门店',
    last_consume_city_code string COMMENT '最后消费城市', # 树枚举
    eb_total_consume_amt int COMMENT '电商累计消费金额',
    eb_total_consume_cnt int COMMENT '电商累计消费次数',
    last_3m_shop_cycle int COMMENT '最近3个月购物周期',
    last_3m_shop_period int COMMENT '最近3个月购物时段',
    last_refund_time BIGINT COMMENT '最后退款日期',
    last_refund_amt int COMMENT '最后退款金额',
    total_refund_cnt int COMMENT '累计退款次数',
    total_refund_amt int COMMENT '累计退款金额',
    eb_total_refund_amt int COMMENT '电商累计退款金额',
    eb_total_refund_cnt int COMMENT '电商累计退款次数',
    total_deposit_amt int COMMENT '累计充值金额',
    total_deposit_cnt int COMMENT '累计充值次数',
    eb_total_deposit_amt int COMMENT '电商累计充值金额',
    eb_total_deposit_cnt int COMMENT '电商累计充值次数',
    last_deposit_amt int COMMENT '最后充值金额',
    last_deposit_store_code string COMMENT '最后充值门店',
    last_deposit_city_code string COMMENT '最后充值城市', #树枚举
    last_consume_channel string COMMENT '最后消费渠道',
    last_deposit_channel string COMMENT '最后充值渠道',
    last_refund_channel string COMMENT '最后退款渠道',
    last_refund_store_code string COMMENT '最后退款门店',
    last_refund_city_code string COMMENT '最后退款城市', #树枚举
    last_consume_org_code string COMMENT '最后消费配送中心代码',
    last_deposit_org_code string COMMENT '最后充值配送中心代码',
    last_refund_org_code string COMMENT '最后退款配送中心代码',
    tpp_total_consume_cnt int COMMENT '第三方累计消费次数',
    tpp_total_consume_amt int COMMENT '第三方累计消费金额'
) COMMENT '会员模块-营销标签汇总表' PARTITIONED BY(part_date string) ROW FORMAT delimited FIELDS TERMINATED BY '*' LINES TERMINATED BY '\n' STORED AS PARQUET;