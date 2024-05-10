// MAP MODULE #map main file
const MapElementsConfig = {
    getIcon: function (icon) {
        return 'map/icons/' + icon + '';
    },

    checkIfImageExists: function (imageSrc, callback) {
        var img = new Image();
        img.onload = function () {
            callback(true);
        };
        img.onerror = function () {
            callback(false);
        };
        img.src = imageSrc;
    },
};

Ext.define('Abraxa.view.map.VoyageCountMap', {
    extend: 'Ext.Container',
    xtype: 'map.voyage.count',
    itemId: 'mainMapItemId',
    controller: 'map.mapbox.controller',
    // viewModel: {
    //     data: {
    //         app: {}
    //     }
    // },
    cls: 'a-map',
    onRender: function () {
        // Ext.ComponentQuery.query('#mainHeader')[0].getViewModel().set('currentTabObjectId', 31);
        this.setMasked({
            xtype: 'loadmask',
            message: 'Loading map...',
        });
        // All containing container
        var me = this;
        var thisController = Ext.ComponentQuery.query('#mainMapItemId')[0].getController();
        // var VM = me.upVM();
        var id = me.element.component.bodyElement.id;
        var appointmentsStore = me.upVM().get('portcallsMap');

        //var xtypesToLoad = ['map.voyageplanner', 'map.appointments', 'map.appointmentdetails', 'map.vessel', 'map.port', 'map.berth', 'map.cargo'];
        //var xtypesToLoad = ['map.appointments', 'map.appointmentdetails'];

        // Map initialization
        var app = new AbraxaMap.MapInit();
        app.config = {
            endpoint: Env.ApiEndpoint + 'global_intelligence/get_distance',
            environment: 'development',
            bearer_token: 'Bearer ' + localStorage.getItem('id_token'),
        };

        me.upVM().set('app', app);
        mapboxgl.accessToken =
            'pk.eyJ1IjoiYWJyYXhhIiwiYSI6ImNsMGxieGEweDBmdHIzY3BlcWczcmYwaTUifQ.7qW1R8BuuKapfBr1JXv3ZA';
        //Map layer options. (Saved state)
        app.map = new mapboxgl.Map({
            container: id,
            // style: 'mapbox://styles/mapbox/light-v10',
            style: 'mapbox://styles/abraxa/ckeh4s17u3h8n19qsdis4lj5s',
            center: ['10.616783426653456', '21.018967960023957'],
            zoom: 1.2,
        });
        app.view = me;
        app.map.sourcesData = {};

        // Add zoom and rotation controls to the map.
        app.map.addControl(new mapboxgl.NavigationControl());

        // Load ExtJS components
        // var appointmentsList = Ext.create('Abraxa.view.map.AppointmentsComponent', {});
        // var listAppointmentsComponent = Ext.ComponentQuery.query('#AppointmentsComponentItemId')[0];
        // // var appointmentsStore = listAppointmentsComponent.getViewModel().get('damanagerappointments');

        // //var voyagePlannerComponent = Ext.create('Abraxa.view.map.VoyagePlannerComponent', {});
        // //Ext.ComponentQuery.query('#mainMapItemId')[0].add(voyagePlannerComponent);
        // Ext.ComponentQuery.query('#mainMapItemId')[0].add(listAppointmentsComponent);

        //var VCALC_SERVICE_URL = Env.ApiEndpoint + 'global_intelligence/get_distance';

        app.map.on('load', function () {
            this.resize();
            // app.view.setMasked(false);
            thisController.loadMapSources(['seca', 'piracy', 'traffic_separation', 'ports'], app.map);
            thisController.loadMapLayers([], app.map);

            app.map.addLayer({
                id: 'ports',
                type: 'symbol',
                source: 'ports',
                minzoom: 8, // default is 4
                layout: {
                    'text-anchor': 'bottom',
                    'text-font': ['Open Sans Regular'],
                    'text-size': 12,
                    'text-offset': [0, -1.9],
                    'text-field': '{name}',
                    'icon-allow-overlap': false,
                    //'visibility': 'visible',
                    //"icon-optional": true,
                    //"icon-image": "porticon",
                    'icon-size': 0.7,
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': '#6B7C93',
                },
            });

            // const portData = new Promise(function (resolve, reject) {
            //     Ext.Ajax.request({
            //         url: Env.ApiEndpoint + 'global_intelligence/get_ports',
            //         method: 'GET',
            //         success: function (response, opts) {
            //             resolve(response.responseText);
            //         },
            //         failure: function (response, opts) {
            //             resolve(false);
            //         },
            //     });
            // });

            // Promise.all([portData]).then(function (values) {

            // app.map.sourcesData.ports = values[0];
            // app.map.getSource('ports').setData(JSON.parse(values[0]));

            // thisController.showHideLayer('ports', true, app.map, null);

            appointmentsStore.load({
                callback: function () {
                    app.view.setMasked(false);
                    if (appointmentsStore.getCount() > 0) {
                        // ('clusters beginnig: ');
                        var portsCluster = [];
                        var clusterGeojsonData = [];

                        // if (appointmentsStore.isLoaded()) {
                        //     //console.info('appointments store is loaded');
                        //     var appointmentsTotalStatisticsComponent = Ext.create('Abraxa.view.map.TotalStatisticsComponent', {});
                        //     Ext.ComponentQuery.query('#mainMapItemId')[0].add(appointmentsTotalStatisticsComponent);
                        // } else {
                        //     //console.error('APPOINTMENTS STORE IS NOT LOADED');
                        // }

                        appointmentsStore.each(function (appointment) {
                            if (appointment.get('port') && appointment.get('port').port_coordinates) {
                                var portDataCoordinates = JSON.parse(appointment.get('port').port_coordinates);
                                var pointObj = {
                                    type: 'Feature',
                                    properties: {
                                        id: appointment.get('id'),
                                        port_name: appointment.get('port_name'),
                                    },
                                    geometry: {
                                        type: 'Point',
                                        coordinates: portDataCoordinates.coordinates,
                                    },
                                };
                                clusterGeojsonData.push(pointObj);
                            }
                        });

                        var clusterGeojsonObject = {
                            type: 'FeatureCollection',
                            crs: {
                                type: 'name',
                                properties: {
                                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
                                },
                            },
                            features: clusterGeojsonData,
                        };
                        app.map.sourcesData.ports = clusterGeojsonObject;
                        // app.map.getSource('ports').setData(JSON.parse(values[0]));

                        app.map.addSource('portcalls', {
                            type: 'geojson',
                            data: clusterGeojsonObject,
                            cluster: true,
                            clusterMaxZoom: 14, // Max zoom to cluster points on
                            clusterRadius: 64, // Radius of each cluster when clustering points (defaults to 50)
                        });

                        thisController.showHideLayer('ports', true, app.map, null);

                        app.map.addLayer({
                            id: 'clusters',
                            type: 'circle',
                            source: 'portcalls',
                            filter: ['has', 'point_count'],
                            paint: {
                                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                                // with three steps to implement three types of circles:
                                //   * Blue, 20px circles when point count is less than 100
                                //   * Yellow, 30px circles when point count is between 100 and 750
                                //   * Pink, 40px circles when point count is greater than or equal to 750
                                'circle-color': [
                                    'step',
                                    ['get', 'point_count'],
                                    '#E91E63',
                                    5100,
                                    '#E91E63',
                                    7750,
                                    '#E91E63',
                                ],
                                'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                            },
                        });
                        app.map.addLayer({
                            id: 'cluster-count',
                            type: 'symbol',
                            source: 'portcalls',
                            filter: ['has', 'point_count'],
                            layout: {
                                'text-field': '{point_count_abbreviated}',
                                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                                'text-size': 13,
                                'text-allow-overlap': true,
                            },
                            paint: {
                                'text-color': '#ffffff',
                            },
                        });
                        app.map.addLayer({
                            id: 'unclustered-point',
                            type: 'circle',
                            source: 'portcalls',
                            filter: ['!', ['has', 'point_count']],
                            paint: {
                                'circle-color': '#E91E63',
                                'circle-radius': 12,
                                'circle-stroke-width': 1,
                                'circle-stroke-color': '#fff',
                            },
                        });
                        app.map.addLayer({
                            id: 'cluster-count-one',
                            type: 'symbol',
                            source: 'portcalls',
                            filter: ['!', ['has', 'point_count']],
                            layout: {
                                'text-field': '1',
                                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                                'text-size': 12,
                                'text-allow-overlap': true,
                            },
                            paint: {
                                'text-color': '#ffffff',
                            },
                        });
                    }
                },
            });

            // });

            app.map.on('click', 'ports', function (e) {
                var portId = parseInt(e.features[0].properties.id);
                if (portId) {
                    var thisController = Ext.ComponentQuery.query('#mainMapItemId')[0].getController();

                    if (portId) {
                        //Abraxa.Global.getPort(portId);
                        if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('PortComponentItemId')) {
                            Ext.ComponentQuery.query('#mainMapItemId')[0].remove('PortComponentItemId');
                        }
                        thisController.mainSearchComponentClick('port');
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'ports/' + portId,
                            method: 'GET',
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                                'Content-Type': 'application/json',
                            },
                            jsonData: {},
                            success: function (resp) {
                                var response = JSON.parse(resp.responseText);
                                var portComponent = Ext.ComponentQuery.query('#PortComponentItemId')[0]
                                    .getViewModel()
                                    .set('port', response);
                            },
                            failure: function (response) {
                                Ext.Msg.alert('Status', 'Request Failed.');
                            },
                        });
                    }
                }
            });

            app.map.on('mousemove', 'ports', function () {
                app.map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            app.map.on('mouseleave', 'ports', function () {
                app.map.getCanvas().style.cursor = '';
            });
        });
    },
    // listeners: {

    // }
});
