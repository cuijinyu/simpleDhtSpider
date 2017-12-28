/**
 * Created by 崔晋瑜 on 2017/12/26.
 */
class Bucket{
    constructor(min,max){
        this.min = min;
        this.max = max;
        this.nodes = []; //Node列表
        this.lastAccessed = Date.now(); //最后访问时间
    }

    /**
     * 向桶内插入node
     * @param node
     * @returns {string}
     */
    append(node){
        if( node.nodeId > this.min && node.nodeId < this.max ){
            node.nodeId = node.nodeId.toString();
            if( node.nodeId.length != 20){
                console.log("I am not equal to 20")
                return
            }
            if(this.nodes.length == 0){
                this.nodes.push(node);
                return
            }
            if(this.nodes.length < 8){
                for(let i = 0;i < this.nodes.length;i++){
                    if(this.nodes[i].nodeId == node.nodeId){
                        this.nodes[i] = node;
                    }else{
                        this.nodes.push(node);
                    }
                }
            }else{
                return "FULL";
            }

        }
    }

    /**
     * 判断node的ID是否在桶的范围内
     * @param nodeId
     * @returns {boolean}
     */
    nodeInRange(nodeId){
        if(nodeId > this.min && nodeId < this.max){
            return true;
        }else{
            return false;
        }
    }
}
let test = new Bucket(0,2E160);
console.log(test.nodes);
module.exports = Bucket;