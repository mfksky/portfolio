import Lenis from 'lenis';
import Swiper, { Navigation } from './swiper';

export function initLightshop() {
    document.addEventListener('DOMContentLoaded', () => {
        const body = document.body;
        const lightshop = document.querySelector('[data-lightshop]');
    
        if (lightshop) {
            const lightshopItemInfoButtons = lightshop.querySelectorAll('[data-lightshop-button]');
            const lightshopPopupBody = document.querySelector('[data-lightshop-popup]');
    
            if (lightshopItemInfoButtons.length > 0 && lightshopPopupBody) {
                const lightshopPopupContent = lightshopPopupBody.querySelector('[data-lightshop-popup-content]');
                const lightshopPrevBtns = document.querySelectorAll('[data-lightshop-prev]');
                const lightshopNextBtns = document.querySelectorAll('[data-lightshop-next]');
                const lightshopPopupCloseBtns = document.querySelectorAll('[data-lightshop-close]');
                const lightshopCounterCurrent = document.querySelector('[data-lightshop-currentItem]');
                const lightshopCounterTotal = document.querySelector('[data-lightshop-totalItems]');
    
                let currentContentIndex = 0;
                let lightshopItemData = [];
                let popupLenis = null; // Lenis в попапе
                let rafId = null; // Аниационный фрейм в попапе
    
                // Функция для загрузки данных
                async function loadPortfolioData() {
                    try {
                        const response = await fetch('/api/portfolio-data');
                        lightshopItemData = await response.json();
                        lightshopCounterTotal.textContent = lightshopItemData.length;
                        console.log(JSON.stringify(lightshopItemData, null, 2));
                    } catch (error) {
                        console.error('Ошибка при загрузке данных портфолио:', error);
                    }
                }
    
                // Загрузка данных при инициализации
                loadPortfolioData();
    
                // Обновление контента по индексу
                function updateContentByIndex(index) {
                    currentContentIndex = index;
                    if (currentContentIndex < 0) {
                        currentContentIndex += lightshopItemData.length;
                    }
                    updateContent();
                    window.history.replaceState(null, null, `#${lightshopItemData[currentContentIndex].id}`);
                }
    
                // Обновление контента
                function updateContent() {
                    const currentItem = lightshopItemData[currentContentIndex];
                    lightshopCounterCurrent.textContent = currentContentIndex + 1;
    
                    const lightshopItemsToUpdate = lightshopPopupBody.querySelectorAll('[data-lightshop-item]');
                    lightshopItemsToUpdate.forEach(item => {
                        const key = item.getAttribute('data-key');
                        let dataProperty = item.getAttribute('data-property');
    
                        if (dataProperty.startsWith('[')) {
                            dataProperty = JSON.parse(dataProperty);
                        }
    
                        if (Array.isArray(dataProperty)) {
                            dataProperty.forEach(prop => {
                                item[prop] = currentItem[key];
                            });
                        } else {
                            item[dataProperty] = currentItem[key];
                        }
                    });
    
                    // Tasks
                    const lightshopTasksContainer = document.querySelector('[data-lightshop-tasks]');
    
                    if (lightshopTasksContainer && currentItem.tasks) {
                        lightshopTasksContainer.innerHTML = '';
                        currentItem.tasks.forEach(task => {
                            const taskElement = document.createElement('li');
                            taskElement.innerText = task.title;
                            lightshopTasksContainer.appendChild(taskElement);
                        });
                    }
    
                    // Skills
                    const lightshopSkillsContainer = document.querySelector('[data-lightshop-skills]');
    
                    if (lightshopSkillsContainer && currentItem.skills) {
                        lightshopSkillsContainer.innerHTML = '';
                        currentItem.tasks.forEach(skill => {
                            const skillElement = document.createElement('li');
                            skillElement.innerText = skill.title;
                            lightshopSkillsContainer.appendChild(skillElement);
                        });
                    }
    
                    // Stack
                    const lightshopStackContainer = document.querySelector('[data-lightshop-stack]');
                    
                    if (lightshopStackContainer && currentItem.stacks) {
                        lightshopStackContainer.innerHTML = '';
                        currentItem.stacks.forEach(stack => {
                            const stackElement = document.createElement('div');
                            stackElement.className = 'tools-grid-popup__item';
                            const img = document.createElement('img');
                            img.setAttribute('src', stack.imageUrl);
                            img.setAttribute('alt', stack.title);
                            img.setAttribute('title', stack.title);
                            stackElement.appendChild(img);
                            lightshopStackContainer.appendChild(stackElement);
                        });
                    }
    
                    // Gallery
                    const lightshopGalleryContainer = lightshopPopupContent.querySelector('[data-lightshop-gallery]');
                    if (lightshopGalleryContainer && currentItem.gallery) {
                        lightshopGalleryContainer.innerHTML = '';
                        currentItem.gallery.forEach(slide => {
                            const slideElement = document.createElement('div');
                            slideElement.className = 'gallery-popup__item swiper-slide';
                            const img = document.createElement('img');
                            img.setAttribute('src', slide.imageUrl);
                            img.setAttribute('alt', slide.alt);
                            img.setAttribute('title', slide.title);
                            slideElement.appendChild(img);
                            lightshopGalleryContainer.appendChild(slideElement);
                            const mainImage = lightshopPopupContent.querySelector('[data-lightshop-item][data-key="imageUrl"]');
    
                            // Смена основного изображение на изображение из галереи
                            if (mainImage) {
                                slideElement.addEventListener('click', () => {
                                    mainImage.src = slide.imageUrl;
                                    mainImage.alt = slide.alt;
                                    mainImage.title = slide.title;
                                });
                            }
                        });
    
                        // Инициализация Swiper
                        let lightshopSwiper;
                        if (!lightshopSwiper) {
                            lightshopSwiper = new Swiper('.gallery-popup.swiper', {
                                slidesPerView: 4,
                                spaceBetween: 20,
                                navigation: {
                                    nextEl: '[data-gallery-next]',
                                    prevEl: '[data-gallery-prev]',
                                },
                            });
                        }
                    }
                }
    
                // Открытие Popup
                function lightshopOpenPopup(index) {
                    updateContentByIndex(index);
                    
                    lightshopPopupBody.style.display = 'block';
                    
                    body.style.overflow = 'hidden';
    
                    if (window.stopLenis) {
                        window.stopLenis();
                    }
    
                    // Новый экземпляр Lenis для попапа
                    popupLenis = new Lenis({
                        wrapper: lightshopPopupContent,
                        content: lightshopPopupContent,
                        smoothWheel: true,
                        smoothTouch: false,
                        touchMultiplier: 2,
                    });
    
                    function raf(time) {
                        if (popupLenis) {
                            popupLenis.raf(time);
                            rafId = requestAnimationFrame(raf);
                        }
                    }
    
                    rafId = requestAnimationFrame(raf);
    
                    requestAnimationFrame(raf);
    
                    lightshopPopupContent.style.overflowY = 'auto';
    
                    setTimeout(() => {
                        lightshopPopupBody.style.opacity = '1';
                    }, 0);
                }
    
                // Загрузка следующего элемента
                function lightshopLoadNextItem() {
                    lightshopPopupContent.style.cssText = 'opacity: 0; transform: translateX(-200%); transition: all .3s ease;';
                    
                    setTimeout(() => {
                        updateContentByIndex((currentContentIndex + 1) % lightshopItemData.length);
                        lightshopPopupContent.style.removeProperty('transform');
                        lightshopPopupContent.style.removeProperty('transition');
                        lightshopPopupContent.style.cssText = 'opacity: 0; transform: translateX(200%);';

                        setTimeout(() => {
                            lightshopPopupContent.style.removeProperty('transform');
                            lightshopPopupContent.style.removeProperty('opacity');
                            lightshopPopupContent.style.cssText = 'opacity: 1; transform: translateX(0); transition: all .3s ease;';
                        }, 100)
                    }, 300)
                }
                
                // Загрузка предыдущего элемента
                function lightshopLoadPrevItem() {
                    lightshopPopupContent.style.cssText = 'opacity: 0; transform: translateX(200%); transition: all .3s ease;';

                    setTimeout(() => {
                        updateContentByIndex((currentContentIndex - 1 + lightshopItemData.length) % lightshopItemData.length);
                        lightshopPopupContent.style.removeProperty('transform');
                        lightshopPopupContent.style.removeProperty('transition');
                        lightshopPopupContent.style.cssText = 'opacity: 0; transform: translateX(-200%);';
    
                        setTimeout(() => {
                            lightshopPopupContent.style.removeProperty('transform');
                            lightshopPopupContent.style.removeProperty('opacity');
                            lightshopPopupContent.style.cssText = 'opacity: 1; transform: translateX(0); transition: all .3s ease;';
                        }, 100);
                    }, 300);
                }
    
                // Закрытие Popup
                function lightshopClosePopup() {
                    lightshopPopupBody.style.opacity = '0';
                    body.style.overflow = 'auto';
    
                    if (window.startLenis) {
                        window.startLenis();
                    }
    
                    if (rafId) {
                        cancelAnimationFrame(rafId);
                        rafId = null;
                    }
    
                    if (popupLenis) {
                        popupLenis.destroy();
                        popupLenis = null;
                    }
    
                    lightshopPopupContent.style.overflowY = '';
    
                    lightshopPopupBody.style.display = 'none';
                    window.history.replaceState(null, null, window.location.pathname);
                }
    
                lightshopPopupContent.addEventListener('scroll', (e) => {
                    e.stopPropagation(); // Предотвращаем распространение события скролла
                });
    
                // Добавление обработчиков событий
                lightshopPrevBtns.forEach(btn => btn.addEventListener('click', lightshopLoadPrevItem));
                lightshopNextBtns.forEach(btn => btn.addEventListener('click', lightshopLoadNextItem));
                lightshopItemInfoButtons.forEach((button, index) => {
                    button.addEventListener('click', () => lightshopOpenPopup(index));
                });
                lightshopPopupCloseBtns.forEach(btn => btn.addEventListener('click', lightshopClosePopup));
            }
        }
    });
}