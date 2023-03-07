mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: lngLat, // starting position [lng, lat]
    zoom: 7, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(lngLat)
    .addTo(map);