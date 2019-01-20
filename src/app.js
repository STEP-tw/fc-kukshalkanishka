const fs = require('fs');
const requestHandler = require('./requestHandler');
const app = new requestHandler();

const addPrefix = function(url) {
  return './public' + url;
};

const readComments = function(req, res, next) {
  fs.readFile('./data/comments.json', (err, logs) => {
    commentsLog = JSON.parse(logs);
    next();
  });
};

const getFilePath = function(url) {
  if (url == '/') return './public/index.html';
  return addPrefix(url);
};

const send = function(res, content, statusCode) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const readBody = (req, res, next) => {
  let content = '';
  req.on('data', chunk => (content += chunk));
  req.on('end', () => {
    req.body = content;
    next();
  });
};

const serveFile = (req, res) => {
  let filePath = getFilePath(req.url);

  fs.readFile(filePath, (err, content) => {
    if (!err) {
      send(res, content, 200);
      return;
    }
    send(res, '', 404);
  });
};

const parseCommentDetails = commentDetails => {
  let commentDetail = {};
  const splitKeyValue = pair => pair.split('=');
  const assignValueToKey = ([key, value]) => (commentDetail[key] = value);
  commentDetails
    .split('&')
    .map(splitKeyValue)
    .forEach(assignValueToKey);
  return commentDetail;
};

const renderAndServeGuestBook = function(req, res) {
  const commentDetails = parseCommentDetails(req.body);
  commentDetails.date = new Date().toLocaleString();
  commentsLog.unshift(commentDetails);
  fs.writeFile('./data/comments.json', JSON.stringify(commentsLog), error => {
    serveGuestBook(req, res);
  });
};

const generateCommentHtml = function(commentDetail) {
  return `<h1>${commentDetail.name}</h1><p>  ${commentDetail.comment}<p><h3>
     ${commentDetail.date}</h3>`;
};

const renderGuestBook = function(req, res, guestBook) {
  let commentsHtml = commentsLog.map(generateCommentHtml).join('');
  return guestBook + commentsHtml;
};

const serveGuestBook = function(req, res) {
  fs.readFile('./public/guestBook.html', (error, guestBook) => {
    const renderedGuestBook = renderGuestBook(req, res, guestBook);
    send(res, renderedGuestBook, 200);
  });
};

app.use(readComments);
app.get('/', serveFile);
app.post('/guestBook.html', readBody);
app.get('/guestBook.html', serveGuestBook);
app.post('/guestBook.html', renderAndServeGuestBook);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
