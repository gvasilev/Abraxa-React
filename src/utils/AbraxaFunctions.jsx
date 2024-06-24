Ext.define('Abraxa.utils.Functions', {
    alternateClassName: ['AbraxaFunctions'],
    statics: {
        alertNoServicesForInvoiceSelected: function () {
            Ext.Msg.alert(
                'No services selected',
                'Please select at least one service to generate an Invoice or a Credit note.'
            );
        },
        checkIfExpensesPresent: function (expensesStore) {
            if (!expensesStore || !expensesStore.count()) {
                Ext.Msg.alert(
                    'No services added',
                    'Please create at least one service to generate an Invoice or a Credit note.'
                );
                return false;
            }
            return true;
        },
        // Converts a coordinates number in decimal degrees to DMS(degrees, minutes, seconds) string
        convertCoordinatesDDtoDMS: function ddToDms(lng, lat) {
            // Make sure that you are working with numbers.
            lat = parseFloat(lat);
            lng = parseFloat(lng);
            let latResult = '';
            let lngResult = '';

            // Check the correspondence of the coordinates for latitude: North or South.
            let latLetter = lat >= 0 ? 'N' : 'S';

            latResult += this.getDms(lat) + ' ' + latLetter;

            // Check the correspondence of the coordinates for longitude: East or West.
            let lngLetter = lng >= 0 ? 'E' : 'W';

            // Call getDms(lng) function for the coordinates of Longitude in DMS.
            lngResult += this.getDms(lng) + ' ' + lngLetter;

            return { latitude: latResult, longitute: lngResult };
        },
        getAlternativeNames: function (alternativeNames) {
            let altNamesString = AbraxaConstants.placeholders.emptySpan;
            if (!alternativeNames) return altNamesString;

            if (alternativeNames.length === 1) {
                altNamesString = alternativeNames[0];
            } else if (alternativeNames.length > 1) {
                altNamesString = alternativeNames.join(', ');
            }
            return altNamesString;
        },
        getDms: function (val) {
            // Required variables
            let valDeg, valMin, valSec, result;

            // Here you'll convert the value received in the parameter to an absolute value.
            // Conversion of negative to positive.
            // In this step does not matter if it's North, South, East or West,
            // such verification was performed earlier.
            val = Math.abs(val); // -40.601203 = 40.601203

            // ---- Degrees ----
            // Stores the integer of DD for the Degrees value in DMS
            valDeg = Math.floor(val); // 40.601203 = 40

            // Add the degrees value to the result by adding the degrees symbol.
            result = valDeg + '\u00B0 ';

            // ---- Minutes ----
            // Removing the integer of the inicial value you get the decimal portion.
            // Multiply the decimal portion by 60.
            // Math.floor returns an integer discarding the decimal portion.
            // ((40.601203 - 40 = 0.601203) * 60 = 36.07218) = 36
            valMin = Math.floor((val - valDeg) * 60); // 36.07218 = 36

            // Add minutes to the result, adding the symbol minutes "'".
            result += valMin + "' ";

            // ---- Seconds ----
            // To get the value in seconds is required:
            // 1Âº - removing the degree value to the initial value: 40 - 40.601203 = 0.601203;
            // 2Âº - convert the value minutes (36') in decimal ( valMin/60 = 0.6) so
            // you can subtract the previous value: 0.601203 - 0.6 = 0.001203;
            // 3Âº - now that you have the seconds value in decimal,
            // you need to convert it into seconds of degree.
            // To do so multiply this value (0.001203) by 3600, which is
            // the number of seconds in a degree.
            // You get 0.001203 * 3600 = 4.3308
            // As you are using the function Math.round(),
            // which rounds a value to the next unit,
            // you can control the number of decimal places
            // by multiplying by 1000 before Math.round
            // and subsequent division by 1000 after Math.round function.
            // You get 4.3308 * 1000 = 4330.8 -> Math.round = 4331 -> 4331 / 1000 = 4.331
            // In this case the final value will have three decimal places.
            // If you only want two decimal places
            // just replace the value 1000 by 100.
            valSec = parseFloat(Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000).toFixed(2); // 40.601203 = 4.331

            // Add the seconds value to the result,
            // adding the seconds symbol " " ".
            result += valSec + '" '; // 40Âº36'4.331"

            // Returns the resulting string.
            return result;
        },
        getPortLatitude: function (coordinates) {
            if (!coordinates || !coordinates.latitude) return null;
            const lat = coordinates.latitude;
            const convertedObj = this.convertCoordinatesDDtoDMS(null, lat);
            return convertedObj.latitude;
        },
        getPortLongitude: function (coordinates) {
            if (!coordinates || !coordinates.longitude) return null;
            const lon = coordinates.longitude;
            const convertedObj = this.convertCoordinatesDDtoDMS(lon, null);
            return convertedObj.longitute;
        },
        getCoordinatesString: function (coordinates) {
            if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
                return AbraxaConstants.placeholders.emptySpan;
            }
            const lat = this.getPortLatitude(coordinates);
            const lon = this.getPortLongitude(coordinates);
            return lat + ' / ' + lon;
        },
        getLowerCaseValue: function (value) {
            return value ? value.toLowerCase() : '';
        },
        getYesNoWithIcon: function (value) {
            const placeholders = AbraxaConstants.placeholders;
            let htmlString = placeholders.emptySpan;
            if (value === true) {
                htmlString = placeholders.yesValueWithIcon;
            } else if (value === false) {
                htmlString = placeholders.noValueWithIcon;
            }
            return htmlString;
        },
        getYesNoWithoutIcon: function (value) {
            const placeholders = AbraxaConstants.placeholders;
            let htmlString = placeholders.emptySpan;
            if (value === true) {
                htmlString = placeholders.yesValueWithoutIcon;
            } else if (value === false) {
                htmlString = placeholders.noValueWithoutIcon;
            }
            return htmlString;
        },
        reloadStore: function (store) {
            return new Promise(function (resolve, reject) {
                if (store) {
                    store.load({
                        callback: function (records, operation, success) {
                            if (success) {
                                resolve(true);
                            } else {
                                reject(false);
                            }
                        },
                    });
                }
            });
        },

        // TODO: CORE-2890 : Refactor grid status rendering everywhere it is used
        renderStatusCell: function (classString, statusString) {
            return `<div class="a-status-badge a-status-md status-${classString}"><span class="text-truncate">${statusString}</span></div>`;
        },

        // TODO CORE-2891 : Refactor grid vessel rendering everywhere it is used
        renderVesselCell: function (vesselName, vesselId) {
            return `<a data-id="vessel_name" class="a_grid_action a-vessel-name text-truncate" href="javascript:void(0)" title="${vesselName}">${vesselName}</a><div class="sm-title">ID-${vesselId}</div>`;
        },

        toPlural: (value, count, suffix = 's', decorator = '') => {
            let plurVal = count === 1 ? value : value + suffix;
            if (decorator) {
                plurVal = `<${decorator}>${plurVal}</${decorator}>`;
            }
            return plurVal;
        },
        //Example:
        //Abraxa.utils.Functions.getNestedProperty(
        //     obj,
        //     'property1.property2.property3' (etc.)
        // );
        getNestedProperty(obj, path) {
            if (!path) return undefined; // Early return for falsy path
            var parts = path.split('.');
            var current = obj;

            for (var i = 0; i < parts.length; i++) {
                if (current === null || typeof current !== 'object') {
                    return undefined;
                }
                current = current[parts[i]];
            }

            return current;
        },

        updateInquiry: function (inqury) {
            if (!inqury) return;
            let currentUser = Ext.Viewport.getViewModel().get('currentUser');
            inqury.set('updated_at', new Date());
            inqury.set('updated_by_user', currentUser.getData());
        },

        updatePortCost: function (port) {
            if (!port) return;
            let currentUser = Ext.Viewport.getViewModel().get('currentUser');
            port.set('updated_at', new Date());
            port.set('updated_by_user', currentUser.getData());
        },

        size: function (size) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (size == 0) return '0 Byte';
            var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
            return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },

        timeAgo: function (date) {
            const now = new Date();
            const secondsPast = (now.getTime() - date.getTime()) / 1000;

            if (secondsPast < 60) {
                return 'just now';
            }
            if (secondsPast < 3600) {
                // Less than an hour
                const minutes = Math.floor(secondsPast / 60);
                return minutes + (minutes > 1 ? ' minutes ago' : ' minute ago');
            }
            if (secondsPast <= 86400) {
                // Less than a day
                const hours = Math.floor(secondsPast / 3600);
                return hours + (hours > 1 ? ' hours ago' : ' hour ago');
            }

            // For days, since the day changes at midnight, we will compare days, not seconds
            const daysPast = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            if (daysPast == 0) {
                return 'today';
            }
            if (daysPast == 1) {
                return 'yesterday';
            }
            if (daysPast < 7) {
                return daysPast + ' days ago';
            }

            const weeksPast = Math.floor(daysPast / 7);
            if (weeksPast == 1) {
                return 'last week';
            }
            if (weeksPast < 52) {
                return weeksPast + ' weeks ago';
            }

            const yearsPast = now.getFullYear() - date.getFullYear();
            return yearsPast + (yearsPast > 1 ? ' years ago' : ' year ago');
        },

        renderDisbursementLabels: function (value) {
            if (value) {
                const firstValue = value[0];
                const firstValueCss = firstValue.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();
                if (value.length > 1) {
                    return (
                        '<span class="a-status-badge rounded no-border a-status-light-' +
                        firstValueCss +
                        '">' +
                        firstValue +
                        '</span><span class="ml-4 fs-11 fw-b c-grey">+' +
                        (value.length - 1) +
                        '</span>'
                    );
                }
                return (
                    '<span class="a-status-badge rounded no-border a-status-light-' +
                    firstValueCss +
                    '">' +
                    firstValue +
                    '</span>'
                );
            }

            return '<div class="a-cell-placeholder">---</div>';
        },

        formatROE: function (value, digits) {
            digits = digits || 7;
            value = +value || 1;
            const num = parseFloat(value);
            let formatted = num.toFixed(digits);
            // This regExp formats numbers by removing trailing zeros, e.g.: 12.34500000 would be formatted to 12.345
            formatted = formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');

            return formatted;
        },
        formatStringToDate: function (dateString, format) {
            const date = new Date(dateString);
            if (date instanceof Date && !isNaN(date)) {
                return Ext.Date.format(date, format);
            }
            this.reportToSentry(dateString + AbraxaConstants.messages.dateFormatError);
            return AbraxaConstants.placeholders.emptyValue;
        },

        createPlaceHolders: function (value, type) {
            const placeholders = {
                span: '<span class="c-light">' + value + '</span>',
                strong: '<strong class="c-black">' + value + '</strong>',
            };
            return placeholders[type];
        },

        reportToSentry: function (message) {
            if (typeof Sentry !== 'undefined') {
                Sentry.captureMessage(message);
            }
        },

        validateNonNegativeFieldValue: function (fieldName, value) {
            const parsedValue = parseFloat(value);
            if (parsedValue >= 0) return true;

            const errTitle = `Wrong ${fieldName} field value: ${parsedValue}`;
            const errMsg = `${fieldName} field has to have a non-negative value.`;
            Ext.Msg.alert(errTitle, errMsg);
            return false;
        },

        renderOrganizationLink: function (organizationId, organizationName) {
            return (
                '<div data-organization-id="' + organizationId + '" class="a-val-link">' + organizationName + '</div>'
            );
        },

        renderPortcallDate: function (portcallDate) {
            return (
                '<div class="a-val-sub"><span class="fw-b">' +
                this.formatStringToDate(portcallDate, AbraxaConstants.formatters.date.dayMonHyphenTime24) +
                '</span></div>'
            );
        },

        isValue: function (value) {
            if (!value || value === ' ' || value === AbraxaConstants.placeholders.emptyValue) {
                return false;
            }
            return true;
        },

        formatPortInfoInGridRenderer: function (portRequestedId, portRequested, etaRequested) {
            const emptyValue = AbraxaConstants.placeholders.emptyValue;
            const port = portRequested ? portRequested : emptyValue;
            const portId = portRequestedId ? portRequestedId : emptyValue;
            const eta = etaRequested ? etaRequested : emptyValue;
            const resHtml = `<div><a href="javascript:void(0);" data-portid="${portId}" class="a_grid_action a-port-eta">${port}</a><span class="a-sm-action"><span class="sm-title text-truncate">${eta}</span></span></div>`;

            return resHtml;
        },

        portRendererType: function (record, type, isExport) {
            if (record && !record.phantom && type && record.get(type)) {
                let eta = 'ETA: ---',
                    date = '',
                    port_requested = '',
                    port_requested_id = '';
                if (record.get(type) && record.get(type).port_name) {
                    port_requested = record.get(type).port_name;
                    port_requested_id = record.get(type).port_id;
                }
                if (record.get(type).port_eta) {
                    date = moment(record.get(type).port_eta).isValid()
                        ? moment(record.get(type).port_eta).format('DD MMM - HH:mm')
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ETA: ' + date;
                }
                if (record.get('port_ata')) {
                    date = moment(record.get(type).port_etd).isValid()
                        ? moment(record.get(type).port_etd).format('DD MMM - HH:mm')
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ETD: ' + date;
                }
                if (record.get(type).port_atd) {
                    date = moment(record.get(type).port_atd).isValid()
                        ? moment(record.get(type).port_atd).format('DD MMM - HH:mm')
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ATD: ' + date;
                }
                if (isExport) return port_requested + ' - ' + eta;
                return Abraxa.utils.Functions.formatPortInfoInGridRenderer(port_requested_id, port_requested, eta);
            } else {
                return AbraxaConstants.placeholders.emptyValue;
            }
        },

        portRenderer: function (record, isExport) {
            if (record) {
                let eta = 'ETA: ---',
                    date = '',
                    port_requested = '',
                    port_requested_id = '';
                if (record && record.get('port_name')) {
                    port_requested = record.get('port_name');
                    port_requested_id = record.get('port_id');
                }
                if (record.get('port_eta')) {
                    date = moment(record.get('port_eta')).isValid()
                        ? moment(record.get('port_eta')).format('DD MMM - HH:mm')
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ETA: ' + date;
                }
                if (record.get('port_ata')) {
                    date = moment(record.get('port_etd')).isValid()
                        ? moment(record.get('port_etd')).format('DD MMM - HH:mm')
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ETD: ' + date;
                }
                if (record.get('port_atd')) {
                    date = moment(record.get('port_atd')).isValid()
                        ? moment(record.get('port_atd')).format('DD MMM - HH:mm')
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ATD: ' + date;
                }
                if (isExport) return port_requested + ' - ' + eta;
                return Abraxa.utils.Functions.formatPortInfoInGridRenderer(port_requested_id, port_requested, eta);
            } else {
                return AbraxaConstants.placeholders.emptyValue;
            }
        },
        // When a portcall member (principal or agent) archives a portcall,
        // a duplicated port call is created with only this member participating in it.
        // The member's record 'has_left' status is set to 1 in both of the port calls.
        // If the same member is invited to the same Portcall,
        // a new member record is created, which has 'has_left' status set to 0.
        getCurrentPortcallMember: function (store) {
            if (!store) {
                return null;
            }

            let masked = Ext.ComponentQuery.query('[cls~=mask_container]');
            if (masked) {
                Ext.each(masked, function (mask) {
                    mask.hide();
                });
            }
            let currentUser = this.get('currentUser');
            let portcall = this.get('object_record');
            if (portcall.get('is_archived') && portcall.get('parent_id')) {
                // The current non-owner member for an archived (duplicated) port call
                // is the one which has has_left status set to 1 and matching tenant_id.
                return store.queryBy(function (rec, id) {
                    return rec.get('tenant_id') === currentUser.get('current_company_id') && rec.get('has_left');
                }).items[0];
            }
            // The current non-owner member for an active port call
            // is the one which has has_left status set to 0 and matching tenant_id.
            return store.queryBy(function (rec, id) {
                return rec.get('tenant_id') === currentUser.get('current_company_id') && !rec.get('has_left');
            }).items[0];
        },

        traverseNomenclature: function (store, type) {
            let nomenclature = store.findRecord('type', type);
            let options = [];

            if (nomenclature) {
                let items = nomenclature.data.items.filter(function (item) {
                    return item.leaf === true;
                });

                items.forEach((category, index) => {
                    options.push({
                        name: category.text,
                        value: category.id,
                    });
                });
            }

            return options;
        },

        exportVesselNameFileId: function (record, type) {
            if (record.get(type).voyage.vessel_name) {
                let fileID = record.get(type).file_id
                    ? record.get(type).file_id
                    : AbraxaConstants.placeholders.emptyValue;
                return record.get(type).voyage.vessel_name + ' / File ID: ' + fileID;
            } else {
                return AbraxaConstants.placeholders.emptyValue;
            }
        },

        calculateVariance: function (pda, dda, fda, returnWithTemplate = true) {
            let startPrice = pda || dda,
                finalPrice = fda || dda;

            if (finalPrice === 0 && startPrice) {
                return AbraxaConstants.placeholders.emptySpan;
            }

            if (!startPrice && finalPrice) {
                return AbraxaConstants.placeholders.emptySpan;
            }

            if (!startPrice && !finalPrice) {
                return AbraxaConstants.placeholders.emptySpan;
            }

            if (startPrice === finalPrice) {
                return AbraxaConstants.placeholders.emptySpan;
            }

            let variance = parseFloat(this.calculatePercentageVariance(startPrice, finalPrice)).toFixed(1),
                sign = startPrice > finalPrice ? '-' : startPrice < finalPrice ? '+' : '',
                cls = startPrice > finalPrice ? 'c-red' : startPrice < finalPrice ? 'c-green' : 'c-blue',
                icon =
                    startPrice > finalPrice
                        ? 'trending_down'
                        : startPrice < finalPrice
                          ? 'trending_up'
                          : 'trending_flat';
            if (returnWithTemplate) {
                return this.formatVarianceText(sign, variance, cls, icon);
            } else {
                return sign + '' + variance;
            }
        },

        calculatePercentageVariance: function (startPrice, finalPrice) {
            return Math.abs((finalPrice - startPrice) / startPrice) * 100;
        },

        formatVarianceText: function (sign, variance, cls, icon) {
            return (
                '<div class="hbox ' +
                cls +
                '"><i class="material-icons-outlined md-16 ' +
                cls +
                '">' +
                icon +
                '</i><span class="ml-8">' +
                sign +
                '' +
                variance +
                '%</span></div>'
            );
        },

        disbursementGetNameByType: function (type) {
            switch (type) {
                case 'pda':
                    return 'Proforma DA';
                case 'dda':
                    return 'Departure DA';
                case 'fda':
                    return 'Final DA';
                case 'sda':
                    return 'Supplementary DA';

                default:
                    return AbraxaConstants.placeholders.emptyValue;
            }
        },
        getFromToStringValue: function (data, fromPropName, toPropName, unit) {
            let htmlString = AbraxaConstants.placeholders.emptySpan;
            if (!data) return htmlString;
            const fromVal = data[fromPropName];
            const toVal = data[toPropName];
            if (fromVal || fromVal === 0) {
                htmlString = `${fromVal}${unit}`;
            }
            if (toVal || toVal === 0) {
                htmlString = `${htmlString} - ${toVal}${unit}`;
            }
            return htmlString;
        },
        getMinMaxValue: function (data, minPropName, maxPropName, digits, unit) {
            let htmlString = AbraxaConstants.placeholders.emptySpan;
            if (!data) return htmlString;
            const minVal = parseFloat(data[minPropName]).toFixed(digits);
            const maxVal = parseFloat(data[maxPropName]).toFixed(digits);
            if ((minVal && !isNaN(minVal)) || minVal === 0) {
                htmlString = `${minVal} ${unit}`;
            }
            if ((maxVal && !isNaN(maxVal)) || maxVal === 0) {
                htmlString = `${htmlString} - ${maxVal} ${unit}`;
            }
            return htmlString;
        },
        getWorkflowConditionValue: function (rulesData, conditionType) {
            let value = null;
            if (rulesData.rules && rulesData.rules[0].conditions) {
                Ext.Array.each(rulesData.rules[0].conditions, function (condition) {
                    switch (conditionType) {
                        case 'invitation_companies':
                            if (condition.type === 'companies') {
                                value = condition.data;
                            }
                            break;
                        case 'disbursement_value_max':
                            if (condition.type === 'disbursementAmount') {
                                if (condition.operator === 'between') {
                                    value = condition.data[1];
                                }
                            }
                            break;
                        case 'disbursement_value_min':
                            if (condition.type === 'disbursementAmount') {
                                if (condition.operator === 'between') {
                                    value = condition.data[0];
                                } else {
                                    value = condition.data;
                                }
                            }
                            break;
                        case 'vessel_type':
                            if (condition.type === 'vesselTypes') {
                                value = condition.data;
                            }
                            break;
                        case 'agency_type':
                            if (condition.type === 'agencyTypes') {
                                value = condition.data;
                            }
                            break;
                        case 'disbursement_amount':
                            if (condition.type === 'disbursementAmount') {
                                if (condition.operator != 'in') {
                                    value = condition.operator;
                                }
                            }
                            break;
                        case 'port_function':
                            if (condition.type === 'portFunctions') {
                                value = condition.data;
                            }
                            break;
                        case 'port':
                            if (condition.type === 'ports') {
                                value = condition.data;
                            }
                            break;
                        case 'label':
                            if (condition.type === 'disbursementLabels') {
                                value = condition.data;
                            }
                            break;
                        case 'disbursement_type':
                            if (condition.type === 'disbursementTypes') {
                                value = condition.data;
                            }
                            break;
                        default:
                            value = null;
                            break;
                    }
                });
            }
            return value;
        },

        showExceptionMessage: function (response) {
            let errorResponseMsg = response?.responseJson?.message || false;
            if (!errorResponseMsg) {
                //report to sentry backend endpoints with incorrect json response
                this.reportToSentry(
                    response.request.url + ' endpoint returned an unexpected response.Please review and fix it ASAP.'
                );
                errorResponseMsg = 'Unknown error.';
            }
            Ext.create('Ext.MessageBox', {
                ui: 'warning',
                title: 'Error',
                innerCls: 'a-bgr-white',
                message: errorResponseMsg + '<br>This incident has been reported.',
                width: 300,
                dataTitle: 'Warning',
                modal: true,
                draggable: false,
                bbar: {
                    manageBorders: false,
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-report',
                            ui: 'action',
                            text: 'OK',
                            handler: function (me) {
                                me.up('dialog').destroy();
                            },
                        },
                    ],
                },
            }).show();
        },
    },
});
