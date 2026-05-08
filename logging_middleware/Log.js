const Log = (stack, level, packageName, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${packageName}] ${message}`;
  
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
};

module.exports = Log;
