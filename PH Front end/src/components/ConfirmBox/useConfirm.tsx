import { useState } from 'react';

type ConfirmOptions = {
  message: string;
};

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [resolveFn, setResolveFn] = useState<(confirmed: boolean) => void>();

  const confirm = ({ message }: ConfirmOptions): Promise<boolean> => {
    setMessage(message);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolveFn(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveFn?.(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveFn?.(false);
  };

  const ConfirmModal = () =>
    isOpen ? (
      <div className="modal-backdrop">
        <div className="modal-content">
          <p>{message}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleConfirm} style={{ backgroundColor: '#e67e22', color: '#fff' }}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return { confirm, ConfirmModal };
};
