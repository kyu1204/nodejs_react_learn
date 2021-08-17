const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const config = require("../config/key")
const { RefreshToken } = require("./RefreshToken")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// 비밀번호 암호화
userSchema.pre('save', function (next) {
    var user = this

    if (user.isModified('password')) {
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)

                user.password = hash
                next()
            })
        })
    }
    else {
        next()
    }
})

// 비밀번호 체크
userSchema.methods.comparePassword = function (plainPassword, cb) {

    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

// 토큰 발급
userSchema.methods.generateToken = function (cb) {
    var user = this

    // jwt token 생성하기
    var access_token = jwt.sign(
        { id: user._id.toHexString() },
        config.jwtSecret,
        { algorithm: 'HS256', expiresIn: '1h' }
    )
    var refresh_token = jwt.sign(
        {},
        config.jwtSecret,
        { algorithm: 'HS256', expiresIn: '14d' }
    )
    RefreshToken({ token: refresh_token }).save(function (err, refresh_token) {
        if (err) return cb(err)

        user.token = refresh_token._id.toHexString()
        user.save(function (err, user) {
            if (err) return cb(err)
            cb(null, user, access_token)
        })
    })
}

// token 검증
userSchema.statics.findByToken = function (token, cb) {
    var user = this

    jwt.verify(token, config.jwtSecret, function (err, payload) {
        if (err) return cb(err)

        user.findOne({ "_id": payload.id }, function (err, user) {
            if (err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)
module.exports = { User }