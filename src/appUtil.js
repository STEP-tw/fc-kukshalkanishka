const send = function(res, content, statusCode) {
  res.statusCode = statusCode;
  res.write(content);
  console.log(res.body);

  res.end();
};

module.exports = { send };
