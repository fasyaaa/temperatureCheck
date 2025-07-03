let currentIndex = 0;
let slider = null;

document.addEventListener("DOMContentLoaded", () => {
  slider = document.getElementById("chartSlider");

  fetch("/api/suhu")
    .then((res) => res.json())
    .then((res) => {
      if (!res.status || res.data.length === 0) return;

      const rows = res.data.slice(0, 7).reverse();
      const labels = rows.map((r) =>
        r.waktu ? new Date(r.waktu).toLocaleTimeString() : ""
      );
      const temps = rows.map((r) => r.temperature);
      const hums = rows.map((r) => r.humidity);

      const latest = rows[rows.length - 1];
      document.getElementById("temperatureValue").textContent = `${latest.temperature}°C`;
      document.getElementById("humidityValue").textContent = `${latest.humidity}%`;

      const waktu = new Date(latest.waktu);
      const formattedTime = waktu.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const timestampEl = document.getElementById("timestampValue");
      if (timestampEl) {
        timestampEl.textContent = formattedTime;
      }

      checkCondition(latest.temperature, latest.humidity); // Trigger alert

      // Suhu Chart
      const ctx1 = document.getElementById("chartSuhu").getContext("2d");
      new Chart(ctx1, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Suhu (°C)",
              data: temps,
              borderColor: "rgb(216, 99, 255)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: "Waktu" } },
            y: { title: { display: true, text: "Suhu (°C)" } },
          },
        },
      });

      // Kelembapan Chart
      const ctx2 = document.getElementById("chartHumidity").getContext("2d");
      new Chart(ctx2, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Kelembapan (%)",
              data: hums,
              borderColor: "rgb(54, 235, 166)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: "Waktu" } },
            y: { title: { display: true, text: "Kelembapan (%)" } },
          },
        },
      });
    })
    .catch((err) => console.error("Error:", err));

  // Tombol ❮ ❯
  document.getElementById("prevChart").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });

  document.getElementById("nextChart").addEventListener("click", () => {
    if (currentIndex < 1) {
      currentIndex++;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });

  // Swipe support
  let startX = 0;
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 50) {
      if (diff < 0 && currentIndex < 1) currentIndex++;
      if (diff > 0 && currentIndex > 0) currentIndex--;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });
});

// Alert kondisi berbahaya
function checkCondition(temp, humidity) {
  let isDanger = false;
  let message = "";

  if (temp < 24 || temp > 30) {
    message += `Suhu saat ini (${temp}°C) di luar batas ideal (24°C – 30°C). `;
    isDanger = true;
  }

  if (humidity < 50 || humidity > 70) {
    message += `Kelembapan saat ini (${humidity}%) di luar batas ideal (50% – 70%).`;
    isDanger = true;
  }

  const weatherBox = document.querySelector(".weather-box");

  if (isDanger) {
    weatherBox.classList.add("danger");
    showToast(message);
    showAlert("SUHU TIDAK NORMAL 😛");
  } else {
    weatherBox.classList.remove("danger");
  }
}

// Toast
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

// Modal Alert
function showAlert(message) {
  const modal = document.getElementById("alertModal");
  const alertMessage = document.getElementById("alertMessage");
  const closeBtn = document.getElementById("alertClose");

  alertMessage.textContent = message;
  modal.style.display = "block";

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
}
