/**
 * Created by 崔晋瑜 on 2017/12/31.
 */
let config=require("./dbconfig");
let mysql=require("mysql");
let pool=mysql.createPool(config.mysql);
//sql语句执行
function query(sql,callback) {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            connection.query(sql,(err,rows)=>{
                if(err){
                    connection.release();
                    reject(err);
                }else {
                    connection.release();
                    resolve(rows);
                }
            })
        })
    })
}
exports.query=query;