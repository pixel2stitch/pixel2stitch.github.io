(function () {
    'use strict';

    function preloadImages() {
        const images = [
            'assets/images/screens/preview-1.png',
            'assets/images/screens/preview-2.png',
            'assets/images/screens/preview-3.png'
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    if (document.readyState === 'complete') {
        preloadImages();
    } else {
        window.addEventListener('load', preloadImages);
    }
})();