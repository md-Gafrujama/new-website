const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
    ...(data && { data })
  };
  
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 500, message = 'Internal server error', errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(errors && { errors })
  };
  
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
