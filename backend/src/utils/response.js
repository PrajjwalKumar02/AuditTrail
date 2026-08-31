const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(response);
};

const errorResponse = (res, message = 'Error occurred', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(response);
};

const paginatedResponse = (res, items, total, page, limit, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  const response = {
    success: true,
    message,
    data: {
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    },
    timestamp: new Date().toISOString()
  };
  return res.status(200).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
