(function () {
    'use strict';

    const button = document.getElementById('backToTop');
    let isVisible = false;
    let ticking = false;

    function checkScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        const windowHeight = window.innerHeight;
        const shouldShow = scrollY > windowHeight;

        if (shouldShow !== isVisible) {
            isVisible = shouldShow;

            if (!ticking) {
                requestAnimationFrame(() => {
                    if (isVisible) {
                        button.classList.add('visible');
                    } else {
                        button.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }
    }

    function scrollToTop() {
        const startPosition = window.scrollY || window.pageYOffset;
        const duration = 600; // ms
        const startTime = performance.now();

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    }

    // Инициализация
    function init() {
        if (!button) return;
        button.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll, { passive: true });
        checkScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();