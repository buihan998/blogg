var q = require('q');
var db = require("../common/database");

var conn = db.getConnection();

function getallposts() {

    var defer = q.defer();

    var query = conn.query('select * from posts', function(err, posts) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(posts);
        }
    });

    return defer.promise;

}

function addPost(params) {
    if (params) {
        var defer = q.defer();
        var query = conn.query('insert into posts set ?', params, function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getPostByID(id) {
    var defer = q.defer();

    var query = conn.query('select * from posts where ?', { id: id }, function(err, posts) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(posts);
        }
    });

    return defer.promise;
}

function updatapost(params) {
    if (params) {
        var defer = q.defer();

        var query = conn.query('update posts set title = ?, content=?, author = ?, update_at=? where id=?', [params.title, params.content, params.author, new Date(), params.id], function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }

    return false;
}

function deletepost(id) {
    if (id) {
        var defer = q.defer();

        var query = conn.query('delete from posts where id= ?', [id], function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }

    return false;
}

module.exports = {
    getallposts: getallposts,
    addPost: addPost,
    getPostByID: getPostByID,
    updatapost: updatapost,
    deletepost: deletepost
}