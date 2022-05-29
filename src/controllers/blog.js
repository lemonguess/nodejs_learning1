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

// 创建博客
const creatNewBlog = (blogData) => {
    // blogData title content
    console.log(blogData)
    return {
        id: 1
    }
}
module.exports = {
    getList,
    getDetail,
    creatNewBlog
}