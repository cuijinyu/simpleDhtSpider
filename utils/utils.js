/**
 * Created by 崔晋瑜 on 2017/12/26.
 */
const crypto = require("crypto");
const bencode = require("bencode");
module.exports = {
    getNodeId:function(){
        return crypto.createHash("sha1").update(Math.random().toString()).digest();
    },

    /**
     * 高位越接近两个Node之间的距离越近
     * @param target
     * @param id
     * @returns {string|Array.<T>}
     */
    getNeighbor:function(target,id){
        return Buffer.concat([target.slice(0,10),id.slice(10)]);
    },

    /*
        解析收到的Node    
    */
    decodeNode:function(nodes){
        let arr = [];
        console.log(nodes.length);
        //node的长度应该是26，那么nodes的长度应是26的倍数
        if(nodes.length %26 !== 0){
            return arr
        }

        for(let i = 0;i+26<=nodes.length;i+=26){
            arr.push({
                nodeId: nodes.slice(i,i+20),
                address: `${nodes[i+20]}.${nodes[i+21]}.${nodes[i+22]}.${nodes[i+23]}`,
                port:nodes.readUInt16BE(i+24)
            });
        }

        return arr;
    },

    /*
        将Node转换为二进制
    */
    encodeNode:function(node){

    }
}