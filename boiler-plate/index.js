const express = require('express')
const app = express()
const port = 3000
const config = require('./config/key');
const cookieParser = require('cookie-parser')
const { User } = require('./modles/User');


app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true
}).then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

app.post('/api/users/login', (req, res) => {
  // 요청된 email 확인
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({ loginSuccess: false, message: 'auth error' })
    }

    // 요청된 email의 password 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "auth error" })

      // 토큰 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)

        // 토큰을 저장한다 (쿠키, 로컬스토리지, 세션스토리지)
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})