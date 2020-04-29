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

export default places;
