import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const FileUpload = ({ onFileUploaded, onClose }) => {
  const [uploading, setUploading] = React.useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      const response = await axios.post('/api/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      onFileUploaded(response.data);
      toast.success('File uploaded successfully!');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [onFileUploaded, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt']
    }
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #F5A623',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? 'rgba(245, 166, 35, 0.1)' : 'white',
        '&:hover': {
          background: 'rgba(245, 166, 35, 0.05)'
        }
      }}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <CircularProgress sx={{ color: '#F5A623' }} />
      ) : (
        <>
          <UploadIcon sx={{ fontSize: 60, color: '#F5A623', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#4A3728', mb: 1 }}>
            {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B6F47' }}>
            Images, PDFs, Documents (Max 50MB)
          </Typography>
        </>
      )}
    </Box>
  );
};

export default FileUpload;
