const Log = (stack, level, packageName, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${packageName}] ${message}`;
  
  // Console logging
  switch (level.toLowerCase()) {
    case 'debug':
      console.log(logEntry);
      break;
    case 'info':
      console.info(logEntry);
      break;
    case 'warn':
      console.warn(logEntry);
      break;
    case 'error':
      console.error(logEntry);
      break;
    case 'fatal':
      console.error(logEntry);
      break;
    default:
      console.log(logEntry);
  }

  // Send log to backend service
  if (typeof window !== 'undefined') {
    try {
      fetch('http://4.224.186.213/evaluation-service/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message,
        }),
      }).catch(err => {
        // Silently fail if logging service unavailable
        console.debug('Log service unavailable:', err.message);
      });
    } catch (err) {
      // Silently fail if error occurs during logging
      console.debug('Failed to send log:', err.message);
    }
  }
};

module.exports = Log;
