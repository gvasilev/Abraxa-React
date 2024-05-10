Ext.define('Abraxa.view.settings.library.ports.PortController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ports.controller',
    control: {
        'grid[cls~=ports_served_grid]': {
            childtap: 'selectPort',
        },
    },

    selectPort: function (grid, selection) {
        let port = selection.record;
        let me = this;

        me.getNomenclaturePort(port.get('port_id'))
            .then(function (response) {
                me.getView().upVM().set('legacyPort', response);
            })
            .catch(function (error) {
                Ext.Msg.alert('Something went wrong', 'Cannot send suggestion!');
            });
    },

    getNomenclaturePort: function (portId) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            let url = Env.nomenclatureEndPoint + 'api/registry/v1/ports-legacy/' + portId;
            xhr.open('GET', url, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject('Request failed with status ' + xhr.status);
                }
            };
            xhr.onerror = function () {
                reject('error');
            };
            xhr.send();
        });
    },
});
