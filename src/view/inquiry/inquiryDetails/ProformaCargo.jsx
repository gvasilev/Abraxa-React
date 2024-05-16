Ext.define('Abraxa.view.inquiry.inquiryDetails.ProformaQuoteCargo', {
    extend: 'Ext.Container',
    xtype: 'proforma.cargo',
    cls: 'a-dialog-form-list',
    // slug: 'portcallCargoGeneral',
    // bind: {
    //     permission: '{userPermissions}'
    // },
    padding: '0 24 0 72',
    items: [
        {
            xtype: 'abraxa.formlist',
            cls: 'a-portcall-data a-cargo-data',
            bind: {
                store: '{object_record.cargoes}',
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
                        padding: 0,
                        items: [
                            {
                                xtype: 'div',
                                cls: 'hbox',
                                bind: {
                                    html: '<div><div class="a-cargo-title"><span class="a-qty">{record.quantity:number("0,000.###")} {record.unit}</span><span class="a-commodity">{record.commodity}</span><span class="a-function a-function-sm function-{record.function ? record.function : ""}" title="{record.function ? record.function : ""}">{functionIcon}</span></div><div class="a-cargo-subtitle">#Cargo {recordIndex + 1}</div></div>',
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
});
