const querystring = require('querystring');

const handleBlogRoute = require('./src/routes/blog')

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
        req.on('data', chunk => {
            postData += chunk.toString()
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
    return promise
}

const serverHandler = (req, res) => {
    //设置响应格式
    res.setHeader('Content-type', 'application/json');

    // 获取path
    const url = req.url;
    // 这里不用let或者const?用了就报错
    req.path = url.split('?')[0];

    //解析query
    req.query = querystring.parse(url.split('?')[1]);

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

module.exports = serverHandler;