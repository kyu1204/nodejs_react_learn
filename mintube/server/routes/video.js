const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require('multer')
var ffmpeg = require('fluent-ffmpeg')


// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false)
        }
        cb(null, true)
    }
})
const upload = multer({ storage: storage }).single('file')

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {

    // 비디오를 서버에 저장
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/thumbnail', (req, res) => {

    // 썸네일 생성, 비디오 러닝타임 얻기

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        fileDuration = metadata.format.duration
    })

    // 썸네일 생성
    // req.body.url: 클라이언트에서 보내준 비디오 path
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            filePath = 'uploads/thumbnails/' + filenames[0]
        })
        .on('end', function () {
            return res.json({ success: true, url: filePath, fileDuration: fileDuration })
        })
        .on('error', function (err) {
            return res.json({ success: false, err })
        })
        .screenshots({
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            filename: 'thumbnail-%b.png'
        })

})

router.post('/uploadVideo', (req, res) => {

    // 비디오 정보를 DB에 저장
    const video = new Video(req.body)
    video.save((err, doc) => {
        if (err)
            return res.json({ success: false, err })
        return res.json({ success: true })
    })
})

module.exports = router;
