const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/BlogData");

const express = require("express");
const app = express();

const http = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(http,{});
const port = process.env.PORT || 3000 ;

const isBlog = require("./middleware/isBlog");
app.use(isBlog.isBlog);


// for admin routes
const admin_route = require("./routes/adminRoute");
app.use("/", admin_route);

// for user routes
const user_route = require("./routes/userRoute");
app.use("/", user_route);

// for blog routes
const blog_route = require("./routes/blogRoutes");
app.use("/", blog_route);

app.get("/" , (req , res) =>{
    res.send("this is the first page");
})


io.on("connection", function(socket){
    console.log("user connected");

    socket.on("new_post" , function(formData){
        console.log(formData);
        socket.broadcast.emit("new_post", formData);
    });

    socket.on("new_comment" , function(comment){
        io.emit("new_comment" , comment);
    });

    socket.on("delete_post" , function(postId){
       socket.broadcast.emit("delete_post" , postId);
    });
});

http.listen(port , () => {
    console.log(`server running on port no ${port}`);
});