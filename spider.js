/**
 * Created by 崔晋瑜 on 2017/12/26.
 */
const Table = require("./spider/Table");
const dgram = require("dgram");
const bencode = require("bencode");
const utils = require("./utils/utils");
const eventEmitter = require("events");
const crypto = require("crypto");
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
            console.log(address);
            // console.log(pack);
            this.parse(pack,address);
        });
        this.udp.once("listening",()=>this.join());
    }

    /**
     * 发送UDP请求
     * @param message
     * @param address
     */
    send(message, address){
        message = bencode.encode(message);
        this.udp.send(message,0,message.length,address.port,address.address);
    }
    parse(pack,address){
        try{
            let message = bencode.decode(pack);
            if(message.y.toString() == 'r'){

            }else if(message.y.toString() == 'q'){
                let question = message.q.toString();
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
                }
            }
        }
    }
    ping(){

    }

    store(){

    }
    join(){
        this.bootstrap.forEach(root=>{
            this.find_node(this.table.nodeId,root)
        })
    }
    find_node(id, target){
        let message = {
            t:crypto.randomBytes(2),
            y:'q',
            q:'find_node',
            a:{
                id:id,
                target:utils.getNodeId()
            }
        }
        this.send(message,target)
    }


    resPing(msg,addr){
        this.send({
            t:message.t,
            y:'r',
            r:{
                id:utils.getNeighbor(message.a.id,this.table.nodeId)
            }
        })
    }

    resGetPeers(msg,addr){

    }

    resAnnouncePeer(msg,addr){

    }
}
new Spider();