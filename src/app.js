const fs = require('fs');
const requestHandler = require('./requestHandler');
const { send, parseComments, getFilePath } = require('./appUtil');
const Comments = require('./comments');
const app = new requestHandler();
const comments = new Comments();

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

const serveGuestBookForPost = function(req, res) {
  const commentDetails = parseComments(req.body);
  comments.insertComment(commentDetails);
  comments.updateCommentsFile();
  serveGuestBook(req, res);
};

const renderGuestBook = function(req, res, guestBook) {
  let commentsHtml = comments.getCommentsHtml();
  return guestBook + commentsHtml;
};

const serveGuestBook = function(req, res) {
  fs.readFile('./public/guestBook.html', (error, guestBook) => {
    const renderedGuestBook = renderGuestBook(req, res, guestBook);
    send(res, renderedGuestBook, 200);
  });
};

comments.initializeComments();
app.get('/', serveFile);
app.post('/guestBook.html', readBody);
app.get('/guestBook.html', serveGuestBook);
app.post('/guestBook.html', serveGuestBookForPost);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
