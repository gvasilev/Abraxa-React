Ext.define('Abraxa.model.costcenter.CostCenter', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'reference_id',
            type: 'string',
        },
        {
            name: 'items',
            type: 'auto',
            mapping: function (data) {
                let items = data.items;
                items.forEach((element) => {
                    if (element.type === 'service') {
                        element.leaf = true;
                    } else {
                        element.expanded = true;
                        element.loaded = true;
                    }
                });
                return items;
            },
        },
        {
            name: 'services',
            depends: ['items'],
            convert: function (value, record) {
                if (record.get('items')) {
                    return record.get('items').filter((item) => {
                        return item.type === 'service';
                    });
                }
            },
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cost-centers',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        // writer: {
        //     type: 'json',
        //     allDataOptions: {
        //         persist: true,
        //         associated: true,
        //     },
        //     partialDataOptions: {
        //         changes: true,
        //         critical: true,
        //         associated: false,
        //     },
        // },
    },
});
