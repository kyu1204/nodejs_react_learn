import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes'


function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const queryParams = { videoId: videoId }

    const user = useSelector(state => state.user)

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideoDetail', { params: queryParams })
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                }
                else {
                    alert('비디오 정보를 가져오는데 실패하였습니다.')
                }
            })

        Axios.get('/api/comment/getComments', { params: queryParams })
            .then(response => {
                if (response.data.success) {
                    setComments(response.data.result)
                }
                else {
                    alert('댓글 정보를 가져오는데 실패하였습니다.')
                }
            })

    }, [])

    const refreshFunc = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    if (VideoDetail.writer) {
        let subscribeButton
        if (user.userData.isAuth)
            subscribeButton = VideoDetail.writer._id !== user.userData._id && <Subscribe userTo={VideoDetail.writer._id} />
        else {
            subscribeButton = <Subscribe userTo={VideoDetail.writer._id} />
        }
        return (
            <div>
                <Row gutter={[16, 16]}>
                    <Col lg={18} xs={24}>
                        <div style={{ width: '100%', padding: '3rem 2rem' }}>

                            <video
                                src={`http://localhost:12041/${VideoDetail.filePath}`}
                                style={{ width: '100%' }}
                                controls
                                autoplay='autoplay'
                                muted='muted'
                            />

                            <List.Item
                                actions={[<LikeDislikes video videoId={videoId} user={user} />, subscribeButton]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer.image} />}
                                    title={VideoDetail.title}
                                    description={VideoDetail.description}
                                />
                            </List.Item>
                            <hr/>
                            {/* {Comments} */}
                            <Comment refreshFunc={refreshFunc} commentLists={Comments} videoId={videoId} />
                        </div>
                    </Col>
                    <Col lg={6} xs={24}>
                        <SideVideo />
                    </Col>
                </Row>
            </div>
        )
    }
    else {
        return (
            <div>...loading</div>
        )
    }
}

export default VideoDetailPage
