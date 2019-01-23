const fs = require('fs');
const requestHandler = require('./requestHandler');
const { parseComments, getFilePath } = require('./appHelper');
const { send } = require('./appUtil');
const Comments = require('./comments');
const IDs = require('./IDs');
const app = new requestHandler();
const comments = new Comments();
const Ids = new IDs();

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

const logRequest = (req, res, next) => {
  console.log(req.method, req.url, req.headers);
  next();
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
  comments.insertComment(commentDetails, parseCookie(req.headers.cookie));
  comments.updateCommentsFile();
  serveGuestBook(req, res);
};

/**
 *Renders the guestBook(Html) by inserting comments's html in it.
 * @param {JSON} guestBook - contains all the previous comment details till data.
 */

const renderGuestBook = function(reqID, guestBook) {
  let logInHtml = Ids.logInHtml;
  if (reqID && Ids.isUserValid(parseCookie(reqID))) {
    Ids.setName(parseCookie(reqID));
    logInHtml = Ids.loggedInHtml;
  }
  let commentsHtml = comments.getCommentsHtml();
  guestBook = guestBook.replace('##_login_in_##', logInHtml);
  return guestBook.replace('##guest_comments##', commentsHtml);
};

/**
 * Serves guest book (html).
 * @param {object} req
 * @param {object} res
 */

const serveGuestBook = function(req, res) {
  fs.readFile('./public/guestBook.html', (error, guestBook) => {
    let reqID = req.headers.cookie;
    const renderedGuestBook = renderGuestBook(reqID, guestBook.toString());
    send(res, renderedGuestBook, 200);
  });
};

/**
 * Refresh the comments section
 * @param {object} req
 * @param {object} res
 */

const refreshComments = function(req, res) {
  res.write(comments.getCommentsHtml());
  res.end();
};

const parseCookie = reqId => {
  return reqId.split('=')[1];
};

const parseName = reqId => {
  return reqId.split('=')[1];
};

const handleGuestLogin = (req, res) => {
  let ID = Ids.getUniqueId(parseName(req.body));
  res.setHeader('Set-Cookie', `id = ${ID}`);
  res.statusCode = 302;
  res.setHeader('location', '/guestBook.html');
  res.end();
};

const resetCookie = function(req, res) {
  Ids.resetCookies();
  serveGuestBook(req, res);
};

/**
 * initailize comments with the contents of comments.json.
 */

comments.initializeComments();

/**
 * Initialize html templates for guest book.
 */

Ids.loadHtml();

/**
 * helper's method calls to set the sequence of function execution.
 */

app.use(logRequest);
app.use(readBody);
app.get('/', serveFile);
app.get('/guestBook.html', serveGuestBook);
app.get('/comments', refreshComments);
app.post('/logout', resetCookie);
app.post('/login', handleGuestLogin);
app.post('/guestBook.html', serveGuestBookForPost);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
