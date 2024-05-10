/**
 * Global class for currency
 */
Ext.define('Abraxa.export', {
    singleton: true,

    portcall: function (id, sections = null, dialog = null) {
        if (id) {
            var urlToSend = Env.ApiEndpoint + 'export/portcall/' + id;
            var req = new XMLHttpRequest();
            req.open('POST', urlToSend, true);
            req.responseType = 'blob';
            req.onload = function (event) {
                if (this.status === 200) {
                    var blob = req.response;
                    let dt = new Date();
                    var fileName = 'Portcall-ABX-' + id + '-' + Ext.Date.format(dt, 'd-m-Y');
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName + '.pdf';
                    link.click();
                    Ext.toast('Document created', 1500);
                    if (dialog) {
                        dialog.destroy();
                    }
                }
                if (this.status === 500) {
                    Ext.Msg.alert('Something went wrong', 'Unable to generate export document.<br>Please try again.');
                }
            };
            if (sections) {
                let values = {};
                values.sections = sections;
                req.send(JSON.stringify(values));
            } else {
                req.send();
            }
        }
    },
    crewing: function (ids, columns) {
        if (ids) {
            let values = {};
            values.ids = ids;
            values.columns = columns;
            var urlToSend = Env.ApiEndpoint + 'export/crewing';
            var req = new XMLHttpRequest();
            req.open('POST', urlToSend, true);
            req.responseType = 'blob';
            req.onload = function (event) {
                if (this.status === 200) {
                    var blob = req.response;
                    let dt = new Date();
                    var fileName = 'Crewings' + '-' + Ext.Date.format(dt, 'd-m-Y');
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName + '.pdf';
                    link.click();
                    Ext.toast('Document created', 1500);
                }
                if (this.status === 500) {
                    Ext.Msg.alert('Something went wrong', 'No data found!');
                }
            };
            req.send(JSON.stringify(values));
        }
    },
    portcalls: async function (columns, filters = []) {
        const formData = new FormData();
        formData.append('columns', JSON.stringify(columns));
        formData.append('filter', JSON.stringify(filters));
        const urlToSend = Env.ApiEndpoint + 'portcalls_export';

        const response = await fetch(urlToSend, {
            method: 'POST',
            body: formData,
        });

        switch (response.status) {
            case 200: {
                const blob = await response.blob();
                const date = new Date();
                const fileName = 'Portcalls' + '-' + Ext.Date.format(date, 'd-m-Y');
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName + '.pdf';
                link.click();
                link.remove();
                Ext.toast('Document created', 1500);
                break;
            }
            case 422: {
                const text = await response.text();
                let msg = '';
                if (JSON.parse(text) && JSON.parse(text).message) {
                    msg = JSON.parse(text).message;
                }
                Ext.Msg.alert('Something went wrong', msg || 'Invalid data!');
                break;
            }
            case 500: {
                Ext.Msg.alert('Something went wrong', 'No data found!');
                break;
            }
            default: {
                Ext.Msg.alert('Something went wrong', 'Error while downloading document.');
                break;
            }
        }
    },
    supplies: function (ids, columns) {
        if (ids) {
            let values = {};
            values.ids = ids;
            values.columns = columns;
            var urlToSend = Env.ApiEndpoint + 'export/supplies';
            var req = new XMLHttpRequest();
            req.open('POST', urlToSend, true);
            req.responseType = 'blob';
            req.onload = function (event) {
                if (this.status === 200) {
                    var blob = req.response;
                    let dt = new Date();
                    var fileName = 'Supplies' + '-' + Ext.Date.format(dt, 'd-m-Y');
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName + '.pdf';
                    link.click();
                    Ext.toast('Document created', 1500);
                }
                if (this.status === 500) {
                    Ext.Msg.alert('Something went wrong', 'No data found!');
                }
            };
            req.send(JSON.stringify(values));
        }
    },
    exportFileFromGrid: function (grid, downloadEndpoint) {
        if (!grid || !grid.getStore) {
            Ext.Msg.warning('Warning', 'Invalid grid.');
            return;
        }

        if (!downloadEndpoint) {
            Ext.Msg.warning('Warning', 'No download endpoint specified.');
            return;
        }

        const store = grid.getStore();
        const storeFilters = store.getFilters().items;
        const filter = [];
        const columns = [];
        const visibleColumns = grid.getHeaderContainer().getVisibleColumns();
        Ext.Array.each(visibleColumns, function (value) {
            if (value.getDataIndex()) {
                columns.push(value.getDataIndex());
            }
        });
        storeFilters.forEach((item) => {
            filter.push({
                operator: item.getOperator(),
                value: item.getValue(),
                property: item.getProperty(),
            });
        });
        if (columns.length === 0) {
            Ext.Msg.warning('Warning', 'Please select at least one column to export!');
            return;
        }

        const downloadUrl =
            downloadEndpoint + '?filter=' + JSON.stringify(filter) + '&visible_columns=' + JSON.stringify(columns);

        window.location.href = downloadUrl;
    },
});
