document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/suhu")
    .then(res => res.json())
    .then(res => {
      if (!res.status || res.data.length === 0) return;

      const rows = res.data.slice(0, 7).reverse();

      const labels = rows.map(r =>
        r.created_at ? new Date(r.created_at).toLocaleTimeString() : ''
      );
      const temps = rows.map(r => r.temperature);
      const hums = rows.map(r => r.humidity);

      const latest = rows[rows.length - 1];
      document.getElementById("temperatureValue").textContent = `${latest.temperature}°C`;
      document.getElementById("humidityValue").textContent = `${latest.humidity}%`;
      document.getElementById("timestampValue").textContent = new Date(latest.created_at).toLocaleString();

      // Chart Suhu
      const ctx1 = document.getElementById("chartSuhu").getContext("2d");
      new Chart(ctx1, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Temperature (°C)",
            data: temps,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
            tension: 0.3,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: "Waktu" }},
            y: { title: { display: true, text: "Suhu (°C)" }}
          }
        }
      });

      // Chart Kelembaban
      const ctx2 = document.getElementById("chartHumidity").getContext("2d");
      new Chart(ctx2, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Humidity (%)",
            data: hums,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
            tension: 0.3,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: "Waktu" }},
            y: { title: { display: true, text: "Kelembaban (%)" }}
          }
        }
      });
    })
    .catch(err => console.error("Error:", err));
});
