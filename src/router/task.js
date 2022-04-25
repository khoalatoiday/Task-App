const express = require("express");
const Task = require("../model/task");
const auth = require("../middleware/auth");
const moogoose = require("mongoose");

const router = new express.Router();

// REST API for creating task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body, // copy key-value của req.body vào Object task
    owner: req.user._id,
  });

  try {
    await task.save();

    res.status(201).send(task);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//REST API for reading task
// Sử dụng query String cho Url để lọc dữ liệu muốn thấy: ?...
// tạo pagination: thêm vào query String "limit" và "skip"
// sorting data: thêm vào query String "sortBy"
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  if (req.query.completed) { // key-value của query String được lưu vào: req.query.key = value
    match.completed = (req.query.completed === "true"); // convert string to boolean
  }

  const sort = {}
  if(req.query.sortBy){
    const parts = req.query.sortBy.split(":")
    sort[parts[0]] = sort[parts[1]] === 'desc'? -1:1 // [dynamicValue~variable] còn .[staticValue~constant]
    // sắp xếp theo field (parts[0]) tăng hoặc giảm dần(parts[1])
  }
  
  console.log(sort)


  try {
    //const tasks = await Task.find({owner: req.user._id});

    // lấy toàn bộ tasks được tạo bởi user này và lưu vào trong vitual field là "mytasks"
    await req.user
      .populate({
        path: "mytasks", // field = 'mytasks', vituralField được tạo bởi User Schema
        match, // thêm option thông tin muốn lọc cho document, option cá nhân 
        options:{ // option được cung cấp sẵn
          limit: parseInt(req.query.limit), // thêm option limit
          skip: parseInt(req.query.skip), // thêm option skip
          sort // thêm option sort
        }
      })
      .execPopulate();
    res.status(200).send(req.user.mytasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// REST API for reading specific task (was created by specific user)
router.get("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Not Fount task" });
    }
    res.status(200).send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch("/task/:id", auth, async (req, res) => {
  const allowUpdateKeys = ["description", "completed"];
  const updateKeys = Object.keys(req.body);
  const isValidate = updateKeys.every((updateKey) =>
    allowUpdateKeys.includes(updateKey)
  );
  if (!isValidate) {
    return res.status(400).send({ error: "invalid update" });
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true, // tạo một task mới
    //   runValidators: true, // run validator cho task
    // });

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Not Fount Task" });
    }

    updateKeys.forEach((updateKey) => (task[updateKey] = req.body[updateKey]));

    await task.save();

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// REST API for deleting task
router.delete("/task/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Not Fount Task" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
