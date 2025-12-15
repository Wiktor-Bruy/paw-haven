const items = document.querySelectorAll('.question-item');

items.forEach(item => {
  const header = item.querySelector('.question-header');

  header.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

