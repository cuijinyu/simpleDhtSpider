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

    append(node){
        if( node.nodeId > this.min && node.nodeId < this.max ){

            if(this.nodes.length < 8){

                if( node.nodeId.length != 20){
                    for(let i = 0;i < this.nodes.length;i++){
                        if(this.nodes[i].nodeId == node.nodeId){
                            this.nodes[i] = node;
                        }else{
                            this.nodes.push(node);
                        }
                    }
                }

            }else{
                return "FULL";
            }

        }
    }
}
module.exports = Bucket;