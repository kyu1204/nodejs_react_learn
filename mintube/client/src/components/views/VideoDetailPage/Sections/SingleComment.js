import React, { useState } from 'react'
import { Comment, Avatar } from 'antd'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import LikeDislikes from './LikeDislikes'


function SingleComment(props) {
    const videoId = props.videoId

    const user = useSelector(state => state.user)

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState('')

    const onClickReply = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) => {
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
            postId: videoId,
            responseTo: props.comment._id
        }
        Axios.post('/api/comment/saveComment', body)
            .then(response => {
                if (response.data.success) {
                    setCommentValue('')
                    setOpenReply(!OpenReply)
                    props.refreshFunc(response.data.result)
                }
                else {
                    alert('댓글 등록에 실패하였습니다.')
                }
            })
    }

    const actions = [
        <LikeDislikes comment commentId={props.comment._id} user={user}/>,
        <span onClick={onClickReply} key='comment-basic-reply-to'>답글</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt='image' />}
                content={<p>{props.comment.content}</p>}
            />
            {
                OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textarea
                        style={{ width: '100%', borderRadius: '5px', marginLeft: '40px'}}
                        onChange={onHandleChange}
                        value={CommentValue}
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick>Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment
