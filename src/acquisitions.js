import Chart from 'chart.js/auto';

async function fetchSensorData() {
  const res = await fetch('http://localhost:3000/api/suhu');
  const json = await res.json();
  return json.data;
}

(async function () {
  const data = await fetchSensorData();

  const labels = data.map((row, index) => `Data ${data.length - index}`);
  const temperatureData = data.map(row => row.temperature);
  const humidityData = data.map(row => row.humidity);

  new Chart(document.getElementById('acquisitions'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatureData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.2
        },
        {
          label: 'Humidity (%)',
          data: humidityData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
})();
