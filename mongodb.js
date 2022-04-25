/*
    Mongodb và NoSQL(Not Only SQL)
    Sự khác biệt giữa SQL và NoSQL là cách tổ chức dữ liệu, với SQL
    là table,row/record và column
    trong khi NoSQL là Collection(table), document(record) và field(column) có dạng
    tổ chức giống một mảng JSON format
    Tool: Robo 3T, mongo npm

    Bật mongodb: path of mongod.exe --dbpath=path of data folder
    F:\demo\LearnMyself\mongodb\bin\mongod.exe --dbpath=F:\demo\LearnMyself\mongodb-data

    Hiểu về ObjectId: trong mongodb, ObjectId sẽ được tạo tự động cho các document
    và có 12 bit thông tin(mục đích giảm thời gian xử lý), khi chuyển sang hexString thì có độ dài 24

    HTTP REST(Representational Stage Transfer) API Resources: Api giúp tương tác giữa client và server

    Postman tool: cho phép test REST API mà không cần phải tạo client side  
    */

const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const database = "task-manager"; // database name

const idExample = new ObjectId();
console.log(idExample.id); // buffer binary type
console.log(idExample.toHexString())
console.log(idExample)
console.log(idExample.getTimestamp());// getTimestamp() là API của ObjectId

//connect database
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect database");
    }
    console.log("Connect successfully");

    const db = client.db(database); // thực hiện truy vấn cho database cụ thể , MoogoClient API

    // collection return promise nếu không có callback agru
    // db.collection("users").insertOne({ // tạo collection
    //   _id: idExample,
    //   name: "kha",
    //   age: 23,
    // },(error,result)=>{
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(result.ops) // result.ops chứa các document trong mongoDB
    // });

    // db.collection("task-manager").insertMany(
    //   [
    //     {
    //       description: "First Task",
    //       completed: true,
    //     },
    //     {
    //       description: "second Task",
    //       completed: false,
    //     },
    //     {
    //       description: "Third Task",
    //       completed: false,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log(error);
    //     }
    //     console.log(result.ops);
    //   }
    // );

  //   // lưu ý khi tìm theo id phải theo dạng: _id = new ObjectId("HexString of id") vì _id là một ObjectId
    // db.collection("task-manager").findOne(
    //   { _id: new ObjectId("60d82bfeb98f7f1b34ab4132") },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to find object");
    //     }
    //     console.log(result);
    //   }
    // );

  //   db.collection("task-manager")
  //     .find({ completed: false })
  //     .toArray((error, result) => {
  //       if (error) {
  //         return console.log("Unable to find object");
  //       }
  //       console.log(result);
  //     });

    // db.collection("users").updateOne({_id: new ObjectId("60d8405477b90d0e44222e52")},
    //   {
    //     $set: {
    //       name: 'An Linh'
    //     },
    //     $inc:{
    //       age: 1
    //     }
    //   }
    // ).then((result)=>{
    //   console.log(result)
    // }).catch((error)=>{
    //   console.log(error)
    // })

    // db.collection("task-manager").updateMany({completed: true},
    //   {
    //     $set: {
    //       completed: false
    //     }
    //   },(result,error)=>{
    //     if(error){
    //       return console.log(error)
    //     }
    //     console.log(result)
    //   })

    db.collection("task-manager").deleteMany({
      description: 'First Task'
    }).then((result)=>{
      console.log(result.deletedCount)
    }).catch((error)=>{
      console.log(error)
    })

   }
);


