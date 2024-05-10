Ext.define('Abraxa.view.map.ShipPositionDialog', {
    extend: 'Ext.Dialog',

    xtype: 'map.ship-position-dialog',
    itemId: 'shipPositionDialog',
    title: '',
    ui: 'dialog-xl',
    minHeight: '80%',
    bodyPadding: 0,
    manageBorders: false,

    closable: true,
    maximizable: false,
    html: '',

    config: {
        imo: undefined,
        vesselName: undefined,
    },

    initialize: function () {
        var me = this;
        me.show();
        var imo = me.config.imo;
        var vessel_name = me.config.vesselName;
        me.setTitle('Ship position: <span style="text-transform: uppercase;">' + vessel_name + '</span> (' + imo + ')');

        var dialogTitle =
            'Ship position: <span style="text-transform: uppercase;">' + vessel_name + '</span> (' + imo + ')';
        var dialogTitleRemainingCredits = '';
        var id = me.bodyElement.dom;

        // Map initialization
        mapboxgl.accessToken =
            'pk.eyJ1IjoiYWJyYXhhIiwiYSI6ImNsMGxieGEweDBmdHIzY3BlcWczcmYwaTUifQ.7qW1R8BuuKapfBr1JXv3ZA';
        var map = new mapboxgl.Map({
            container: id,
            style: 'mapbox://styles/thedarkd/cjdu6w9mm4xke2rqcna0rkysr',
            zoom: 3.2,
            center: [14.73389, 47.033165],
        });
        //map.addControl(new mapboxgl.NavigationControl());

        map.on('load', function () {
            try {
                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'vessel/position/' + imo + '?credits=1',
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                    },
                    method: 'GET',

                    success: function (response, opts) {
                        var data = JSON.parse(response.responseText);
                        var remaining_credits = parseInt(data.remaining_credits);
                        dialogTitleRemainingCredits =
                            '<span id="remaining-ais-credits" style="right: 15px;position: absolute;">(remaining credits ' +
                            remaining_credits +
                            ')</span>';
                        me.setTitle(dialogTitle + dialogTitleRemainingCredits);

                        if (remaining_credits > 0) {
                            if (data.success) {
                                let ship = data.vessel_data;

                                if (ship === undefined) {
                                    Ext.Msg.alert('Message', 'Vessel not found!');
                                    return false;
                                }

                                if (parseFloat(ship.current_speed) < 0.5) {
                                    map.loadImage('resources/map/icon-vessel-blue-stop.png', function (error, image) {
                                        if (error) throw error;

                                        var layerName = 'myfleet-' + ship.imo;
                                        var point = {
                                            type: 'FeatureCollection',
                                            features: [
                                                {
                                                    type: 'Feature',
                                                    properties: {
                                                        'marker-color': '#7e7e7e',
                                                        'marker-size': 'medium',
                                                        'marker-symbol': '',
                                                        imo: ship.imo,
                                                        name: vessel_name,
                                                        ship: ship,
                                                    },
                                                    geometry: {
                                                        type: 'Point',
                                                        coordinates: [ship.longitude, ship.latitude],
                                                    },
                                                },
                                            ],
                                        };
                                        if (map.getSource(layerName) == null) {
                                            map.addSource(layerName, {
                                                type: 'geojson',
                                                data: point,
                                            });
                                        }

                                        try {
                                            map.addImage(layerName, image);
                                        } catch (e) {}

                                        map.addLayer({
                                            id: layerName,
                                            type: 'symbol',
                                            source: layerName,
                                            layout: {
                                                'icon-allow-overlap': true,
                                                'text-allow-overlap': true,
                                                'icon-anchor': 'center',
                                                'text-anchor': 'left',
                                                'text-font': ['Ubuntu Bold'],
                                                'text-letter-spacing': 0.155,
                                                'text-transform': 'uppercase',
                                                'text-size': 14,
                                                'text-offset': [1.4, 0],
                                                //'text-field': '{name}',
                                                'icon-image': layerName,
                                                'icon-size': 1,
                                                'icon-rotation-alignment': 'map',
                                            },
                                            paint: {
                                                'text-color': '#ffffff',
                                                'text-halo-color': '#002945',
                                                'text-halo-width': 1.6,
                                            },
                                        });
                                        map.getSource(layerName).setData(point);

                                        map.setLayoutProperty(layerName, 'icon-rotate', parseFloat(ship.course - 90));
                                    });

                                    map.flyTo({
                                        center: [ship.longitude, ship.latitude],
                                        zoom: 8,
                                    });
                                } else {
                                    map.loadImage('resources/map/icon-vessel-blue.png', function (error, image) {
                                        if (error) throw error;

                                        var layerName = 'myfleet-' + ship.imo;
                                        var point = {
                                            type: 'FeatureCollection',
                                            features: [
                                                {
                                                    type: 'Feature',
                                                    properties: {
                                                        'marker-color': '#7e7e7e',
                                                        'marker-size': 'medium',
                                                        'marker-symbol': '',
                                                        imo: ship.imo,
                                                        name: vessel_name,
                                                        ship: ship,
                                                    },
                                                    geometry: {
                                                        type: 'Point',
                                                        coordinates: [ship.longitude, ship.latitude],
                                                    },
                                                },
                                            ],
                                        };
                                        if (map.getSource(layerName) == null) {
                                            map.addSource(layerName, {
                                                type: 'geojson',
                                                data: point,
                                            });
                                        }

                                        try {
                                            map.addImage(layerName, image);
                                        } catch (e) {}

                                        map.addLayer({
                                            id: layerName,
                                            type: 'symbol',
                                            source: layerName,
                                            layout: {
                                                'icon-allow-overlap': true,
                                                'text-allow-overlap': true,
                                                'icon-anchor': 'center',
                                                'text-anchor': 'left',
                                                'text-font': ['Ubuntu Bold'],
                                                'text-letter-spacing': 0.155,
                                                'text-transform': 'uppercase',
                                                'text-size': 15,
                                                'text-offset': [1.4, 0],
                                                //'text-field': '{name}',
                                                'icon-image': layerName,
                                                'icon-size': 1,
                                                'icon-rotation-alignment': 'map',
                                            },
                                            paint: {
                                                'text-color': '#ffffff',
                                                'text-halo-color': '#002945',
                                                'text-halo-width': 1.6,
                                            },
                                        });
                                        map.getSource(layerName).setData(point);

                                        map.setLayoutProperty(layerName, 'icon-rotate', parseFloat(ship.course - 90));
                                    });

                                    map.flyTo({
                                        center: [ship.longitude, ship.latitude],
                                        zoom: 8,
                                    });
                                }

                                var popupShip = new mapboxgl.Popup({
                                    offset: 1,
                                    closeButton: true,
                                    closeOnClick: true,
                                });

                                var coordinates = [ship.longitude, ship.latitude];

                                ship.name = vessel_name;
                                var description = new Abraxa.templates.MapVesselPopup(ship);

                                popupShip.setLngLat(coordinates).setHTML(description.html).addTo(map);
                            } else {
                                Ext.Msg.alert('Info', data.message);
                            }
                        } else {
                            Ext.Msg.alert('Info', data.message);
                        }
                    },

                    failure: function (response, opts) {
                        console.log('failed', response);
                    },
                });
            } catch (e) {
                console.log(e);
            }
        });
    },
});
