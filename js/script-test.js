// Replace with your own Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYXdlc29tZWd1eWUiLCJhIjoiY21oc2hvcWg3MWxpYzJrb2g1N3YxYnU3OCJ9.3bb1XsS_5H_L3hZ5DL5T8Q';

// Initialize Mapbox map
const map = new mapboxgl.Map({
  container: 'map', // Div ID
  style: 'mapbox://styles/mapbox/streets-v12', // Map style
  center: [-122.33, 47.6], // Seattle [lng, lat]
  zoom: 10 // Zoom level
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());
