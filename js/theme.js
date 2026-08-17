(function () {
    'use strict';

    const THEME_KEY = 'pixel2stitch-theme';
    const themes = ['light', 'dark', 'system'];

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateBadges(theme) {
        const isDark = theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');

        document.querySelectorAll('.download-badge').forEach(container => {
            const lightBadge = container.querySelector('.badge-light');
            const darkBadge = container.querySelector('.badge-dark');

            if (lightBadge && darkBadge) {
                lightBadge.style.display = isDark ? 'none' : 'block';
                darkBadge.style.display = isDark ? 'block' : 'none';
            }
        });
    }

    function applyTheme(theme) {
        const html = document.documentElement;
        if (theme === 'system') {
            html.setAttribute('data-theme', 'system');
            const systemTheme = getSystemTheme();
            html.style.colorScheme = systemTheme;
        } else {
            html.setAttribute('data-theme', theme);
            html.style.colorScheme = theme;
        }

        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        // Update badges for ALL containers
        updateBadges(theme);

        // Update icons
        updateAppIcon(theme);

        localStorage.setItem(THEME_KEY, theme);
    }

    function updateAppIcon(theme) {
        const iconLight = document.querySelector('.app-icon-light');
        const iconDark = document.querySelector('.app-icon-dark');

        if (!iconLight || !iconDark) return;

        let isDark = false;

        if (theme === 'dark') {
            isDark = true;
        } else if (theme === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            isDark = false;
        }

        iconLight.style.display = isDark ? 'none' : 'block';
        iconDark.style.display = isDark ? 'block' : 'none';
    }

    function initTheme() {
        let savedTheme = localStorage.getItem(THEME_KEY);
        if (!savedTheme || !themes.includes(savedTheme)) {
            savedTheme = 'system';
        }
        applyTheme(savedTheme);

        // Setup buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const theme = this.dataset.theme;
                if (theme && themes.includes(theme)) {
                    applyTheme(theme);
                }
            });
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            const currentTheme = localStorage.getItem(THEME_KEY) || 'system';
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();