const express = require('express')
const app = express()
const port = 3000
const config = require('./config/key');

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

app.post('/register', (req, res) => {
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err})
    return res.status(200).json({ success: true })
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})