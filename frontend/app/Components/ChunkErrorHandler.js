'use client';
import { useEffect } from 'react';

const ChunkErrorHandler = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handler = (e) => {
        if (
          e?.message?.includes('Loading chunk') ||
          e?.message?.includes('ChunkLoadError')
        ) {
          window.location.reload();
        }
      };

      window.addEventListener('error', handler);

      return () => {
        window.removeEventListener('error', handler);
      };
    }
  }, []);

  return null; // This component doesn't render anything
};

export default ChunkErrorHandler;