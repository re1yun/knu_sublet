// routes/home.js

module.exports = function(app){
    var express = require('express');
    var route = express.Router();
    var Post = require('../models/post');
    
    route.get('/',async function(req, res){
        var page = Math.max(1, parseInt(req.query.page));  
        var limit = Math.max(1, parseInt(req.query.limit));
        page = !isNaN(page)?page:1;                        
        limit = !isNaN(limit)?limit:10;

        var skip = (page-1)*limit;
        var count = await Post.countDocuments({});
        var maxPage = Math.ceil(count/limit);

        var posts = await Post.find({})
            .populate('author')
            .sort('-createdAt')     //작성한 순서대로 정렬하여서,
            .skip(skip)
            .limit(limit)
            .exec();                //posts 변수에 array로 저장 - find는 항상 array 반환
        
        res.render('index', {
            title: "main_page",
            posts:posts,
            currentPage: page,
            maxPage: maxPage,
            limit: limit
        });
    })
    ;

    return route;
};