Ext.define('Abraxa.model.calculator.TariffTableRow', {
    extend: 'Ext.data.Model',
    convertOnSet: true,
    fields: [
        {
            name: '_y',
            critical: true,
            depends: ['splitY'],
            mapping: function (data, record) {
                if (Array.isArray(data._y)) return data._y.join('-');
            },
            // convert: function (val, record) {
            //     if (val && record.get('splitY')) {
            //         let digits = val.split('-').map((num) => Number(num));
            //         return digits;
            //     }
            //     return val;
            // },
            serialize: function (val, record) {
                if (val && record.get('splitY')) {
                    let digits = val.split('-').map((num) => Number(num));
                    return digits;
                }
                return val;
            },
        },
        {
            name: 'splitY',
            persist: false,
        },
    ],
});
