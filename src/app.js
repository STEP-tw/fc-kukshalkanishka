const fs = require('fs');

const getFilePath = function(url) {
  if (url == '/') return './src/flowerCatalog.html';
  return './src' + url;
};

const send = function(res, content, statusCode) {
  res.write(content);
  res.statusCode = statusCode;
  res.end();
};

const sendStatusCode = function(res, statusCode) {
  res.statusCode = statusCode;
  res.end();
};

const app = (req, res) => {
  let filePath = getFilePath(req.url);

  fs.readFile(filePath, (err, content) => {
    if (!err) {
      return send(res, content, 200);
    }
    sendStatusCode(res, 404);
  });
};

module.exports = app;
