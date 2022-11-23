// routes/home.js

module.exports = function(app){
    var express = require('express');
    var route = express.Router();
    var Post = require('../models/post');
    
    route.get('/',async function(req, res){
        var page = Math.max(1, parseInt(req.query.page));  
        var limit = Math.max(1, parseInt(req.query.limit));
        page = !isNaN(page)?page:1;                        
        limit = !isNaN(limit)?limit:4;

        var searchQuery = createSearchQuery(req.query);
        console.log("search query: " + searchQuery);

        var skip = (page-1)*limit;
        var count = await Post.countDocuments(searchQuery);
        var maxPage = Math.ceil(count/limit);

        var posts = await Post.find(searchQuery)
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
            limit: limit,
            searchType: req.query.searchType,
            searchText: req.query.searchText
        });
    })
    ;

    return route;
};

function createSearchQuery(queries){
    var searchQuery = {};
    if(queries.searchType && queries.searchText && queries.searchText.length >= 1){
      var searchTypes = queries.searchType.toLowerCase().split(',');
      var postQueries = [];
      if(searchTypes.indexOf('title')>=0){
        postQueries.push({ title: { $regex: new RegExp(queries.searchText, 'i') } });
      }
      if(searchTypes.indexOf('body')>=0){
        postQueries.push({ body: { $regex: new RegExp(queries.searchText, 'i') } });
      }
      if(postQueries.length > 0) searchQuery = {$or:postQueries};
    }
    return searchQuery;
}