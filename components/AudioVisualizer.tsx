import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export function AudioVisualizer({ isPlaying }: AudioVisualizerProps) {
  const bars = 30;
  
  return (
    <div className="flex items-center justify-center gap-1 h-20">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isPlaying ? Math.random() * 100 + '%' : '20%',
          }}
          transition={{
            duration: 0.2,
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse"
          }}
          className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
          style={{
            opacity: Math.max(0.3, 1 - Math.abs(i - bars/2) / (bars/2))
          }}
        />
      ))}
    </div>
  );
}
