const send = function(res, content, statusCode) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

module.exports = { send };
