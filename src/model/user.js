const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task")



const userSchema = new mongoose.Schema({
  name: {
    // thêm các thuộc tính cho field
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age phải là số nguyên dương");
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail) {
        throw new Error("Email không hợp lệ");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Mật khẩu không được chứa cụm  password");
      }
    },
  },
  // lưu các token khi login/create user
  tokens:[{
    token:{
      type: String,
      required: true
    }
  }],
  // ảnh được lưu dưới dạng binary
  avatar:{
    type: Buffer
  }
},{
  timestamps: true // add timestamp for model User
});

// tạo liên kết(field) giữa 2 model riêng biệt -> vì là virtual nên sẽ không lưu vào database
userSchema.virtual('mytasks',{
  ref: "Tasks",
  localField: '_id', // field của model User
  foreignField: 'owner' // field của model Task
  // tìm document của model Tasks mà _id = owner
})

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const userToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); 
  // _id trong database có kiểu là ObjectId

  user.tokens = user.tokens.concat({token: userToken})
  await user.save()

  return userToken
};

userSchema.methods.getPublicObject = function(){
  const user = this // có kiểu là object moogoose
  const userObject = user.toObject()

  delete userObject.password // delete chỉ có tác dụng với raw Object JS
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.methods.toJSON = function(){
  const user = this // có kiểu là object moogoose
  const userObject = user.toObject()

  delete userObject.password // delete chỉ có tác dụng với raw Object JS
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}


// thiết lập static method cho model User
// -> static method có thể kích hoạt khi chỉ cần model User
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Wrong email");
  }
  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    throw new Error("Wrong password");
  }
  return user;
};

// Sử dụng Schema để sử dụng middleware -> có thể sử dụng các feature trước và sau 1 sự kiện
// hash password trước khi save vào database
userSchema.pre("save", async function (next) {
  // param 1: method 'save'

  // console.log("Something change before event");
  const user = this;

  // nếu password của user bị thay đổi
  if (user.isDirectModified("password")) {
    const oldPass = user.password;
    user.password = await bcrypt.hash(user.password, 8);
    console.log(await bcrypt.compare(oldPass, user.password));
  }

  next(); // call next() để hoàn thành
});

// xóa user -> xóa luôn task của nó
userSchema.pre("remove", async function(next){
  const user = this

  await Task.deleteMany({owner: user._id})

  next()
})

//  tạo model, mongoose.model('name', schema) ~ nếu para 2 là Object thì nó sẽ tự động chuyển
// thành schema nhờ mongoose -> mongoose sử dụng schema để tương tác document
const User = mongoose.model("Users", userSchema); // users là tên collection

// const meUser = new User({
//   name: "nguyen duc       khoa",
//   email: "demon@gmail.com",
//   password: "  pasd sadasdasd ",
// });

// meUser
//   .save()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

module.exports = User;

