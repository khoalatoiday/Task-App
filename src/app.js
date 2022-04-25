const express = require("express");
require("./db/mongoose"); // connect database
const userRouter = require("./router/user");
const taskRouter = require("./router/task");
const multer = require("multer"); // thư viện middleware cho việc upload file

const app = express();

// nếu viết như này là sẽ chạy khi chạy route bất kì
// app.use((req,res,next)=>{
//   res.status(503).send("Site is currently down for maintenance. Check back soon")
// })


// vì client sẽ gửi HTTP Respone body có dạng JSON Format nên ta cần app cho phép sử dụng json 
app.use(express.json()); // tự động chuyển đổi incomming JSON data ra Object

app.use(userRouter);
app.use(taskRouter);

// Finish CRUD(create,read,update,delete) REST API

module.exports = app;


/*
*/