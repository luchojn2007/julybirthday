import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBBP8m0Q5DnhEUJEj3_eSxN2yE2dsFJa3s",
  authDomain: "cumple-july-46c17.firebaseapp.com",
  projectId: "cumple-july-46c17",
  storageBucket: "cumple-july-46c17.firebasestorage.app",
  messagingSenderId: "497698299224",
  appId: "1:497698299224:web:50a86a527666a7cdac992d",
  measurementId: "G-LW5K8CX2Z6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias UI
const loader = document.getElementById("loader");
const revealItems = document.querySelectorAll(".reveal");
const giftList = document.getElementById("giftList");
const giftStatus = document.getElementById("giftStatus");

// Fecha del evento
const targetDate = new Date("2026-03-22T13:30:00-05:00").getTime();

function hideLoader() {
  if (!loader) return;
  loader.classList.add("is-hidden");
  setTimeout(() => {
    if (loader.parentNode) loader.remove();
  }, 500);
}

function animateIntro() {
  try {
    if (window.gsap) {
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      gsap.from(".hero__inner > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out"
      });

      revealItems.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%"
            }
          }
        );
      });
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  } catch (error) {
    console.error("Error en animaciones:", error);
  }
}

function updateCountdown() {
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  if (!days || !hours || !minutes || !seconds) return;

  const now = Date.now();
  const distance = targetDate - now;

  if (distance <= 0) {
    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";
    return;
  }

  const dayValue = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hourValue = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minuteValue = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secondValue = Math.floor((distance % (1000 * 60)) / 1000);

  days.textContent = String(dayValue).padStart(2, "0");
  hours.textContent = String(hourValue).padStart(2, "0");
  minutes.textContent = String(minuteValue).padStart(2, "0");
  seconds.textContent = String(secondValue).padStart(2, "0");
}

async function reservarGift(giftId) {
  const nombre = prompt("Escribe tu nombre para reservar este regalo:");
  if (!nombre || !nombre.trim()) return;

  const giftRef = doc(db, "gifts", giftId);

  try {
    await runTransaction(db, async (transaction) => {
      const giftDoc = await transaction.get(giftRef);

      if (!giftDoc.exists()) {
        throw new Error("El regalo ya no existe.");
      }

      const data = giftDoc.data();
      const cuposTotales = Number(data.cupos_totales || 0);
      const cuposReservados = Number(data.cupos_reservados || 0);
      const reservas = Array.isArray(data.reservas) ? [...data.reservas] : [];

      if (cuposReservados >= cuposTotales) {
        throw new Error("Este regalo ya no tiene cupos disponibles.");
      }

      reservas.push(nombre.trim());

      transaction.update(giftRef, {
        cupos_reservados: cuposReservados + 1,
        reservas: reservas
      });
    });

    await loadGifts();
    alert("Reserva realizada con éxito.");
  } catch (error) {
    console.error("Error al reservar:", error);
    alert(error.message || "No se pudo completar la reserva.");
  }
}

async function loadGifts() {
  if (!giftList) return;

  try {
    const querySnapshot = await getDocs(collection(db, "gifts"));
    giftList.innerHTML = "";

    let disponibles = 0;
    let total = 0;

    querySnapshot.forEach((docSnap) => {
      total += 1;
      const data = docSnap.data();

      const cuposTotales = Number(data.cupos_totales || 0);
      const cuposReservados = Number(data.cupos_reservados || 0);
      const cuposRestantes = Math.max(cuposTotales - cuposReservados, 0);
      const estaDisponible = cuposRestantes > 0;

      if (estaDisponible) disponibles += 1;

      const div = document.createElement("div");
      div.className = "gift-card";

      const reservasTexto =
        Array.isArray(data.reservas) && data.reservas.length
          ? data.reservas.join(", ")
          : "Aún no reservado";

      div.innerHTML = `
        <h3>${data.nombre || "Regalo"}</h3>
        <p class="gift-card__quota">${cuposReservados} de ${cuposTotales} reservados</p>
        <p class="gift-card__remaining">
          ${estaDisponible ? `Quedan ${cuposRestantes} cupo(s)` : "Sin cupos disponibles"}
        </p>
        <p class="gift-card__people"><strong>Reservado por:</strong> ${reservasTexto}</p>
        <button class="gift-card__btn" ${estaDisponible ? "" : "disabled"}>
          ${estaDisponible ? "Reservar" : "Completo"}
        </button>
      `;

      const btn = div.querySelector(".gift-card__btn");
      if (btn && estaDisponible) {
        btn.addEventListener("click", () => reservarGift(docSnap.id));
      }

      giftList.appendChild(div);
    });

    if (giftStatus) {
      if (total === 0) {
        giftStatus.textContent = "Aún no hay regalos configurados.";
      } else if (disponibles > 0) {
        giftStatus.textContent = "Elige una opción disponible para reservar tu regalo.";
      } else {
        giftStatus.textContent =
          "Todos los regalos ya fueron reservados. Puedes escribirnos por WhatsApp para coordinar otra opción.";
      }
    }
  } catch (error) {
    console.error("Error cargando regalos:", error);
    if (giftStatus) {
      giftStatus.textContent = "No se pudo cargar la lista de regalos en este momento.";
    }
  }
}

// Inicio seguro
window.addEventListener("load", async () => {
  try {
    animateIntro();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    await loadGifts();
  } catch (error) {
    console.error("Error general al iniciar:", error);
  } finally {
    hideLoader();
  }
});