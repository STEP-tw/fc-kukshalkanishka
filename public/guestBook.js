const refreshComments = function() {
  const request = new XMLHttpRequest();

  const reqListener = function() {
    document.getElementById('comments').innerHTML = request.response;
  };

  request.addEventListener('load', reqListener);
  request.open('GET', '/comments');
  request.send();
};

const setEventListner = function() {
  document.getElementById('refresh').onclick = refreshComments;
};

window.onload = setEventListner;
