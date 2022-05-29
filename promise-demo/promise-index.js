// 引入核心模块 fs文件处理
// promise实现
const fs = require('fs');
const path = require('path');

function getFileContent(filename){
    const promise = new Promise((resolve, reject) => {
        // 数据文件的绝对路径
        const fullFilename = path.resolve(__dirname, 'data', filename);

        fs.readFile(fullFilename, (err, data)=>{
            if (err){
                reject(err);
                return;
            }
            resolve(
                JSON.parse(data.toString())
            );
        });
    });
    return promise;

}
getFileContent('a.json').then((aData)=>{
    console.log('aData', aData);
    return getFileContent(aData.next)
}).then((bData)=>{
    console.log('bData', bData);
    return getFileContent(bData.next);
}).then((cData)=>{
    console.log('cData', cData)
})