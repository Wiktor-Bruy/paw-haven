import axios from 'axios';

//-----------------------------------------------------------------Глобальні-змінні
//---------------------------------------------------------------------------------
//--------------------------------------------------------------------------Функції
function tailsGetCategories() {
  axios
    .get('https://paw-hut.b.goit.study/api/categories')
    .then(res => {
      const tailCategories = res.data.toSorted((a, b) =>
        a._id.localeCompare(b._id)
      );
      tailsRenderCategories(tailCategories);
    })
    .catch(err => {
      alert(
        `Вибачте, нажаль при запиті сталася помилка ${err}. Спробуйте знов.`
      );
    });
}
function tailsRenderCategories(arr) {
  let gallery = [];

  arr.forEach(elem => {
    const buttuon = document.createElement('button');
    buttuon.classList.add('tails-select');
    buttuon.textContent = elem.name;
    buttuon.setAttribute('data-id', `${elem._id}`);
    buttuon.setAttribute('type', 'button');
    gallery.push(buttuon);
  });

  const btnList = document.querySelector('.tails-button-list');
  btnList.append(...gallery);
}

function tailsGetArrAnimals() {}
//---------------------------------------------------------------------------------
//------------------------------------------------------------------Загальна-логікa
tailsGetCategories();
