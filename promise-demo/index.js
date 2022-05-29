// 引入核心模块 fs文件处理
// 回调地域的写法，不推荐
const fs = require('fs');
const path = require('path');

// 读取文件内容
function getFileContent(filename, callback){
    // 数据文件的绝对路径
    const fullFilename = path.resolve(__dirname, 'data', filename);

    fs.readFile(fullFilename, (err, data) =>{
        if (err){
            console.log(err);
            return;
        }
        // 打印内容
        // console.log(data.toString());
        // 转化成json对象
        // console.log(JSON.parse(data.toString()))

        // 回调函数
        callback(JSON.parse(data.toString()))
        // callback (data.toString());
    })
}

// 回调地狱
getFileContent('a.json', (aData)  => {
    console.log('aData', aData.message);
    getFileContent(aData.next, (bData)=>{
        console.log('bData', bData);
        getFileContent(bData.next, (cData)=>{
            console.log('cData', cData)
        })
    })
})