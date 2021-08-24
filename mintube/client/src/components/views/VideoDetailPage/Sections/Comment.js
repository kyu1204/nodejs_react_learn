import React, { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'

function Comment(props) {
    const videoId = props.videoId
    const user = useSelector(state => state.user)
    const [commentValue, setcommentValue] = useState('')

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        const body = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }
        Axios.post('/api/comment/saveComment', body)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result)
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
            <hr />

            {/* Comment Lists */}

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    placeholder='공개 댓글 추가...'
                    onChange={handleClick}
                    value={commentValue}
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment
