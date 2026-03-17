gsap.registerPlugin(ScrollTrigger);

// Seguimiento del Cursor de Lupa
const cursor = document.querySelector('#custom-cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

window.addEventListener('load', () => {
    // Quitar Loader
    gsap.to("#loader", { duration: 0.8, opacity: 0, display: "none" });

    // Animación de entrada secuencial
    const tl = gsap.timeline();
    tl.from(".hero-content > *", { y: 50, opacity: 0, stagger: 0.3, duration: 1 })
      .from("#foto-julian", { scale: 0.5, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.5");

    // Animación de la Card al bajar
    gsap.from("#mision-card", {
        scrollTrigger: { trigger: "#mision-card", start: "top 90%" },
        y: 80, opacity: 0, duration: 1.2, ease: "power4.out"
    });
});

// Lluvia de Dinosaurios y WhatsApp
function lanzarLluvia() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2d5a27', '#ff8c00', '#ffffff']
    });

    // Cambia este número por tu WhatsApp real (ejemplo para Ecuador)
    const miNumero = "593987375196"; 
    const mensaje = encodeURIComponent("¡Hola! Confirmo mi asistencia a la Expedición de Julián REX 🦖. ¡Estamos listos!");

    setTimeout(() => {
        window.open(`https://wa.me/${miNumero}?text=${mensaje}`, '_blank');
    }, 2000);
}