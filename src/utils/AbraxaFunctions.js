Ext.define('Abraxa.utils.Functions', {
    alternateClassName: ['AbraxaFunctions'],
    statics: {
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

        formatPortInfoInGridRenderer: function (portRequestedId, portRequested, eta) {
            return (
                '<div>' + '<a href="javascript:void(0);" data-portid="' + portRequestedId ||
                '---' + '" class="a_grid_action a-port-eta">' + portRequested ||
                '---' + '</a>' + '<span class="a-sm-action"><span class="sm-title text-truncate">' + eta ||
                '---' + '</span></span></div>'
            );
        },

        portRendererType: function (record, type, isExport) {
            if (record && type) {
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
    },
});
