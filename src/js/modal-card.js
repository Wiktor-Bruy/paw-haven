import Swal from 'sweetalert2';
import { openModal } from './modal-input';

const refs = {
  modal: document.querySelector('.modal-card'),
  modalOverlay: document.querySelector('.modal-card-overlay'),
};

refs.modalOverlay.addEventListener('click', e => {
  const id = document.querySelector('.id');

  if (e.target.closest('.modal-card-close-btn')) {
    closeModal();
  }

  if (e.target.closest('.modal-card-info-btn')) {
    try {
      closeModal();
      openModal(id.textContent);
    } catch (error) {
      Swal.fire({
        title: `Oops... 
            ${error}`,
        icon: 'error',
      });
    }
  }

  if (e.target === refs.modalOverlay) {
    closeModal();
  }
});

export default function openModalCard(data) {
  try {
    renderModalCard(data);
    refs.modalOverlay.classList.add('is-open');
    document.addEventListener('keydown', onEscPress);
  } catch (error) {
    Swal.fire({
      title: `Oops...
         ${error}`,
      icon: 'error',
    });
  }
}

function closeModal() {
  refs.modalOverlay.classList.remove('is-open');
  document.removeEventListener('keydown', onEscPress);
}

function onEscPress(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

function renderModalCard({
  name,
  image,
  age,
  species,
  behavior,
  healthStatus,
  description,
  gender,
  _id,
}) {
  const markup = ` 
    <button class="modal-card-close-btn">
        <svg width="13" height="13" class="modal-card-close-btn-svg">
        <use href="/img/icons.svg#close"></use>
        </svg>
    </button>
    <img class="modal-card-img" src="${image}" alt="">
    <div class="modal-card-info">
      <div class="modal-card-info-container">
        <h3 class="modal-card-info-subtitle">${species}</h3>
        <h2 class="modal-card-info-title">${name}</h2>
        <div class="modal-card-info-desc">
          <p class="modal-card-info-desc-text">${age}</p>
          <p class="modal-card-info-desc-text">${gender}</p>
        </div>
      </div>
      <ul class="modal-card-info-list">
        <li class="modal-card-info-list-item">
          <h2 class="modal-card-info-list-item-title">Опис:</h2>
          <p class="modal-card-info-list-item-text">${description}</p>
        </li>
        <li class="modal-card-info-list-item">
          <h2 class="modal-card-info-list-item-title">Здоров’я:</h2>
          <p class="modal-card-info-list-item-text">${healthStatus}</p>
        </li>
        <li class="modal-card-info-list-item">
          <h2 class="modal-card-info-list-item-title">Поведінка:</h2>
          <p class="modal-card-info-list-item-text">${behavior}</p>
        </li>
      </ul>
      <button class="modal-card-info-btn" type="button">Взяти додому</button>
      <p class="id">${_id}</p>
    </div>`;

  refs.modal.innerHTML = markup;
}
