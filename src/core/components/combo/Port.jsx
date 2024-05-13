import '../../../store/common/Port';

Ext.define('Abraxa.core.components.combo.Port', {
    extend: 'Ext.field.ComboBox',
    xtype: 'port.combo',
    // itemId: 'portCombo',
    label: 'Ports',
    minChars: 3,
    forceSelection: true,
    placeholder: 'Enter port',
    clearable: true,
    autoFocus: true,
    itemTpl:
        '<div class="combo-item">' +
        '<div class="sm-icon"><i class="md-icon-outlined md-18">place</i></div>' +
        '<label class="sm-type">{code}</label>' +
        '<div class="sm-value">{port_name}</div>' +
        '</div>',
    valueField: 'port_id',
    displayField: 'port_name',
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
        expand: null,
    },
    store: {
        type: 'port',
        autoLoad: false,
    },
    queryMode: 'remote',
    config: {
        initialStore: null,
        value: null,
    },
    initialize: function () {
        // this.callParent(arguments);

        const vm = this.getViewModel();
        const combo = this;
        if (!combo._multiSelect) return;

        combo.on(
            'keydown',
            function (combo, error, eOpts) {
                Ext.ComponentQuery.query('port\\.combo').forEach((element) => {
                    if (element.containsFocus) {
                        element.config.value = element.getValue() ? [...element.getValue()] : [];
                        if (!element.getValue()) {
                            element.config.initialStore = [];
                        }
                    }
                });
            },
            this
        );

        combo.on(
            'mousedown',
            function (combo, error, eOpts) {
                Ext.ComponentQuery.query('port\\.combo').forEach((element) => {
                    if (element.containsFocus) {
                        element.config.value = element.getValue() ? [...element.getValue()] : [];
                        if (!element.getValue()) {
                            element.config.initialStore = [];
                        }
                    }
                });
            },
            this
        );

        combo.on('change', function (combo, newValue, oldValue, eOpts) {
            if (newValue && newValue.length > 0) {
                const selectedRecord = combo
                    .getStore()
                    .getData()
                    .items.filter((record) => newValue.includes(record.get(combo.getValueField())));
                if (combo.config.initialStore) {
                    combo.config.initialStore = [...combo.config.initialStore, ...selectedRecord];
                } else {
                    combo.setValue([...newValue]);
                }
            }
        }),
            combo.getStore().on(
                'load',
                function (store, records, successful, operation, eOpts) {
                    setTimeout(() => {
                        if (!combo.config.initialStore && combo.getStore().getCount() > 0) {
                            combo.config.initialStore = [...combo.getStore().getData().items];
                        }
                        if (combo.config.initialStore && combo.config.initialStore.length > 0) {
                            const array = [...combo.config.initialStore, ...combo.getStore().getData().items];

                            const uniqueArray = array.filter((current, index, self) => {
                                return (
                                    index ===
                                    self.findIndex(
                                        (item) =>
                                            item.data[combo.getValueField()] === current.data[combo.getValueField()]
                                    )
                                );
                            });
                            combo.getStore().loadData(uniqueArray.reverse());
                            combo.setValue(combo.config.value ? [...combo.config.value] : []);
                        }
                    }, 0);
                },
                this
                // { single: true }
            );
    },
    listeners: {
        beforequery: function () {
            let store = this.getStore();
            if (!store.loadCount) store.load();
        },
    },
});
