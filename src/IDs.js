const fs = require('fs');

class IDs {
  constructor() {
    this.IDs = [];
    this.htmlTemplate = '';
    this.loggedInHtml = '';
    this.logInHtml = '';
  }

  insert(ID) {
    this.IDs.push(ID);
  }

  loadHtml() {
    this.loggedInHtml = fs.readFileSync('./src/guestBookLogOut.html', 'utf-8');
    this.logInHtml = fs.readFileSync('./src/guestBookLogIn.html', 'utf-8');
    this.htmlTemplate = this.logInHtml;
  }

  getUniqueId() {
    let ID = new Date().getTime();
    this.insert(ID);
    return ID;
  }

  isUserValid(reqID) {
    return this.IDs.includes(reqID);
  }

  setHtmlAfterValidation(reqID) {
    if (this.isUserValid(reqID)) {
      this.htmlTemplate = this.loggedInHtml;
    }
  }

  setHtml() {
    this.htmlTemplate = this.loggedInHtml;
  }

  resetCookies() {
    this.htmlTemplate = this.logInHtml;
    this.IDs = [];
  }

  getHtmlTemplate() {
    return this.htmlTemplate;
  }
}

module.exports = IDs;
