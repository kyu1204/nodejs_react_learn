import React, { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'


function Comment(props) {
    const videoId = props.videoId
    const user = useSelector(state => state.user)
    const [CommentValue, setCommentValue] = useState('')

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        let writer = null
        if (user.userData.isAuth) {
            writer = user.userData._id
        }
        else {
            return window.location.href = '/login'
        }

        const body = {
            content: CommentValue,
            writer: writer,
            postId: videoId
        }
        Axios.post('/api/comment/saveComment', body)
            .then(response => {
                if (response.data.success) {
                    setCommentValue('')
                    props.refreshFunc(response.data.result)
                }
                else {
                    alert('댓글 등록에 실패하였습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p>댓글</p>
            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    placeholder='공개 댓글 추가...'
                    onChange={handleClick}
                    value={CommentValue}
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunc={props.refreshFunc} videoId={videoId} comment={comment} />
                        <ReplyComment refreshFunc={props.refreshFunc} parentCommentID={comment._id} commentLists={props.commentLists} videoId={videoId} />
                    </React.Fragment>
                )
            ))}

        </div>
    )
}

export default Comment
