mapboxgl.accessToken = 'pk.eyJ1IjoiYXdlc29tZWd1eWUiLCJhIjoiY21oc2hvcWg3MWxpYzJrb2g1N3YxYnU3OCJ9.3bb1XsS_5H_L3hZ5DL5T8Q'; // replace this with your real token

// Initialize map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-122.33, 47.6], // Seattle
  zoom: 10
});

// The month you want to display (change later for slider)
const dateKey = "6/30/2024"; // must match one of your CSV date columns

map.on('load', () => {
  fetch('data/seattle_housing_prices.geojson')
    .then(res => res.json())
    .then(data => {
      map.addSource('housing', {
        type: 'geojson',
        data: data
      });

      // Define color scale (adjust thresholds to fit your price range)
      map.addLayer({
        id: 'housing-layer',
        type: 'fill',
        source: 'housing',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', dateKey],
            300000, '#f7fcf0',
            600000, '#ccebc5',
            900000, '#7bccc4',
            1200000, '#2b8cbe',
            1500000, '#084081'
          ],
          'fill-opacity': 0.8,
          'fill-outline-color': '#ffffff'
        }
      });

      // Popup on hover
      map.on('mousemove', 'housing-layer', (e) => {
        const feature = e.features[0];
        const name = feature.properties.neighborhood;
        const price = feature.properties[dateKey];
        const popupHTML = `<strong>${name}</strong><br>Average Price: $${Math.round(price).toLocaleString()}`;
        
        new mapboxgl.Popup({ closeButton: false })
          .setLngLat(e.lngLat)
          .setHTML(popupHTML)
          .addTo(map);
      });

      // Change cursor on hover
      map.on('mouseenter', 'housing-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'housing-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    });
});
