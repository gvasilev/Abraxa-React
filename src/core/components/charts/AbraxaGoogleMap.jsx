// Uses https://developers.google.com/maps/documentation/javascript/advanced-markers/html-markers
// In order to show map, set the Google Maps API key as GMAP_API_KEY: xxxxx in env.js
// (More info on api key here: https://developers.google.com/maps/documentation/javascript/get-api-key)

Ext.define('Abraxa.core.components.charts.AbraxaGoogleMap', {
    extend: 'Ext.Container',
    xtype: 'AbraxaGoogleMap',
    alias: 'widget.AbraxaGoogleMap',
    cls: 'a-google-map',
    flex: 1,
    googleMapInstance: null,
    mapConfig: {
        // Set Varna as center
        center: {
            lat: 43.1982,
            lng: 27.7923,
        },
        zoom: 1,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        //Set mapId in order to use AdvancedMarkerElement
        mapId: 'google-map-' + new Date().getTime(),
    },
});
