document.addEventListener("DOMContentLoaded", () => {
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
      document.getElementById(
        "temperatureValue"
      ).textContent = `${latest.temperature}°C`;
      document.getElementById(
        "humidityValue"
      ).textContent = `${latest.humidity}%`;
      const waktu = new Date(latest.waktu);
      const formattedTime = waktu.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      document.getElementById("timestampValue").textContent = formattedTime;

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
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
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
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
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
});

// Custom alert
function checkCondition(temp, humidity) {
  let message = "";

  if (temp < 24 || temp > 30) {
    message += `Suhu saat ini (${temp}°C) di luar batas ideal (24°C – 30°C). `;
  }

  if (humidity < 50 || humidity > 70) {
    message += `Kelembapan saat ini (${humidity}%) di luar batas ideal (50% – 70%).`;
  }

  if (message) {
    showToast(message);
  }
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}
