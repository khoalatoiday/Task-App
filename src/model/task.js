const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  // tạo owner để biết được user nào tạo task 
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users" // reference model User 
  }
},{
  timestamps:true
});

taskSchema.pre("save", function (next) {
  const task = this;
  console.log("SOmething before event of task");
  next();
});

const Task = mongoose.model("Tasks", taskSchema); // tasks là tên Collection

//instance
// const task1 = new Task({
//     description: 'Fouth Task',
//     completed: false
// })

// // save into database
// task1.save().then(()=>{
//     console.log(task1)
// }).catch((error)=>{
//     console.log(error)
// })

module.exports = Task;
