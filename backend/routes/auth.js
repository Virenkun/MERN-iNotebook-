const express = require('express')
const { body, validationResult } = require('express-validator')

const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser.js')

const JWT_SECRET = "iamviren";


// Create a User
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ error: "User Alredy Exsits" })
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);


        res.json({ authToken })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Found")
    }

})

//authenticate a user api/auth/login
router.post('/login', [
    body('email').isEmail(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body

    try{
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({error: "User Not Exists"})
        }

        const passwordComp = await bcrypt.compare(password, user.password)

        if(!passwordComp){
            return res.status(400).json({error: "Wrong Pasword"})
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        res.json({ authToken })


    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

})


//Get User Details api/auth/getuser
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userID = req.user.id
        const user = await User.findById(userID).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")  
    }
})
  



module.exports = router
