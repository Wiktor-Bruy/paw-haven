import axios from 'axios';

//-----------------------------------------------------------------Глобальні-змінні
let tailsPage = 1;
let tailsSearchParams = new URLSearchParams({
  page: 1,
  limit: 8,
});
//---------------------------------------------------------------------------------

//--------------------------------------------------------------------------Функції
//-------------------------------------------------------------------Запит-ктегорій
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
        `Вибачте, нажаль при запиті категорій сталася помилка ${err}. Спробуйте знов.`
      );
    });
}

//-----------------------------------------------------------------Рендер-категорій
function tailsRenderCategories(arr) {
  let gallery = [];

  arr.forEach(elem => {
    const item = document.createElement('li');
    const buttuon = document.createElement('button');
    buttuon.classList.add('tails-select');
    buttuon.textContent = elem.name;
    buttuon.setAttribute('data-id', `${elem._id}`);
    buttuon.setAttribute('type', 'button');
    item.append(buttuon);
    gallery.push(item);
  });

  const btnList = document.querySelector('.tails-button-list');
  btnList.append(...gallery);
}

//---------------------------------------------------------------------Запит-карток
function tailsGetArrAnimals() {
  axios
    .get(`https://paw-hut.b.goit.study/api/animals?${tailsSearchParams}`)
    .then(res => {
      const arrAnimals = res.data.animals;
      tailsRenderCards(arrAnimals);
    })
    .catch(er =>
      alert(
        `Вибачте, за сталася помилка в запиті карток ${er}. Спробуйте оновити сторінку.`
      )
    );
}

//--------------------------------------------------------------------Рендер-карток
function tailsRenderCards(arr) {
  let gallery = [];

  arr.forEach(elem => {
    const item = document.createElement('li');
    item.classList.add('tails-gallery-item');

    const div = document.createElement('div');
    div.classList.add('tails-gallery-img');
    const img = document.createElement('img');
    img.src = elem.image;
    img.alt = elem.name;
    div.append(img);
    item.append(div);

    const spec = document.createElement('p');
    spec.classList.add('tails-gallery-species');
    spec.textContent = elem.species;
    item.append(spec);

    const name = document.createElement('p');
    name.classList.add('tails-gallery-name');
    name.textContent = elem.name;
    item.append(name);

    const categorys = document.createElement('ul');
    categorys.classList.add('tails-gallery-categories');
    let listCategorys = [];
    elem.categories.forEach(el => {
      const item = document.createElement('li');
      item.classList.add('tails-categori-item');
      const text = document.createElement('span');
      text.textContent = el.name;
      item.append(text);
      listCategorys.push(item);
    });
    categorys.append(...listCategorys);
    item.append(categorys);

    const age = document.createElement('span');
    age.textContent = elem.age;
    item.append(age);

    const gen = document.createElement('span');
    gen.textContent = elem.gender;
    item.append(gen);

    const descr = document.createElement('p');
    descr.textContent = elem.shortDescription;
    item.append(descr);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Дізнвтися більше';
    btn.setAttribute('data-obj', JSON.stringify(elem));
    item.append(btn);

    gallery.push(item);
  });

  const cardList = document.querySelector('.tails-gallery');
  cardList.append(...gallery);
}

//---------------------------------------------------------------------------------

//------------------------------------------------------------------Загальна-логікa
tailsGetCategories();
tailsGetArrAnimals();
