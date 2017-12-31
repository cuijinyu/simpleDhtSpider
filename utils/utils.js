/**
 * Created by 崔晋瑜 on 2017/12/26.
 */
const crypto = require("crypto");
const bencode = require("bencode");
module.exports = {
    self : this,
    getNodeId:function(){
        return crypto.createHash('sha1').update(crypto.randomBytes(20)).digest();
    },

    /**
     * 高位越接近两个Node之间的距离越近
     * @param target
     * @param id
     * @returns {string|Array.<T>}
     */
    getNeighbor:function(target,id){
        return Buffer.concat([target.slice(0,15),id.slice(15)]);
    },

    /*
     解析收到的Node
     */
    decodeNode:function(nodes){
        let arr = [];
        const len = nodes.length;
        if (len % 26 !== 0) {
            return arr;
        }

        for (let i = 0; i + 26 <= nodes.length; i += 26) {
            arr.push({
                nid: nodes.slice(i, i + 20),
                address: nodes[i + 20] + '.' + nodes[i + 21] + '.' +
                nodes[i + 22] + '.' + nodes[i + 23],
                port: nodes.readUInt16BE(i + 24)
            });
        }

        return arr;
    },


    /**
     * 将Node转换为二进制
     * @param nodes
     * @returns {string|Array.<T>}
     */
    encodeNode:function(nodes){
        return Buffer.concat(nodes.map((node)=> Buffer.concat([node.nodeIdBuffer, this.encodeIP(node.address), this.encodePort(node.port)])));
    },
    /**
     * 将ip处理为指定格式，去掉.
     * @param ip
     */
    encodeIP:function(ip){
        return Buffer.from(ip.split(".").map(i=>parseInt(i)));
    },
    encodePort:function(port){
        let data = Buffer.alloc(2);
        data.writeUInt16BE(port,0);
        return data;
    },
    getMagnet:function (infohash) {
        return `magnet:?xt=urn:btih:${infohash.toString('hex').toUpperCase()}`
    }
}