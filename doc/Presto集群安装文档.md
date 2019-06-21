## Presto cluster setup

#### Donwload presto server
* presto version

```shell
wget https://repo1.maven.org/maven2/com/facebook/presto/presto-server/0.205/presto-server-0.205.tar.gz
```

* unzip prosto 

```shell
tar zxvf presto-server-0.205.tar.gz
```

* install uuid rpm

```shell
yum install uuid
```

* execute uuid

```sheel
$ uuid
7fd6390a-f2dc-11e5-a834-0eb3775013cf
```

* Create configure files

```shell
mv presto-server-0.205.tar.gz presto-server
cd presto-server
mkdir etc
cd etc
mkdir spill-path
touch config.properties
touch node.properties
touch jvm.config
touch log.properties

mkdir /etc/catalog
cat /etc/catalog
touch jmx.properties
```

* config /etc/config.properties

```shell
coordinator=true
node-scheduler.include-coordinator=false
http-server.http.port=8080
query.max-memory=50GB
query.max-memory-per-node=4GB
discovery-server.enabled=true
discovery.uri=http://10.8.29.13:18080
experimental.spill-enabled=true
experimental.spiller-spill-path=/root/presto-seria/spill-path
```
> /root/presto-seria/spill-path这个路径根据实际情况换

* config /etc/jvm.preperties

```shell
-server
-Xmx16G
-XX:+UseG1GC
-XX:G1HeapRegionSize=32M
-XX:+UseGCOverheadLimit
-XX:+ExplicitGCInvokesConcurrent
-XX:+HeapDumpOnOutOfMemoryError
-XX:+ExitOnOutOfMemoryError
```

* config /etc/log.properties

```shell
com.facebook.presto = INFO
```

* config /etc/node.properties

```shell
node.environment = production
node.id = 7fd6390a-f2dc-11e5-a834-0eb3775013cf
node.data-dir = /root/presto-server/data
```

> /root/presto-server/data,根据实际创建路径填写

* config /etc/catalog/jmx.properties

```shell
connector.name=jmx
```

* config /etc/catalog/hive.properties

```shell
connector.name=hive-hadoop2
hive.metastore.uri=thrift://example.net:9083
```

> 注意：hive.config.resources=/etc/hadoop/conf/core-site.xml,/etc/hadoop/conf/hdfs-site.xml，另外参照一下测试服务器的配置


* 打包presto,然后复制到10.8.29.7,10.8.29.6,10.8.29.11这3台机器上

* 配置worker节点

```shell
vi /presto-server/etc/config.properties
coordinator=false
http-server.http.port=18080
query.max-memory=50GB
query.max-memory-per-node=4GB
discovery.uri=10.8.29.13:18080
experimental.spill-enabled=true
experimental.spiller-spill-path=/root/presto-seria/spill-path
```
* work节点安装uuid

```shell
$ uuid
xxx-xxxx-xxxxxxxxx
```

* 修改work节点node.properties

```shell
vi /presto-server/etc/node.properties
node.environment=production
node.id=xxx-xxxx-xxxxxxxxx
node.data-dir=/root/presto-server/data
```

* 修改work节点jvm.preperties

```shell
-server
-Xmx8G
-XX:+UseG1GC
-XX:G1HeapRegionSize=32M
-XX:+UseGCOverheadLimit
-XX:+ExplicitGCInvokesConcurrent
-XX:+HeapDumpOnOutOfMemoryError
-XX:+ExitOnOutOfMemoryError
```

> 注意上-Xmx8G,可能设置有点大，如果启动不起来就调低点

* 分别启动master节点和work节点
```shell
./presto-server/bin/launcher start
```

> 最先启动master节点，看看日志有正常启动成功没，在启动后面的worker node


* download presto client to master node

```shell
https://repo1.maven.org/maven2/com/facebook/presto/presto-cli/0.205/presto-cli-0.205-executable.jar

mvn presto-cli-0.205-executable.jar presto
```

* check cluster 是否成功配置

```shell
$ ./presto-cli.jar --server 10.8.13.115:18080 
presto> select * from system.runtime.nodes;
```

|node_id|http_uri| node_version |
|----|:----:|---:|
|ffb969e8-f049-11e5-a8dd-0e144badbcb1| http://10.8.29.7:18080|0.205|
|ffb969e8-f049-11e5-a8dd-0e144badbcb1| http://10.8.29.6:18080|0.205|
|ffb969e8-f049-11e5-a8dd-0e144badbcb1| http://10.8.29.11:18080|0.205|



