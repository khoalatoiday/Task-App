// thư viện giúp nodejs gửi email đến người dùng: nodeJS -> sendgrid service -> email server
const sendgrid = require("@sendgrid/mail")

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

// sendgrid.send({
//     to:'demonhunter942000@gmail.com',
//     from: 'demonhunter942000@gmail.com', // cần verify từ sendgrid service
//     subject: 'This is my first creation',
//     text: 'I hope this text will send successfully'
// })

const sendWelcomeEmail = (email,name)=>{
    sendgrid.send({
        to: email,
        from: "demonhunter942000@gmail.com",
        subject: "Thanks for joining",
        text: `Welcome my friend, ${name}`
    })
}

const sendCancelEmail = (email,name)=>{
    sendgrid.send({
        to: email,
        from: "demonhunter942000@gmail.com",
        subject: "Cancelation",
        text: `Hey, ${name},Why you cancel our application?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}

