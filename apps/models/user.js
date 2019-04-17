var q = require('q');
var db = require("../common/database");

var conn = db.getConnection();

function adduser(user) {
    if (user) {
        var defer = q.defer();

        var query = conn.query('insert into user set ?', user, function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        // console.log(query.sql);

        return defer.promise;
    }

    return false;
}


function getuserbyemail(email) {
    if (email) {
        var defer = q.defer();

        var query = conn.query("select * from user where ?", { email: email }, function(err, result) {
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

function getalluser() {
    var defer = q.defer();

    var query = conn.query('select * from user', function(err, result) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(result);
        }
    });

    return defer.promise;
}

module.exports = {
    adduser: adduser,
    getalluser: getalluser,
    getuserbyemail: getuserbyemail
}