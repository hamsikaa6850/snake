import React, { useState, useRef, useEffect } from 'react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur || 0);
      if (dur) {
        setProgress((current / dur) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <footer className="h-[120px] border-t-4 border-[var(--color-cyan)] flex items-center px-8 gap-8 bg-black shrink-0 w-full screen-tear">
      <div className="w-[300px] border-r-2 border-[var(--color-magenta)] pr-4">
        <div className="text-2xl text-[var(--color-cyan)] truncate">{currentTrack.title}</div>
        <div className="text-xl text-[var(--color-magenta)] truncate">{currentTrack.artist}</div>
      </div>

      <div className="flex items-center gap-6 flex-1 justify-center">
        <button onClick={handlePrev} className="bg-black border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] px-4 py-2 text-xl hover:bg-[var(--color-cyan)] hover:text-black cursor-pointer">{'<<'}</button>
        <button onClick={togglePlay} className="bg-[var(--color-magenta)] text-black px-8 py-2 text-2xl hover:bg-white cursor-pointer">
          {isPlaying ? 'HALT' : 'PLAY'}
        </button>
        <button onClick={handleNext} className="bg-black border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] px-4 py-2 text-xl hover:bg-[var(--color-cyan)] hover:text-black cursor-pointer">{'>>'}</button>
        
        <div className="w-[400px] h-4 bg-black border-2 border-[var(--color-magenta)] relative">
          <div className="absolute left-0 top-0 bottom-0 bg-[var(--color-cyan)]" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="text-2xl text-[var(--color-cyan)]">
          {formatTime(currentTime)}/{formatTime(duration)}
        </div>
      </div>

      <div className="w-[200px] text-right border-l-2 border-[var(--color-magenta)] pl-4">
        <span className="text-2xl text-[var(--color-cyan)] animate-pulse">AMP: 85%</span>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
    </footer>
  );
}
