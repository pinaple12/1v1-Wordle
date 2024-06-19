import React from 'react';

const Keyboard = ({ onKeyPress }) => {
  const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');

  return (
    <div className="keyboard">
      <div className="krow">
        {keys.slice(0, 10).map((key) => (
          <button key={key} onClick={() => onKeyPress(key)} className="key">
            {key}
          </button>
        ))}
      </div>
      <div className="krow">
        {keys.slice(10, 19).map((key) => (
          <button key={key} onClick={() => onKeyPress(key)} className="key">
            {key}
          </button>
        ))}
      </div>
      <div className="krow">
        <button onClick={() => onKeyPress('ENTER')} className="key special-key">
          ENTER
        </button>
        {keys.slice(19).map((key) => (
          <button key={key} onClick={() => onKeyPress(key)} className="key">
            {key}
          </button>
        ))}
        <button onClick={() => onKeyPress('BACKSPACE')} className="key special-key">
          BACKSPACE
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
