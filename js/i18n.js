(function () {
    'use strict';

    let currentLang = 'en';
    let translations = {};

    function getBrowserLang() {
        const lang = navigator.language || navigator.languages?.[0] || 'en';
        return lang.startsWith('ru') ? 'ru' : 'en';
    }

    function loadTranslations(lang) {
        return fetch(`locales/${lang}.json`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
                return res.json();
            })
            .then(data => {
                translations = data;
                currentLang = lang;
                applyTranslations();
            })
            .catch(err => {
                console.error('i18n error:', err);
                if (lang !== 'en') {
                    return loadTranslations('en');
                }
            });
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(translations, key);
            if (value !== undefined) {
                el.innerHTML = value;
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const value = getNestedValue(translations, key);
            if (value !== undefined) {
                el.setAttribute('title', value);
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const value = getNestedValue(translations, key);
            if (value !== undefined) {
                el.setAttribute('aria-label', value);
            }
        });

        const metaTitle = getNestedValue(translations, 'meta.title');
        const metaDescription = getNestedValue(translations, 'meta.description');

        if (metaTitle) {
            document.title = metaTitle;
        }

        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta && metaDescription) {
            descMeta.setAttribute('content', metaDescription);
        }

        document.documentElement.lang = currentLang;
        updateBadgeLanguage(currentLang);

        const lang = currentLang;
        const privacyLink = document.querySelector('.footer-links a[data-i18n="footerPrivacy"]');
        const termsLink = document.querySelector('.footer-links a[data-i18n="footerTerms"]');

        if (privacyLink) {
            privacyLink.href = `https://pixel2stitch.github.io/docs/privacy_${lang}.html`;
        }
        if (termsLink) {
            termsLink.href = `https://pixel2stitch.github.io/docs/terms_${lang}.html`;
        }
    }

    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    function updateBadgeLanguage(lang) {
        const badgeLinks = document.querySelectorAll('.download-badge a');
        const langCode = lang === 'ru' ? 'ru' : 'us';
        badgeLinks.forEach(link => {
            const img = link.querySelector('img');
            if (img) {
                const src = img.src;
                const newSrc = src.replace(/\/(en-us|ru)\//, `/${langCode}/`);
                if (newSrc !== src) {
                    img.src = newSrc;
                }
            }
        });
    }

    function getBrowserLang() {
        // Проверяем параметр URL для тестирования
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam === 'en' || langParam === 'ru') {
            return langParam;
        }

        // Иначе определяем по браузеру
        const lang = navigator.language || navigator.languages?.[0] || 'en';
        return lang.startsWith('ru') ? 'ru' : 'en';
    }

    function initI18n() {
        const lang = getBrowserLang();
        loadTranslations(lang);
    }

    window.__i18n = {
        currentLang: () => currentLang,
        translations: () => translations,
        reload: loadTranslations
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
})();