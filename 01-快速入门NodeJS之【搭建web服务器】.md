b站教程：[【已完结】快速入门 NodeJS 之『搭建Web服务器』_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1KX4y1K7uz?p=2)

## 1.处理GET请求

如何用NodeJS编写服务器：

1.导入nodejs的核心模块`http`,

Node.js require函数是将模块导入到当前文件的主要方式。在Node.js中有三种的模块:核心模块，文件模块和外部node_modules

2.然后使用其`createServer`方法创建服务器，代码如下：

```javascript
//导入核心模块 http
const http = require('http');

//创建服务器，并返回Hello World
const server = http.createServer((req, res)=>{
    res.end('Hello World')
});

//监听端口5000，如果监听成功，则打印相关信息
server.listen(5000, ()=>{
    console.log('server running at port 5000')
});
```

3.执行该代码文件

```
PS D:\桌面\md\Vue入门\后台管理系统\code\vue-ego\server_test> node index.js
server running at port 5000
```

## 2.处理POST请求

```js
const http = require('http');
const querystring = require('querystring')

const server = http.createServer((req, res)=>{
    if (req.method == "POST"){
        let postData = '';
        //on方法监听data数据
        //流 stream的方式接收
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', ()=>{
            console.log('postData', postData)
            res.end('数据接收完毕')
        })

        console.log('post data content type', req.headers['content-type']);
    }
});

//监听端口5000，如果监听成功，则打印相关信息
server.listen(5000, ()=>{
    console.log('server running at port 5000')
});
```

运行结果：

```js
PS D:\桌面\md\Vue入门\后台管理系统\code\vue-ego\server_test> node index.js
server running at port 5000
post data content type text/plain
postData {
"name":"li"
}
```

## 3.处理http请求总结

```js
const method = req.method;
const url = req.url;
const path = url.split('?')[0];
//利用require自带的核心模块querystring，解析参数
const query = querystring.parse(url.split('?')[1])

//响应数据
const responseData = {
    method,
    url,
    path,
    query
}

res.setHeader('Content-Type', 'application/json');

if (method === 'GET'){
    res.end(
    JSON.stringify(responseData))
}
```

## 4.搭建开发环境

1.初始化

```shell
npm init -y
```

2.项目目录下新建bin文件夹

新建`www.js`文件，创建服务器

3.根目录下新建`app.js`

在里面写回调函数

4.安装nodemon

```shell
npm install nodemon -D --registry=https://registry.npm.taobao.org
```

5.修改package.json

- 入口文件修改

  - ```
    "main": "bin/www.js",
    ```

- 启动脚本修改

  - ```json
    "scripts": {
        "dev": "nodemon/bin/www.js"
      },
    ```

6.启动,即可访问localhost:5000

```shell
PS D:\桌面\md\学习笔记归档\nodePro> npm run dev

> nodePro@1.0.0 dev
> nodemon/bin/www.js
```

![image-20220524192034622](https://lemon-guess.oss-cn-hangzhou.aliyuncs.com/image-20220524192034622.png) 

## 5.初始化路由

app.js:

```js
const handleBlogRoute = require('./src/routes/blog')

const serverHandler = (req, res) => {
    res.setHeader('Content-type', 'application/json');
    const url = req.url;
    req.path = url.split('?')[0];
    const blogData = handleBlogRoute(req, res);
    if (blogData) {
        res.end(JSON.stringify(blogData));
        return;
    }
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found');
    res.end();
}

module.exports = serverHandler;
```

blog.js:

```js
// 处理博客相关的路由
const handleBlogRoute = (req, res) => {
    //定义处理路由的逻辑
    const method = req.method;
    const path = req.path
    if (method === 'GET' && path === '/api/blog/list'){
        return {
            message: '获取博客列表的接口'
        }
    }
    if (method === 'GET' && path === '/api/blog/detail'){
        return {
            message: '获取博客详情的接口'
        }
    }
    if (method === 'POST' && path === '/api/blog/new'){
        return {
            message: '新建博客的接口'
        }
    }
    if (method === 'POST' && path === '/api/blog/update'){
        return {
            message: '更新博客列表的接口'
        }
    }
    if (method === 'POST' && path === '/api/blog/delete'){
        return {
            message: '删除博客列表的接口'
        }
    }

}

module.exports = handleBlogRoute
```

## 6.开发第一个路由

![image-20220524201547948](https://lemon-guess.oss-cn-hangzhou.aliyuncs.com/image-20220524201547948.png) 

为了让返回数据的格式更加规范：

在src下新建model>responseModel.js

```js
class BaseModel {
    //constructor构造器
    constructor(data, message) {
        if (typeof data === 'string'){
            this.message = data;
            data = null;
            message = null;
        }
        if (data){
            this.data = data;
        }
        if (message){
            this.message = message;
        }
    }
}

// 成功模型 - 继承BaseModel
class SuccessModel extends BaseModel{
 constructor(data, message){
     super(data, message);
     this.errnno = 0;
 }
}
// 失败模型
class ErrorModel extends BaseModel{
    constructor(data, message) {
        super(data, message);
        this.errno = -1;
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
```

blog.js:

```js
if (method === 'GET' && path === '/api/blog/list/'){
        // /api/blog/list/?author=zhangsan&keyword=123
        // new SuccessModel()
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const listData = getList(author, keyword);
        return new SuccessModel(listData);
        // return {
        //     message: '获取博客列表的接口'
        // }
    }
```

在src下新建controllers>blogs.js

```js
// 博客相关方法
const getList  = ()=>{
    // 从数据库里拿数据
    // 先返回假数据
    return [
        {
            id: 1,
            title: '标题1',
            content: '内容1',
            author: 'zhangsan',
            creatAt: 161055518935
        },
        {
            id: 2,
            title: '标题2',
            content: '内容2',
            author: 'lisi',
            creatAt: 161055585324
        },
    ]
}

module.exports = {
    getList
}
```

类似的，创建博客详情路由也是一个get请求，总结下来两步走：

1.在routes\blog.js中编写：

```js
...
const { getList, getDetail } = require("../controllers/blog")
...
if (method === 'GET' && path === '/api/blog/detail'){
        const id = req.query.id;
        const detailData = getDetail(id);
        return new SuccessModel(detailData);
        // return {
        //     message: '获取博客详情的接口'
        // }
    }
...
```

2.在controllers\blog.js中编写getDetail方法：

```js
// 获取博客详情数据
const getDetail = (id)=>{
    // 先返回假数据
    return {
        id: 1,
        title: '标题1',
        content: '内容1',
        author: 'zhangsan',
        creatAt: 161055518935
    }
}
module.exports = {
    ...
    getDetail
}
```

## 7.处理异步代码-promise

举例：读取文件

## 8.处理post数据

在app.js文件中编写函数：

```js
// 处理POST数据
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method != 'POST'){
            resolve({});
            return;
        }

        if (req.headers['content-type'] !== 'application/json'){
            resolve({});
            return;

        }
        let postData = '';
        req.on('data', chunck => {
            postData += chunck.toString()
        })
        req.on('end', () => {
            if (!postData){
                resolve({});
                return
            }
            resolve(
                JSON.parse(postData)
            );
        })
    });
    return promise;
}
```

在app.js的serverHandler函数中编写post处理方法：

```js
const serverHandler = (req, res) => {
    ...
    getPostData(req).then((postData) => {
        req.body = postData

        // 博客相关的路由
        const blogData = handleBlogRoute(req, res);
        if (blogData) {
            res.end(JSON.stringify(blogData));
            return;
        }

        // 未匹配到任何路由
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Not Found');
        res.end();
    });
}
```

## 9.开发新建、更新、删除博客的路由



