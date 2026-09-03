const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
    ...(data !== null && { data })
  };
  return res.status(statusCode).json(response);
};

const errorResponse = (res, message = 'Error occurred', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    ...(details && { details })
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
        hasPrev: page > 1,
        firstPage: 1,
        lastPage: totalPages
      }
    },
    timestamp: new Date().toISOString()
  };
  return res.status(200).json(response);
};

const createdResponse = (res, data = null, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

const noContentResponse = (res) => {
  return res.status(204).send();
};

const customResponse = (res, data, message, statusCode, success = true) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
  customResponse
};
