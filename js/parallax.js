(function () {
    'use strict';

    function initParallax() {
        const wrappers = document.querySelectorAll('.screenshot-wrapper');

        wrappers.forEach(wrapper => {
            const img = wrapper.querySelector('.screenshot-main');
            if (!img) return;

            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.willChange = 'transform';

            let ticking = false;

            const updateParallax = () => {
                const rect = wrapper.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const containerHeight = rect.height;
                const imgHeight = img.offsetHeight || containerHeight;
                const delta = Math.max(0, imgHeight - containerHeight);

                if (delta === 0) {
                    img.style.transform = 'translate3d(0, 0, 0)';
                    return;
                }

                const visiblePercent = 1 - (rect.top / windowHeight);
                const clamped = Math.max(0, Math.min(1, visiblePercent));
                const offset = clamped * delta;

                img.style.transform = `translate3d(0, ${-offset}px, 0)`;
            };

            const requestUpdate = () => {
                if (ticking) return;

                ticking = true;

                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
            };

            window.addEventListener('scroll', requestUpdate, { passive: true });
            window.addEventListener('resize', requestUpdate, { passive: true });

            requestUpdate();
        });
    }

    if (document.readyState === 'complete') {
        setTimeout(initParallax, 100);
    } else {
        window.addEventListener('load', () => setTimeout(initParallax, 100));
    }
})();