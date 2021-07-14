const express = require("express");
require("./db/mongoose");
const userRouter = require("./router/user");
const taskRouter = require("./router/task");
const multer = require("multer")// thư viện middleware cho việc upload file

const app = express();

//process.env lưu các enviroment variable được set up bởi dev hoặc service
// các environment variable sẽ được lưu vào các file .env
const port = process.env.PORT;


// nếu viết như này là sẽ chạy khi chạy route bất kì 
// app.use((req,res,next)=>{
//   res.status(503).send("Site is currently down for maintenance. Check back soon")
// })

app.use(express.json()); // tự động chuyển đổi incomming JSON data ra Object

app.use(userRouter);
app.use(taskRouter);

// Finish CRUD(create,read,update,delete) REST API

app.listen(port, () => {
  console.log("Server is serving up in " + port);
});
