'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, PictureInPicture, X } from 'lucide-react';
import { Caption } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';

export interface YouTubePlayerController {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number) => void;
}

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  width?: string;
  height?: string;
  onPlayerReady?: (player: YouTubePlayerController) => void;
  className?: string;
  autoPlay?: boolean;
  playsInline?: boolean;
  iframeClassName?: string;
}

const YouTubePlayer = ({
  videoId,
  title,
  width = '100%',
  height = '400',
  onPlayerReady,
  className = '',
  autoPlay = false,
  playsInline = true,
}: YouTubePlayerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source === iframeRef.current?.contentWindow) {
        // Handle YouTube player state changes
        if (event.data && typeof event.data === 'object') {
          switch (event.data.event) {
            case 'onStateChange':
              if (event.data.info === 1) {
                setIsPlaying(true); // Playing
              } else if (event.data.info === 2) {
                setIsPlaying(false); // Paused
              }
              break;
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onPlayerReady) {
      onPlayerReady({
        playVideo: () => {
          // Post message to play video
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              '*'
            );
          }
        },
        pauseVideo: () => {
          // Post message to pause video
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              '*'
            );
          }
        },
        seekTo: (seconds: number) => {
          // Post message to seek to specific time
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              `{"event":"command","func":"seekTo","args":[${seconds},true]}`,
              '*'
            );
          }
        },
      });
    }
  };

  // Enhanced iframe URL with more parameters for better control
  const getIframeUrl = () => {
    const params = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      playsinline: playsInline ? '1' : '0',
      enablejsapi: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
      widget_referrer:
        typeof window !== 'undefined' ? window.location.href : '',
      iv_load_policy: '3', // Hide annotations
      fs: '1', // Allow fullscreen
      controls: '1',
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Handle play/pause via postMessage
  const handlePlayPause = () => {
    if (iframeRef.current?.contentWindow) {
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow.postMessage(
        `{"event":"command","func":"${command}","args":""}`,
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl ${className} aspect-video`}
    >
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <Caption className="text-gray-300">Loading video...</Caption>
          </div>
        </div>
      )}

      {/* YouTube Iframe */}
      <iframe
        ref={iframeRef}
        src={getIframeUrl()}
        title={title}
        width={width}
        height={height}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className={`
          w-full h-full absolute inset-0
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
        `}
        onLoad={handleLoad}
        loading="lazy"
        // Removed invalid 'importance' attribute
      />

      {/* Custom Overlay Controls (Optional) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 group">
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

        {/* Play/Pause button overlay */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 opacity-0 pointer-events-auto transition-all duration-200 hover:bg-black/70 group-hover:opacity-100"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      {/* Mobile Optimization Indicators */}
      <div className="sr-only" aria-live="polite">
        {isLoaded ? 'Video player ready' : 'Loading video player'}
        {isPlaying ? 'Video is playing' : 'Video is paused'}
      </div>
    </div>
  );
};

// Enhanced YouTube Player with Background Play Mode
export const YouTubePlayerWithBackground = ({
  videoId,
  title,
  onPlayerReady,
  className = '',
}: {
  videoId: string;
  title: string;
  onPlayerReady?: (player: YouTubePlayerController) => void;
  className?: string;
}) => {
  const [isDetached, setIsDetached] = useState(false);
  const playerRef = useRef<YouTubePlayerController | null>(null);

  const handlePlayerReady = (player: YouTubePlayerController) => {
    playerRef.current = player;
    if (onPlayerReady) {
      onPlayerReady(player);
    }
  };

  const toggleDetachedMode = () => {
    setIsDetached(!isDetached);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main YouTube Player */}
      <div
        className={`
        transition-all duration-500 ease-in-out
        ${
          isDetached
            ? 'fixed bottom-6 right-6 w-80 h-45 z-50 shadow-2xl rounded-2xl overflow-hidden border-2 border-yellow-400'
            : 'w-full'
        }
      `}
      >
        <YouTubePlayer
          videoId={videoId}
          title={title}
          onPlayerReady={handlePlayerReady}
          className={isDetached ? 'h-full' : ''}
          autoPlay={isDetached}
          playsInline={!isDetached}
        />

        {/* Detach/Attach Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleDetachedMode}
          className={`absolute top-2 right-2 z-10 rounded-full border border-white/20 p-2 backdrop-blur-sm transition-all duration-200 ${
            isDetached
              ? 'bg-yellow-500 text-black hover:bg-yellow-600'
              : 'bg-black/70 text-white hover:bg-black/90'
          }`}
          aria-label={
            isDetached ? 'Attach video player' : 'Detach video player'
          }
        >
          {isDetached ? (
            <X className="w-4 h-4" />
          ) : (
            <PictureInPicture className="w-4 h-4" />
          )}
        </Button>

        {/* Video Title in Detached Mode */}
        {isDetached && (
          <div className="absolute top-2 left-2 right-10 bg-black/70 text-white text-xs p-2 rounded backdrop-blur-sm line-clamp-1 border border-white/20">
            {title}
          </div>
        )}
      </div>

      {/* Backdrop for detached mode */}
      {isDetached && (
        <div
          className="fixed inset-0 bg-black/20 z-40 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default YouTubePlayer;
