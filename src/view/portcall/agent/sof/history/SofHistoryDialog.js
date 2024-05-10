Ext.define('AbraxaLive.view.portcall.sof.history.HistorySofDialog', {
    extend: 'Ext.Dialog',
    xtype: 'sof.history.dialog',
    bind: {
        title: '{dialogTitle}',
    },
    closable: true,
    showAnimation: 'pop',
    scrollable: 'y',
    width: 1024,
    height: '80%',
    maxHeight: 800,
    layout: 'vbox',
    draggable: false,
    padding: 0,
    items: [
        {
            xtype: 'container',
            padding: '8 24',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'selectfield',
                    valueField: 'id',
                    minWidth: 200,
                    displayTpl: new Ext.XTemplate(
                        'V{[ this.getIndex(values.id) ]} - {[this.parseDate(values.created_at)]}',
                        {
                            parseDate: function (date) {
                                if (date) {
                                    let localTime = moment.utc(date).toDate();
                                    return moment(localTime).format('D MMM - HH:mm');
                                }
                            },
                            getIndex: function (id) {
                                let store = Ext.getStore('SofHistoryStore'),
                                    record = store.getById(id);
                                if (store.indexOf(record) === 0) {
                                    return store.getCount();
                                } else {
                                    return store.getCount() - store.indexOf(record);
                                }
                            },
                        }
                    ),
                    itemTpl: new Ext.XTemplate(
                        'V{[ this.getIndex(values.id) ]} - {[this.parseDate(values.created_at)]}',
                        {
                            parseDate: function (date) {
                                if (date) {
                                    let localTime = moment.utc(date).toDate();
                                    return moment(localTime).format('D MMM - HH:mm');
                                }
                            },
                            getIndex: function (id) {
                                let store = Ext.getStore('SofHistoryStore'),
                                    record = store.getById(id);

                                if (store.indexOf(record) === 0) {
                                    return store.getCount();
                                } else {
                                    return store.getCount() - store.indexOf(record);
                                }
                            },
                        }
                    ),
                    reference: 'SofHistoryVersion',
                    ui: 'classic',
                    cls: 'a-field-icon a-icon-small icon-history non-editable',
                    bind: {
                        store: '{history}',
                        value: '{selectedId}',
                    },
                    queryMode: 'local',
                },
                {
                    xtype: 'updated-by',
                    bind: {
                        data: '{disbursement}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    //history grid
                    xtype: 'sof.history.grid',
                },
            ],
        },
    ],
});
