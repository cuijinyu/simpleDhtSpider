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
    }
}