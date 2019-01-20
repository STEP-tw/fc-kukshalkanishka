const fs = require('fs');

class Comments {
  constructor() {
    this.comments = [];
  }

  updateCommentsFile() {
    fs.writeFile(
      './data/comments.json',
      JSON.stringify(this.comments),
      error => {}
    );
  }

  initializeComments() {
    let comments = fs.readFileSync('./data/comments.json', 'utf-8');
    if (comments) {
      this.comments = JSON.parse(comments);
    }
  }

  generateCommentHtml(commentDetail) {
    return `<h1>${commentDetail.name}</h1><p>  ${commentDetail.comment}<p><h3>
       ${commentDetail.date}</h3>`;
  }

  getCommentsHtml() {
    return this.comments.map(this.generateCommentHtml).join('');
  }

  insertComment(comment) {
    this.comments.unshift(comment);
  }
}
module.exports = Comments;
