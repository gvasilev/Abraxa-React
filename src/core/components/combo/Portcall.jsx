import '../../../store/common/PortcallsRemote';

Ext.define('Abraxa.core.components.combo.Portcall', {
    extend: 'Ext.field.ComboBox',
    xtype: 'portcall.combo',
    selectable: true,
    minChars: 3,
    placeholder: 'Search by Vessel name or id',
    itemTpl:
        '<div class="combo-item">' +
        '<div class="sm-icon sm-type-record"><i class="md-icon-outlined md-18">business_center</i></div>' +
        '<div class="sm-value">{voyage.vessel_name}</div>' +
        '<label class="sm-type">#ABX-{id}</label>' +
        '</div>',
    valueField: 'id',
    displayTpl: new Ext.XTemplate('{[this.create(values)]}', {
        create: function (values) {
            let store = Ext.ComponentQuery.query('portcall\\.combo')[0].getStore(),
                record = store.getById(values.id);

            return record.getVoyage().get('vessel_name');
        },
    }),
    forceSelection: true,
    matchFieldWidth: true,
    triggers: {
        search: {
            side: 'right',
            iconCls: 'md-icon-search',
            style: 'padding-right: 8px;',
        },
        expand: null,
    },
    store: {
        type: 'portcalls.remote',
        autoLoad: false,
    },
    queryMode: 'remote',
    listeners: {
        beforequery: function () {
            let store = this.getStore();
            if (!store.loadCount) store.load();
        },
    },
});
