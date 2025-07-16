// script.js

document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Thanks for your message, Rasool will get back to you soon!');
  this.reset();
});