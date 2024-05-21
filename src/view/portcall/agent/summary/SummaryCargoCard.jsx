Ext.define('Abraxa.view.portcall.summary.SummaryCargoCard', {
    extend: 'Ext.Container',
    xtype: 'portcall.summary.cargo.card',
    cls: 'a-dialog-form-list',
    slug: 'portcallCargoGeneral',
    bind: {
        permission: '{userPermissions}',
    },
    items: [
        {
            xtype: 'abraxa.formlist',
            cls: 'a-portcall-data a-cargo-data',
            bind: {
                store: '{cargoes}',
            },
            itemConfig: {
                viewModel: {
                    formulas: {
                        recordIndex: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record) {
                                    let store = record.store;
                                    return store.indexOf(record);
                                }
                            },
                        },
                        functionIcon: {
                            bind: {
                                bindTo: '{record.function}',
                                deep: true,
                            },
                            get: function (func) {
                                let str = '';
                                if (func) {
                                    switch (func) {
                                        case 'Loading':
                                            str = 'L';
                                            break;
                                        case 'Discharging':
                                            str = 'D';
                                            break;
                                        case 'Transshipment':
                                            str = 'TS';
                                            break;
                                        case 'Lightering':
                                            str = 'LT';
                                            break;

                                        default:
                                            break;
                                    }
                                }
                                return str;
                            },
                        },
                    },
                },
                xtype: 'container',
                cls: 'a-cargo-container',
                items: [
                    {
                        xtype: 'container',
                        cls: 'a-cargo-titlebar',
                        padding: '0 16',
                        items: [
                            {
                                xtype: 'div',
                                cls: 'hbox',
                                bind: {
                                    html: '<div class="a-cargo fw-b"><span class="text-truncate">Cargo {recordIndex + 1} - {record.quantity:number("0,000.###")} {record.unit} - {record.commodity}</span><span class="a-function a-function-sm function-{record.function ? record.function : ""}" title="{record.function ? record.function : ""}">{functionIcon}</span></span></div>',
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
});
