import axios from 'axios';
import Swal from 'sweetalert2';
import openModalCard from './modal-card.js';
//-----------------------------------------------------------------Глобальні-змінні
const tailsBtnLoad = document.querySelector('.tails-load-more');
let tailsTotalPage;
let tailsTotalItems;
let tailsSearchParams = {
  page: 1,
  limit: 8,
};
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
      Swal.fire({
        title: `Вибачте, нажаль при запиті категорій сталася помилка ${err} Спробуйте знов.`,
        icon: 'error',
      });
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
  tailsToggleLoader();
  const serarchParams = new URLSearchParams({
    ...tailsSearchParams,
  });
  axios
    .get(`https://paw-hut.b.goit.study/api/animals?${serarchParams}`)
    .then(res => {
      const arrAnimals = res.data.animals;
      tailsRenderCards(arrAnimals);
      tailsToggleLoader();
      tailsTotalItems = res.data.totalItems;
      tailsTotalPage = Math.ceil(tailsTotalItems / tailsSearchParams.limit);
      if (tailsSearchParams.page >= tailsTotalPage) {
        tailsBtnLoad.classList.add('tails-none');
      } else {
        tailsBtnLoad.classList.remove('tails-none');
      }
    })
    .catch(er => {
      Swal.fire({
        title: `Вибачте, нажаль при запиті карток тарин сталася помилка ${err} Спробуйте знов.`,
        icon: 'error',
      });
      tailsToggleLoader();
    });
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
    img.loading = 'lazy';
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

    const spans = document.createElement('div');

    const age = document.createElement('span');
    age.classList.add('tails-gallery-span');
    age.classList.add('tails-gallery-span-m');
    age.textContent = elem.age;
    spans.append(age);

    const gen = document.createElement('span');
    gen.classList.add('tails-gallery-span');
    gen.textContent = elem.gender;
    spans.append(gen);

    item.append(spans);

    const descr = document.createElement('p');
    descr.classList.add('tails-gallery-text');
    descr.textContent = elem.shortDescription;
    item.append(descr);

    const btn = document.createElement('button');
    btn.classList.add('tails-know-more');
    btn.type = 'button';
    btn.textContent = 'Дізнатися більше';
    btn.setAttribute('data-obj', JSON.stringify(elem));
    item.append(btn);

    gallery.push(item);
  });

  const cardList = document.querySelector('.tails-gallery');
  cardList.append(...gallery);
}

//----------------------------------------------------------------Клік-по-категорії
function tailsOnClickCategori(event) {
  const elem = event.target;
  if (elem.tagName !== 'BUTTON') {
    return;
  }

  const gallery = document.querySelector('.tails-gallery');
  gallery.innerHTML = '';

  if (elem.dataset.id === undefined) {
    delete tailsSearchParams.categoryId;
    tailsSearchParams.page = 1;
    tailsGetArrAnimals();
  } else {
    tailsSearchParams.categoryId = elem.dataset.id;
    tailsSearchParams.page = 1;
    tailsGetArrAnimals();
  }

  const btnList = document.querySelectorAll('.tails-select');
  btnList.forEach(el => el.classList.remove('tails-select-active'));
  elem.classList.add('tails-select-active');
}

//-------------------------------------------------------------------Завантажити-ще
function onClickLoadMore() {
  tailsSearchParams.page += 1;

  tailsToggleLoader();

  const serarchParams = new URLSearchParams({
    ...tailsSearchParams,
  });
  axios
    .get(`https://paw-hut.b.goit.study/api/animals?${serarchParams}`)
    .then(res => {
      const arrAnimals = res.data.animals;
      tailsRenderCards(arrAnimals);
      tailsToggleLoader();
    })
    .catch(er => {
      Swal.fire({
        title: `Вибачте, нажаль при запиті карток тарин сталася помилка ${err} Спробуйте знов.`,
        icon: 'error',
      });
      tailsToggleLoader();
    });

  if (tailsSearchParams.page === tailsTotalPage) {
    tailsBtnLoad.classList.add('tails-none');
  }
}

//----------------------------------------------------Відкриття-та-закриття-лоадера
function tailsToggleLoader() {
  const loader = document.querySelector('.tails-loader');
  loader.classList.toggle('tails-none');
}

//---------------------------------------------------------Відкриття-модалки-картки
function tailsKnowMore(event) {
  const elem = event.target;
  if (elem.tagName !== 'BUTTON') {
    return;
  }
  openModalCard(JSON.parse(elem.dataset.obj));
}
//---------------------------------------------------------------------------------

//------------------------------------------------------------------Загальна-логікa
//----------------------------------------------------------------Початковий-рендер
const tailsWindov = window.innerWidth;
if (tailsWindov >= 1440) {
  tailsSearchParams.limit = 9;
}

tailsGetCategories();
tailsGetArrAnimals();

//------------------------------------------------------------------Вибір-категорії
const tailsCategories = document.querySelector('.tails-button-list');
tailsCategories.addEventListener('click', tailsOnClickCategori);

//-------------------------------------------------------------------Завантажити-ще
tailsBtnLoad.addEventListener('click', onClickLoadMore);

//----------------------------------------------------------Відкрити-модалку-картки
const tailsGallery = document.querySelector('.tails-gallery');
tailsGallery.addEventListener('click', tailsKnowMore);
//---------------------------------------------------------------------------------
