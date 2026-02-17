import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { 
  CallEnd, 
  Mic, 
  MicOff, 
  Videocam, 
  VideocamOff 
} from '@mui/icons-material';
import SimplePeer from 'simple-peer';

const VideoCall = ({ socket, user, peer, onEndCall }) => {
  const [stream, setStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const myVideo = useRef();
  const peerVideo = useRef();
  const peerConnection = useRef();

  useEffect(() => {
    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(currentStream => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        // Create peer connection
        const peerObj = new SimplePeer({
          initiator: true,
          trickle: false,
          stream: currentStream
        });

        peerObj.on('signal', data => {
          socket.emit('callUser', {
            to: peer.userId,
            offer: data,
            callType: 'video'
          });
        });

        peerObj.on('stream', remoteStream => {
          if (peerVideo.current) {
            peerVideo.current.srcObject = remoteStream;
          }
        });

        peerConnection.current = peerObj;
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.destroy();
      }
    };
  }, [socket, peer]);

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.destroy();
    }
    socket.emit('endCall', { to: peer.userId });
    onEndCall();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Remote video */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <video
          ref={peerVideo}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>

      {/* Local video */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 200,
          height: 150,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <video
          ref={myVideo}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>

      {/* Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2
        }}
      >
        <IconButton
          onClick={toggleAudio}
          sx={{
            background: audioEnabled ? 'rgba(255,255,255,0.2)' : '#E54646',
            color: 'white',
            '&:hover': { background: audioEnabled ? 'rgba(255,255,255,0.3)' : '#C53030' }
          }}
        >
          {audioEnabled ? <Mic /> : <MicOff />}
        </IconButton>

        <IconButton
          onClick={endCall}
          sx={{
            background: '#E54646',
            color: 'white',
            width: 60,
            height: 60,
            '&:hover': { background: '#C53030' }
          }}
        >
          <CallEnd />
        </IconButton>

        <IconButton
          onClick={toggleVideo}
          sx={{
            background: videoEnabled ? 'rgba(255,255,255,0.2)' : '#E54646',
            color: 'white',
            '&:hover': { background: videoEnabled ? 'rgba(255,255,255,0.3)' : '#C53030' }
          }}
        >
          {videoEnabled ? <Videocam /> : <VideocamOff />}
        </IconButton>
      </Box>

      {/* Call info */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white'
        }}
      >
        <Typography variant="h6">{peer.username}</Typography>
        <Typography variant="caption">Video Call</Typography>
      </Box>
    </Box>
  );
};

export default VideoCall;
