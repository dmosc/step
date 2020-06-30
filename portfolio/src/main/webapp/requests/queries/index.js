const GITHUB_REPOS_URL = "https://api.github.com/users/oscardavidrm/repos";
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_LIMIT = 5;
let page = 0;

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

const getComments = async limit => {
    let comments;
    try {
        const payload = await fetch(`/comments?limit=${limit || DEFAULT_LIMIT}`);
        const data = await payload.text();
        comments = JSON.parse(data); // Verify that the payload is in valid format.
    } catch (e) {
        console.log(e);
        return;
    }

    const commentsSectionTitle = document.getElementById("comments-title");
    commentsSectionTitle.innerHTML = `Comments (${comments?.length})`;

    const commentsSection = document.getElementById("comments");
    commentsSection.innerHTML = ""; // Empty previous loaded comments.
    comments.forEach(commentPayload => {
        const commentToAppend = createCommentElement(commentPayload);
        commentsSection.append(commentToAppend);
    });
};

const getProjects = async (page, size) => {
    const data = await fetch(`${GITHUB_REPOS_URL}?page=${page}&per_page=${DEFAULT_PAGE_SIZE}`);
    const payload = await data.text();
    const repos = JSON.parse(payload);

    const projects_section = document.getElementById("projects");
    repos.forEach(repo => {
        const card = document.createElement("div");
        const body = document.createElement("div");
        const title = document.createElement("h6");
        const tags = document.createElement("div");
        const description = document.createElement("p");

        card.onclick = () => window.open(repo.html_url);

        card.classList.add("card");
        body.classList.add("card-body");
        title.classList.add("card-title");
        tags.classList.add("card-subtitle", "list-tags");
        description.classList.add("card-text");

        title.innerHTML = repo.name;
        description.innerHTML = repo.description;

        const language = document.createElement("span");
        const createdAt = document.createElement("span");

        language.innerHTML = repo.language;
        language.classList.add("badge", "badge-success");
        createdAt.innerHTML = new Date(repo.created_at).toLocaleDateString();
        createdAt.classList.add("badge", "badge-secondary");

        tags.appendChild(language);
        tags.appendChild(createdAt);

        body.appendChild(title);
        body.appendChild(tags);
        body.appendChild(description);
        card.appendChild(body);

        projects_section.append(card);
    });
};

const loadMoreProjects =  async () => {
    ++page;
    
    getProjects(page, DEFAULT_PAGE_SIZE);

    const projects = document.getElementById("projects");
    projects.scrollTo({ top: projects.scrollHeight, behavior: "smooth" });
};

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

// Event listeners
const limitComments = document.getElementById("limit-form");
limitComments.addEventListener("submit", async e => {
    e.preventDefault();
    const form = new FormData(limitComments);

    limitComments.reset();

    const payload = {};
    for (var [key, value] of form.entries())
        payload[key] = value;

    getComments(payload.limit);
});