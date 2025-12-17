import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.mySwiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 30,
    loop: false,
    speed: 500,
    grabCursor: true,
    navigation: {
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
    },
    pagination: {
        el: '.slider-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="pagination-bullet ' + className + '"></span>';
        },
    },
    on: {
        init: function () {
            updatePagination(this);
        },
        slideChange: function () {
            updatePagination(this);
        }
    }
});

function updatePagination(swiperInstance) {
    const bullets = document.querySelectorAll('.pagination-bullet');
    bullets.forEach((bullet, index) => {
        if (index === swiperInstance.activeIndex) {
            bullet.classList.add('active');
        } else {
            bullet.classList.remove('active');
        }
    });
}