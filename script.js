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

      /* --- Carrusel: solo si existe en la página --- */
      if (prevBtn && nextBtn && slides.length) {
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
        if (hero) {
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
        }

        /* --- Arranque carrusel --- */
        init();
        startAuto();
      }

/* --- Login + FETCH --- */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      alert('Por favor completá todos los campos.');
      return;
    }

    try {
      const res = await fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const json = await res.json();
      
      if (json.ok) {
        alert(json.message);  // "Login exitoso"
        window.location.href = 'dashboard.php';  // o donde quieras
      } else {
        alert(json.errors?.join('\n') || json.error || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red');
    }
  });
}

/* --- Validación registro + FETCH --- */
function initRegistroForm() {
  const regForm = document.getElementById('registroForm');
  console.log('🔍 Buscando formulario registroForm:', regForm);
  if (!regForm) {
    console.warn('❌ Formulario NO encontrado en DOM');
    return;
  }
  console.log('✅ Formulario encontrado, adjuntando event listener');
  regForm.addEventListener('submit', async e => {
    console.log('🎯 SUBMIT EVENT DISPARADO');
    e.preventDefault();
    const data = Object.fromEntries(new FormData(regForm).entries());
    
    // DEBUG: ver qué se envía
    console.log('📤 Enviando registro:', data);
    
    // Validación rápida cliente (UX)
    if (!data.nombre || !data.apellido || !data.email || !data.telefono || !data.password || !data.password2 || !data.tipo_usuario) {
      console.warn('❌ Validación falló - campos vacíos:', { nombre: !!data.nombre, apellido: !!data.apellido, email: !!data.email, telefono: !!data.telefono, password: !!data.password, password2: !!data.password2, tipo_usuario: !!data.tipo_usuario });
      alert('Completá todos los campos (incluí "Tipo de cuenta").');
      return;
    }
    if (data.password !== data.password2) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    if (data.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Enviar al backend
    try {
      const res = await fetch('registro.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'  // importante para cookies de sesión
      });
      const json = await res.json();
      console.log('📥 Respuesta servidor:', json);
      
      if (json.ok) {
        alert(json.message);  // "Registro exitoso"
        window.location.href = 'login_ferreteria.html';  // redirigir a login
      } else {
        alert(json.errors?.join('\n') || json.error || 'Error en el registro');
      }
    } catch (err) {
      console.error('💥 Error fetch:', err);
      alert('Error de red');
    }
  });
}

      /* --- Arranque --- */
      initRegistroForm();

    })();