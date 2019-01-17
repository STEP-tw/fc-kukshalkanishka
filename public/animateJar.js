const toggleJar = function(jar) {
  setTimeout(() => {
    jar.setAttribute('style', 'filter: brightness(1)');
  }, 1000);
  jar.setAttribute('style', 'filter: brightness(400)');
};

const setEventListners = function(document) {
  const jar = document.getElementById('jar');
  jar.onclick = toggleJar.bind(null, jar);
};

const initialize = function() {
  setEventListners(document);
};

window.onload = initialize;
