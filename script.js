if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

const places = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    37.6115732,
                    55.7694016
                ]
            },
            properties: {
                title: 'Клиника Петровские Ворота',
                address: 'г. Москва, 2-й Колобовский пер., 4',
                siteFormatted: 'www.myendo.ru',
                site: 'http://myendo.ru/'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    37.6125732,
                    55.7684016
                ]
            },
            properties: {
                title: '2 Клиника Петровские Ворота',
                address: '2 г. Москва, 2-й Колобовский пер., 4',
                siteFormatted: 'www.myendo.ru',
                site: 'http://myendo.ru/'
            }
        }
    ]
};

mapboxgl.accessToken = 'pk.eyJ1Ijoib3NvcmluYSIsImEiOiJjanMyeXVkaXYwNmp4NDNteXE2MHJ2cDg5In0.fo9raJlKCuYINaQnnkzN_A';

const map = new mapboxgl.Map({
    container: 'map-inner',
    // style: 'mapbox://styles/mapbox/streets-v10',
    style: 'mapbox://styles/osorina/cjs4885tz08e01fo4tqqyuilp',
    center: [37.6115732, 55.7694016],
    zoom: 16,
    scrollZoom: false
});

const loader = document.querySelector('.map_loader');

map.on('load', (e) => {
    loader.classList.add('leave-fade');
    setTimeout(() => {
        loader.classList.add('leave-leave');
    }, 500);
    map
        .addSource('places', {
            type: 'geojson',
            data: places
        })
        .addControl(new MapboxLanguage({ defaultLanguage: 'ru' }))
        .addControl(new mapboxgl.NavigationControl())
        .addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));
    buildLocationList(places);
});


places.features.forEach((marker, i) => {
    const el = document.createElement('div');

    el.id = `marker-${ i}`;
    el.className = 'marker';

    new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

    el.addEventListener('click', (e) => {
        flyToStore(marker);
        createPopUp(marker);
        const activeItem = document.getElementsByClassName('is-active');
        e.stopPropagation();
        if (activeItem[0]) {
            activeItem[0].classList.remove('is-active');
        }
        const listItem = document.getElementById(`map-li-${ i}`);
        listItem.classList.add('is-active');
    });
});

function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 17
    });
}

function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');

    if (popUps[0]) {
        popUps[0].remove();
    }

    const popup = new mapboxgl.Popup({ anchor: 'bottom', closeOnClick: false, closeButton: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(`<div class="baloon-title">${ currentFeature.properties.title }</div>`
            + `<div class="baloon-subtitle">${ currentFeature.properties.address }</div>`
            + `<a href="${currentFeature.properties.site}" target="_blank">${currentFeature.properties.siteFormatted}</a>`)
        .addTo(map);
}


function buildLocationList(data) {
    for (i = 0; i < data.features.length; i++) {
        const currentFeature = data.features[i];
        const prop = currentFeature.properties;

        const placeList = document.querySelector('.map_list');
        const listing = placeList.appendChild(document.createElement('div'));

        listing.className = 'map_li';
        listing.id = `map-li-${ i}`;

        const link = listing.appendChild(document.createElement('a'));

        link.href = '#';
        link.className = 'map_linkTo';
        link.dataPosition = i;

        const details = listing.appendChild(document.createElement('div'));

        details.className = 'map_liDetails';
        details.innerHTML = `<div class="map_liTitle">${prop.title}</div> <p>${prop.address}</p>`;

        if (prop.site) {
            const site = listing.appendChild(document.createElement('a'));

            site.href = prop.site;
            site.target = '_blank';
            site.innerHTML = prop.siteFormatted;
            // details.innerHTML += `<a href="${prop.site}" target="_blank">${prop.siteFormatted}</a>`;
        }

        link.addEventListener('click', function (e) {
            const clickedListing = data.features[this.dataPosition];

            flyToStore(clickedListing);
            createPopUp(clickedListing);

            const activeItem = document.getElementsByClassName('is-active');

            if (activeItem[0]) {
                activeItem[0].classList.remove('is-active');
            }
            this.parentNode.classList.add('is-active');
        });
    }
}

window.addEventListener('resize', () => {
    map.resize();
});
