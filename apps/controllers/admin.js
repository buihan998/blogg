var express = require('express');
var router = express.Router();

var user_add = require('../models/user');
var post_add = require('../models/post');

router.get('/', function(req, res) {
    if (req.session.user) {
        // res.json({ 'message': 'this is admin' });
        var data = post_add.getallposts();
        data.then(function(posts) {
            var data = {
                posts: posts,
                error: false
            };
            // console.log(posts);
            res.render('admin/dashboard', { data: data });
        }).catch(function(err) {
            res.render('admin/dashboard', { data: { error: "Get post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});

router.get('/signup', function(req, res) {
    res.render("signup", { data: {} });
});

router.post('/signup', function(req, res) {
    var user = req.body;
    console.log(user);
    if (user.email.trim().length == 0) {
        res.render('signup', { data: { error: "Email is required" } });
    }

    user = {
        id: 1,
        email: user.email,
        pass: user.passwd,
        ho: user.firstname,
        ten: user.lastname
    };

    var result = user_add.adduser(user);

    result.then(function(data) {
        res.redirect('/admin/signin');
    }).catch(function(err) {
        res.render('signup', { data: { error: "Insert error" } });
    });

    // if (!result) {
    //     res.render('signup', { data: { error: "could not insert data" } });
    // } else {
    //     res.json({ message: "insert sucess" });
    // }
});

router.get('/signin', function(req, res) {
    res.render('signin', { data: {} });
});
router.post('/signin', function(req, res) {
    var params = req.body;

    if (params.email.trim().length == 0) {
        res.render('signin', { data: { error: "Email is null" } });
    } else {
        var data = user_add.getuserbyemail(params.email);
        if (data) {
            data.then(function(user) {
                var user = user[0];
                if (params.password == user.pass) {
                    req.session.user = user;
                    res.redirect("/admin");
                } else {
                    res.render("signin", { data: { error: "sai pass" } });
                }
            })
        } else {
            res.render("signin", { data: { error: "please email" } });
        }
    }

});

router.get('/post/new', function(req, res) {
    if (req.session.user) {
        res.render('admin/post/new', { data: { error: false } });
    } else {
        res.redirect("/admin/signin");
    }
});

router.post('/post/new', function(req, res) {
    var params = req.body;
    if (params.title.trim().length == 0) {
        var data = {
            error: "Title is null"
        };
        res.render('admin/post/new', { data: data });
    } else {
        var now = new Date();

        params.cre_at = now;
        params.update_at = now;
        // console.log(params);
        var data = post_add.addPost(params);

        data.then(function(result) {
            res.redirect('/admin');
        }).catch(function(err) {
            var data = {
                error: "could not insert post"
            };
            res.render('admin/post/new', { data: data });
        });
    }
});

router.get('/post/edit/:id', function(req, res) {
    if (req.session.user) {
        var params = req.params;
        var id = params.id;

        var data = post_add.getPostByID(id);

        if (data) {
            data.then(function(posts) {
                // console.log(posts);
                var post = posts[0];
                var data = {
                    post: post,
                    error: false
                };
                res.render("admin/post/edit", { data: data });
            }).catch(function(err) {
                var data = {
                    error: "Not get post ID"
                };
                res.render("admin/post/edit", { data: data });
            });
        } else {
            var data = {
                error: "Not get post ID"
            };
            res.render("admin/post/edit", { data: data });
        }
    } else {
        res.redirect("/admin/signin");
    }
});

router.put('/post/edit', function(req, res) {
    var params = req.body;
    // console.log("haha");
    data = post_add.updatapost(params);

    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(function(result) {
            res.json({ status_code: 200 });
        }).catch(function(err) {
            res.json({ status_code: 500 });
        });
    }
})

router.delete('/post/delete', function(req, res) {
    var post_id = req.body.id;

    var data = post_add.deletepost(post_id);

    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(function(result) {
            res.json({ status_code: 200 });
        }).catch(function(err) {
            res.json({ status_code: 500 });
        });
    }
})

router.get("/post", function(req, res) {
    if (req.session.user) {
        res.redirect("/admin");
    } else {
        res.redirect("/admin/signin");
    }
});

router.get("/user", function(req, res) {
    if (true) {
        var data = user_add.getalluser();

        data.then(function(user) {
            // console.log(user);
            var data = {
                user: user,
                error: false
            };

            res.render("admin/user", { data: data });
        }).catch(function(err) {
            var data = {
                error: "cout not get user"
            };

            res.render("admin/user", { data: data });
        });
    } else {
        res.redirect("/admin/signin");
    }
});

router.get('/signout', function(req, res) {
    if (req.session.user) {
        req.session.user = null;
        res.redirect('/admin/signin');
    } else {
        res.redirect('/admin/signin');
    }
})
module.exports = router;