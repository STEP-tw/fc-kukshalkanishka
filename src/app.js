const fs = require('fs');

const getFilePath = function(url) {
  return './src' + url;
};

const app = (req, res) => {
  let filePath = getFilePath(req.url);

  fs.readFile(filePath, (err, content) => {
    if (!err) {
      res.write(content);
      res.statusCode = 200;
      res.end();
    }
    res.statusCode = 404;
    res.end();
  });
};

// Export a function that can act as a handler

module.exports = app;
