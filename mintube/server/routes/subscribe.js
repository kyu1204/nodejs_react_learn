const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models/Subscriber')


//=================================
//             Subscribe
//=================================


router.get('/subscribeInfo', (req, res) => {

    Subscriber.find({ 'userTo': req.query.userTo })
        .exec((err, allSubscribe) => {
            if (err) return res.status(200).json({ success: false, err })

            // 구독여부 정보를 반환
            Subscriber.find({ 'userTo': req.query.userTo, 'userFrom': req.query.userFrom })
                .exec((err, subscribe) => {
                    if (err) return res.status(200).json({ success: false, err })
                    let result = false
                    if (subscribe.length !== 0)
                        result = true

                    return res.status(200).json({ success: true, subscribeNumber: allSubscribe.length, subscribed: result })
                })
        })
})

router.post('/subscribe', (req, res) => {

    // 구독 취소
    if (req.body.subscribed) {
        Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
            .exec((err) => {
                if (err) res.status(200).json({ success: false, err })
                return res.status(200).json({ success: true })
            })
    }
    // 구독
    else {
        const subscribe = Subscriber(req.body)
        subscribe.save((err) => {
            if (err) return res.status(200).json({ success: false, err })
            return res.status(200).json({ success: true })
        })
    }
})

module.exports = router;
