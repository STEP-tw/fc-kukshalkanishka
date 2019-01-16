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

const app = (req, res) => {
  let filePath = getFilePath(req.url);

  fs.readFile(filePath, (err, content) => {
    if (!err) {
      return send(res, content, 200);
    }
    send(res, '', 404);
  });
};

// Export a function that can act as a handler

module.exports = app;
