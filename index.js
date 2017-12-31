/**
 * Created by 崔晋瑜 on 2017/12/30.
 */
let Spider = require("./spider");
const cp = require('child_process');
    for(let i = 0;i<2;i++)
        cp.exec("node spider.js",function (err,stdout,stderr) {
            if(err){
                console.log(err)
            }
            console.log(stdout);
        })