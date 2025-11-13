// Replace this with your own token from your Mapbox account
mapboxgl.accessToken = 'pk.eyJ1IjoiYXdlc29tZWd1eWUiLCJhIjoiY21oc2hvcWg3MWxpYzJrb2g1N3YxYnU3OCJ9.3bb1XsS_5H_L3hZ5DL5T8Q';

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // map style
    center: [-98.5795, 39.8283], // [lng, lat] — center of the US
    zoom: 3 // initial zoom level
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

// Add a test marker (San Francisco)
new mapboxgl.Marker({ color: 'red' })
    .setLngLat([-122.4194, 37.7749])
    .setPopup(new mapboxgl.Popup().setHTML("<b>San Francisco</b><br>Example marker."))
    .addTo(map);
