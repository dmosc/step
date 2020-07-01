const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];

const loadMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 25.655022, lng: -100.274593 },
        zoom: 13,
        styles: [...mapStyles]
    });

    const places = [
        {
            location: 'TEC de Monterrey Campus Monterrey, Avenida Eugenio Garza Sada Sur, Tecnológico, Monterrey, Nuevo León',
            title: 'My University'
        },
        {
            location: 'Nuevo Sur, Avenida Revolución, Ladrillera, Monterrey, N.L.',
            title: 'Where I live'
        },
        {
            location: 'Mun’s Kitchen (A.K.A Tec Kogi Box), Alta Alta Vista, Monterrey, N.L.',
            title: 'Favorite ramen'
        },
        {
            location: 'Sport City, Avenida Revolución, Ladrillera, Monterrey, N.L.',
            title: 'Where I exercise'
        }
    ];

    const placesService = new google.maps.places.PlacesService(map);
    for (const i in places) {
        const { location, title } = places[i];
        const query = { query: location, fields: ['geometry'] };

        placesService.findPlaceFromQuery(query, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                const [{ geometry: { location } }] = results;
                const position = new google.maps.LatLng(location.lat(), location.lng());
                const marker = new google.maps.Marker({ position, title });

                marker.addListener('click', () => {
                    marker.setAnimation(marker.getAnimation() ? null : marker.setAnimation(google.maps.Animation.BOUNCE));
                });
                marker.setMap(map);
            }
        });
    }
};