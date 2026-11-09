(() => {
  'use strict';
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('nav-menu');
  function closeMenu() {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menu.dataset.open = 'false';
    const icon = menuButton.querySelector('.menu-icon');
    if (icon) icon.textContent = '☰';
  }
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menu.dataset.open = String(!isOpen);
      menuButton.querySelector('.menu-icon').textContent = isOpen ? '☰' : '×';
    });
    menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu(); menuButton.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
    window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
  }
  const choices = Array.from(document.querySelectorAll('[data-product]'));
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  function selectProduct(button) {
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    panels.forEach(panel => { panel.hidden = panel.dataset.panel !== button.dataset.product; });
  }
  choices.forEach((button, index) => {
    button.addEventListener('click', () => selectProduct(button));
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % choices.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index - 1 + choices.length) % choices.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = choices.length - 1;
      if (target !== undefined) {
        event.preventDefault(); choices[target].focus(); selectProduct(choices[target]);
      }
    });
  });
  document.querySelectorAll('[data-quote-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const error = form.querySelector('.form-error');
      error.hidden = true;
      if (!form.reportValidity()) return;
      const measure = form.elements.namedItem('measure').value;
      const quantity = form.elements.namedItem('quantity').value.trim();
      if (quantity && (!Number.isSafeInteger(Number(quantity)) || Number(quantity) < 1)) {
        error.textContent = 'Informe uma quantidade inteira maior que zero.';
        error.hidden = false; form.elements.namedItem('quantity').focus(); return;
      }
      let message = 'Olá! Vim pelo site da Ouro Verde e gostaria de um orçamento de pontaletes de ' + form.dataset.wood + '.';
      if (measure) message += '\nMedida: ' + measure + '.';
      if (quantity) message += '\nQuantidade: ' + quantity + ' peças.';
      if (!measure) message += '\nGostaria de orientação sobre as medidas.';
      window.open('https://wa.me/551146554008?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
    });
  });
})();
