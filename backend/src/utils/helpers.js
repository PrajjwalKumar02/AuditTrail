const crypto = require('crypto');

const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const id = `${timestamp}${random}`.toUpperCase();
  return prefix ? `${prefix}-${id}` : id;
};

const generateUUID = () => {
  return crypto.randomUUID();
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const retry = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let lastError;
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;
      await sleep(delay);
      delay *= 2;
    }
  }
  
  throw lastError;
};

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const truncate = (str, length = 100, suffix = '...') => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString();
};

const timeDifference = (date1, date2) => {
  const diff = Math.abs(new Date(date2) - new Date(date1));
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

const maskSensitive = (data, fields = ['password', 'token', 'secret']) => {
  const masked = { ...data };
  fields.forEach(field => {
    if (masked[field]) {
      masked[field] = '***';
    }
  });
  return masked;
};

module.exports = {
  generateId,
  generateUUID,
  sleep,
  retry,
  deepClone,
  isEmptyObject,
  toTitleCase,
  truncate,
  formatDate,
  timeDifference,
  maskSensitive
};
