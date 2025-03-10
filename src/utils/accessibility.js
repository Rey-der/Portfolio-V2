const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const trapFocus = (element) => {
    const focusable = element.querySelectorAll(focusableElements);
    if (focusable.length === 0) return;
    
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    firstFocusable.focus();

    element.addEventListener('keydown', (event) => {
        const isTabPressed = event.key === 'Tab';

        if (!isTabPressed) {
            return;
        }

        if (event.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                event.preventDefault();
            }
        }
    });
};

export const setAriaLive = (message, priority = 'polite') => {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;
    }
};

export const handleEscapeKey = (element, closeCallback) => {
    element.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeCallback();
        }
    });
};

export const initializeAccessibility = () => {
    // Only create if it doesn't exist yet
    if (!document.getElementById('aria-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.id = 'aria-live-region';
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }
    
    // Add skip link if it doesn't exist
    if (!document.querySelector('a[href="#main-content"]')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-blue-600 focus:text-white';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
};