/**
 * Created by 崔晋瑜 on 2017/12/26.
 */
const Bucket = require("./Bucket");
const utils = require("../utils/utils")
class Table{
    constructor(nodeId){
        /**
         * 构建路由表内的桶
         * @type {Array}
         */        // this.bucket = [];

        // this.bucket.push(new Bucket(0,2E160));
        this.nodeId = nodeId != undefined ? nodeId:utils.getNodeId();
        this.nodes = [];
    }

    /**
     * 讲node插入到表中
     */
    append(node){
        // if(node.nodeId == this.nodeId){
        //     return ;
        // }else{
        //     let index = this.getBucketIndex(node.nodeId);
        //     let tempBucket = this.bucket[index];
        //     try{
        //         if(this.bucket[index] != undefined)
        //             var message = this.bucket[index].append(node);
        //     }catch(e){
        //         console.log(e);
        //     }
        //     if(message == "FULL"){
        //         if(!this.bucket[index].nodeInRange(node.nodeId)){
        //             return;
        //         }else{
        //             this.splitBucket(index);
        //             this.append(node);
        //         }
        //     }
        // }
        this.nodes.push(node);
        // console.log(this.bucket.length);
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
        for(let node in oldBucket){
            if(newBucket.nodeInRange(node.nodeId)){
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

    pop(){
        // let length = this.bucket.length;
        // // console.log(length);
        // if(length == 1){
        //     return this.bucket[0];
        // }else{
        //     length = this.bucket.length;
        //     let random = Math.floor(Math.random()*length);
        //     // console.log(this.bucket[random]);
        //     return this.bucket[random].nodes;
        // }
        return this.nodes;
    }
}
module.exports = Table;