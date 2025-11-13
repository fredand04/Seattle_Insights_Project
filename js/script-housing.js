mapboxgl.accessToken = 'pk.eyJ1IjoiYXdlc29tZWd1eWUiLCJhIjoiY21oc2hvcWg3MWxpYzJrb2g1N3YxYnU3OCJ9.3bb1XsS_5H_L3hZ5DL5T8Q'; // Replace with your token

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-122.33, 47.6], // Seattle
  zoom: 10
});

// Variables to hold data and keys
let housingData;
let dateKeys = [];

// Load GeoJSON after the map has loaded
map.on('load', () => {
  fetch('data/seattle_housing_prices.geojson')
    .then(res => res.json())
    .then(data => {
      housingData = data;

      // Extract all date columns (format MM/DD/YYYY)
      const props = data.features[0].properties;
      dateKeys = Object.keys(props).filter(k => k.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/));

      // Initialize slider with all months
      setupSlider();

      // Add the initial layer using the first date
      addHousingLayer(dateKeys[0]);
    });
});

// --- Function to add or refresh the housing layer ---
function addHousingLayer(dateKey) {
  // Remove layer and source if already exists
  if (map.getLayer('housing-layer')) {
    map.removeLayer('housing-layer');
    map.removeSource('housing');
  }

  // Add GeoJSON source
  map.addSource('housing', { type: 'geojson', data: housingData });

  // Add fill layer with safe null handling
  map.addLayer({
    id: 'housing-layer',
    type: 'fill',
    source: 'housing',
    paint: {
      'fill-color': [
        'case',
        ['any',
          ['==', ['get', dateKey], null],
          ['!', ['has', dateKey]],
          ['==', ['get', dateKey], 0]
        ],
        '#d9d9d9', // fallback gray for missing/null
        ['interpolate',
          ['linear'],
          ['get', dateKey],
          300000, '#f7fcf0',
          600000, '#ccebc5',
          900000, '#7bccc4',
          1200000, '#2b8cbe',
          1500000, '#084081'
        ]
      ],

      'fill-opacity': 0.8,
      'fill-outline-color': '#ffffff'
    }
  });

  // Create a single popup instance (reuse it)
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // Mouse hover
  map.on('mousemove', 'housing-layer', (e) => {
    const feature = e.features[0];
    const name = feature.properties.neighborhood || 'Unknown';
    const price = feature.properties[dateKeys[document.getElementById('month-slider').value]] || 0;

    // Set popup content and location
    popup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${name}</strong><br>Average Price: $${price.toLocaleString()}`)
      .addTo(map);
  });

  // Remove popup when mouse leaves layer
  map.on('mouseleave', 'housing-layer', () => {
    popup.remove();
    map.getCanvas().style.cursor = '';
  });

  // Change cursor on hover
  map.on('mouseenter', 'housing-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });


  // Cursor change on hover
  map.on('mouseenter', 'housing-layer', () => map.getCanvas().style.cursor = 'pointer');
  map.on('mouseleave', 'housing-layer', () => map.getCanvas().style.cursor = '');
}

// --- Timeline Slider Setup ---
function setupSlider() {
  const slider = document.getElementById('month-slider');
  const currentDate = document.getElementById('current-date');

  slider.max = dateKeys.length - 1;
  slider.value = dateKeys.length - 1; // start at most recent
  currentDate.textContent = dateKeys[slider.value];

  slider.addEventListener('input', (e) => {
    const index = e.target.value;
    const dateKey = dateKeys[index];
    currentDate.textContent = dateKey;
    updateMap(dateKey);
  });
}

// --- Update Map Colors Dynamically ---
function updateMap(dateKey) {
  if (!map.getLayer('housing-layer')) return;

  map.setPaintProperty('housing-layer', 'fill-color', [
    'case',
    ['any',
      ['==', ['get', dateKey], null],   // null value
      ['!', ['has', dateKey]],          // property missing
      ['==', ['get', dateKey], 0]       // zero value
    ],
    '#d9d9d9', // gray for missing data
    ['interpolate',
      ['linear'],
      ['get', dateKey],
      300000, '#f7fcf0',
      600000, '#ccebc5',
      900000, '#7bccc4',
      1200000, '#2b8cbe',
      1500000, '#084081'
    ]
  ]);
}


// --- Legend Popup Toggle ---
const legendToggle = document.getElementById('legend-toggle');
const legendPopup = document.getElementById('legend-popup');
const legendClose = document.getElementById('legend-close');

legendToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  legendPopup.classList.toggle('show');
});

legendClose.addEventListener('click', (e) => {
  e.stopPropagation();
  legendPopup.classList.remove('show');
});

document.addEventListener('click', (e) => {
  const isClickInside =
    legendPopup.contains(e.target) || legendToggle.contains(e.target);
  if (!isClickInside) {
    legendPopup.classList.remove('show');
  }
});