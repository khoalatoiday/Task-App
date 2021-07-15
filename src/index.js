const app = require('./app')

//process.env lưu các enviroment variable được set up bởi dev hoặc service
// các environment variable sẽ được lưu vào các file .env
const port = process.env.PORT;

// run app server
app.listen(port, () => {
  console.log("Server is serving up in " + port);
});


/*
  Sử dụng mongoDB Atlas để set up database server(dùng cho production)
  -Run, create và manage các test case: Jest, Moka,...
*/