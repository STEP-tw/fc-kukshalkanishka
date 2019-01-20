const createPrefixPath = prefix => {
  return url => prefix + url;
};
const getFilePath = function(url) {
  if (url == '/') return './public/index.html';
  const addPrefix = createPrefixPath('public');
  return addPrefix(url);
};

const send = function(res, content, statusCode) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
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

module.exports = { getFilePath, send, parseCommentDetails };
