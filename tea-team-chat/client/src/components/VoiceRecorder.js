import React, { useState, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Mic, Stop, Send, Close } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const VoiceRecorder = ({ onVoiceSent, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const sendVoice = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('voice', audioBlob, 'voice-message.webm');
    formData.append('duration', recordingTime);

    try {
      const response = await axios.post('/api/upload/voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      onVoiceSent(response.data);
      toast.success('Voice message sent!');
      onClose();
    } catch (error) {
      console.error('Error sending voice:', error);
      toast.error('Failed to send voice message');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        background: 'white',
        borderRadius: 3,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      {!isRecording && !audioBlob && (
        <IconButton
          onClick={startRecording}
          sx={{
            background: '#F5A623',
            color: 'white',
            '&:hover': { background: '#D4A574' }
          }}
        >
          <Mic />
        </IconButton>
      )}

      {isRecording && (
        <>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#E54646',
              animation: 'pulse 1.5s infinite'
            }}
          />
          <Typography sx={{ flexGrow: 1, color: '#4A3728' }}>
            Recording... {formatTime(recordingTime)}
          </Typography>
          <IconButton onClick={stopRecording} color="error">
            <Stop />
          </IconButton>
        </>
      )}

      {audioBlob && !isRecording && (
        <>
          <audio src={URL.createObjectURL(audioBlob)} controls style={{ flexGrow: 1 }} />
          <IconButton onClick={sendVoice} sx={{ color: '#F5A623' }}>
            <Send />
          </IconButton>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default VoiceRecorder;
