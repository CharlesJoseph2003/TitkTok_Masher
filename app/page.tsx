'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MoodSlider } from '@/components/MoodSlider';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { Toaster, toast } from 'sonner';
import { Music, Youtube } from 'lucide-react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMood, setCurrentMood] = useState(50); // 0-100 scale

  const handleProcess = async () => {
    if (!videoUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    setIsProcessing(true);
    try {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          currentMood,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      toast.success('Music transformation applied!');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Mood Music Transformer
        </h1>
        
        {/* URL Input */}
        <div className="relative">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Youtube className="absolute right-3 top-3 text-purple-400" />
        </div>

        {/* Mood Controls */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 space-y-6">
          <MoodSlider value={currentMood} onChange={setCurrentMood} />
          <AudioVisualizer isPlaying={isProcessing} />
        </div>

        {/* YouTube Player */}
        {videoUrl && (
          <div className="rounded-xl overflow-hidden">
            <YouTubePlayer videoUrl={videoUrl} />
          </div>
        )}

        {/* Process Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleProcess}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-medium"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Transform Music'}
        </motion.button>
      </motion.div>
      <Toaster position="bottom-center" />
    </main>
  );
}
