Ext.define('Abraxa.view.cdb.company.AppointmentsDialog', {
    extend: 'Ext.Dialog',
    xtype: 'AppointmentsDialog',
    itemId: 'appointmentsDialog',
    testID: 'appointmentsDialog',
    layout: 'vbox',
    ui: 'dialog-md type3',
    cls: 'a-dialog-color a-dialog-vessel',
    minWidth: '835',
    minHeight: '516',
    maxHeight: '90%',
    margin: 0,
    padding: 0,
    closable: true,
    items: [
        {
            xtype: 'grid',
            cls: 'a-offset-grid abraxa-grid a-bt-100',
            ui: 'bordered',
            flex: 1,
            selectable: false,
            bind: {
                store: '{appointments}',
            },
            itemConfig: {
                height: 62,
                cls: 'a-detailed-item',
            },
            columns: [
                {
                    text: 'Vessel',
                    dataIndex: 'vessel_name',
                    flex: 1,

                    cell: {
                        encodeHtml: false,
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a.a-vessel-name',
                                fn: function fn() {
                                    const cmp = this.component;
                                    const dialog = cmp.up('AppointmentsDialog');
                                    const recordId = cmp.getRecord().get('id');
                                    Ext.getCmp('main-viewport').setMasked({
                                        xtype: 'viewport.mask',
                                    });
                                    Ext.getCmp('main-viewport')
                                        .getController()
                                        .redirectTo('portcall/' + recordId);

                                    dialog.close();
                                },
                            },
                        },
                    },
                    renderer: function (value, record) {
                        if (!value) return AbraxaConstants.placeholders.emptyCellSpan;
                        let vesselName = value;
                        let vesselId = record.get('vessel_id') || '';
                        return AbraxaFunctions.renderVesselCell(vesselName, vesselId);
                    },
                },
                {
                    text: 'Status',
                    dataIndex: 'status',
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (statusObj, record) {
                        if (!statusObj || !statusObj.name) return AbraxaConstants.placeholders.emptyStatusDiv;
                        const statusString = statusObj.name;
                        const classString = statusObj.string;

                        return AbraxaFunctions.renderStatusCell(classString, statusString);
                    },
                    sorter: {
                        sorterFn: function (record1, record2) {
                            let val1 = record1.get('status').name || '';
                            let val2 = record2.get('status').name || '';
                            return val1.localeCompare(val2);
                        },
                    },
                },
                {
                    text: 'Appointment date',
                    dataIndex: 'nomination_date',
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (value, record) {
                        if (!value) return AbraxaConstants.placeholders.emptySpan;

                        const dateFormatted = Abraxa.utils.Functions.formatStringToDate(
                            value,
                            AbraxaConstants.formatters.date.dayMonYearShortHyphenTime24
                        );

                        return Abraxa.utils.Functions.createPlaceHolders(dateFormatted, 'span');
                    },
                    sorter: {
                        sorterFn: function (record1, record2) {
                            let val1 = new Date(record1.get('nomination_date'));
                            let val2 = new Date(record2.get('nomination_date'));
                            if (val1 instanceof Date && !isNaN(val1)) {
                                val1 = val1.getTime();
                            } else {
                                val1 = 0;
                            }

                            if (val2 instanceof Date && !isNaN(val2)) {
                                val2 = val2.getTime();
                            } else {
                                val2 = 0;
                            }
                            return val1 - val2;
                        },
                    },
                },
            ],
        },
    ],
});
