Ext.define('Abraxa.view.directory.agents.AgentsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.AgentsController',

    bindings: {
        getGoogleMapMarkers: '{googleMapMarkers}',
    },

    getGoogleMapMarkers: function (googleMapMarkers) {
        return googleMapMarkers;
    },

    customMarkerClick: function (portId) {
        if (portId) {
            Abraxa.getApplication().getController('AbraxaController').showPortDialogById(portId);
        }
    },
    customMarkerMouseOver: function (map, marker, title) {
        if (!marker.infoWindow) {
            marker.infoWindow = new google.maps.InfoWindow({
                content: title,
            });
        }

        marker.infoWindow.open(map, marker);
    },
    customMarkerMouseOut: function (marker) {
        var infoWindow = marker.infoWindow;
        if (infoWindow) {
            infoWindow.close();
        }
    },
});
