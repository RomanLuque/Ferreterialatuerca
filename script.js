    (() => {
      /* --- Estado del carrusel --- */
      const state = {
        current: 0,
        total: 3,
        autoInterval: null,
        AUTO_DELAY: 4500,
      };

      /* --- Referencias al DOM --- */
      const slides  = document.querySelectorAll('.slide');
      const dots    = document.querySelectorAll('.dot');
      const prevBtn = document.getElementById('prev');
      const nextBtn = document.getElementById('next');

      /* --- Utilidad: ir a un slide específico --- */
      function goTo(index) {
        // Normalizar índice circular
        state.current = (index + state.total) % state.total;

        // Mover todos los slides con transform
        slides.forEach((slide, i) => {
          slide.style.transform = `translateX(${(i - state.current) * 100}%)`;
        });

        // Actualizar dots / aria
        dots.forEach((dot, i) => {
          const active = i === state.current;
          dot.classList.toggle('active', active);
          dot.setAttribute('aria-selected', active);
        });
      }

      /* --- Inicializar posiciones --- */
      function init() {
        slides.forEach((slide, i) => {
          slide.style.transform = `translateX(${i * 100}%)`;
        });
        goTo(0);
      }

      /* --- Autoplay --- */
      function startAuto() {
        state.autoInterval = setInterval(() => goTo(state.current + 1), state.AUTO_DELAY);
      }

      function resetAuto() {
        clearInterval(state.autoInterval);
        startAuto();
      }

      /* --- Event listeners --- */
      prevBtn.addEventListener('click', () => { goTo(state.current - 1); resetAuto(); });
      nextBtn.addEventListener('click', () => { goTo(state.current + 1); resetAuto(); });

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          goTo(parseInt(dot.dataset.index, 10));
          resetAuto();
        });
      });

      /* --- Pausa al hover (accesibilidad) --- */
      const hero = document.querySelector('.hero');
      hero.addEventListener('mouseenter', () => clearInterval(state.autoInterval));
      hero.addEventListener('mouseleave', startAuto);

      /* --- Swipe táctil --- */
      let touchStartX = 0;
      hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      hero.addEventListener('touchend', e => {
        const delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) {
          goTo(state.current + (delta > 0 ? 1 : -1));
          resetAuto();
        }
      }, { passive: true });

      /* --- Validación mínima del formulario --- */
      document.getElementById('loginForm').addEventListener('submit', e => {
        e.preventDefault();
        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        if (!email || !password) {
          alert('Por favor completá todos los campos.');
          return;
        }
        alert(`Accediendo como: ${email}`);
      });

      /* --- Arranque --- */
      init();
      startAuto();

    })();