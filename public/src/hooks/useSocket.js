import { useEffect, useRef } from 'react';

const useSocket = (url) => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket connection error:', error);
    };

    return () => {
      socketRef.current.close();
    };
  }, [url]);

  return socketRef.current;
};

export default useSocket;
