const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment')


//=================================
//             Comment
//=================================


router.post('/saveComment', (req, res) => {

    // 댓글 저장
    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if (err) return res.status(200).json({ success: false, err })
        Comment.find({ '_id': comment._id })
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.status(200).json({ success: false, err })
                return res.status(200).json({ success: true, result })
            })
    })

})

module.exports = router;
