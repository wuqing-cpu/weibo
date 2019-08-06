const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const help = require("./module/help")
const db = require("./module/db")
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.get("/wuqq",async function (req,res) {
    const {context,callback} = req.query;
    console.log({context,callback})
    const count = await db.count("study",{context});
    if(count>0){
        if(callback){
            res.send(callback+"("+JSON.stringify({
                ok:-1,
                msg:"您添加的内容已存在"
            })+")")
        }else{
            res.json({
                ok:-1,
                msg:"您添加的内容已存在"
            })
        }
    }else{
        db.insertOne("study",{
            context,
            zannum:0,
            cainum:0,
            getTime:help.getTime()
        }).then(data=>{
            if(callback){
                res.send(callback+"("+JSON.stringify({
                    ok:1,
                    msg:"添加成功"
                })+")")
            }else{
                res.json({
                    ok:1,
                    msg:"添加成功"
                })
            }
        }).catch(data=>{
            res.json({
                ok:-1,
                msg:"添加失败"
            })
        })
    }
});
app.get("/wuq",async (req,res)=>{
    let pageIndex = req.query.pageIndex||1;
    pageIndex = pageIndex/1;
    const limit = 5;
    // 总条数
    const count = await db.count("study");
    let pageSum = Math.ceil(count/limit);// 总页数
    if(pageSum < 1) pageSum = 1;
    if(pageIndex < 1) pageIndex = 1;
    if(pageIndex > pageSum) pageIndex = pageSum;
    const contextList = await db.find("study",{
        limit,
        skip:(pageIndex-1)*limit,
        sort:{
            getTime:-1
        }
    })
    const obj = {
        ok:1,
        contextList,
        pageIndex,
        pageSum
    }

    const callback = req.query.callback;

    if(callback){
        // jsonp

        res.send(callback+"("+JSON.stringify(obj)+")")
    }else{
        // 非JSONP

        res.send(obj)
    }
});
app.get("/wu",async (req,res)=>{
    const dete = req.query;
    const callback = req.query.callback;
    const detelist = await db.deleteOne("study",{context:dete.context});
    if(callback){
        console.log(1111)
        res.send(callback+"("+JSON.stringify({
            detelist,
            ok:1,
            msg:"删除成功"
        })+")")
    }
})
app.get("/ww",async (req,res)=>{
    const dete = req.query;
    console.log(typeof dete.type)
    const updateOne = await db.updateOne(
        "study",{context:dete.context.toString()},{$inc:{
            [Number(dete.type)===1?"zannum":"cainum"]: 1}}
        ).then(data=>{
            const callback = req.query.callback;
            if(callback){
                res.send(callback+"("+JSON.stringify({
                    ok:1,
                    msg:"修改成功"
                })+")")
            }else{
                res.send({
                    ok:-1,
                    msg:"修改失败"
                })
            }
    })
})
app.listen(80,function () {
    console.log("success")
})