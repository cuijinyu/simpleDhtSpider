/**
 * Created by 崔晋瑜 on 2017/12/26.
 */
const Table = require("./spider/Table");
const dgram = require("dgram");
const bencode = require("bencode");
const utils = require("./utils/utils");
const eventEmitter = require("events");
const crypto = require("crypto");
const db = require("./db/DB");
const mysql = require("mysql");
/**
 * 根节点
 * @type {{}}
 */
const BOOTSTRAP = [{
    address: 'router.utorrent.com',
    port: 6881
}, {
    address: 'router.bittorrent.com',
    port: 6881
}, {
    address: 'dht.transmissionbt.com',
    port: 6881
}];

class Spider extends eventEmitter{
    constructor(){
        super();
        this.udp = dgram.createSocket("udp4");
        this.random = Math.floor(Math.random()*65535)
        this.udp.bind(6881);
        this.bootstrap = BOOTSTRAP;

        /**
         * 随机初始一个NodeID
         * @type {Table}
         */
        this.table = new Table(utils.getNodeId());
        this.udp.on('error',err=>{
            console.log(`some error happened ====> ${err}`);
            this.udp.close();
        });
        this.udp.on('message',(pack,address)=>{
            // console.log(address);
            // console.log(pack);
            this.parse(pack,address);
        });
        this.udp.once("listening",()=>this.join());
        setTimeout(()=>{
            this.findMoreNodes()
        },1000)
    }

    /**
     * 发送UDP请求
     * @param message
     * @param address
     */
    send(message, address){
        // console.log("!!!!!!!!!!!!!!!")
        // console.log(message)
        // console.log("!!!!!!!!!!!!!!!")
        // console.log(address.address)
        message = bencode.encode(message);
        // console.log(message+address);
        this.udp.send(message,0,message.length,address.port,address.address);
    }
    parse(pack,address){
        try{
            let message
            try{
                 message = bencode.decode(pack);
            }catch (e){
                console.log("can't resolve it");
                return;
            }
            // console.log(message);
            // console.log(address)
            //
            if(message.y == undefined){
                return;
            }
            if(message.y.toString() == 'e'){
                return;
            }
            if(message.y.toString()!='r'){
                // console.log(message.y.toString())
                // console.log(message)
            }
            // console.log(message.y.toString())
            // console.log(address.address);
            if(message.y.toString() == 'r'){
                this.resFoundNode(message.r.nodes);
            }else if(message.y.toString() == 'q'){
                let question = message.q.toString();
                // console.log(question);
                switch (question){
                    case 'get_peers':
                        this.resGetPeers(message,address);
                        break;
                    case 'announce_peer':
                        this.resAnnouncePeer(message,address);
                        break;
                    case 'ping':
                        this.resPing(message,address);
                        break;
                    case 'find_node':
                        this.resFindNode(message,address);
                        break;
                }
            }
        }catch(e){
            console.log(e);
        }
    }
    /*
     不实现ping get_peers等，只用实现find_node
     */
    join(){
            this.bootstrap.forEach(root=>{
                this.find_node(this.table.nodeId,root)
            });
    }
    findMoreNodes(){
        //设置定时器，定时向外发送find_node请求
        setInterval(()=>{
            // if(this.table.bucket.length != 0){
                // console.log(`----------------`);
                // console.log(this.table.all());
                // console.log(`----------------`);
                if(this.table.nodes.length == 0){
                    this.join();
                }
                let nodes = this.table.pop();
                // console.log(nodes);
                nodes.map(e=>{
                    try{
                        this.find_node(e.nodeId,e)
                    }catch(e){
                        console.log("some wrong happened");
                    }
                    // console.log(e);
                    // console.log("I am been send to "+ e.address)
                })
                this.table.nodes = [];
            // }
        },10)
    }
    find_node(id, target){
        id = id!=undefined?utils.getNeighbor(id,this.table.nodeId):this.table.nodeId;
        if(target.port<= 0 || target.port > 65536){
            return;
        }
        let message = {
            t:crypto.randomBytes(2),
            y:'q',
            q:'find_node',
            a:{
                id:id,
                target:utils.getNodeId()
            }
        }
        // console.log(message);
        this.send(message,target)
    }

    resFoundNode(data){
        // console.log("I am the node that has been found");
        let nodes = utils.decodeNode(data);
        if(nodes instanceof Array){
            for(let i = 0;i<nodes.length;i++ ){
                // if(nodes[i].address.length >= 11 && nodes[i].address.toString() <= 15)
                // {
                    this.table.append(nodes[i]);
                    // console.log(this.table.nodes);
                // }
            }
        }else{
            this.table.append(nodes[i]);
        }
    }

    resPing(msg,addr){
        this.send({
            t:msg.t,
            y:'r',
            r:{
                id:utils.getNeighbor(msg.a.id,this.table.nodeId)
            }
        },addr)
        // console.log("I got some ping")
    }

    resGetPeers(msg,addr){
        let magnet = utils.getMagnet(msg.a.info_hash)
        console.log(magnet);
        (async ()=>{
            let info = mysql.escape(magnet);
            await db.query(`insert into magnet (magnet) values (${info})`);
        })()
        let res = {
            id: utils.getNeighbor(msg.a.info_hash, this.table.nodeId),
            token: crypto.randomBytes(4),
            nodes: ''
        };
        let message = {
            t:msg.t,
            r:res,
            y:'r'
        };
        if(addr.port <= 0||addr.port >65535){
            return;
        }
        this.send(message,addr);
    }

    resAnnouncePeer(msg,addr){
        let magnet = utils.getMagnet(msg.a.info_hash)
        console.log(magnet);
        (async ()=>{
            let info = mysql.escape(magnet);
            await db.query(`insert into magnet (magnet) values (${info})`);
        })()
        let res = {
            id: this.table.nodeId
        };
        let message = {
            t:msg.t,
            r:res,
            y:'r'
        };
        if(addr.port <= 0||addr.port >65535){
            return;
        }
        this.send(message,addr);
    }
    resFindNode(msg,addr){
        let res = {
            id:this.table.nodeId,
            nodes:''
        }
        let message ={
            t:msg.t,
            r:res,
            y:'r'
        }
        if(addr.port <= 0||addr.port >65535){
            return;
        }
        this.send(message,addr);
    }
}
new Spider();
module.exports = Spider;