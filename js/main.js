/* ============================================
   HIKING FOR KIDS - Interactive JavaScript
   Animations | Search | Language | Interactivity
   ============================================ */

(function() {
  'use strict';

  /* --- Header Scroll Effect --- */
  const header = document.querySelector('.header');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.pageYOffset;
    if (header) {
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* --- Mobile Menu Toggle --- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const headerNav = document.querySelector('.header__nav');

  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('open');
      headerNav.classList.toggle('open');
      document.body.style.overflow = headerNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    headerNav.querySelectorAll('.header__nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileToggle.classList.remove('open');
        headerNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Scroll Animations (Intersection Observer) --- */
  function initScrollAnimations() {
    var targets = document.querySelectorAll('.animate-on-scroll, .animate-scale, .animate-slide-left, .animate-slide-right');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function(el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    targets.forEach(function(el) { observer.observe(el); });
  }

  /* --- Animated Counter --- */
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function(el) { el.textContent = el.getAttribute('data-count'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var prefix = el.getAttribute('data-prefix') || '';
          var duration = 2000;
          var start = 0;
          var startTime = null;

          function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
          }

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.floor(easeOut(progress) * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = prefix + target.toLocaleString() + suffix;
            }
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  /* --- Trail Finder Search --- */
  function initTrailFinder() {
    var form = document.querySelector('.trail-finder__form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var location = form.querySelector('[name="location"]');
      var difficulty = form.querySelector('[name="difficulty"]');
      var age = form.querySelector('[name="age"]');
      var duration = form.querySelector('[name="duration"]');

      // Get current language
      var lang = document.documentElement.lang || 'en';
      var basePath = '/' + lang + '/trails/';

      var params = new URLSearchParams();
      if (location && location.value) params.set('q', location.value);
      if (difficulty && difficulty.value) params.set('difficulty', difficulty.value);
      if (age && age.value) params.set('age', age.value);
      if (duration && duration.value) params.set('duration', duration.value);

      var url = basePath;
      var paramStr = params.toString();
      if (paramStr) url += '?' + paramStr;

      window.location.href = url;
    });
  }

  /* --- Favorite Toggle --- */
  function initFavorites() {
    document.querySelectorAll('.trail-card__favorite').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
        var icon = this.querySelector('span') || this;
        if (this.classList.contains('active')) {
          icon.textContent = '❤️';
          this.setAttribute('aria-label', 'Remove from favorites');
        } else {
          icon.textContent = '🤍';
          this.setAttribute('aria-label', 'Add to favorites');
        }
      });
    });
  }

  /* --- Filter Buttons --- */
  function initFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // Remove active from siblings
        var parent = this.closest('.filter-bar');
        if (parent) {
          parent.querySelectorAll('.filter-btn').forEach(function(b) {
            b.classList.remove('active');
          });
        }
        this.classList.add('active');

        // Filter cards
        var filter = this.getAttribute('data-filter');
        var cards = document.querySelectorAll('[data-category]');
        cards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(function() {
              card.style.transition = 'all 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var headerHeight = header ? header.offsetHeight : 72;
          var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });
  }

  /* --- Interactive Map Pins --- */
  function initMapPins() {
    document.querySelectorAll('.map-pin').forEach(function(pin) {
      pin.addEventListener('click', function() {
        var region = this.getAttribute('data-region');
        var regionItems = document.querySelectorAll('.region-item');
        regionItems.forEach(function(item) {
          item.style.background = 'rgba(255,255,255,0.05)';
          item.style.borderColor = 'rgba(255,255,255,0.1)';
        });
        var targetItem = document.querySelector('.region-item[data-region="' + region + '"]');
        if (targetItem) {
          targetItem.style.background = 'rgba(255,255,255,0.15)';
          targetItem.style.borderColor = 'var(--green-mid)';
          targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  /* --- Checklist Interactive --- */
  function initChecklists() {
    document.querySelectorAll('.checklist-card__item input[type="checkbox"]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        var label = this.parentElement;
        if (this.checked) {
          label.style.textDecoration = 'line-through';
          label.style.opacity = '0.6';
        } else {
          label.style.textDecoration = '';
          label.style.opacity = '';
        }

        // Save state
        var id = this.id;
        if (id) {
          try {
            var saved = JSON.parse(localStorage.getItem('hfk-checklist') || '{}');
            saved[id] = this.checked;
            localStorage.setItem('hfk-checklist', JSON.stringify(saved));
          } catch (e) { /* ignore */ }
        }
      });

      // Restore state
      var id = cb.id;
      if (id) {
        try {
          var saved = JSON.parse(localStorage.getItem('hfk-checklist') || '{}');
          if (saved[id]) {
            cb.checked = true;
            var label = cb.parentElement;
            label.style.textDecoration = 'line-through';
            label.style.opacity = '0.6';
          }
        } catch (e) { /* ignore */ }
      }
    });
  }

  /* --- Newsletter Form --- */
  function initNewsletter() {
    var form = document.querySelector('.newsletter__form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('.newsletter__input');
      var btn = form.querySelector('.btn');
      if (input && input.value && input.value.includes('@')) {
        var originalText = btn.textContent;
        btn.textContent = '✓';
        btn.style.background = 'var(--green-mid)';
        input.value = '';
        setTimeout(function() {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  /* --- Parallax Effect for Hero --- */
  function initParallax() {
    var heroBg = document.querySelector('.hero__bg img');
    if (!heroBg) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrolled = window.pageYOffset;
          if (scrolled < window.innerHeight) {
            heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px) scale(1.1)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- Language Switcher --- */
  function initLangSwitcher() {
    document.querySelectorAll('.lang-switcher__btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var lang = this.getAttribute('data-lang');
        var currentPath = window.location.pathname;

        // Extract current path after language prefix
        var pathParts = currentPath.split('/').filter(Boolean);
        var currentLang = pathParts[0];
        var supportedLangs = ['en', 'es', 'fr'];

        var remainingPath;
        if (supportedLangs.indexOf(currentLang) !== -1) {
          remainingPath = pathParts.slice(1).join('/');
        } else {
          remainingPath = pathParts.join('/');
        }

        var newPath = '/' + lang + '/';
        if (remainingPath) newPath += remainingPath + '/';

        window.location.href = newPath;
      });
    });
  }

  /* --- Back to Top Button --- */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8593;';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;width:48px;height:48px;border-radius:50%;background:var(--green-mid);color:white;font-size:1.25rem;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);opacity:0;visibility:hidden;transition:all 0.3s ease;z-index:999;cursor:pointer;border:none;';

    document.body.appendChild(btn);

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 600) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      } else {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Level Card Interaction --- */
  function initLevelCards() {
    document.querySelectorAll('.level-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var level = this.getAttribute('data-level');
        if (level) {
          var lang = document.documentElement.lang || 'en';
          window.location.href = '/' + lang + '/trails/?difficulty=' + level;
        }
      });
    });
  }

  /* --- Region Item Interaction --- */
  function initRegionItems() {
    document.querySelectorAll('.region-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var region = this.getAttribute('data-region');
        if (region) {
          var lang = document.documentElement.lang || 'en';
          window.location.href = '/' + lang + '/trails/?region=' + encodeURIComponent(region);
        }
      });
    });
  }

  /* --- Image Lazy Loading --- */
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) return;

    var images = document.querySelectorAll('img[loading="lazy"]');
    if (!images.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });
      images.forEach(function(img) { observer.observe(img); });
    }
  }

  /* --- Initialize Everything --- */
  function init() {
    initScrollAnimations();
    animateCounters();
    initTrailFinder();
    initFavorites();
    initFilters();
    initSmoothScroll();
    initMapPins();
    initChecklists();
    initNewsletter();
    initParallax();
    initLangSwitcher();
    initBackToTop();
    initLevelCards();
    initRegionItems();
    initLazyLoading();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
