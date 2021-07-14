// có thể sử dụng middleware function cho việc xác thực
const jwt = require('jsonwebtoken')
const User = require ('../model/user')


const auth = async (req,res,next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,process.env.JWT_SECRET) // return token
        const user = await User.findOne({_id: decode._id,'tokens.token': token})

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