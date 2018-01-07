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
    getMetadata(infoHash,address){
        this.client.connect(address.port,address.address,()=>{
            console.log(`Connect to ${address.address}:${address.port} successful`);
        });
        this.client.write()
        this.infoHash = infoHash;
    }
    sendHandShake(){
        let msg = "BitTorrent protocol";
        msg += this.infoHash;
        msg += this.peerId;
    }
}