module.exports = function(io) {
    var usernames = [];

    io.sockets.on("connection", function(socket) {
        console.log("Have a new user connectied");

        // listen adduser event
        socket.on("adduser", function(username) {
            socket.username = username;
            usernames.push(username);

            // notify to myselt
            var data = {
                sender: username,
                message: "Bạn đã tham gia phòng chát"
            };

            socket.emit("update_message", data);

            // notify to other users
            var data = {
                sender: "SERVER",
                message: username + ": đã tham gia phòng chát"
            };

            socket.broadcast.emit("update_message", data);

            // listen send_message
            socket.on("send_message", function(message) {
                //notify to myself
                var data = {
                    sender: "You",
                    message: message
                };
                socket.emit("update_message", data);

                //notify to other user
                var data = {
                    sender: socket.username,
                    message: message
                };
                socket.broadcast.emit("update_message", data);
            });

            //listen disconnect
            socket.on("disconnect", function() {
                for (var i = 0; i < usernames.length; i++) {
                    if (usernames[i] == socket.username) {
                        usernames.splice(i, 1);
                    }
                }

                //notify to other user
                var data = {
                    sender: "SERVER",
                    message: socket.username + ": rời phòng chát"
                };
                socket.broadcast.emit("update_message", data);

            });
        })
    });
}