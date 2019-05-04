module.exports = callback => ({
  error: (err, message) => {
    callback(null, {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message })
    });
  },
  success: body => {
    callback(null, { statusCode: 200, body: JSON.stringify(body) });
  }
});
