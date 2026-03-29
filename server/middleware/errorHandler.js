// server/middleware/errorHandler.js
// Global error handler — catches any error thrown in controllers

function errorHandler(err, req, res, next) {
  console.error('🔥 Error:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
