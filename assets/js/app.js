document.addEventListener('DOMContentLoaded', function () {
  const map = L.map('map').setView([51.505, -0.09], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  async function getRoute(from, to) {
    const response = await axios.get(`${process.env.OTP_API_URL}/plan`, {
      params: {
        fromPlace: from,
        toPlace: to,
        mode: 'TRANSIT,WALK',
        numItineraries: 1
      }
    });
    return response.data;
  }

  async function plotRoute(from, to) {
    const route = await getRoute(from, to);
    const waypoints = route.plan.itineraries[0].legs.map(leg => {
      return [leg.from.lat, leg.from.lon];
    });

    const polyline = L.polyline(waypoints, {color: 'blue'}).addTo(map);
    map.fitBounds(polyline.getBounds());
  }

  plotRoute('60.169,24.939', '60.192,24.945'); // Example coordinates for Helsinki
});
