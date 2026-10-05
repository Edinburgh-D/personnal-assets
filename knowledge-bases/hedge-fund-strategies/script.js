const menuButton = document.querySelector('[data-menu-button]');
const chapterStrip = document.querySelector('[data-chapter-strip]');

if (menuButton && chapterStrip) {
  menuButton.addEventListener('click', () => {
    const isOpen = chapterStrip.dataset.open === 'true';
    chapterStrip.dataset.open = String(!isOpen);
    menuButton.setAttribute('aria-expanded', String(!isOpen));
  });
}
