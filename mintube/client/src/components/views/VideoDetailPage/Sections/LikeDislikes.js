import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd'
import Axios from 'axios'

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(false)
    const [DislikeAction, setDislikeAction] = useState(false)

    useEffect(() => {
        let queryParams = {}

        if (props.video) {
            queryParams = {
                videoId: props.videoId
            }
        }
        else {
            queryParams = {
                commentId: props.commentId
            }
        }

        Axios.get('/api/like-dislike/getLikesDislikes', { querys: queryParams })
            .then(response => {
                if (response.data.success) {
                    setLikes(response.data.likes.length)
                    setDislikes(response.data.dislikes.length)

                    response.data.likes.map(like => {
                        if (like.userId === props.user.userData._id) {
                            setLikeAction(true)
                        }
                    })
                    response.data.dislikes.map(dislike => {
                        if (dislike.userId === props.user.userData._id) {
                            setDislikeAction(true)
                        }
                    })
                }
                else {
                    alert('좋아요 정보를 가져오는데 실패하였습니다.')
                }
            })

    }, [])

    const onLikeClick = () => {

        let body = {}
        if (props.video) {
            body = {
                userId: '',
                videoId: '',
                like: !LikeAction
            }
        }
        else {
            body = {
                userId: '',
                commentId: '',
                like: !LikeAction
            }
        }


        Axios.post('/api/like-dislike/like', body)
            .then(response => {
                if (response.data.success) {

                }
                else {
                    alert('좋아요를 등록하는데 실패하였습니다.')
                }
            })
    }

    const onDislikeClick = () => {
        let body = {}
        if (props.video) {
            body = {
                userId: '',
                videoId: '',
                dislike: !DislikeAction
            }
        }
        else {
            body = {
                userId: '',
                commentId: '',
                dislike: !DislikeAction
            }
        }


        Axios.post('/api/like-dislike/dislike', body)
            .then(response => {
                if (response.data.success) {

                }
                else {
                    alert('싫어요를 등록하는데 실패하였습니다.')
                }
            })
    }

    return (
        <div>
            <span key='comment-basic-like'>
                <Tooltip title='Like'>
                    <Icon
                        type='like'
                        theme={LikeAction ? 'filled' : 'outlined'}
                        onClick={onLikeClick}
                    />
                </Tooltip>
                {
                    Likes > 0 ?
                        <span style={{ paddingLeft: '8px', cursor: 'auto', margin: '0.5rem' }}> {Likes} </span>
                        :
                        <span style={{ paddingLeft: '8px', cursor: 'auto', margin: '0.5rem' }} />
                }

            </span>
            <span key='comment-basic-dislike'>
                <Tooltip title='Dislike'>
                    <Icon
                        type='dislike'
                        theme={DislikeAction ? 'filled' : 'outlined'}
                        onClick={onDislikeClick}
                    />
                </Tooltip>
                {
                    Dislikes > 0 ?
                        <span style={{ paddingLeft: '8px', cursor: 'auto', margin: '0.5rem' }}> {Dislikes} </span>
                        :
                        <span style={{ paddingLeft: '8px', cursor: 'auto', margin: '0.5rem' }} />
                }
            </span>
        </div>
    )
}

export default LikeDislikes
