var express = require('express');
var post_md = require('../models/post');
var router = express.Router();

router.get('/', function(req, res) {
    var data = post_md.getallposts();

    data.then(function(posts) {
        var data = {
            posts: posts,
            error: false
        };
        res.render('blog/index', { data: data });

    }).catch(function(err) {
        var data = {
            error: "could not data"
        };
        res.render('blog/index', { data: data });
    });
});

router.get('/post/:id', function(req, res) {

    var data = post_md.getPostByID(req.params.id);

    // var data = post_md.getPostByID(1);
    // console.log("haha");

    data.then(function(posts) {
        var post = posts[0];

        var result = {
            post: post,
            error: false
        };
        console.log(post);
        res.render('blog/post', { data: result });
    }).catch(function(err) {
        var result = {
            error: "not get data by id"
        };

        res.render('blog/post', { data: result });
    });
})

router.get('/about', function(req, res) {
    res.render('blog/about');
})

module.exports = router;