class ApiResponse {
  static success(res, message, data = null, statusCode = 200) {
    const response = { success: true, message };
    if (data !== null) response.data = data;
    return res.status(statusCode).json(response);
  }

  static error(res, message, statusCode = 400, errors = null) {
    const response = { success: false, message };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static paginated(res, message, data, pagination) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
      },
    });
  }
}

module.exports = ApiResponse;
