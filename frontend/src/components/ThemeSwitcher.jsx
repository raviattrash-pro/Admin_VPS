import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Layers, Box, Ghost, Zap, Crown, TreeDeciduous, Sparkles } from 'lucide-react';

const ACCENT_COLORS = [
  { name: 'Coral', h: 18, s: 90, l: 65, glow: 'rgba(255, 127, 80, 0.3)' },
  { name: 'Sky', h: 195, s: 90, l: 60, glow: 'rgba(0, 191, 255, 0.3)' },
  { name: 'Lime', h: 80, s: 80, l: 60, glow: 'rgba(124, 252, 0, 0.3)' },
  { name: 'Navy', h: 210, s: 80, l: 40, glow: 'rgba(0, 0, 128, 0.3)' },
  { name: 'Purple', h: 265, s: 85, l: 65, glow: 'rgba(108, 92, 231, 0.3)' },
  { name: 'Pink', h: 330, s: 90, l: 70, glow: 'rgba(255, 105, 180, 0.3)' },
  { name: 'Teal', h: 175, s: 90, l: 50, glow: 'rgba(0, 242, 254, 0.3)' },
  { name: 'Tan', h: 35, s: 50, l: 60, glow: 'rgba(210, 180, 140, 0.3)' },
  { name: 'Emerald', h: 150, s: 70, l: 45, glow: 'rgba(16, 172, 132, 0.3)' },
  { name: 'Gold', h: 45, s: 100, l: 50, glow: 'rgba(255, 190, 11, 0.3)' },
  { name: 'Indigo', h: 230, s: 80, l: 65, glow: 'rgba(72, 52, 212, 0.3)' },
  { name: 'Crimson', h: 350, s: 80, l: 55, glow: 'rgba(235, 77, 75, 0.3)' },
  { name: 'Mint', h: 160, s: 60, l: 75, glow: 'rgba(123, 237, 159, 0.3)' },
  { name: 'Lavender', h: 280, s: 50, l: 75, glow: 'rgba(190, 144, 212, 0.3)' },
  { name: 'Silver', h: 210, s: 10, l: 75, glow: 'rgba(189, 195, 199, 0.3)' },
  { name: 'Sunset', h: 10, s: 80, l: 60, glow: 'rgba(255, 121, 63, 0.3)' }
];

const THEME_MODES = [
  { id: 'dark', icon: <Moon size={14} />, label: 'Obsidian' },
  { id: 'light', icon: <Sun size={14} />, label: 'Diamond' },
  { id: 'solid', icon: <Palette size={14} />, label: 'Solid' },
  { id: 'glass', icon: <Ghost size={14} />, label: 'Glass' },
  { id: 'midnight', icon: <Sparkles size={14} />, label: 'Midnight' },
  { id: 'nature', icon: <TreeDeciduous size={14} />, label: 'Nature' },
  { id: 'royal', icon: <Crown size={14} />, label: 'Royal' },
  { id: 'neon', icon: <Zap size={14} />, label: 'Neon' }
];

export default function ThemeSwitcher() {
  const [mode, setMode] = useState(localStorage.getItem('vps-theme') || 'dark');
  const [activeAccent, setActiveAccent] = useState(parseInt(localStorage.getItem('vps-accent-index')) || 4);

  useEffect(() => {
    // Apply Mode
    document.documentElement.classList.remove(
      'light-mode', 'solid-mode', 'glass-mode', 'midnight-mode', 'nature-mode', 'royal-mode', 'neon-mode'
    );
    if (mode !== 'dark') {
      document.documentElement.classList.add(`${mode}-mode`);
    }
    localStorage.setItem('vps-theme', mode);

    // Apply Accent
    const color = ACCENT_COLORS[activeAccent];
    document.documentElement.style.setProperty('--accent', `hsl(${color.h}, ${color.s}%, ${color.l}%)`);
    document.documentElement.style.setProperty('--accent-light', `hsl(${color.h}, ${color.s}%, ${color.l + 10}%)`);
    document.documentElement.style.setProperty('--accent-glow', color.glow);
    localStorage.setItem('vps-accent-index', activeAccent);
  }, [mode, activeAccent]);

  return (
    <div className="theme-switcher-lux">
      <div className="switcher-section">
        <label className="section-label"><Layers size={12} /> Aesthetics Control</label>
        <div className="mode-tabs-lux grid">
          {THEME_MODES.map(tm => (
            <button key={tm.id} className={`mode-tab ${mode === tm.id ? 'active' : ''}`} onClick={() => setMode(tm.id)} title={tm.label}>
              {tm.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="switcher-section">
        <label className="section-label">Accent Palette</label>
        <div className="color-palette-lux">
          {ACCENT_COLORS.map((c, i) => (
            <motion.button
              key={c.name}
              className={`color-circle ${activeAccent === i ? 'active' : ''}`}
              style={{ backgroundColor: `hsl(${c.h}, ${c.s}%, ${c.l}%)` }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveAccent(i)}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
