Ext.define('Abraxa.view.portnews.CreateNewPostDialogViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.createNewPostDialogViewModel',
    data: {
        record: null,
        isPublishButtonPressed: false,
        removedAttachmentsIds: [],
        oldPortComboValue: null,
    },
    stores: {
        files: Ext.create('Ext.data.Store'),
        addedFiles: Ext.create('Ext.data.Store'),
        portNewsType: {
            type: 'portNewsType',
            autoLoad: true,
        },
    },
    formulas: {
        recordCopy: function (get) {
            return get('record') ? get('record').getData() : {};
        },

        removedAttachmentsIdsFiltered: {
            bind: {
                bindTo: '{removedAttachmentsIds}',
                deep: true,
            },
            get: function (removedAttachmentsIds) {
                removedAttachmentsIds.filter((file) => get('removedAttachmentsIds').includes(file.get('id')));
            },
        },

        portIds: {
            bind: {
                bindTo: '{record.ports}',
                deep: true,
            },
            get: function (ports) {
                const dialog = this.getView();
                const portComboStore = dialog.down('port\\.combo').getStore();
                const addedPortName = [];
                ports.forEach((port) => {
                    const isExistPort = portComboStore.findRecord('port_id', port.id);
                    addedPortName.push({
                        port: {
                            name: port.name,
                            code: port.code || '-',
                        },
                        port_id: port.id,
                        port_name: port.name,
                    });
                });
                if (addedPortName.length > 0) portComboStore.add(addedPortName);
                dialog.setMasked(false);
                return ports.map((port) => port.id) || [];
            },
        },

        commodityIds: {
            bind: {
                bindTo: '{record.commodities}',
            },
            get: function (commodities) {
                const commoditiesIds = commodities.map((commodity) => commodity.id);
                return commoditiesIds;
            },
        },

        validityDate: function (get) {
            const arr = [];
            arr.push(new Date(get('record.validity_from')));
            arr.push(new Date(get('record.validity_to')));
            return arr;
        },

        setAttachments: function (get) {
            const size = Abraxa.utils.Functions.size;
            if (get('isEdit')) {
                const attachments = Ext.clone(get('record.attachments'));
                const files = get('files');
                attachments.getData().items.forEach((attachment) => {
                    files.add(attachment);
                });
            }
        },
    },
});
