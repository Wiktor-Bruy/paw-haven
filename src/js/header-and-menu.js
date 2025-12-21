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

document.querySelectorAll('.mobile-menu a, .mobile-menu button').forEach(el => {
  el.addEventListener('click', () => {
    menuSection.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  });
});

//------------------------------------------------------------------------------------------
const headerUpIs = document.querySelector('.header-observer');
const headerUpBtn = document.querySelector('.header-button-up');

const observerHead = new IntersectionObserver(toggleHeaderBtnUp);
observerHead.observe(headerUpIs);

function toggleHeaderBtnUp(arr) {
  const headObs = arr[0];

  if (headObs.isIntersecting) {
    headerUpBtn.classList.remove('is-open');
  } else {
    headerUpBtn.classList.add('is-open');
  }
}
