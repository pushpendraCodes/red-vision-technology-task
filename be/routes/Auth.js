
const express = require("express")
const { CreateUser ,loginUser,resetPasswordRequest,resetPassword, loginDemoUser } = require("../controllers/Auth")

const router = express.Router()

router.
    post("/create" ,CreateUser)
    .post("/login" ,loginUser)
    .post("/loginDemo" ,loginDemoUser)
    .post('/resetPasswordRequest', resetPasswordRequest)
.post('/reset-password', resetPassword)



exports.router = router