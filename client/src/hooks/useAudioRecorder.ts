import { useCallback, useEffect, useRef, useState } from 'react';
import type { MicDevice } from '../components/logs/MicDeviceSelect';

export type RecorderPhase = 'idle' | 'recording';

interface UseAudioRecorderOptions {
  deviceId: string;
  onStop?: (blob: Blob) => void;
}

export function useAudioRecorder({ deviceId, onStop }: UseAudioRecorderOptions) {
  const [phase, setPhase] = useState<RecorderPhase>('idle');
  const [devices, setDevices] = useState<MicDevice[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const refreshDevices = useCallback(async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    const inputs = all
      .filter((d) => d.kind === 'audioinput')
      .map((d) => ({
        deviceId: d.deviceId,
        label: d.label || `Microphone ${d.deviceId.slice(0, 8)}`,
      }));
    setDevices(inputs);
    return inputs;
  }, []);

  const requestPermission = useCallback(async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      await refreshDevices();
    } catch {
      setPermissionError('Microphone permission denied. Allow access to select a device.');
    }
  }, [refreshDevices]);

  useEffect(() => {
    void requestPermission();
  }, [requestPermission]);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    setPermissionError(null);
    chunksRef.current = [];

    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stopStream();
        setPhase('idle');
        onStop?.(blob);
      };

      recorder.start();
      setPhase('recording');
    } catch {
      setPermissionError('Could not start recording. Check microphone selection.');
      stopStream();
    }
  }, [deviceId, onStop, stopStream]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
  }, []);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  return {
    phase,
    devices,
    permissionError,
    startRecording,
    stopRecording,
    refreshDevices,
  };
}
