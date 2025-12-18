import axios from 'axios';

import Swal from 'sweetalert2';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import raty from 'raty-js';

import starOn from '../img/icons/star-black.svg';
import starOff from '../img/icons/star-blank.svg';
import starHalf from '../img/icons/star-half.svg';

const feedbackLoader = document.querySelector('.feedback-loader');
const feedbackSwiper = document.querySelector('.feedback-swiper-wrapper');

async function getFeedbacks() {
  const response = await axios.get(
    'https://paw-hut.b.goit.study/api/feedbacks',
    {
      params: {
        page: 1,
        limit: 10,
      },
    }
  );
  return response.data;
}

function feedbackTemplate({ rate, description, author }) {
  return `<div class="swiper-slide feedback-swiper-slide"><div class="feedback-rating" data-score="${rate}"></div>
      <p class="feedback-description">${description}</p>
      <p class="feedback-author">${author}</p></div>`;
}

function feedbacksTemplate(feedbacks) {
  return feedbacks.map(feedbackTemplate).join('');
}

function createFeedbacks(feedbacks) {
  const markup = feedbacksTemplate(feedbacks);
  feedbackSwiper.insertAdjacentHTML('beforeend', markup);
}

function showLoader() {
  feedbackLoader.classList.remove('hidden');
}

function hideLoader() {
  feedbackLoader.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
  showLoader();
  try {
    const data = await getFeedbacks();
    const feedbacks = data.feedbacks;
    createFeedbacks(feedbacks);

    const ratingElements = document.querySelectorAll('.feedback-rating');
    ratingElements.forEach(el => {
      const rating = new raty(el, {
        score: Number(el.dataset.score),
        readOnly: true,
        half: true,

        starType: 'img',
        starOn: starOn,
        starOff: starOff,
        starHalf: starHalf,
        path: '',
      });
      rating.init();
    });

    const swiper = new Swiper('.feedback-swiper', {
      modules: [Navigation, Pagination],
      pagination: {
        el: '#swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.feedback-navigation .swiper-button-next',
        prevEl: '.feedback-navigation .swiper-button-prev',
        addIcons: false,
      },
      slidesPerView: 1,
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 32,
        },
      },
    });
  } catch (error) {
    if (error.response) {
      Swal.fire({
        title: `Помилка сервера (${error.response.status}). Спробуйте пізніше.`,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: `Не вдалося зʼєднатись із сервером. Перевірте інтернет.`,
        icon: 'error',
      });
    }
  } finally {
    hideLoader();
  }
});
