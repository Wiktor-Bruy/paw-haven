import axios from 'axios';
import Swal from 'sweetalert2';

const overlay = document.getElementById('modalinputOverlay');
const closeBtn = document.getElementById('modalinputClose');
const form = document.getElementById('modalinputForm');

let currentAnimalId = null;

/* ---------- GUARD ---------- */
if (!overlay || !closeBtn || !form) {
  console.warn('Modal elements not found');
} else {
  initModal();
}

/* ---------- INITIALIZATION ---------- */
function initModal() {
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  form.addEventListener('input', onFieldInput);

  form.addEventListener('submit', onFormSubmit);
}

/* ---------- OPEN MODAL ---------- */
export function openModal(animalId) {
  currentAnimalId = animalId;

  overlay.classList.remove('is-hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onEscPress);

  const firstField = form.querySelector('input, textarea');
  if (firstField) firstField.focus();
}

/* ---------- CLOSE MODAL ---------- */
function closeModal() {
  overlay.classList.add('is-hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', onEscPress);

  form.reset();
  clearAllErrors();
}

/* ---------- ESC KEY ---------- */
function onEscPress(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal();
  }
}

/* ---------- LIVE VALIDATION ---------- */
function onFieldInput(e) {
  if (!e.target.matches('input, textarea')) return;

  const field = e.target;
  const label = field.closest('.modal-input-form-label');
  if (!label) return;

  const error = label.querySelector('.modal-input-error');
  if (!error) return;

  if (field.name === 'phone') {
    field.value = field.value.replace(/[^\d+]/g, '');

    const phonePattern = /^\+380\d{9}$/;
    if (!phonePattern.test(field.value)) {
      label.classList.add('error');
      error.textContent = 'Телефон повинен бути у форматі +380XXXXXXXXX';
      return;
    }
  }

  if (field.checkValidity()) {
    label.classList.remove('error');
    error.textContent = '';
  } else {
    showError(label, field, error);
  }
}

/* ---------- SHOW / CLEAR ERROR ---------- */
function showError(label, field, error) {
  label.classList.add('error');

  if (field.validity.valueMissing) {
    error.textContent = 'Це поле обовʼязкове';
  } else if (field.validity.typeMismatch) {
    error.textContent = 'Некоректне значення';
  } else if (field.validity.tooShort) {
    error.textContent = `Мінімум ${field.minLength} символів`;
  } else if (field.validity.patternMismatch) {
    error.textContent = 'Невірний формат';
  } else {
    error.textContent = 'Некоректне значення';
  }
}

function clearError(label, error) {
  label.classList.remove('error');
  error.textContent = '';
}

function clearAllErrors() {
  form.querySelectorAll('.modal-input-form-label').forEach(label => {
    label.classList.remove('error');
    const error = label.querySelector('.modal-input-error');
    if (error) error.textContent = '';
  });
}

/* ---------- FORM SUBMIT ---------- */
async function onFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  const name = form.elements.name.value.trim();
  const phoneRaw = form.elements.phone.value;
  // const phoneRaw = phoneRawOld.slice(1);
  // console.log(phoneRaw);

  const commentRaw = form.elements.comment.value.trim();
  const animalId = currentAnimalId;

  if (!name || !phoneRaw || !animalId) {
    Swal.fire({
      icon: 'error',
      title: 'Помилка',
      text: 'Будь ласка, заповніть всі обовʼязкові поля',
    });
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  // const phoneDigits = phoneRaw.replace(/\D/g, '');
  const phone = phoneRaw.slice(1);
  // phoneDigits.length === 9
  //   ? '+380' + phoneDigits
  //   : phoneDigits.startsWith('380')
  //   ? '+' + phoneDigits
  //   : '+' + phoneDigits;

  const comment = commentRaw || '-';

  const formData = {
    name,
    phone,
    comment,
    animalId: String(animalId),
  };

  console.log('✅ Form Data to send:', formData);

  try {
    const response = await axios.post(
      'https://furniture-store.b.goit.study/api/orders',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Response:', response.data);

    Swal.fire({
      icon: 'success',
      title: 'Заявку надіслано',
      text: `Номер вашого замовлення: ${response.data.id}`,
      timer: 2500,
      showConfirmButton: false,
    });

    closeModal();
  } catch (error) {
    console.error('❌ Axios error:', error);

    let errorMsg = 'Спробуйте ще раз пізніше';
    if (error.response) {
      console.error('Server response:', error.response.data);
      if (error.response.data?.message) errorMsg = error.response.data.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Помилка',
      text: errorMsg,
    });
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* ---------- VALIDATION BEFORE SUBMIT ---------- */
function validateForm() {
  let isValid = true;
  let firstInvalidField = null;

  const fields = form.querySelectorAll('input, textarea');

  fields.forEach(field => {
    const label = field.closest('.modal-input-form-label');
    if (!label) return;

    const error = label.querySelector('.modal-input-error');
    if (!error) return;

    if (field.name === 'phone') {
      const phonePattern = /^\+380\d{9}$/;
      if (!phonePattern.test(field.value)) {
        showError(label, field, error);
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field;
        return;
      }
    }

    if (!field.checkValidity()) {
      showError(label, field, error);
      isValid = false;
      if (!firstInvalidField) firstInvalidField = field;
    } else {
      clearError(label, error);
    }
  });

  if (firstInvalidField) firstInvalidField.focus();
  return isValid;
}
