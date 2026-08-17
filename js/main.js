(function () {
    'use strict';

    function initRevealOnScroll() {
        const blocks = document.querySelectorAll('.feature-block');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            blocks.forEach(block => {
                block.style.opacity = '0';
                block.style.transform = 'translateY(40px)';
                block.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(block);
            });
        } else {
            blocks.forEach(block => {
                block.style.opacity = '1';
                block.style.transform = 'translateY(0)';
            });
        }
    }

    if (document.readyState === 'complete') {
        initRevealOnScroll();
    } else {
        window.addEventListener('load', initRevealOnScroll);
    }
})();