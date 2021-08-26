import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    const videoId = props.videoId

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComment, setOpenReplyComment] = useState(false)

    useEffect(() => {

        let commentNumber = 0

        props.commentLists.map((comment) => {
            if (comment.responseTo === props.parentCommentID)
                commentNumber++
        })

        setChildCommentNumber(commentNumber)

    }, [props.commentLists])

    const onClickHandler = () => {
        setOpenReplyComment(!OpenReplyComment)
    }

    const renderReplyComment = (parentCommentID) =>
        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentID &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment refreshFunc={props.refreshFunc} videoId={videoId} comment={comment} />
                        <ReplyComment refreshFunc={props.refreshFunc} parentCommentID={comment._id} commentLists={props.commentLists} videoId={videoId} />
                    </div>
                }
            </React.Fragment>
        ))

    return (
        <div>
            {/* {ChildCommentNumber > 0 && OpenReplyComment ?
                <p style={{ fontSize: '14px', margin: 0, color: '#065fd4', marginLeft: '40px' }} onClick={onClickHandler}>
                    답글 {ChildCommentNumber}개 숨기기
                </p>
                :
                <p style={{ fontSize: '14px', margin: 0, color: '#065fd4', marginLeft: '40px' }} onClick={onClickHandler}>
                    답글 {ChildCommentNumber}개 보기
                </p>
            } */}
            {ChildCommentNumber > 0 &&
                (OpenReplyComment ?
                    <p style={{ fontSize: '14px', margin: 0, color: '#065fd4', marginLeft: '40px' }} onClick={onClickHandler}>
                        답글 {ChildCommentNumber}개 숨기기
                    </p>
                    :
                    <p style={{ fontSize: '14px', margin: 0, color: '#065fd4', marginLeft: '40px' }} onClick={onClickHandler}>
                        답글 {ChildCommentNumber}개 보기
                    </p>)
            }
            {
                OpenReplyComment &&
                renderReplyComment(props.parentCommentID)
            }
        </div >
    )
}

export default ReplyComment
