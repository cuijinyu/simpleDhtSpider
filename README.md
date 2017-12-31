# simpleDhtSpider
一个小小的DHT爬虫，爬一爬种子，因为对py和其他编程语言不熟悉，故采用了node。可以爬取到种子文件并存储到Mysql数据库里。用它做些想做的事情！蛤蛤！
## 环境要求
 - node>v8.0.0
 - mysql
## 使用方法
 - 1.运行dht.sql创建数据库和表结构
 - 2.修改db/dbconfig.js下的数据库配置
 - 3.npm install
 - 4.单线程运行node spider.js
 - 5.多进程运行node index.js(功能极其不完善)

## 文件结构
 - db文件夹：存放数据库配置，配置文件是dbconfig.js
 - spider文件夹：存放路由表结构，但是因为一些错误，暂时简化了路由表（o(╥﹏╥)o Buffer用的不好）
 - util文件夹：存放一些操作node（DHT协议里的一个元素）的方法

## 存在的问题
效率还是有些低，吃带宽严重。并且暂时没有实现bep_009协议，还不能通过磁力链接获取到种子的信息。

## todo
- [ ] 完成bep_009协议的实现
- [ ] 对种子进行分类，方便对其的进一步处理
- [ ] O(∩_∩)O写个磁力搜索引擎怎么样

## 参考文档
[DHT协议官方版本](http://www.bittorrent.org/beps/bep_0005.html)


[P2P中DHT网络介绍](http://blog.csdn.net/mergerly/article/details/7989281)


[BitTorrent的DHT协议(译自官方版本)](http://blog.csdn.net/mergerly/article/details/7989188)


[P2P中DHT网络爬虫](http://codemacro.com/2013/05/19/crawl-dht/)

## 参考过的源码
[nodeDHT](https://github.com/fanpei91/nodeDHT)


[dhtspider](https://github.com/cuijinyu/dhtspider)
