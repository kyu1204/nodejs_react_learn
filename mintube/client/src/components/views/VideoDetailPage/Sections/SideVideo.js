import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    setsideVideos(response.data.videos)
                }
                else {
                    alert('비디오를 가져오는데 실패하였습니다.')
                }
            })
    }, [])

    const renderSideVideo = sideVideos.map((video, index) => {
        var minutes = Math.floor(video.duration / 60)
        var seconds = Math.floor(video.duration - minutes * 60)
        console.log(video)

        return (
            <div key={index} style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}>
                <div style={{ width: '40%', marginRight: '1rem' }}>
                    <a href>
                        <img style={{ width: '100%', height: '100%' }} src={`http://localhost:12041/${video.thumbnail}`} alt='thumbnail' />
                    </a>
                </div>

                <div style={{ width: '50%' }}>
                    <a href style={{ color: 'gray' }}>
                        <span style={{ fontSize: '1rem', color: 'black' }}>{video.title}</span>
                        <br />
                        <span>{video.writer.name}</span>
                        <br />
                        <span>{video.views} views</span>
                        <br />
                        <span>{minutes} : {seconds}</span>
                    </a>
                </div>
            </div>
        )
    })

    return (
        <React.Fragment>
            <div style={{ marginTop: '3rem' }}>
                {renderSideVideo}

            </div>
        </React.Fragment>
    )
}

export default SideVideo
