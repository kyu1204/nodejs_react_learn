import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const queryParams = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])

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
        return (
            <div>
                <Row gutter={[16, 16]}>
                    <Col lg={18} xs={24}>
                        <div style={{ width: '100%', padding: '3rem 4rem' }}>

                            <video style={{ width: '100%' }} src={`http://localhost:12041/${VideoDetail.filePath}`} controls />

                            <List.Item
                                actions={[<Subscribe uesrTo={VideoDetail.writer._id} />]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer.image} />}
                                    title={VideoDetail.title}
                                    description={VideoDetail.description}
                                />
                            </List.Item>

                            {/* {Comments} */}

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
