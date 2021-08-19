const { RefreshToken } = require("../modles/RefreshToken")
const { User } = require("../modles/User")


// 인증 처리
let auth = (req, res, next) => {

    // 클라이언트 쿠키에서 토큰 Get
    let token = req.headers.authorization.split('Bearer ')[1]

    // 토큰을 복호화
    User.findByToken(token, (err, user) => {
        if (err) return res.json({ isAuth: false, error: true, message: err.message })
        if (!user) return res.json({ isAuth: false, error: true, message: 'auth error' })

        req.token = token
        req.user = user
        next()
    })
}

// 토큰 refresh
let refresh = (req, res, next) => {

    // 클라이언트 헤더에서 토큰, 리프레시 토큰 Get
    let access_token = req.headers.authorization.split('Bearer ')[1]
    let refresh_token_id = req.cookies.__sid

    // 토큰을 복호화
    RefreshToken.findByRefresh(refresh_token_id, access_token, (err, token) => {
        if (err) return res.json({ isAuth: false, error: true, message: err.message })
        if (!token) return res.json({ isAuth: false, error: true, message: err.message })

        User.findOne({'token': token._id.toHexString()}, (err, user) => {
            if (err) return res.json({ isAuth: false, error: true, message: err.message })
            if (!user) return res.json({ isAuth: false, error: true, message: err.message })

            // 토큰 재발급
            token.delete()
            user.generateToken((err, user, access_token) => {
                if (err) return res.json({ isAuth: false, error: true, message: err.message })

                req.token = access_token
                req.user = user
                next()
            })
        })
    })
}

module.exports = { auth, refresh }