
import React from 'react';
import './LoadingModal.scss'; 

interface LoadingModalProps {
  message?: string;
  show: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ message = 'Loading...', show }) => {
  if (!show) return null;

  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-content">
        <div className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
