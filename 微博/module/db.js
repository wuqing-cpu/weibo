const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
function _connect() {
    return new Promise(function (resolve,reject) {
        mongoClient.connect("mongodb://127.0.0.1:27017",{useNewUrlParser: true },function (err,client) {
            if(err){
                console.log("失败")
            }else {
                const db = client.db("weibo");
                resolve(db);
            }
        })
    })
};
module.exports.insertOne = async (coll,insertObj) => {
    const db = await _connect();
    return new Promise(function (resolve,reject) {
        db.collection(coll).insertOne(insertObj,function (err,results) {
            if(err) reject(err);
            else resolve(results);
        })
    })
}
module.exports.count = async function (coll,whereObj={}) {
    const db = await _connect();
    return new Promise(function (resolve,reject) {
        db.collection(coll).countDocuments(whereObj).then(function (count) {
            resolve(count);
        })
    })
}
module.exports.find = async function (coll,{whereObj={},sort={},skip=0,limit=0}) {
    const db = await _connect();
    return new Promise(function (resolve,reject) {
        db.collection(coll).find(whereObj).sort(sort).skip(skip).limit(limit).toArray(function (err,results) {
            if(err) reject(err);
            else resolve(results);
        })
    })
}
module.exports.deleteOne = async function (coll,deleteObj) {
    const db = await _connect();
    return new Promise(function (resolve,reject) {
        db.collection(coll).deleteOne(deleteObj,function (err,results) {
            if(err) reject(err);
            else resolve(results);
        })
    })
}
module.exports.updateOne = async function (coll,finds,updateObj) {
    const db = await _connect();
    return new Promise(function (resolve,reject) {
        db.collection(coll).updateOne(finds,updateObj,function (err,results) {
            if(err) reject(err);
            else resolve(results);
        })
    })
}