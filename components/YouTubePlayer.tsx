import { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  videoUrl: string;
}

export function YouTubePlayer({ videoUrl }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) return;

    if (playerRef.current) {
      playerRef.current.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
  }, [videoUrl]);

  return (
    <div className="aspect-video w-full">
      <iframe
        ref={playerRef}
        className="w-full h-full rounded-lg"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
