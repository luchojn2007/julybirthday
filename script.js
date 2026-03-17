(function () {
  const loader = document.getElementById('loader');
  const confirmBtn = document.getElementById('confirmarBtn');
  const revealItems = document.querySelectorAll('.reveal');
  const targetDate = new Date('2026-03-22T13:30:00-05:00').getTime();

  function hideLoader() {
    if (!loader) return;
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 500);
  }

  function animateIntro() {
    if (window.gsap) {
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      gsap.from('.hero__inner > *', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out'
      });

      revealItems.forEach((item) => {
        gsap.to(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 88%'
          },
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out'
        });
      });
    } else {
      revealItems.forEach((item, index) => {
        setTimeout(() => item.classList.add('is-visible'), 120 * index);
      });
    }
  }

  function updateCountdown() {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    if (!days || !hours || !minutes || !seconds) return;

    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      days.textContent = '00';
      hours.textContent = '00';
      minutes.textContent = '00';
      seconds.textContent = '00';
      return;
    }

    const dayValue = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hourValue = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minuteValue = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secondValue = Math.floor((distance % (1000 * 60)) / 1000);

    days.textContent = String(dayValue).padStart(2, '0');
    hours.textContent = String(hourValue).padStart(2, '0');
    minutes.textContent = String(minuteValue).padStart(2, '0');
    seconds.textContent = String(secondValue).padStart(2, '0');
  }

  function launchCelebration() {
    if (window.confetti) {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      window.open(
        'https://wa.me/593987375196?text=%C2%A1Hola!%20Confirmo%20mi%20asistencia%20a%20la%20Expedici%C3%B3n%20de%20Juli%C3%A1n%20Rex%20%F0%9F%A6%96',
        '_blank',
        'noopener'
      );
    }, 700);
  }

  window.addEventListener('load', () => {
    hideLoader();
    animateIntro();
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', launchCelebration);
  }
})();
