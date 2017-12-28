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
     * 讲node插入到表中
     */
    append(node){
        if(node.nodeId == this.nodeId){
            return ;
        }else{
            let index = this.getBucketIndex(node.nodeId);
            let tempBucket = this.bucket[index];
            let message = this.bucket[index].append(node);
            if(message == "FULL"){
                if(!this.bucket[index].nodeInRange(node.nodeId)){
                    return;
                }else{
                    this.splitBucket(index);
                    this.append(node);
                }
            }
        }
    }

    /**
     * 获取桶的引导
     * @param nodeId
     * @returns {number}
     */
    getBucketIndex(nodeId){
        for(let i = 0;i < this.bucket.length;i ++){
            if(this.bucket[i].nodeInRange(nodeId)){
                return i;
            }
        }
    }

    /**
     * 拆分桶
     * @param index
     */
    splitBucket(index){
        let oldBucket = this.bucket[index];
        let point = this.bucket[index].max - (this.bucket[index].max - this.bucket[index].min)/2;
        let newBucket = new Bucket(point,oldBucket.max);
        oldBucket.max = point;
        this.bucket.push(newBucket);
        for(let node in newBucket){
            if(node.nodeInRange(node.nodeId)){
                newBucket.push(node);
            }
        }
        for(let node in newBucket){
            for(let i = 0;i<oldBucket.length;i++){
                if(node.nodeId == oldBucket[i].nodeId){
                    oldBucket.splice(i,1);
                }
            }
        }
    }
}
module.exports = Table;