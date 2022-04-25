const express = require("express");
const User = require("../model/user");

// thiết lập authorization cho từng route
// Trong http method thì là agru 2
// Sau khi nhận incoming request ,chạy auth() trước rồi mới chạy router handler
const auth = require("../middleware/auth");

// thư viện dùng để định dạng và cắt, chỉnh sửa size ảnh
const sharp = require("sharp");

const multer = require("multer");
const upload = multer({
  // dest: "avatars", // không có dest -> thì file sẽ được upload vào request.file
  limits: 1000000,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg||jpeg||png)$/)) {
      return cb(new Error("Please upload one of these file: jpg,jpeg,png"));
    }
    cb(undefined, true); // accept file
  },
});

const { sendWelcomeEmail, sendCancelEmail } = require("../email/account");

// set up router
const router = new express.Router();

// REST API for creating User, post HTTP method được thiết kế cho tạo mới resources
// gửi JSON data thông qua HTTP request body lên server
// chuyển đổi JSON data sang Object để truy cập thông tin của thuộc tính
// Tạo instance của model là document thông qua thông tin lấy được rồi lưu vào database
router.post("/users", async (req, res) => {
  // res.send("Testing")
  const user = new User(req.body);
  // sử dụng try_catch để bắt lỗi reject của await promise
  try {
    sendWelcomeEmail(user.email, user.name);
    
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

//REST API Reading User, get HTTP method được thiết cho đọc dữ liệu resources
router.get("/users/me", auth, async (req, res) => {
  res.send({ profile: req.user.getPublicObject() });
});

// REST API for deleting user, delete HTTP method được thiết kế cho deleting
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.send(500).send();
  }
});

// REST API for updating user, patch HTTP method được thiết kế để update resources có sẵn
// thực tế nếu ta update field mà không có trong collection thì mongoose sẽ lờ đi
router.patch("/users/me", auth, async (req, res) => {
  const allowUpdateKeys = ["name", "age", "email", "password"];
  const updateKeys = Object.keys(req.body); // lấy các key của Object req.body và lưu vào mảng
  const isValidateKey = updateKeys.every(
    (
      updateKey //every khiến tất cả element đều gọi callback để test và trả về boolean -> để trả về true thì tất cả phải true, chỉ cần 1 false thì sẽ về false
    ) => allowUpdateKeys.includes(updateKey)
  );

  if (!isValidateKey) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    updateKeys.forEach((key) => (req.user[key] = req.body[key]));

    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    // tạo authenticational token cho từng user
    // tạo token từ server rồi gửi lại cho client và lưu vào database
    const token = await user.generateAuthToken();
    res.send({ user: user.getPublicObject(), token });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

// REST API for logout: loại bỏ autherizational token hiện tại
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send("Logout successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Logout All Users successfully");
  } catch (error) {
    res.status(500).send();
  }
});

// thêm athorization để user tự upload ảnh, dữ liệu ảnh sẽ được lưu vào database dưới dạng binary(buffer)
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // req.user.avatar = req.file.buffer // dữ liệu buffer được lưu trong req.file(nếu có file được upload)
    // sử dụng sharp để chỉnh sửa ảnh, vẫn ở lưu ở dạng buffter(binary)
    const imageSharp = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = imageSharp;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//serve up file
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("Error! Not found User or Avatar of User");
    }
    //set header properties
    res.set("Content-type", "image/png"); // key - value
    res.send(user.avatar);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/users", async(req,res)=>{
  try {
    const users = await User.find({})
    res.status(200).send({result: users})
  } catch (error) {
    res.status(400).send({error: error.message})
  }

})

module.exports = router;

// Thực tế không nên cung cấp id cho người dùng khi thực hiện chức năng-> người dùng
// chỉ có thể tự xóa hoặc update user của chính mình

//với :id(route parameter ~ với id là tên tự đặt) được cung cấp vởi Express
// và được lưu vào req.params(lưu các route paramater), truy cập vào route parameter bất kì: req.params.nameOfRouteParameter
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send({ error: "Not Fount Id" });
//     }
//     res.send(user);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// router.delete("/user/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).send({ error: "Not Fount Id" });
//     }
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });


// router.get("/users",async (req,res)=>{
//   try {
//     const user = await User.find({})
//     res.send(user)
//   } catch (error) {
//     res.status(400).send({error: error.message})
//   }
// })
