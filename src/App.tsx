import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[var(--color-bg)] text-white overflow-hidden bg-scanlines">
      <div className="static-noise"></div>
      
      <header className="px-8 py-4 border-b-4 border-[var(--color-magenta)] flex justify-between items-center shrink-0 screen-tear">
        <div className="flex items-center gap-6">
          <h1 className="text-5xl glitch-text text-[var(--color-cyan)] m-0" data-text="SYS.CORE // RHYTHM.EXE">
            SYS.CORE // RHYTHM.EXE
          </h1>
          <div className="text-xl bg-[var(--color-cyan)] text-black px-2 py-1 animate-pulse">
            [ERR_NO_SIGNAL]
          </div>
        </div>
        <div className="border-jarring px-4 py-2 flex flex-col items-end bg-black">
          <span className="text-sm text-[var(--color-magenta)]">MAX_OVERRIDE_VAL</span>
          <span className="text-3xl text-[var(--color-cyan)]">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] min-h-0 p-4 gap-4">
        {/* Left Sidebar */}
        <aside className="border-jarring p-6 flex flex-col gap-6 bg-black screen-tear">
          <div className="text-2xl text-[var(--color-magenta)] border-b-2 border-[var(--color-cyan)] pb-2">
            &gt; DIAGNOSTICS
          </div>
          <div>
            <div className="text-xl text-[var(--color-cyan)]">LATENCY_MS</div>
            <div className="text-3xl">ERR_NULL</div>
          </div>
          <div>
            <div className="text-xl text-[var(--color-cyan)]">SYNC_RATE</div>
            <div className="text-3xl">0.001%</div>
          </div>

          <div className="text-2xl text-[var(--color-magenta)] border-b-2 border-[var(--color-cyan)] pb-2 mt-auto">
            &gt; INPUT.MAP
          </div>
          <div>
            <div className="text-xl text-[var(--color-cyan)]">VECTOR_CTRL</div>
            <div className="text-2xl">W_A_S_D // ARROWS</div>
          </div>
          <div>
            <div className="text-xl text-[var(--color-cyan)]">HALT_EXEC</div>
            <div className="text-2xl">ESC</div>
          </div>
        </aside>

        {/* Center - Game */}
        <section className="border-jarring-alt flex flex-col items-center justify-center relative p-4 bg-black overflow-hidden">
          <SnakeGame onScoreChange={handleScoreChange} />
        </section>

        {/* Right Sidebar */}
        <aside className="border-jarring p-6 flex flex-col bg-black screen-tear">
          <div className="text-2xl text-[var(--color-magenta)] border-b-2 border-[var(--color-cyan)] pb-2 mb-6">
            &gt; SECURE.COMMS
          </div>
          <div className="text-xl text-[var(--color-cyan)] animate-pulse mb-4">
            AWAITING_HANDSHAKE...
          </div>
          <div className="text-lg text-white opacity-50">
            0x00F1: CONNECTION REFUSED<br/>
            0x00F2: RETRYING...<br/>
            0x00F3: BYPASSING FIREWALL...
          </div>
        </aside>
      </main>

      <MusicPlayer />
    </div>
  );
}
