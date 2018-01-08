/**
 * Created by 崔晋瑜 on 2018/1/5.
 */
let net = require("net");
let utils = require("../utils/utils");
const bencode = require("bencode");
class MetadataHelper{
    constructor(){
        this.client = new net.Socket();
        this.infoHash = "";
        this.peerId = utils.getNodeId();
    }
    sendMessage(msg){
        this.client.write(msg,status=>{

        })
    }
    getMetadata(infoHash,address){
        try{
            this.client.connect(address.port,address.address,()=>{
                console.log(`Connect to ${address.address}:${address.port} successful`);
                this.sendHandShake();
                this.sendExtHandShake();
            });
            this.client.on('data',data=>{
                console.log(data.toString());
            });
            this.client.on('close',()=>{

            });
            this.client.on('end',()=>{

            });
            this.client.on('error',()=>{
                console.log(`can't connect to ${address.address}:${address.port}`)
            })
        }catch (e){
            console.log(e);
        }
        this.infoHash = infoHash;
    }
    sendHandShake(){
        let msg = "\x13BitTorrent protocol";
        msg += "\x00\x00\x00\x00\x00\x10\x00\x00";
        msg += this.infoHash;
        msg = new Buffer(msg);
        msg = Buffer.concat([msg,this.peerId]);
        this.sendMessage(msg);
    }
    sendExtHandShake(){
        let msg = "\x14\x00";
        msg = new Buffer(msg);
        msg = Buffer.concat([msg,bencode.encode({
            m:{
                ut_metadata:1
            }
        })])
        this.sendMessage(msg);
    }
}
// let test = new MetadataHelper().sendExtHandShake();
module.exports = MetadataHelper;