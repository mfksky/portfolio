// mapSwiperSync.js
import Swiper, { Navigation } from '../../js/surf/swiper';

export function initializeMapSwiperSync() {
    const swiperSurf = new Swiper('.cards__inner', {
        modules: [Navigation],
        slidesPerView: 'auto',
        spaceBetween: -40,
        navigation: {
            nextEl: '.cards__nav-next',
            prevEl: '.cards__nav-prev',
        },
    });

    const mapDotBoxes = document.querySelectorAll('.map__dot-box');
    const mapTexts = document.querySelectorAll('.map__text');
    const slides = document.querySelectorAll('.cards__slide');

    const initialActiveIndex = 0;
    if (mapDotBoxes.length > 0 && mapTexts.length > 0) {
        activateElements(initialActiveIndex);
    }

    function activateElements(index) {
        mapDotBoxes.forEach((dotBox, i) => {
            dotBox.querySelector('.map__dot-content').classList.remove('_active', '_visible');
            dotBox.querySelector('.map__dot').classList.remove('_active');
        });
        mapTexts.forEach(text => text.classList.remove('_active'));
        slides.forEach(slide => slide.classList.remove('swiper-slide-active'));

        if (mapDotBoxes[index] && mapTexts[index] && slides[index]) {
            mapDotBoxes[index].querySelector('.map__dot-content').classList.add('_active');
            setTimeout(() => {
                mapDotBoxes[index].querySelector('.map__dot-content').classList.add('_visible');
            }, 10);
            mapDotBoxes[index].querySelector('.map__dot').classList.add('_active');
            mapTexts[index].classList.add('_active');
            slides[index].classList.add('swiper-slide-active');
            swiperSurf.slideTo(index);  // Прокручиваем слайдер к активному слайду
        }
    }

    function handleMouseOver(event) {
        const dotBox = event.currentTarget;
        const index = Array.from(mapDotBoxes).indexOf(dotBox);
        activateElements(index);
    }

    mapDotBoxes.forEach(dotBox => {
        dotBox.addEventListener('mouseover', handleMouseOver);
    });

    swiperSurf.on('slideChange', () => {
        activateElements(swiperSurf.activeIndex);
    });
}