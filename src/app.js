const fs = require('fs');
const requestHandler = require('./requestHandler');

const app = new requestHandler();

const createPrefixPath = prefix => {
  return url => prefix + url;
};

const getFilePath = function(url) {
  if (url == '/') return './public/index.html';
  const addPrefix = createPrefixPath('public');
  return addPrefix(url);
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

const readBody = (req, res, next) => {
  let content = '';
  req.on('data', chunk => (content += chunk));
  req.on('end', () => {
    req.body = content;
    next();
  });
};

const servePage = (req, res) => {
  let filePath = getFilePath(req.url);

  fs.readFile(filePath, (err, content) => {
    if (!err) {
      send(res, content, 200);
      return;
    }
    sendStatusCode(res, 404);
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

const renderGuestBookPage = function(req, res) {
  const commentDetails = parseCommentDetails(req.body);
  commentDetails.date = new Date().toLocaleString();
  fs.readFile('./data/userLog.json', (err, logs) => {
    let logsInJSON = JSON.parse(logs);
    logsInJSON.unshift(commentDetails);
    fs.writeFile('./data/userLog.json', JSON.stringify(logsInJSON), error => {
      serveGuestBookPage(req, res);
    });
  });
};

const readLogsAndServePage = function(req, res, guestBook) {
  fs.readFile('./data/userLog.json', (err, userLogs) => {
    let userLogsInJSON = JSON.parse(userLogs);
    userLogsInJSON.forEach(commentDetail => {
      guestBook += `<h1>${commentDetail.name}</h1><p>  ${
        commentDetail.comment
      }<p><h3>
       ${commentDetail.date}</h3>`;
    });
    send(res, guestBook, 200);
  });
};

const serveGuestBookPage = function(req, res) {
  fs.readFile('./public/guestBook.html', (error, guestBook) => {
    readLogsAndServePage(req, res, guestBook);
  });
};

app.use(readBody);
app.get('/', servePage);
app.get('/guestBook.html', serveGuestBookPage);
app.post('/guestBook.html', renderGuestBookPage);
app.use(servePage);

module.exports = app.handleRequest.bind(app);
