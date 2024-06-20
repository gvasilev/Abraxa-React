Ext.define('Abraxa.view.map.mapbox.AbraxaMapboxController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map.mapbox.controller',

    init: function () {},

    // Map layers
    //------------------------------------------------------------------------------------------------------------------
    createLayer: function (layerName, mapInstance) {
        if (mapInstance) {
            var map = mapInstance;
        } else {
            var map = this.getView().map;
        }

        switch (layerName) {
            case 'ports':
                map.loadImage(
                    AbraxaMapRoutes.staticURL + 'images/icon-port-point.png',
                    function (error, image) {
                        if (error) throw error;
                        map.addImage('porticon', image);
                        map.addLayer({
                            id: 'ports',
                            type: 'symbol',
                            source: 'ports',
                            minzoom: 6, // default is 4
                            layout: {
                                'text-anchor': 'bottom',
                                'text-font': ['Open Sans Regular'],
                                'text-size': 10,
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
                                'text-color': '#ebebeb',
                            },
                        });
                        /*map.addLayer({
                        'id': 'ports',
                        'type': 'symbol',
                        'source': 'ports',
                        "minzoom": 6, // default is 4
                        'layout': {
                            'text-anchor': 'bottom',
                            "text-font": ["Open Sans Regular"],
                            "text-size": 10,
                            "text-offset": [0, -0.2],
                            'text-field': '{name}',
                            'icon-allow-overlap': true,
                            'visibility': 'visible',
                            "icon-image": "porticon",
                            "icon-size": 0.7,
                            "text-allow-overlap": false,
                        },
                        paint: {
                            "text-color": "#585858"
                        }
                    });*/
                    },
                    'junctionPoints'
                );
                break;
            case 'piracy':
                // Othe piracy zones: Jakarta, Nigeria, Antilles
                map.addLayer({
                    id: 'piracy',
                    type: 'fill',
                    source: 'piracy',
                    layout: {
                        visibility: 'visible',
                    },
                    paint: {
                        'fill-color': '#7A4900',
                        'fill-opacity': 0.4,
                        'fill-outline-color': '#5E3800',
                    },
                });
                break;
            case 'seca':
                map.addLayer(
                    {
                        id: layerName,
                        type: 'fill',
                        source: 'seca',
                        layout: {
                            visibility: 'visible',
                        },
                        paint: {
                            'fill-color': '#b8ff4d',
                            'fill-opacity': 0.5,
                            //'fill-outline-color': '#228B22'
                            //'fill-outline-color': '#fff',
                            'fill-antialias': true,
                            //"fill-pattern": "seca-pattern-6"
                        },
                    },
                    'admin-2-boundaries-bg'
                );
                break;
            case 'traffic_separation':
                map.addLayer({
                    id: 'traffic_separation',
                    type: 'fill',
                    source: 'traffic_separation',
                    layout: {
                        visibility: 'visible',
                    },
                    paint: {
                        'fill-color': '#fca8ea',
                        'fill-opacity': 0.7,
                        'fill-outline-color': '#606060',
                    },
                });
                break;
        }
    },

    hideLayers: function (layers, mapInstance) {
        if (mapInstance) {
            var map = mapInstance;
        } else {
            var map = this.getView().map;
        }
    },

    showLayers: function (layers, mapInstance, mapConfig) {
        if (mapInstance) {
            var map = mapInstance;
        } else {
            var map = this.getView().map;
        }
    },

    loadMapElements: function (mapElements, mapInstance, mapConfig) {
        if (mapInstance) {
            var map = mapInstance;
        } else {
            var map = this.getView().map;
        }

        mapElements.forEach(function (mapElement) {
            switch (mapElement) {
                case 'ports':
                    // Load ports on map. Get data from server and set geojson data to mapLayer 'ports'
                    if (mapConfig.loadPorts) {
                        AbraxaRequestMapData.getPorts(function (ports) {
                            map.getSource('ports').setData(JSON.parse(ports));
                        });
                    }
                    break;
                case '':
                    break;
            }
        });
    },

    loadUiComponents: function (uiComponents, mapInstance, mapConfig) {
        if (mapInstance) {
            var map = mapInstance;
        } else {
            var map = this.getView().map;
        }

        uiComponents.forEach(function (uiComponent) {
            switch (uiComponent) {
                case 'measureDistance':
                    // Load ports on map. Get data from server and set geojson data to mapLayer 'ports'
                    var measureDistance = Ext.create('MapboxMeasureDistance', {
                        map: map,
                    });
                    break;
                case '':
                    break;
            }
        });
    },

    loadMapSources: function (mapSources, mapInstance) {
        if (mapInstance) {
            var map = mapInstance;
        } else {
            var map = this.getView().map;
        }

        mapSources.forEach(function (source) {
            if (!map.getSource(source)) {
                map.addSource(source, {
                    type: 'geojson',
                    data: null,
                });
            }
        });
    },

    loadMapLayers: function (mapLayers, mapInstance) {
        var me = this;
        if (mapInstance) {
            var map = mapInstance;
        } else {
            var map = this.getView().map;
        }

        // Create predefined layers for the map
        // MapboxLayers.mapLayers.forEach(function (layerName) {
        //     if (!map.getLayer(layerName)) {
        //         me.createLayer(layerName, map);
        //     }
        // })
    },

    getVoyagePlannerComponentStopsCoordinates: function (stops) {
        var me = this;
        var stopsList = [];
        Ext.each(stops, function (record, index) {
            if (record.data.coordinates) {
                var port = {};
                port.name = record.data.port_name;

                var coordinatesObject = {};
                coordinatesObject.lng = record.data.coordinates[0];
                coordinatesObject.lat = record.data.coordinates[1];
                port.coordinates = AbraxaMap.ProjectionConversion.from4326_to3857(coordinatesObject);

                stopsList.push(port);
            }
        });

        return stopsList;
    },

    // var stops = [[27, 42], [28, 43]]
    convertPointCoordinatesFrom4326To3857: function (stops) {
        var stopsList = [];
        Ext.each(stops, function (record, index) {
            if (record) {
                var coordinatesObject = {};
                coordinatesObject.lng = record[0];
                coordinatesObject.lat = record[1];

                var coordinates = AbraxaMap.ProjectionConversion.from4326_to3857(coordinatesObject);
                stopsList.push(coordinates);
            }
        });

        return stopsList;
    },

    //------------------------------------------------------------------------------------------------------------------

    /*
     * PIRACY layers:
     * -----------------------------------------------------------------------------------------------------------------
     * piracyZonesLayersOther:
     */

    // Helper component functions

    mainSearchComponentClick: function (name) {
        var listComponents = ['vessel', 'port', 'berth', 'commodity'];

        switch (name) {
            case 'vessel':
                if (!Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('VesselComponentItemId')) {
                    var component = Ext.create('Abraxa.view.map.VesselComponent', {});
                    Ext.ComponentQuery.query('#mainMapItemId')[0].add(component);
                }
                break;
            case 'port':
                if (!Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('PortComponentItemId')) {
                    var component = Ext.create('Abraxa.view.map.PortComponent', {});
                    Ext.ComponentQuery.query('#mainMapItemId')[0].add(component);
                }
                break;
            case 'berth':
                if (!Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('BerthComponentItemId')) {
                    var component = Ext.create('Abraxa.view.map.BerthComponent', {});
                    Ext.ComponentQuery.query('#mainMapItemId')[0].add(component);
                }
                break;
            case 'commodity':
                if (!Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('CargoComponentItemId')) {
                    var component = Ext.create('Abraxa.view.map.CargoComponent', {});
                    Ext.ComponentQuery.query('#mainMapItemId')[0].add(component);
                }
                break;
        }

        if (Ext.ComponentQuery.query('#AppointmentsComponentItemId').length > 0) {
            Ext.ComponentQuery.query('#AppointmentsComponentItemId')[0].setHidden(true);
            if (Ext.ComponentQuery.query('#AppointmentDetailsComponentItemId')[0]) {
                Ext.ComponentQuery.query('#AppointmentDetailsComponentItemId')[0].setHidden(true);
            }
        }

        Ext.ComponentQuery.query('#mapSearchResultsContainerItemId')[0].setHidden(true);

        listComponents.forEach(function (elName) {
            if (name != elName) {
                if (elName == 'vessel') {
                    if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('VesselComponentItemId')) {
                        Ext.ComponentQuery.query('#mainMapItemId')[0].remove('VesselComponentItemId');
                    }
                }

                if (elName == 'port') {
                    if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('PortComponentItemId')) {
                        Ext.ComponentQuery.query('#mainMapItemId')[0].remove('PortComponentItemId');
                    }
                }

                if (elName == 'berth') {
                    if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('BerthComponentItemId')) {
                        Ext.ComponentQuery.query('#mainMapItemId')[0].remove('BerthComponentItemId');
                    }
                }

                if (elName == 'commodity') {
                    if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('CargoComponentItemId')) {
                        Ext.ComponentQuery.query('#mainMapItemId')[0].remove('CargoComponentItemId');
                    }
                }
            }
        });
    },

    removeAllSecondaryPanelsAndShowAppointmentsPanel: function () {
        var listComponents = ['vessel', 'port', 'berth', 'commodity'];
        listComponents.forEach(function (elName) {
            if (elName == 'vessel') {
                if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('VesselComponentItemId')) {
                    Ext.ComponentQuery.query('#mainMapItemId')[0].remove('VesselComponentItemId');
                }
            }

            if (elName == 'port') {
                if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('PortComponentItemId')) {
                    Ext.ComponentQuery.query('#mainMapItemId')[0].remove('PortComponentItemId');
                }
            }

            if (elName == 'berth') {
                if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('BerthComponentItemId')) {
                    Ext.ComponentQuery.query('#mainMapItemId')[0].remove('BerthComponentItemId');
                }
            }

            if (elName == 'commodity') {
                if (Ext.ComponentQuery.query('#mainMapItemId')[0].getComponent('CargoComponentItemId')) {
                    Ext.ComponentQuery.query('#mainMapItemId')[0].remove('CargoComponentItemId');
                }
            }
        });

        if (!Ext.ComponentQuery.query('#AppointmentDetailsComponentItemId')[0]) {
            if (Ext.ComponentQuery.query('#AppointmentsComponentItemId').length > 0) {
                Ext.ComponentQuery.query('#AppointmentsComponentItemId')[0].setHidden(false);
            }
        }
        if (Ext.ComponentQuery.query('#sideMenuVesselPortBerthSearchItemId2')[0].getValue().length > 2) {
            Ext.ComponentQuery.query('#AppointmentDetailsComponentItemId')[0].setHidden(false);
        }
    },

    // ----------------------------------------------- MAP LAYERS ------------------------------------------------------

    /*showHideLayer: function (layerName, checked, mapInstance, callBackResponse) {
        if (mapInstance) {
            var map = mapInstance
        } else {
            var map = this.getView().map;
        }

        switch (layerName) {
            case 'ports':
                if (checked) {
                    if (!map.getLayer('ports')) {
                        this.getLayerData('ports', function (result) {
                            if(map.getSource('ports')){
                                map.getSource('ports').setData(JSON.parse(result));

                                map.loadImage(AbraxaMapRoutes.staticURL + 'images/icon-port-point.png', function (error, image) {
                                    if (error) throw error;
                                    map.addImage('porticon', image);
                                    map.addLayer({
                                        'id': 'ports',
                                        'type': 'symbol',
                                        'source': 'ports',
                                        "minzoom": 6, // default is 4
                                        'layout': {
                                            'text-anchor': 'bottom',
                                            "text-font": ["Open Sans Regular"],
                                            "text-size": 10,
                                            "text-offset": [0, -1.9],
                                            'text-field': '{name}',
                                            'icon-allow-overlap': false,
                                            //'visibility': 'visible',
                                            //"icon-optional": true,
                                            //"icon-image": "porticon",
                                            "icon-size": 0.7,
                                            "text-allow-overlap": false,
                                        },
                                        paint: {
                                            "text-color": "#ebebeb"
                                        }
                                    });
                                });

                                return callBackResponse('ports layer loaded');
                            }else{
                                map.addSource('ports', {type: 'geojson', data: null});

                                map.getSource('ports').setData(JSON.parse(result));

                                map.loadImage(AbraxaMapRoutes.staticURL + 'images/icon-port-point.png', function (error, image) {
                                    if (error) throw error;
                                    map.addImage('porticon', image);
                                    map.addLayer({
                                        'id': 'ports',
                                        'type': 'symbol',
                                        'source': 'ports',
                                        "minzoom": 6, // default is 4
                                        'layout': {
                                            'text-anchor': 'bottom',
                                            "text-font": ["Open Sans Regular"],
                                            "text-size": 10,
                                            "text-offset": [0, -1.9],
                                            'text-field': '{name}',
                                            'icon-allow-overlap': false,
                                            //'visibility': 'visible',
                                            //"icon-optional": true,
                                            //"icon-image": "porticon",
                                            "icon-size": 0.7,
                                            "text-allow-overlap": false,
                                        },
                                        paint: {
                                            "text-color": "#ebebeb"
                                        }
                                    });
                                });
                            }

                        })
                    } else {
                        map.setLayoutProperty('ports', 'visibility', 'visible');
                    }
                } else {
                    if (map.getLayer('ports')) {
                        map.setLayoutProperty('ports', 'visibility', 'none');
                    }
                }
                break;
            case 'seca':
                if (checked) {
                    if (!map.getLayer('seca')) {

                        this.getLayerData('seca', function (result) {
                            if(map.getSource('seca')){
                                map.getSource('seca').setData(JSON.parse(result));

                                map.loadImage('https://static.abraxa.com/images/seca-pattern.png', function (err, image) {
                                    if (err) throw err;
                                    map.addImage('pattern', image);

                                    map.addLayer({
                                        "id": "seca",
                                        "type": "fill",
                                        "source": "seca",
                                        "paint": {
                                            "fill-pattern": "pattern"
                                        }
                                    });
                                });

                                return null;
                            }else{
                                map.addSource('seca', {type: 'geojson', data: null});
                                map.getSource('seca').setData(JSON.parse(result));

                                map.loadImage('https://static.abraxa.com/images/seca-pattern.png', function (err, image) {
                                    if (err) throw err;
                                    map.addImage('pattern', image);

                                    map.addLayer({
                                        "id": "seca",
                                        "type": "fill",
                                        "source": "seca",
                                        "paint": {
                                            "fill-pattern": "pattern"
                                        }
                                    });
                                });

                                return null;
                            }
                        });
                    } else {
                        map.setLayoutProperty('seca', 'visibility', 'visible');
                    }
                } else {
                    if (map.getLayer('seca')) {
                        map.setLayoutProperty('seca', 'visibility', 'none');
                    }
                }
                break;
            case 'piracy':
                if (checked) {
                    if (!map.getLayer('piracy')) {
                        this.getLayerData('piracy', function (result) {
                            if(map.getSource('piracy')){
                                map.getSource('piracy').setData(JSON.parse(result));

                                map.addLayer({
                                    "id": 'piracy',
                                    "type": "fill",
                                    "source": 'piracy',
                                    "layout": {
                                        "visibility": "visible",
                                    },
                                    "paint": {
                                        "fill-color": "#7A4900",
                                        "fill-opacity": 0.4,
                                        'fill-outline-color': '#5E3800'
                                    }
                                });

                                return null;
                            }else{
                                map.addSource('piracy', {type: 'geojson', data: null});

                                map.getSource('piracy').setData(JSON.parse(result));

                                map.addLayer({
                                    "id": 'piracy',
                                    "type": "fill",
                                    "source": 'piracy',
                                    "layout": {
                                        "visibility": "visible",
                                    },
                                    "paint": {
                                        "fill-color": "#7A4900",
                                        "fill-opacity": 0.4,
                                        'fill-outline-color': '#5E3800'
                                    }
                                });

                                return null;
                            }
                        });
                    } else {
                        map.setLayoutProperty('piracy', 'visibility', 'visible');
                    }
                } else {
                    if (map.getLayer('piracy')) {
                        map.setLayoutProperty('piracy', 'visibility', 'none');
                    }
                }

                break;
            case 'traffic_separation':
                if (checked) {
                    if (!map.getLayer('traffic_separation')) {

                        this.getLayerData('traffic_separation', function (result) {
                            if(map.getSource('traffic_separation')){
                                map.getSource('traffic_separation').setData(JSON.parse(result));

                                map.addLayer({
                                    "id": "traffic_separation",
                                    "type": "fill",
                                    "source": "traffic_separation",
                                    "layout": {
                                        "visibility": "visible"
                                    },
                                    "paint": {
                                        "fill-color": "#fca8ea",
                                        "fill-opacity": 0.7,
                                        'fill-outline-color': '#606060'
                                    }
                                });

                                return null;
                            }else{
                                map.addSource('traffic_separation', {type: 'geojson', data: null});
                                map.getSource('traffic_separation').setData(JSON.parse(result));

                                map.addLayer({
                                    "id": "traffic_separation",
                                    "type": "fill",
                                    "source": "traffic_separation",
                                    "layout": {
                                        "visibility": "visible"
                                    },
                                    "paint": {
                                        "fill-color": "#fca8ea",
                                        "fill-opacity": 0.7,
                                        'fill-outline-color': '#606060'
                                    }
                                });

                                return null;
                            }
                        });
                    } else {
                        map.setLayoutProperty('traffic_separation', 'visibility', 'visible');
                    }
                } else {
                    if (map.getLayer('traffic_separation')) {
                        map.setLayoutProperty('traffic_separation', 'visibility', 'none');
                    }
                }
                break;
        }
    },*/

    showHideLayer: function (layerName, checked, mapInstance, callBackResponse) {
        if (mapInstance) {
            var map = mapInstance;
        } else {
            var map = this.getView().map;
        }

        switch (layerName) {
            case 'ports':
                if (map.getLayer('ports')) {
                    map.setLayoutProperty('ports', 'visibility', 'visible');
                }
                break;
            case 'seca':
                if (checked) {
                    map.setLayoutProperty('seca', 'visibility', 'visible');
                } else {
                    if (map.getLayer('seca')) {
                        map.setLayoutProperty('seca', 'visibility', 'none');
                    }
                }
                break;
            case 'piracy':
                if (checked) {
                    map.setLayoutProperty('piracy', 'visibility', 'visible');
                } else {
                    if (map.getLayer('piracy')) {
                        map.setLayoutProperty('piracy', 'visibility', 'none');
                    }
                }

                break;
            case 'traffic_separation':
                if (checked) {
                    map.setLayoutProperty('traffic_separation', 'visibility', 'visible');
                } else {
                    if (map.getLayer('traffic_separation')) {
                        map.setLayoutProperty('traffic_separation', 'visibility', 'none');
                    }
                }
                break;
            case 'clusters':
                if (checked) {
                    if (map.getLayer('clusters')) {
                        map.setLayoutProperty('clusters', 'visibility', 'visible');
                        map.setLayoutProperty('cluster-count', 'visibility', 'visible');
                        map.setLayoutProperty('unclustered-point', 'visibility', 'visible');
                        map.setLayoutProperty('cluster-count-one', 'visibility', 'visible');
                    }
                } else {
                    if (map.getLayer('clusters')) {
                        map.setLayoutProperty('clusters', 'visibility', 'none');
                        map.setLayoutProperty('cluster-count', 'visibility', 'none');
                        map.setLayoutProperty('unclustered-point', 'visibility', 'none');
                        map.setLayoutProperty('cluster-count-one', 'visibility', 'none');
                    }
                }
                break;
        }
    },

    getLayerData: function (layerName, callback) {
        switch (layerName) {
            case 'ports':
                AbraxaRequestMapData.getPorts(function (result) {
                    return callback(result);
                });
                break;
            case 'seca':
                AbraxaRequestMapData.getSECAAndECA(function (result) {
                    return callback(result);
                });
                break;
            case 'piracy':
                AbraxaRequestMapData.getPiracyZonesLayers(function (result) {
                    return callback(result);
                });
                break;
            case 'traffic_separation':
                AbraxaRequestMapData.getTrafficSeparationZones(function (result) {
                    return callback(result);
                });
                break;
        }
    },

    // -----------------------------------------------------------------------------------------------------------------
    findTimeByGivenDistanceSpeed: function (distance, speed) {
        var data = [];

        data['hours'] = distance / speed;
        data['days'] = distance / (speed * 24);
        data['minutes'] = data['hours'] * 60;

        return data;
    },

    vp_stops_list_count: function () {
        var list = Ext.ComponentQuery.query('#voyagePlannerStopsListItemId')[0];
        var listStore = list.getStore();
        var count = 0;

        Ext.each(listStore.data.items, function (record, index) {
            count++;
        });

        return count;
    },

    vp_manage_close_buttons: function (action) {
        var list = Ext.ComponentQuery.query('#voyagePlannerStopsListItemId')[0];
        var listStore = list.getStore();
        var stopsCount = this.vp_stops_list_count();

        if (action == 'delete') {
            // Check if records are more than 2, then all X are visible
            if (stopsCount > 3) {
                // All rows must have X
                Ext.each(listStore.data.items, function (record, index) {
                    record.set('x', false);
                });
            }

            if (stopsCount == 3) {
                // All rows must have X
                Ext.each(listStore.data.items, function (record, index) {
                    record.set('x', true);
                });
            }

            // Check if records are more than 2, then all X are hidden
            if (stopsCount == 2) {
                // Add new empty record without X, after the row has data add X
                Ext.each(listStore.data.items, function (record, index) {
                    record.set('x', false);
                });
            }
        }

        if (action == 'select') {
            // All rows must have X
            Ext.each(listStore.data.items, function (record, index) {
                record.set('x', false);
            });
        }
    },

    /**
     * @param response $voyage_interraction object
     * @param stopsListFull
     * @param speed
     * @param dateOfDeparture
     * @returns {*|[]}
     */
    parseTimelineDataMainRoute: function ($voyage_interraction, stopsListFull, speed, dateOfDeparture) {
        var returnData = [];

        $voyage_interraction.voyage_graphs.forEach((record) => {
            var selectedPaths = record.selected_path;

            var finalData = [];

            var data = {
                dist: 0,
                dist_seca: 0,
            };

            selectedPaths.forEach((pathName) => {
                var pathsData = record.edge_data;
                var graph = pathsData[pathName];

                if (graph.c_path) {
                    data.dist = data.dist + parseInt(graph.dist);
                    data.dist_seca = data.dist_seca + parseInt(graph.zoneinfo.seca.total);
                }
            });

            finalData.push(data);

            returnData.push(finalData);
        });

        return this.basicTimelineData(returnData, stopsListFull, speed, dateOfDeparture);
    },

    basicTimelineData: function (data, stops, speed, dateOfDeparture) {
        var result = [];
        result['data'] = [];
        result['html'] = [];

        var lastDate = dateOfDeparture;

        var i = 0;
        stops.forEach((stop) => {
            if (i == 0) {
                result['html'].push({
                    date: moment(dateOfDeparture).format(AbraxaConstants.formatters.date.dayMonYearTime24).toString(),
                    port: stop.name,
                    dist: '<b>Starting point</b>',
                    dist_seca: '',
                });
            } else {
                //Time in minutes = Distance in nautical miles x 60 ÷ Speed in knots
                var travelMinutes = 0;
                if (data[i - 1][0].dist > 0) travelMinutes = (parseFloat(data[i - 1][0].dist) * 60) / speed;

                var travelMinutesSeca = 0;
                if (data[i - 1][0].dist_seca > 0)
                    travelMinutesSeca = (parseFloat(data[i - 1][0].dist_seca) * 60) / speed;

                lastDate = moment(lastDate).add(travelMinutes, 'minutes');
                var travelDays = function () {
                    if (travelMinutes == 0) return 0;
                    return (travelMinutes / 60 / 24).toFixed(2);
                };

                var travelDaysSeca = function () {
                    if (travelMinutesSeca == 0) return 0;
                    return (travelMinutesSeca / 60 / 24).toFixed(2);
                };

                var travelDaysString = travelDays();
                var travelDaysSecaString = travelDaysSeca();

                result['html'].push({
                    date: moment(lastDate).format(AbraxaConstants.formatters.date.dayMonYearTime24),
                    port: stop.name,
                    dist: '<b>' + data[i - 1][0].dist.toFixed(2) + '</b> <em>nm</em>',
                    dist_seca: '<b>' + data[i - 1][0].dist_seca.toFixed(2) + '</b> <em>nm</em>',
                    days: '<b>' + travelDaysString + '</b> <em>days</em>',
                    days_seca: '<b>' + travelDaysSecaString + '</b> <em>days</em>',
                });

                result['data'].push({
                    date: moment(lastDate).format(AbraxaConstants.formatters.date.dayMonYearTime24),
                    port: stop.name,
                    dist: data[i - 1][0].dist.toFixed(2),
                    dist_seca: data[i - 1][0].dist_seca.toFixed(2),
                    days: travelDaysString,
                    days_seca: travelDaysSecaString,
                });
            }
            i++;
        });

        return result;
    },

    getSummary: function (data) {
        var result = {
            total_dist: 0,
            total_dist_days: 0,
            total_dist_seca: 0,
            total_seca_days: 0,
        };

        data.forEach(function (el) {
            result.total_dist = result.total_dist + parseInt(el.dist);
            result.total_dist_days = result.total_dist_days + parseFloat(el.days);
            result.total_dist_seca = result.total_dist_seca + parseInt(el.dist_seca);
            result.total_seca_days = result.total_seca_days + parseFloat(el.days_seca);
        });

        return result;
    },
});
