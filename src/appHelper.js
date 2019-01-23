const parseComments = function(commentDetails) {
  let commentDetail = {};
  const splitKeyValue = pair => pair.split('=');
  const assignValueToKey = ([key, value]) =>
    (commentDetail[key] = formatComment(value));
  commentDetails
    .split('&')
    .map(splitKeyValue)
    .forEach(assignValueToKey);
  commentDetail.date = new Date().toLocaleString();
  return commentDetail;
};

const addPrefix = function(url) {
  return './public' + url;
};

const getFilePath = function(url) {
  if (url == '/') return './public/index.html';
  return addPrefix(url);
};

const formatComment = data => {
  return unescape(data).replace(/\+/g, ' ');
};

module.exports = { parseComments, getFilePath };
