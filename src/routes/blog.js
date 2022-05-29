const { SuccessModel } = require("../model/responseModel")
const { getList, getDetail, creatNewBlog } = require("../controllers/blog")
// 处理博客相关的路由
const handleBlogRoute = (req, res) => {
    //定义处理路由的逻辑
    const method = req.method;
    const path = req.path
    if (method === 'GET' && path === '/api/blog/list'){
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
    if (method === 'GET' && path === '/api/blog/detail'){
        const id = req.query.id;
        const detailData = getDetail(id);
        return new SuccessModel(detailData);
        // return {
        //     message: '获取博客详情的接口'
        // }
    }
    if (method === 'POST' && path === '/api/blog/new'){
        const postData = req.body;
        const newBlogData = creatNewBlog(req.body);
        // return {
        //     message: '新建博客的接口'
        // }
        return new SuccessModel(newBlogData);
    }
    if (method === 'POST' && path === '/api/blog/update'){
        console.log(req.body)
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