const app = require('./app');

//process.env lưu các enviroment variable được set up bởi dev hoặc service
// các environment variable sẽ được lưu vào các file .env

// run app server
app.listen(3000, () => {
  console.log('Server is serving up in 3000');
});

/*
  Sử dụng mongoDB Atlas để set up database server(dùng cho production)
  -Run, create và manage các test case: Jest, Moka,...
*/
