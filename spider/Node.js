/**
 * Created by 崔晋瑜 on 2017/12/26.
 */
const utils = require("../utils/utils");
class Node{
    constructor(nodeId,ip,port){
        this.nodeId = nodeId || utils.getNodeId();
        this.ip = ip;
        this.port = port;
    }
}
module.exports = Node;