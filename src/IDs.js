const fs = require('fs');

class IDs {
  constructor() {
    this.IDs = [];
    this.htmlTemplate = '';
    this.loggedInHtml = '';
    this.logInHtml = '';
  }

  updateIdFile() {
    fs.writeFile('./data/ids.json', JSON.stringify(this.IDs), error => {});
  }

  insert(ID) {
    this.IDs.push(ID);
  }

  loadHtml() {
    this.loggedInHtml = fs.readFileSync('./src/guestBookLogOut.html', 'utf-8');
    this.logInHtml = fs.readFileSync('./src/guestBookLogIn.html', 'utf-8');
    this.IDs = JSON.parse(fs.readFileSync('./data/ids.json'));
    this.htmlTemplate = this.logInHtml;
  }

  getUniqueId(name) {
    let ID = name;
    this.insert(ID);
    this.updateIdFile();
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
    this.updateIdFile();
  }

  getHtmlTemplate() {
    return this.htmlTemplate;
  }

  setName(name) {
    console.log(name);
    this.loggedInHtml = this.loggedInHtml.replace(`##__name__##`, name);
  }
}

module.exports = IDs;
