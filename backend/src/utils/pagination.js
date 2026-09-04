const getPaginationOptions = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  
  return {
    skip,
    limit: limitNum,
    page: pageNum,
  };
};

const getPaginationMetadata = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    firstPage: 1,
    lastPage: totalPages
  };
};

const getPaginationLinks = (baseUrl, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const links = {
    self: `${baseUrl}?page=${page}&limit=${limit}`,
    first: `${baseUrl}?page=1&limit=${limit}`,
    last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
  };
  
  if (page > 1) {
    links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
  }
  if (page < totalPages) {
    links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
  }
  
  return links;
};

const validatePagination = (page, limit) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
  return { page: validPage, limit: validLimit };
};

module.exports = {
  getPaginationOptions,
  getPaginationMetadata,
  getPaginationLinks,
  validatePagination
};
