import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock } from 'lucide-react';

const ClockTimePicker = ({ value, onChange, placeholder, required, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('hours'); // 'hours' | 'minutes'
  
  // Parse initial 24h value "14:30" to internal state
  const parseTime = (val) => {
    if (!val) return { h: 12, m: 0, ampm: 'AM' };
    const [hr, mn] = val.split(':').map(Number);
    const isPM = hr >= 12;
    const h12 = hr % 12 || 12;
    return { h: h12, m: mn, ampm: isPM ? 'PM' : 'AM' };
  };

  const [time, setTime] = useState(() => parseTime(value));

  useEffect(() => {
    setTime(parseTime(value));
  }, [value]);

  const updateValue = (newTime) => {
    setTime(newTime);
    let hr24 = newTime.h;
    if (newTime.ampm === 'PM' && hr24 !== 12) hr24 += 12;
    if (newTime.ampm === 'AM' && hr24 === 12) hr24 = 0;
    
    const formatted = `${hr24.toString().padStart(2, '0')}:${newTime.m.toString().padStart(2, '0')}`;
    if (onChange) {
      onChange({ target: { name, value: formatted } });
    }
  };

  const handleHourSelect = (h) => {
    updateValue({ ...time, h });
    setMode('minutes');
  };

  const handleMinuteSelect = (m) => {
    updateValue({ ...time, m });
    setIsOpen(false);
  };

  const toggleAmPm = (ampm) => {
    updateValue({ ...time, ampm });
  };

  // Generate numbers for the dial
  const renderDial = () => {
    const items = mode === 'hours' 
      ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      
    const radius = 76;
    
    return (
      <div className="relative w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-800/50 border theme-border flex items-center justify-center mx-auto my-4 shadow-inner">
        {/* Center dot */}
        <div className="absolute w-2 h-2 bg-teal-500 rounded-full z-20"></div>
        
        {/* Dial Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-[2px] bg-teal-500 origin-bottom z-10 transition-transform duration-300"
          style={{ 
            height: '62px', 
            transform: `translateX(-50%) rotate(${mode === 'hours' ? (time.h % 12) * 30 : (time.m / 5) * 30}deg)` 
          }}
        >
          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-teal-500 opacity-20"></div>
        </div>

        {items.map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const isSelected = mode === 'hours' ? (time.h % 12 || 12) === (num % 12 || 12) : time.m === num;
          
          return (
            <button
              key={num}
              type="button"
              onClick={() => mode === 'hours' ? handleHourSelect(num) : handleMinuteSelect(num)}
              className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-xs font-bold transition-all z-20 ${
                isSelected ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'theme-text hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            >
              {mode === 'minutes' ? num.toString().padStart(2, '0') : num}
            </button>
          );
        })}
      </div>
    );
  };

  const displayTime = value 
    ? `${time.h}:${time.m.toString().padStart(2, '0')} ${time.ampm}`
    : '';

  return (
    <div className="relative w-full">
      <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
      <input
        type="text"
        readOnly
        required={required}
        placeholder={placeholder}
        value={displayTime}
        onClick={() => {
          setIsOpen(true);
          setMode('hours');
        }}
        className="w-full pl-14 pr-6 py-4 theme-bg border theme-border rounded-xl text-sm theme-text placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium cursor-pointer"
      />

      {isOpen && document.getElementById('entity-modal-card') ? createPortal(
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/40 dark:bg-gray-950/80 backdrop-blur-md animate-fade-in" onClick={() => setIsOpen(false)} />
          
          <div className="relative p-5 theme-surface border theme-border rounded-3xl shadow-2xl z-50 w-[260px] animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-baseline gap-1 text-3xl font-black theme-text tracking-tighter">
              <button 
                type="button"
                onClick={() => setMode('hours')}
                className={`transition-colors ${mode === 'hours' ? 'text-teal-500' : 'opacity-50 hover:opacity-100'}`}
              >
                {time.h}
              </button>
              <span className="opacity-50">:</span>
              <button 
                type="button"
                onClick={() => setMode('minutes')}
                className={`transition-colors ${mode === 'minutes' ? 'text-teal-500' : 'opacity-50 hover:opacity-100'}`}
              >
                {time.m.toString().padStart(2, '0')}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <button 
                type="button"
                onClick={() => toggleAmPm('AM')}
                className={`px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wider transition-colors ${time.ampm === 'AM' ? 'bg-teal-500 text-white shadow-sm' : 'theme-bg theme-text-sub hover:theme-text'}`}
              >
                AM
              </button>
              <button 
                type="button"
                onClick={() => toggleAmPm('PM')}
                className={`px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wider transition-colors ${time.ampm === 'PM' ? 'bg-teal-500 text-white shadow-sm' : 'theme-bg theme-text-sub hover:theme-text'}`}
              >
                PM
              </button>
            </div>
          </div>

            {renderDial()}
          </div>
        </div>,
        document.getElementById('entity-modal-card') || document.body
      ) : null}
    </div>
  );
};

export default ClockTimePicker;
