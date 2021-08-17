const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require("../config/key")

const refreshTokenSchema = mongoose.Schema({
    token: {
        type: String
    }
})

// 리프레시 token 검증
refreshTokenSchema.statics.findByRefresh = function (token_id, access_token, cb) {
    var token = this

    token.findOne({ "_id": token_id }, function (err, token) {
        if (err) return cb(err)
        if (!token) return cb({message: 'not match refresh token'})

        // refresh token verify, pair access token 인지 체크
        jwt.verify(token.token, config.jwtSecret, function (err, refresh_payload) {
            if (err) return cb(err)
            if (refresh_payload.token != access_token) return cb({ message: 'not match access token' })

            cb(null, token)
        })
    })
}

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
module.exports = { RefreshToken }