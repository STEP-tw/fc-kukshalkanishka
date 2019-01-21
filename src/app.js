const fs = require('fs');
const requestHandler = require('./requestHandler');
const { parseComments, getFilePath } = require('./appHelper');
const { send } = require('./appUtil');
const Comments = require('./comments');
const app = new requestHandler();
const comments = new Comments();

/**
 *Reads the req body at post request.
 * @param {object} req - The http request
 * @param {object} res - The response from the server.
 * @param {function} next - The next function to be executed.
 */

const readBody = (req, res, next) => {
  let content = '';
  req.on('data', chunk => (content += chunk));
  req.on('end', () => {
    req.body = content;
    next();
  });
};

/**
 * Serves a file at get request.
 * @param {object} req - The http request
 * @param {object} res - The response from the server.
 */

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

/**
 * Serves guest book for post request.
 * @param {object} req - The http request
 * @param {object} res - The response from the server.
 */

const serveGuestBookForPost = function(req, res) {
  const commentDetails = parseComments(req.body);
  comments.insertComment(commentDetails);
  comments.updateCommentsFile();
  serveGuestBook(req, res);
};

/**
 *Renders the guestBook(Html) by inserting comments's html in it.
 * @param {JSON} guestBook - contains all the previous comment details till data.
 */

const renderGuestBook = function(guestBook) {
  let commentsHtml = comments.getCommentsHtml();
  return guestBook + commentsHtml;
};

/**
 * Serves guest book (html).
 * @param {object} req
 * @param {object} res
 */
const serveGuestBook = function(req, res) {
  fs.readFile('./public/guestBook.html', (error, guestBook) => {
    const renderedGuestBook = renderGuestBook(guestBook);
    send(res, renderedGuestBook, 200);
  });
};

/**
 * initailize comments with the contents of comments.json.
 */

comments.initializeComments();

/**
 * helper's method calls to set the sequence of function execution.
 */

app.get('/', serveFile);
app.post('/guestBook.html', readBody);
app.get('/guestBook.html', serveGuestBook);
app.post('/guestBook.html', serveGuestBookForPost);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
