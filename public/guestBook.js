const refreshComments = function() {
  fetch('/comments')
    .then(res => res.text())
    .then(
      comments => (document.getElementById('comments').innerHTML = comments)
    );
};

const logInToGuestBook = function() {
  fetch('/logIn')
    .then(res => res.text())
    .then(form => {
      document.getElementById('logInForm').innerHTML = form;
      document.getElementById('logOut').onclick = logOutFromGuestBook;
    });
};

const logOutFromGuestBook = function() {
  fetch('/logOut')
    .then(res => res.text())
    .then(form => {
      document.getElementById('logInForm').innerHTML = form;
      document.getElementById('logIn').onclick = logInToGuestBook;
    });
};

const setEventListner = function() {
  document.getElementById('refresh').onclick = refreshComments;
  document.getElementById('logIn').onclick = logInToGuestBook;
};

window.onload = setEventListner;
