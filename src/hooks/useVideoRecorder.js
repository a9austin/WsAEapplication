import { useState, useRef, useCallback, useEffect } from 'react';

const RECORDING_DURATION = 30; // 30 seconds
const MAX_RETAKES = 2;

export default function useVideoRecorder() {
  const [status, setStatus] = useState('idle'); // idle, previewing, recording, recorded, reviewing
  const [countdown, setCountdown] = useState(RECORDING_DURATION);
  const [retakesRemaining, setRetakesRemaining] = useState(MAX_RETAKES);
  const [error, setError] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Initialize camera preview
  const initCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus('previewing');
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    setCountdown(RECORDING_DURATION);

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4';

    const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatus('reviewing');
    };

    mediaRecorder.start(100); // Collect data every 100ms
    setStatus('recording');

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setStatus('recorded');
  }, []);

  // Retake video
  const retake = useCallback(() => {
    if (retakesRemaining <= 0) return;

    // Clean up previous video URL
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoBlob(null);
    setVideoUrl(null);
    setRetakesRemaining((prev) => prev - 1);
    setCountdown(RECORDING_DURATION);
    setStatus('previewing');

    // Re-init camera if stream was stopped
    if (!streamRef.current || !streamRef.current.active) {
      initCamera();
    }
  }, [retakesRemaining, videoUrl, initCamera]);

  // Clean up
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
  }, [videoUrl]);

  // Stop camera stream when reviewing
  useEffect(() => {
    if (status === 'reviewing' && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    videoRef,
    status,
    countdown,
    retakesRemaining,
    error,
    videoBlob,
    videoUrl,
    initCamera,
    startRecording,
    stopRecording,
    retake,
    cleanup,
    maxRetakes: MAX_RETAKES,
    recordingDuration: RECORDING_DURATION,
  };
}
