class Comments {
  constructor() {}

  readComments(req, res, next) {
    const logs = fs.readFileSync('./data/comments.json', 'utf-8');
    this.comments = JSON.parse(logs);
    next();
  }

  generateCommentHtml(commentDetail) {
    return `<h1>${commentDetail.name}</h1><p>  ${commentDetail.comment}<p><h3>
     ${commentDetail.date}</h3>`;
  }
}
