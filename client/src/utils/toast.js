import { toast } from 'react-toastify';

// Custom toast configurations
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, { ...toastConfig, ...options });
  },
  
  error: (message, options = {}) => {
    toast.error(message, { ...toastConfig, autoClose: 5000, ...options });
  },
  
  info: (message, options = {}) => {
    toast.info(message, { ...toastConfig, ...options });
  },
  
  warning: (message, options = {}) => {
    toast.warning(message, { ...toastConfig, ...options });
  },
  
  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        pending: messages.pending || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong!',
      },
      { ...toastConfig, ...options }
    );
  },
};

// Utility functions for common scenarios
export const notifySwapRequest = (userName) => {
  showToast.success(`Swap request sent to ${userName}!`);
};

export const notifySwapAccepted = (userName) => {
  showToast.success(`${userName} accepted your swap request!`);
};

export const notifySwapRejected = (userName) => {
  showToast.warning(`${userName} declined your swap request.`);
};

export const notifyProfileUpdated = () => {
  showToast.success('Profile updated successfully!');
};

export const notifyLoginSuccess = (userName) => {
  showToast.success(`Welcome back, ${userName}!`);
};

export const notifyLogout = () => {
  showToast.info('You have been logged out.');
};

export const notifyError = (error) => {
  const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
  showToast.error(message);
};
