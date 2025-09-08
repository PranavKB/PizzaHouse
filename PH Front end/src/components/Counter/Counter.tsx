import React from 'react';
import './Counter.css';
import type { CounterProps } from '../../types/interfaces';

const Counter: React.FC<CounterProps> = ({ value, onIncrement, onDecrement, onReset }) => {
  return (
    <div className="counter">
      <div className="counter-display">{value}</div>
      <div className="counter-buttons">
        <button className="counter-decrement" onClick={onDecrement} disabled={value <= 0}>-</button>
        {onReset && <button className="counter-reset" onClick={onReset}>Reset</button>}
        <button className="counter-increment" onClick={onIncrement}>+</button>
      </div>
    </div>
  );
};

export default Counter;
