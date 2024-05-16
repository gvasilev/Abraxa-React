Ext.define('Abraxa.Timefield', {
    extend: 'Ext.field.Time',
    xtype: 'abraxa.timefield',
    format: 'H:i',
    placeholder: 'hh:mm',
    altFormats: 'G|' + 'H|',
    parseValidator: null,
    hideTrigger: true,
    parseValue: function (value, errors) {
        var date;
        if (value) {
            if (moment(value, 'HH:mm').isValid() || moment(value).isValid()) {
                var rawValue = moment(value, 'HH:mm').utc();
                date = rawValue._d;
            }
        }
        return date;
    },
});
