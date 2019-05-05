module.exports = callback => ({
  error: (err, message) => {
    callback(null, {
      statusCode: err.statusCode || 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message })
    });
  },
  success: body => {
    callback(null, {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(body)
    });
  }
});
