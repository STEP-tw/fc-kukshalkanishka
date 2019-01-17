const fs = require('fs');
const requestHandler = require('./requestHandler');
const app = new requestHandler();

const getFilePath = function(url) {
  if (url == '/') return './public/flowerCatalog.html';
  return './public' + url;
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

const servePage = (req, res, next) => {
  let filePath = getFilePath(req.url);

  fs.readFile(filePath, (err, content) => {
    if (!err) {
      send(res, content, 200);
      next();
    }
    sendStatusCode(res, 404);
    next();
  });
};

const logRequest = (req, res, next) => {
  console.log(req.method, req.url);
  console.log('headers =>', JSON.stringify(req.headers, null, 2));
  console.log('body =>', req.body);
  next();
};

app.use(logRequest);
app.use(servePage);

module.exports = app.handleRequest.bind(app);
