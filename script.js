(function () {
  "use strict";

  document.documentElement.classList.add("js-enabled");
  const data = window.NFL_DATA || {};
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Centralized links: edit them in site-data.js.
  $$('[data-register-link]').forEach((link) => {
    if (data.registerUrl) link.href = data.registerUrl;
  });
  $$('[data-website-link]').forEach((link) => {
    if (data.websiteUrl) link.href = data.websiteUrl;
  });
  $$('[data-instagram-link]').forEach((link) => {
    if (data.instagramUrl) link.href = data.instagramUrl;
  });
  $$('[data-email-link]').forEach((link) => {
    if (data.email) link.href = `mailto:${data.email}`;
  });
  $$('[data-whatsapp-link]').forEach((link) => {
    if (data.phoneWhatsApp) link.href = `https://wa.me/${data.phoneWhatsApp}`;
    const label = link.querySelector('span')?.nextSibling;
    if (label && data.phoneDisplay) label.textContent = ` ${data.phoneDisplay} ↗`;
  });

  // Mobile navigation.
  const menuToggle = $('.menu-toggle');
  const nav = $('.primary-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuToggle.setAttribute('aria-label', expanded ? 'Buka navigasi' : 'Tutup navigasi');
      nav.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('menu-open', !expanded);
    });
    $$('a', nav).forEach((link) => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Buka navigasi');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }));
  }

  // Accessible FAQ accordion, generated from site-data.js.
  const faqList = $('#faq-list');
  if (faqList && Array.isArray(data.faqs)) {
    faqList.innerHTML = data.faqs.map((item, index) => `
      <details class="faq-item" ${index === 0 ? 'open' : ''}>
        <summary><span class="faq-number">${String(index + 1).padStart(2, '0')}</span><span class="faq-question">${escapeHTML(item.question)}</span><span class="faq-plus" aria-hidden="true">＋</span></summary>
        <div class="faq-answer"><p>${escapeHTML(item.answer)}</p></div>
      </details>
    `).join('');
  }

  // Testimonial cards, generated from site-data.js.
  const testimonialGrid = $('#testimonial-grid');
  if (testimonialGrid && Array.isArray(data.testimonials)) {
    testimonialGrid.innerHTML = data.testimonials.map((item, index) => `
      <article class="testimonial-card reveal">
        <div class="testimonial-top"><span class="quote-mark">“</span><span class="testimonial-index">0${index + 1} / 03</span></div>
        <blockquote>${escapeHTML(item.quote)}</blockquote>
        <div class="testimonial-person">
          <img src="${escapeAttribute(item.image)}" data-fallback="assets/photo-placeholder.svg" alt="Foto contoh ${escapeAttribute(item.name)}" loading="lazy">
          <div><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.role || 'Peserta NFL 2025')}</span></div>
        </div>
      </article>
    `).join('');
    testimonialGrid.querySelectorAll('img').forEach(setImageFallback);
  }

  // Five-frame auto carousel with manual arrows and dot navigation.
  const galleryImage = $('#gallery-image');
  const galleryCount = $('#gallery-count');
  const galleryCaption = $('#gallery-caption');
  const galleryDots = $('#gallery-dots');
  const galleryItems = Array.isArray(data.gallery) ? data.gallery : [];
  let galleryIndex = 0;
  let galleryTimer = null;
  const galleryFrame = $('.gallery-frame');

  function renderGallery() {
    if (!galleryImage || galleryItems.length === 0) return;
    const item = galleryItems[galleryIndex];
    galleryImage.src = item.image || item.fallback || '';
    galleryImage.alt = item.alt || 'Foto contoh kegiatan NFL';
    galleryImage.dataset.fallback = item.fallback || '';
    galleryImage.dataset.activeImage = item.image || '';
    if (galleryCount) galleryCount.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
    if (galleryCaption) galleryCaption.textContent = item.caption || '';
    if (galleryDots) {
      galleryDots.innerHTML = galleryItems.map((_, index) => `<button class="gallery-dot ${index === galleryIndex ? 'is-active' : ''}" type="button" aria-label="Tampilkan foto ${index + 1}" aria-current="${index === galleryIndex ? 'true' : 'false'}" data-gallery-index="${index}"></button>`).join('');
    }
    galleryImage.onerror = () => {
      const fallback = galleryImage.dataset.fallback;
      if (fallback && galleryImage.src !== fallback) galleryImage.src = fallback;
      else galleryImage.classList.add('image-failed');
    };
    galleryImage.classList.remove('image-failed');
  }

  function moveGallery(direction) {
    galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
    renderGallery();
  }

  function stopGalleryTimer() {
    if (galleryTimer) window.clearInterval(galleryTimer);
    galleryTimer = null;
  }

  function startGalleryTimer() {
    stopGalleryTimer();
    if (galleryItems.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      galleryTimer = window.setInterval(() => moveGallery(1), 5600);
    }
  }

  $('#gallery-prev')?.addEventListener('click', () => { moveGallery(-1); startGalleryTimer(); });
  $('#gallery-next')?.addEventListener('click', () => { moveGallery(1); startGalleryTimer(); });
  galleryDots?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gallery-index]');
    if (!button) return;
    galleryIndex = Number(button.dataset.galleryIndex) || 0;
    renderGallery();
    startGalleryTimer();
  });
  if (galleryFrame) {
    galleryFrame.addEventListener('mouseenter', stopGalleryTimer);
    galleryFrame.addEventListener('mouseleave', startGalleryTimer);
    galleryFrame.addEventListener('focusin', stopGalleryTimer);
    galleryFrame.addEventListener('focusout', startGalleryTimer);
  }
  renderGallery();
  startGalleryTimer();

  // Fallback images keep the layout intact if an external image URL expires.
  function setImageFallback(image) {
    image.addEventListener('error', () => {
      const fallback = image.dataset.fallback;
      if (fallback && image.src !== fallback) {
        image.src = fallback;
      } else {
        image.classList.add('image-failed');
      }
    });
  }

  // Reveal-on-scroll: graceful fallback for browsers without IntersectionObserver.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Mark the current section in the desktop navigation.
  const sections = ['tentang', 'events', 'faq'].map((id) => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeId = entry.target.id;
        $$('.primary-nav a[href^="#"]').forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Footer year.
  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function escapeAttribute(value) {
    return escapeHTML(value).replace(/`/g, '&#96;');
  }
})();
