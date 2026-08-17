(function () {
    'use strict';

    function initCarousels() {
        document.querySelectorAll('.carousel').forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const dots = carousel.querySelector('.carousel-dots');
            const prevBtn = carousel.querySelector('.prev');
            const nextBtn = carousel.querySelector('.next');

            if (!track || slides.length === 0) return;

            let currentIndex = 0;
            const totalSlides = slides.length;

            if (dots) {
                dots.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                    dot.setAttribute('data-index', i);
                    dot.addEventListener('click', () => goToSlide(i));
                    dots.appendChild(dot);
                }
            }

            function goToSlide(index) {
                if (index < 0) index = totalSlides - 1;
                if (index >= totalSlides) index = 0;

                currentIndex = index;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;

                if (dots) {
                    dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }
            }

            function nextSlide() {
                goToSlide(currentIndex + 1);
            }

            function prevSlide() {
                goToSlide(currentIndex - 1);
            }

            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);

            let autoplayInterval = setInterval(nextSlide, 5000);

            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoplayInterval);
            });

            carousel.addEventListener('mouseleave', () => {
                autoplayInterval = setInterval(nextSlide, 5000);
            });

            let touchStartX = 0;
            let touchEndX = 0;

            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) nextSlide();
                    else prevSlide();
                }
            }, { passive: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousels);
    } else {
        initCarousels();
    }
})();