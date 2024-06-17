document.addEventListener('DOMContentLoaded', function () {
    // Scroll Items
    const elements = document.querySelectorAll('._scr-item');

    function checkVisibility() {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const offset = parseInt(el.getAttribute('data-offset')) || 100;

            if (rect.top <= window.innerHeight - offset && rect.bottom >= 0) {
                const duration = el.getAttribute('data-duration') || '0.6s';
                const delay = el.getAttribute('data-delay') || '0s';

                el.style.setProperty('transition-duration', duration);
                el.style.setProperty('transition-delay', delay);
                el.classList.add('_visible');
            }
        });
    }

    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
});