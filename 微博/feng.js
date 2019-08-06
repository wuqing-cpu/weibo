const feng = {
    jsonp({url="",data={}}){
        return new Promise((resolve, reject) => {
            let methodName = "jquery"+Date.now();
            data.callback = methodName;
            window[methodName] = function (data) {
                delete window[methodName];
                resolve(data);
            }
            const script = document.createElement("script");
            let arr = [];
            for(let key in data){
                arr.push(key+"="+data[key])
            }
            console.log(arr)
            let str = arr.join("&");
            if(url.includes("?")){
                script.src = url+"&"+str;
            }else{
                script.src = url+"?"+str;
            }
            document.body.appendChild(script);
            document.body.removeChild(script);
        })
    }
}