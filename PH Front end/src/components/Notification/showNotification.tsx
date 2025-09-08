import { toast, type ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
};

const showNotification = {

  success: (message: string): void => {
  toast.success(message, {
    ...toastOptions,
    style: {
      backgroundColor: '#d1e7dd', 
      color: '#0f5132',           
    },
  });
},

  error: (message: string): void => {
    toast.error(message, {
        ...toastOptions,
        style: {
        backgroundColor: '#f7c5bfff', 
        color: '#ec3325ff',           
        },
    });
  },

  info: (message: string): void => {
    toast.info(message, toastOptions);
  },
};

export default showNotification;
