const temporaryUserSchema = require('../models/temporaryUserSchema')
const { body, validationResult } = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const rechargeSchema = require('../models/rechargeSchema')
const { fixedDigits } = require('../controllers/action')
const userSchema = require('../models/userSchema')
const otpSchema = require('../models/otpSchema')
const otpGenerator = require('otp-generator')
const fast2sms = require('fast-two-sms')
const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const router = express.Router()

router.post('/sendOTP', [
    body('name', 'Name must be contains minimum 5 character').isLength({ min: 5 }),
    body('email', 'Please enter a valid email address').isEmail(),
    body('number', 'Please enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 }),
    body('gender', 'Gender name can not be empty').isLength({ min: 1 }),
    body('state', 'State name can not be empty').isLength({ min: 1 }),
    body('password', 'Password must be contains minimum 5 character').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg })
    }

    try {
        const { name, email, number, gender, state, password } = req.body

        // OTP Exceeded Logic
        const otpHolder = await otpSchema.find({ number })
        if (otpHolder.length > 5) {
            return res.status(400).json({ success: false, msg: 'You have exceeded the maximum number of otp attempts, please try again after some time!' })
        }

        let user = await userSchema.findOne({ number })
        if (user) {
            return res.status(400).json({ success: false, msg: 'Sorry a user with this phone number already exists!' })
        }
        user = await userSchema.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, msg: 'Sorry a user with this email address already exists!' })
        }

        // Delete duplicate record from temporary user
        user = await temporaryUserSchema.findOne({ number })
        if (user) {
            await temporaryUserSchema.deleteMany({ number })
        }
        user = await temporaryUserSchema.findOne({ email })
        if (user) {
            await temporaryUserSchema.deleteMany({ email })
        }

        // Encrypt Password
        const salt = await bcrypt.genSalt(10)
        const encryptPass = await bcrypt.hash(password, salt)

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const message = otp + ' for re4ge'
        const options = { authorization: process.env.FAST2SMS_APIKEY, message, numbers: [number] }
        const result = await fast2sms.sendMessage(options)

        if (result.return) {
            await otpSchema.create({ number, otp })
            await temporaryUserSchema.create({ name, email, number, gender, state, password: encryptPass })
            res.status(200).json({ success: true, msg: 'OTP send successfully!' })
        } else {
            console.log(result)
            return res.status(400).json({ success: false, msg: 'Something went wrong, please try again leter!' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'Internal server error' })
    }
})

router.post('/verifyOTP', [
    body('number', 'Please enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 }),
    body('otp', 'OTP must be contains 6 character').isNumeric().isLength({ min: 6, max: 6 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg })
    }

    try {
        const { number, otp } = req.body
        const otpHolder = await otpSchema.find({ number })
        let user = await temporaryUserSchema.findOne({ number })
        if (!user) {
            return res.status(400).json({ success: false, msg: 'Invalid details, please send otp first!' })
        }
        if (otpHolder.length === 0) {
            return res.status(400).json({ success: false, msg: 'You have entered an expired OTP!' })
        }
        const rightOtpFind = otpHolder[otpHolder.length - 1]
        if (rightOtpFind.number == number && rightOtpFind.otp == otp) {
            const { name, email, number, gender, state, password } = user
            user = await userSchema.create({ name, email, number, gender, state, password })
            await otpSchema.deleteMany({ number })
            await temporaryUserSchema.deleteMany({ number })
            let data = { user: { id: user.id } }
            const authToken = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '7 days' })
            await userSchema.findByIdAndUpdate(user.id, { authToken })
            res.status(200).json({ success: true, authToken })
        } else {
            return res.status(400).json({ success: false, msg: 'You have entered an wrong OTP!' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'Internal server error' })
    }
})

router.post('/login', [
    body('number', 'Please enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 }),
    body('password', 'Password must be contains minimum 5 character').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg })
    }

    try {
        const { number, password } = req.body
        const user = await userSchema.findOne({ number })
        if (!user) {
            return res.status(400).json({ success: false, msg: 'Invalid login details!' })
        }
        const passCompare = await bcrypt.compare(password, user.password)
        if (!passCompare) {
            return res.json({ success: false, msg: 'Invalid login details' })
        }

        let data = { user: { id: user.id } }
        const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '7 days' })
        await userSchema.findByIdAndUpdate(user.id, { authToken })
        res.status(200).json({ success: true, authToken })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'Internal server error' })
    }
})

router.get('/userdetails', authMiddleware, async (req, res) => {
    try {
        const id = req.user
        const data = await userSchema.findById(id).select('-password')

        let totalCommission = 0
        let result = await rechargeSchema.find({ userId: id, status: 'success' })
        result.forEach(element => totalCommission += element.commission)
        totalCommission = fixedDigits(totalCommission)

        let dailyResult = 0
        result = await rechargeSchema.find({ userId: id, status: 'success', createdAt: { $gte: moment().startOf('day'), $lte: moment().endOf('day') } })
        result.forEach(element => dailyResult += element.amount)
        dailyResult = fixedDigits(dailyResult)

        let monthlyResult = 0
        result = await rechargeSchema.find({ userId: id, status: 'success', createdAt: { $gte: moment().startOf('month'), $lte: moment().endOf('month') } })
        result.forEach(element => monthlyResult += element.amount)
        monthlyResult = fixedDigits(monthlyResult)

        res.status(200).json({ success: true, data: { ...data._doc, totalCommission, dailyResult, monthlyResult } })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'Internal server error' })
    }
})

router.post('/updateprofile', [
    body('name', 'Name must be contains minimum 5 character').isLength({ min: 5 }),
    body('email', 'Please enter a valid email address').isEmail(),
    body('gender', 'Gender is required').isLength({ min: 1 }),
    body('state', 'State is required').isLength({ min: 1 })
], authMiddleware, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg })
    }

    try {
        const id = req.user
        const { name, email, gender, state } = req.body

        await userSchema.findByIdAndUpdate(id, { name, email, gender, state }, { new: true })
        res.status(200).json({ success: true, msg: 'Profile updated successfully!' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'Internal server error' })
    }
})

router.post('/forgot/sendOTP', [
    body('number', 'Please enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg })
    }

    try {
        const { number } = req.body

        // OTP Exceeded Logic
        const otpHolder = await otpSchema.find({ number })
        if (otpHolder.length > 5) {
            return res.status(400).json({ success: false, msg: 'You have exceeded the maximum number of otp attempts, please try again after some time!' })
        }

        let user = await userSchema.findOne({ number })
        if (!user) {
            return res.status(400).json({ success: false, msg: 'Sorry a user with this phone number does not exists!' })
        }

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const message = otp + ' for re4ge'
        const options = { authorization: process.env.FAST2SMS_APIKEY, message, numbers: [number] }
        const result = await fast2sms.sendMessage(options)

        if (result.return) {
            await otpSchema.create({ number, otp })
            res.status(200).json({ success: true, msg: 'OTP send successfully!' })
        } else {
            console.log(result)
            return res.status(400).json({ success: false, msg: 'Something went wrong, please try again leter!' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'Internal server error' })
    }
})

router.post('/forgot/verifyOTP', [
    body('number', 'Please enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 }),
    body('otp', 'OTP must be contains 6 character').isNumeric().isLength({ min: 6, max: 6 }),
    body('newPassword', 'Password must be contains minimum 5 character').isLength({ min: 5 }),
    body('confirmPassword', 'Confirm password must be contains minimum 5 character').isLength({ min: 5 }).custom((value, { req }) => {
        if (value !== req.body.newPassword) throw new Error('Password does not matched')
        return true
    })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg })
    }

    try {
        const { number, otp, newPassword, confirmPassword } = req.body

        const user = await userSchema.findOne({ number })
        const otpHolder = await otpSchema.find({ number })

        if (!user) {
            return res.status(400).json({ success: false, msg: 'Sorry a user with this phone number does not exists!' })
        }
        if (otpHolder.length === 0) {
            return res.status(400).json({ success: false, msg: 'You have entered an expired OTP!' })
        }

        const rightOtpFind = otpHolder[otpHolder.length - 1]
        if (rightOtpFind.number == number && rightOtpFind.otp == otp) {
            // Encrypt Password
            const salt = await bcrypt.genSalt(10)
            const encryptPass = await bcrypt.hash(confirmPassword, salt)

            await userSchema.findOneAndUpdate({ number }, { password: encryptPass }, { new: true })
            await otpSchema.deleteMany({ number })
            res.status(200).json({ success: true, msg: 'Password changed successfully!' })
        } else {
            return res.status(400).json({ success: false, msg: 'You have entered an wrong OTP!' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'Internal server error' })
    }
})

module.exports = router