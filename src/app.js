const fs = require('fs');

const app = (req, res) => {
  const handledUrls = [
    '/',
    '/styleSheet.css',
    '/freshorigins.jpg',
    '/waterJar.gif'
  ];
  let page = './src/flowerCatalog.html';

  if (req.url == '/styleSheet.css') {
    page = './src/StyleSheet.css';
  }

  if (req.url == '/freshorigins.jpg') {
    page = './images/freshorigins.jpg';
  }

  if (req.url == '/waterJar.gif') {
    page = './images/waterJar.gif';
  }

  fs.readFile(page, (err, content) => {
    res.write(content);
    res.end();
  });
};

// Export a function that can act as a handler

module.exports = app;
