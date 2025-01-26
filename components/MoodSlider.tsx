import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function MoodSlider({ value, onChange }: MoodSliderProps) {
  const emojis = ['😴', '😌', '😊', '🕺', '🎉'];
  
  const getEmoji = (val: number) => {
    const index = Math.floor((val / 100) * (emojis.length - 1));
    return emojis[index];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Moon className="text-blue-400" />
          <span>Chill</span>
        </div>
        <motion.div
          key={getEmoji(value)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl"
        >
          {getEmoji(value)}
        </motion.div>
        <div className="flex items-center gap-2">
          <span>Dance</span>
          <Sun className="text-yellow-400" />
        </div>
      </div>
      
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
      />
    </div>
  );
}
