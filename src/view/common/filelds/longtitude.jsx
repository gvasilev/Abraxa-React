Ext.define('Abraxa.view.common.fields.Longitude', {
    extend: 'Ext.field.Number',
    xtype: 'Longitudefield',
    label: 'Longitude',
    ui: 'classic field-md',
    config: {
        validators: [
            function (lon) {
                const regexLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
                let validLon = regexLon.test(lon);
                if (validLon) {
                    return true;
                }
                return 'Invalid Longitude';
            },
        ],
    },
});
