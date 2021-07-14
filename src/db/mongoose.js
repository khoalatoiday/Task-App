/*
    Mongoose là một Mongodb object modelling tool được thiết kế để làm 
    việc trong môi trường aschronous 
*/
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});




