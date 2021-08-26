const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like')
const { Dislike } = require('../models/Dislike')


//=================================
//             LikeDislike
//=================================


router.get('/getLikesDislikes', (req, res) => {

    let query = {}

    if (req.query.videoId) {
        query = {
            videoId: req.query.videoId
        }
    }
    else {
        query = {
            commentId: req.query.commentId
        }
    }

    Like.find(query)
        .exec((err, likes) => {
            if (err) return res.status(200).json({ success: false, err })

            Dislike.find(query)
            .exec((err, dislikes) => {
                if (err) return res.status(200).json({ success: false, err })

                return res.status(200).json({success: true, likes, dislikes})
            })
        })

})

module.exports = router;
