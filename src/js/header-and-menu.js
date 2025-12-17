const menuSection = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('data-burger-close');
const openBtn = document.getElementById('data-burger-open');

openBtn.addEventListener('click', () => {
  menuSection.classList.add('is-open');
  document.body.classList.add('menu-open');
});

closeBtn.addEventListener('click', () => {
  menuSection.classList.remove('is-open');
  document.body.classList.remove('menu-open');
});

document.querySelectorAll('.mobile-menu a, .mobile-menu button')
  .forEach(el => {
    el.addEventListener('click', () => {
      menuSection.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });
