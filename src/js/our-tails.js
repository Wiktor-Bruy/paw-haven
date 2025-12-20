import axios from 'axios';
import Swal from 'sweetalert2';
import openModalCard from './modal-card.js';
//-----------------------------------------------------------------Глобальні-змінні

const tailSection = document.querySelector('.our-tails');
const tailPagBtnBox = document.querySelector('.tails-pag-list');
const tailBtnLeft = document.querySelector('#tail-btn-left');
const tailBtnRight = document.querySelector('#tail-btn-right');

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

      //----------------------------------------------------------------------------------pagin

      if (tailsSearchParams.page === 1) {
        tailBtnLeft.setAttribute('disabled', '');
      } else {
        tailBtnLeft.removeAttribute('disabled');
      }
      if (tailsSearchParams.page === tailsTotalPage) {
        tailBtnRight.setAttribute('disabled', '');
      } else {
        tailBtnRight.removeAttribute('disabled');
      }
      renderPaginBox(tailsSearchParams.page, tailsTotalPage);
      //-----------------------------------------------------------------------------------------
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

//---------------------------------------------------------------------Кнопка-вгору
const tailsUpIs = document.querySelector('.tails-observer');
const tailsUpBtn = document.querySelector('.tails-button-up');

const observerTails = new IntersectionObserver(toggleTailsBtnUp);
observerTails.observe(tailsUpIs);

function toggleTailsBtnUp(arr) {
  const tailsObs = arr[0];
  if (tailsObs.isIntersecting) {
    tailsUpBtn.classList.remove('is-open');
  } else {
    tailsUpBtn.classList.add('is-open');
  }
}

//------------------------------------------------------------------------Пагінація

function renderPaginBox(curr, total) {
  const pageBox = document.querySelector('.tails-pag-list');

  if (total <= 3) {
    let btnList = [];
    for (let i = 1; i <= total; i++) {
      const item = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add('tails-pagin-btn-page');
      btn.setAttribute('data-page', `${i}`);
      btn.textContent = i;
      if (i === curr) {
        btn.setAttribute('disabled', '');
      }
      item.append(btn);
      btnList.push(item);
    }
    pageBox.innerHTML = '';
    pageBox.append(...btnList);
  } else {
    if (curr <= 3) {
      pageBox.innerHTML = '';
      let btnList = [];
      for (let i = 1; i <= 3; i++) {
        const item = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('tails-pagin-btn-page');
        btn.textContent = i;
        if (i === curr) {
          btn.setAttribute('disabled', '');
        }
        btn.setAttribute('data-page', `${i}`);
        item.append(btn);
        btnList.push(item);
      }
      pageBox.append(...btnList);

      const itemN = document.createElement('li');
      const btnN = document.createElement('button');
      btnN.setAttribute('data-page', 'dis');
      btnN.classList.add('tails-pagin-btn-none');
      btnN.textContent = '...';
      itemN.append(btnN);

      pageBox.append(itemN);

      const itemT = document.createElement('li');
      const btnT = document.createElement('button');
      btnT.type = 'button';
      btnT.setAttribute('data-page', `${total}`);
      btnT.classList.add('tails-pagin-btn-page');
      btnT.textContent = `${total}`;
      itemT.append(btnT);

      pageBox.append(itemT);
    } else if (curr >= total - 2) {
      pageBox.innerHTML = '';

      const itemT = document.createElement('li');
      const btnT = document.createElement('button');
      btnT.type = 'button';
      btnT.setAttribute('data-page', '1');
      btnT.classList.add('tails-pagin-btn-page');
      btnT.textContent = '1';
      itemT.append(btnT);

      pageBox.append(itemT);

      const itemN = document.createElement('li');
      const btnN = document.createElement('button');
      btnN.setAttribute('data-page', 'dis');
      btnN.classList.add('tails-pagin-btn-none');
      btnN.textContent = '...';
      itemN.append(btnN);

      pageBox.append(itemN);

      let btnList = [];
      for (let i = total - 2; i <= total; i++) {
        const item = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('tails-pagin-btn-page');
        btn.textContent = i;
        if (i === curr) {
          btn.setAttribute('disabled', '');
        }
        btn.setAttribute('data-page', `${i}`);
        item.append(btn);
        btnList.push(item);
      }
      pageBox.append(...btnList);
    } else {
      pageBox.innerHTML = '';

      const itemT = document.createElement('li');
      const btnT = document.createElement('button');
      btnT.type = 'button';
      btnT.setAttribute('data-page', '1');
      btnT.classList.add('tails-pagin-btn-page');
      btnT.textContent = '1';
      itemT.append(btnT);

      pageBox.append(itemT);

      const itemN = document.createElement('li');
      const btnN = document.createElement('button');
      btnN.setAttribute('data-page', 'dis');
      btnN.classList.add('tails-pagin-btn-none');
      btnN.textContent = '...';
      itemN.append(btnN);

      pageBox.append(itemN);

      let btnList = [];
      for (let i = curr - 1; i <= curr + 1; i++) {
        const item = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('tails-pagin-btn-page');
        btn.textContent = i;
        if (i === curr) {
          btn.setAttribute('disabled', '');
        }
        btn.setAttribute('data-page', `${i}`);
        item.append(btn);
        btnList.push(item);
      }
      pageBox.append(...btnList);

      const itemNn = document.createElement('li');
      const btnNn = document.createElement('button');
      btnNn.setAttribute('data-page', 'dis');
      btnNn.classList.add('tails-pagin-btn-none');
      btnNn.textContent = '...';
      itemNn.append(btnNn);

      pageBox.append(itemNn);

      const itemTt = document.createElement('li');
      const btnTt = document.createElement('button');
      btnTt.type = 'button';
      btnTt.setAttribute('data-page', `${total}`);
      btnTt.classList.add('tails-pagin-btn-page');
      btnTt.textContent = total;
      itemTt.append(btnTt);

      pageBox.append(itemTt);
    }
  }
}

tailPagBtnBox.addEventListener('click', onClickPag);
tailBtnLeft.addEventListener('click', onClickLeft);
tailBtnRight.addEventListener('click', onClickRight);

function onClickLeft() {
  if (tailsSearchParams === 1) {
    return;
  }
  const gallery = document.querySelector('.tails-gallery');
  gallery.innerHTML = '';
  tailsSearchParams.page -= 1;
  tailsGetArrAnimals();
  tailSection.scrollIntoView();
}

function onClickRight() {
  if (tailsSearchParams === tailsTotalPage) {
    return;
  }
  const gallery = document.querySelector('.tails-gallery');
  gallery.innerHTML = '';
  tailsSearchParams.page += 1;
  tailsGetArrAnimals();
  tailSection.scrollIntoView();
}

function onClickPag(event) {
  const elem = event.target;
  const page = elem.dataset.page;
  if (page === 'dis') {
    return;
  }
  tailsSearchParams.page = +page;
  const gallery = document.querySelector('.tails-gallery');
  gallery.innerHTML = '';
  tailsGetArrAnimals();
  tailSection.scrollIntoView();
}
