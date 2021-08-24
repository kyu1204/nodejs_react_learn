import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const queryParams = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const user = useSelector(state => state.user)

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
    }, [])

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
                                actions={[subscribeButton]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer.image} />}
                                    title={VideoDetail.title}
                                    description={VideoDetail.description}
                                />
                            </List.Item>

                            {/* {Comments} */}
                            <Comment videoId={videoId} />
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
