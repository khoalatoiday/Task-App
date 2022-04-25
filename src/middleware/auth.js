// có thể sử dụng middleware function cho việc xác thực
const jwt = require('jsonwebtoken')
const User = require ('../model/user')


const auth = async (req,res,next) =>{
    try {
        // Authorization là một key của header
        const token = req.header('Authorization').replace('Bearer ','')
        //console.log(token)
        const decode = jwt.verify(token,process.env.JWT_SECRET) // return {_id: user._id.toString()} ~ Object tạo ra token ở generateAuthToken() 

        // tìm user
        const user = await User.findOne({_id: decode._id,'tokens.token': token}) //  kiểm tra token từ request có trong dãy tokens trong mongoDB không?

        if(!user){
            throw new Error() // chạy catch()
        }

        req.token = token

        // tạo property user
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error : 'Please authenticate!'})
    }
}

module.exports = auth