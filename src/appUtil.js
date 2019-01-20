const parseComments = function(commentDetails) {
  let commentDetail = {};
  const splitKeyValue = pair => pair.split('=');
  const assignValueToKey = ([key, value]) => (commentDetail[key] = value);
  commentDetails
    .split('&')
    .map(splitKeyValue)
    .forEach(assignValueToKey);
  commentDetail.date = new Date().toLocaleString();
  return commentDetail;
};

const send = function(res, content, statusCode) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const addPrefix = function(url) {
  return './public' + url;
};

const getFilePath = function(url) {
  if (url == '/') return './public/index.html';
  return addPrefix(url);
};

module.exports = { parseComments, send, getFilePath };
