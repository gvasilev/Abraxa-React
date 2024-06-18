Ext.define('Abraxa.view.directory.agents.AgentDetailsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.AgentDetailsViewModel',

    stores: {
        companyBankDetails: {
            source: '{object_record.company_bank_details}',
        },
        publicBankDetails: {
            source: '{companyBankDetails}',
            filters: [
                {
                    property: 'is_public',
                    value: 1 || true,
                    operator: '=',
                },
            ],
        },
    },
    formulas: {
        doDefaults: {
            bind: {
                bindTo: '{execPortDefaults}',
                deep: true,
            },
            get: function (rec) {
                if (rec) {
                    Ext.getCmp('main-viewport').setMasked(false);
                    return rec;
                }
            },
        },

        portsServed: {
            bind: {
                bindTo: '{object_record.ports_served}',
                deep: true,
            },
            get: function (portsServed) {
                if (portsServed && portsServed.length > 0) {
                    let portsArr = portsServed.filter((item) => item.port);

                    let sortedPorts = portsArr.sort((a, b) => {
                        return a.port_name.localeCompare(b.port_name);
                    });

                    return sortedPorts;
                }

                return [];
            },
        },
        selectedCompanyLogo: {
            bind: {
                bindTo: '{object_record.logo}',
                deep: true,
            },
            get: function (image) {
                if (image) {
                    let url;
                    if (image != '') {
                        url = image;
                    } else {
                        url = AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image-company.svg';
                    }
                    return url;
                }
            },
        },
        googleMapMarkerData: {
            bind: '{portsServed}',
            get: function (ports) {
                let meView = this.getView();
                let markersDataArr = [];
                if (ports && ports.length > 0) {
                    ports.forEach(function (portEl) {
                        if (portEl.port && portEl.port.point) {
                            let ptStr = portEl.port.point;

                            let ptArr = JSON.parse(ptStr);
                            let lat = ptArr.coordinates[1];
                            let lng = ptArr.coordinates[0];
                            let portId = portEl.port.id || null;
                            let portName = portEl.port.name || null;

                            markersDataArr.push({ lat, lng, portId, portName });
                        }
                    });
                }

                if (markersDataArr.length <= 0) {
                    // Set Varna as default port when no other ports are specified!
                    markersDataArr = [{ lat: 43.1982, lng: 27.7923, portId: 8563, portName: 'Varna' }];
                }

                let gMapCmp = meView.down('AbraxaGoogleMap');
                async function initMap() {
                    // Request needed libraries.
                    // let AdvancedMarkerElement = (await google.maps.importLibrary("marker")).AdvancedMarkerElement;
                    let MarkerElement = (await google.maps.importLibrary('marker')).Marker;

                    // Set Varna as center!
                    let map = gMapCmp.googleMapInstance;

                    if (!map) {
                        let { Map } = await google.maps.importLibrary('maps');
                        map = new Map(gMapCmp.element.dom, gMapCmp.mapConfig);
                        gMapCmp.googleMapInstance = map;
                    }

                    markersDataArr.forEach(function (markerData) {
                        // let gmapMarker = document.createElement("div");

                        // gmapMarker.className = "google-map-marker";
                        // gmapMarker.textContent = markerData.portName;

                        let marker = new MarkerElement({
                            map,
                            position: { lat: markerData.lat, lng: markerData.lng },
                            // content: gmapMarker,
                        });

                        marker.addListener('click', () => {
                            meView.getController().customMarkerClick(markerData.portId);
                        });

                        marker.addListener('mouseover', () => {
                            meView.getController().customMarkerMouseOver(map, marker, markerData.portName);
                        });
                        marker.addListener('mouseout', () => {
                            meView.getController().customMarkerMouseOut(marker);
                        });
                    });
                }

                initMap();

                return markersDataArr;
            },
        },
        googleMapAddress: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (rec) {
                let address = '';
                if (rec && rec.get('address')) {
                    address += rec.get('address');
                }

                if (rec && rec.get('city_name')) {
                    address += ', ' + rec.get('city_name');
                }

                if (rec && rec.get('country')) {
                    address += ', ' + rec.get('country');
                }

                return address;
            },
        },

        verifiedStatusHtml: function (get) {
            var object_record = get('object_record');

            if (!object_record) return '';

            var statusBadge;

            if (object_record.get('verified') === 1) {
                statusBadge =
                    '<div class="a-status-badge rounded filled a-has-icon status-verified"><i class="md-icon">verified_user</i><span>Verified</span></div>';
            } else {
                statusBadge =
                    '<div class="a-status-badge rounded filled a-has-icon status-not-verified"><i class="md-icon">verified_user</i><span>Not verified</span></div>';
            }

            return '<div class="a-profile-title">' + object_record.get('name') + '</div>' + statusBadge;
        },
    },
});
