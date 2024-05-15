Ext.define('Abraxa.view.common.fields.Latitude', {
    extend: 'Ext.field.Number',
    xtype: 'Latitudefield',
    label: 'Latitude',
    ui: 'classic field-md',
    config: {
        validators: [
            function (lat) {
                const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
                let validLat = regexLat.test(lat);
                if (validLat) {
                    return true;
                }
                return 'Invalid Latitude';
            },
        ],
    },
});
