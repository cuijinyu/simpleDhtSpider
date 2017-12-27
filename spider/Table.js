/**
 * Created by 崔晋瑜 on 2017/12/26.
 */
const Bucket = require("./Bucket");
class Table{
    constructor(nodeId){
        /**
         * 构建路由表内的桶
         * @type {Array}
         */
        this.bucket = [];
        this.bucket.push(new Bucket(0,2E160));
        this.nodeId = nodeId;
    }

    /**
     * 暂时还没有实现，之后实现
     */
    append(){

    }
}
var test = new Table();

module.exports = Table;