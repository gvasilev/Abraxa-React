Ext.define('Abraxa.view.portcall.sof.SOFCargolist', {
    extend: 'Ext.dataview.List',
    xtype: 'sof.cargolist',
    selectable: true,
    bind: {
        store: '{cargoGroup}',
    },
    itemConfig: {
        viewModel: {
            formulas: {
                recordIndex: function recordIndex(get) {
                    var store = this.getView().getRecord().store;
                    if (store) {
                        return store.indexOf(get('record'));
                    }
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
        keyMapEnabled: true,
        keyMap: {
            scope: 'this',
            ESC: function () {
                let record = this.upVM().get('selectedCargo.selection'),
                    grid = Ext.ComponentQuery.query('sof\\.cargolist')[0];

                grid.deselectAll();
            },
        },
        xtype: 'container',
        cls: 'a-cargo-list-item',
        items: [
            {
                xtype: 'container',
                cls: 'a-titlebar',
                items: [
                    {
                        xtype: 'title',
                        bind: {
                            html: '<div class="a-badge a-badge-cargo"><i></i></div><div><div class="a-panel-title"><span class="a-qty">{record.quantity ? (record.quantity:number("0,000.###")) : "0,000"}<em>{record.unit ? record.unit : ""}</em></span><span class="a-commodity">{record.commodity ? record.commodity : ("Cargo " + (recordIndex + 1) + "")}<span class="a-function a-function-sm function-{record.function ? record.function : ""}" title="{record.function ? record.function : ""}">{functionIcon}</span></span></div><span class="a-panel-id">#CARGO-{recordIndex + 1}</span></div>',
                        },
                    },
                    {
                        xtype: 'container',
                        bind: {
                            cls: 'a-actions',
                        },
                        items: [
                            {
                                xtype: 'button',
                                menuAlign: 'tr-br',
                                iconCls: 'md-icon-more-horiz',
                                ui: 'tool round tool-md',
                                arrow: false,
                                subObject: 'cargo',
                                bind: {
                                    cls: '{nonEditable ? "hidden" : ""}',
                                    objectPermission: '{objectPermissions}',
                                },
                                tooltip: {
                                    anchorToTarget: true,
                                    html: 'More actions',
                                    align: 'bc-tc?',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                },
                                menu: {
                                    ui: 'medium has-icons',
                                    items: [
                                        {
                                            text: 'Unassign',
                                            cls: null,
                                            arrow: false,
                                            slug: 'portcallCargoReAssign',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            iconCls: 'md-icon-outlined md-icon-assignment-return',
                                            handler: function (me) {
                                                let selectedCargo = me.upVM().get('record'),
                                                    events = me.upVM().get('events'),
                                                    cargoes = me.upVM().get('cargoes');
                                                Ext.Msg.confirm(
                                                    'Unassign',
                                                    'Are you sure you would like to unassign this entry?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            selectedCargo.set('berth_id', null);
                                                            selectedCargo.set('berth_name', null);
                                                            selectedCargo.set('terminal_id', null);
                                                            selectedCargo.set('terminal_name', null);
                                                            cargoes.sync({
                                                                success: function (response, options) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    events.load();
                                                                },
                                                            });
                                                        }
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Unassign',
                                                        },
                                                    ]
                                                );
                                            },
                                        },
                                        {
                                            text: 'Re-assign',
                                            cls: null,
                                            arrow: false,
                                            slug: 'portcallCargoReAssign',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            iconCls: 'md-icon-outlined md-icon-assignment-return',
                                            handler: function () {
                                                let berth = this.upVM().get('activeBerth.selection'),
                                                    cargoes = this.upVM().get('cargoes'),
                                                    berthStore = this.upVM().get('berths'),
                                                    events = this.upVM().get('events'),
                                                    selectedCargo = this.upVM().get('record'),
                                                    berthCargoes = cargoes.queryBy(function (record) {
                                                        return record.get('berth_id') == berth.get('id');
                                                    }).items,
                                                    filteredBerths = berthStore.queryBy(function (record) {
                                                        return record.get('id') != berth.get('id');
                                                    }).items;

                                                Ext.create('Ext.Dialog', {
                                                    title: 'Re-assign cargo',
                                                    maxWidth: 460,
                                                    closable: true,
                                                    viewModel: {
                                                        data: {
                                                            berth: berth,
                                                            berthStore: filteredBerths,
                                                            cargoes: cargoes,
                                                            berthCargoes: berthCargoes,
                                                            berths: berthStore,
                                                        },
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            items: [
                                                                {
                                                                    margin: '16 0 0 0',
                                                                    xtype: 'combobox',
                                                                    queryMode: 'local',
                                                                    forceSelection: true,
                                                                    bind: {
                                                                        store: '{berthStore}',
                                                                    },
                                                                    label: 'Assign to',
                                                                    labelAlign: 'top',
                                                                    placeholder: 'Choose berth',
                                                                    displayField: 'name',
                                                                    valueField: 'id',
                                                                    reference: 'reassignedBerth',
                                                                    listeners: {
                                                                        painted: function () {
                                                                            this.focus();
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                    bbar: {
                                                        items: [
                                                            '->',
                                                            {
                                                                xtype: 'button',
                                                                margin: '0 8 0 0',
                                                                text: 'Cancel',
                                                                handler: function (me) {
                                                                    this.up('dialog').destroy();
                                                                },
                                                            },
                                                            {
                                                                xtype: 'button',
                                                                text: 'Assign',
                                                                ui: 'action alt',
                                                                handler: function (me) {
                                                                    let reassignedBerth =
                                                                            this.upVM().get(
                                                                                'reassignedBerth.selection'
                                                                            ),
                                                                        cargoes = this.upVM().get('cargoes'),
                                                                        berth = this.upVM().get('berth');
                                                                    if (reassignedBerth) {
                                                                        cargoes.each(function (cargo) {
                                                                            if (
                                                                                cargo.get('berth_id') ==
                                                                                    berth.get('id') &&
                                                                                cargo.get('id') ==
                                                                                    selectedCargo.get('id')
                                                                            ) {
                                                                                cargo.set(
                                                                                    'berth_id',
                                                                                    reassignedBerth.get('id')
                                                                                );
                                                                                cargo.set(
                                                                                    'berth_name',
                                                                                    reassignedBerth.get('name')
                                                                                );
                                                                            }
                                                                        });
                                                                        cargoes.sync({
                                                                            success: function (response, options) {
                                                                                Ext.toast('Record updated', 1000);
                                                                                events.load();
                                                                                me.up('dialog').close();
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        ],
                                                    },
                                                }).show();
                                            },
                                            // menu: {
                                            //     cls: 'filter-menu',
                                            //     listeners: {
                                            //         painted: function (me) {
                                            //             me.removeAll(true);

                                            //             let store = me.upVM().get('berths'),
                                            //                 data = store.getData().getRange(),
                                            //                 record = this.upVM().get('record'),
                                            //                 items = [];

                                            //             Ext.each(data, function (value) {
                                            //
                                            //                 if (record.get('da_berth_id') != value.get('id')) {
                                            //                     let item = {
                                            //                         padding: '0 16',
                                            //                         text: value.get('name'),
                                            //                         record: value,
                                            //                         handler: function (cmp) {
                                            //                             let record = this.upVM().get('record'),
                                            //                                 cargoStore = this.upVM().get('cargoes');
                                            //                             Ext.Msg.confirm("Confirmation", ["Are you sure you want to re-assign this cargo"].join(''), function (answer) {
                                            //                                 if (answer == 'yes') {
                                            //                                     record.set('da_berth_id', cmp.getRecord().get('id'));
                                            //                                     cargoStore.sync({
                                            //                                         success: function (response, options) {
                                            //                                             Ext.toast('Record updated', 1000);
                                            //                                         }
                                            //                                     });
                                            //                                 }
                                            //                             });
                                            //                         }
                                            //                     };
                                            //                     items.push(item);
                                            //                 }
                                            //             });
                                            //             if (items.length) {
                                            //                 me.setItems(items);
                                            //             } else {
                                            //                 me.setItems({
                                            //                     xtype: 'div',
                                            //                     cls: 'a-non-menu-info',
                                            //                     html: 'No berths with cargo function to assign to.'
                                            //                 })
                                            //             }
                                            //         }
                                            //     }
                                            // },
                                        },
                                        // {
                                        //     text: 'Delete',
                                        //     ui: 'decline',
                                        //     slug: 'portcallCargoDelete',
                                        //     bind: {
                                        //         permission: '{userPermissions}'
                                        //     },
                                        //     iconCls: 'md-icon-outlined md-icon-delete',
                                        //     handler: function (me) {
                                        //         let record = me.upVM().get('record');
                                        //         let store = me.upVM().get('cargoes');
                                        //         Ext.Msg.confirm(
                                        //             'Delete',
                                        //             'Are you sure you would like to delete this cargo?',
                                        //             function (answer) {
                                        //                 if (answer == 'yes') {
                                        //                     store.remove(record);
                                        //                     store.sync({
                                        //                         success: function (response, options) {
                                        //                             Ext.toast('Record updated', 1000);
                                        //                         }
                                        //                     });
                                        //                 }
                                        //             }, this, [{
                                        //                 xtype: 'button',
                                        //                 itemId: 'no',
                                        //                 margin: '0 8 0 0',
                                        //                 text: 'Cancel'
                                        //             }, {
                                        //                 xtype: 'button',
                                        //                 itemId: 'yes',
                                        //                 ui: 'decline alt',
                                        //                 text: 'Delete'
                                        //             }]
                                        //         );
                                        //     }
                                        // }
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    emptyText: {
        xtype: 'container',
        margin: '24 0 0 0',
        layout: {
            type: 'vbox',
        },
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner no-fill"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9972 -18910)"><g transform="translate(9138 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(10007 18945)"><g transform="translate(2.498 2.5)" fill="none" stroke-linejoin="round"><path d="M24.5,12.373h0l5.625-2.419V9.929l8.42,3.816L47,10.537,24.5,2,2,10.537l22.5,8.539,8.42-3.188ZM2,38.994,23.1,47V21.391L2,13.385Zm5.625-5.076,5.625,2.135v3.035L7.628,36.956Zm30.933-10.2-5.625,2.133V18.722L25.9,21.391V47L47,38.994V13.385l-8.438,3.2Z" stroke="none"/><path d="M 24.49800682067871 2 L 1.997997283935547 10.5364990234375 L 24.49800682067871 19.07525062561035 L 32.91750717163086 15.88700103759766 L 24.50025749206543 12.37250137329102 L 30.12525749206543 9.953750610351562 L 30.12525749206543 9.929000854492188 L 38.54475784301758 13.74499893188477 L 46.99800872802734 10.5364990234375 L 24.49800682067871 2 M 2.002498626708984 13.3849983215332 L 2.002498626708984 38.99449157714844 L 23.09625625610352 47 L 23.09625625610352 21.39049911499023 L 2.002498626708984 13.3849983215332 M 13.25249862670898 39.0889892578125 L 7.627498626708984 36.95600128173828 L 7.627498626708984 33.91849899291992 L 13.25249862670898 36.05376052856445 L 13.25249862670898 39.0889892578125 M 46.99575805664062 13.3849983215332 L 38.55825805664062 16.58675003051758 L 38.56050872802734 23.71475982666016 L 32.93550872802734 25.84774971008301 L 32.93550872802734 18.72200965881348 L 25.90424728393555 21.39049911499023 L 25.90424728393555 47 L 46.99575805664062 38.99449157714844 L 46.99575805664062 13.3849983215332 M 24.49800872802734 3.814697265625e-06 C 24.73846626281738 3.814697265625e-06 24.97892761230469 0.04335403442382812 25.20746612548828 0.1300582885742188 L 47.70746612548828 8.666561126708984 C 48.48425674438477 8.961280822753906 48.99794769287109 9.705539703369141 48.99800872802734 10.53636169433594 C 48.998046875 11.08366394042969 48.77520751953125 11.59341430664062 48.40104675292969 11.96188354492188 C 48.77816390991211 12.33425521850586 48.99575805664062 12.84549331665039 48.99575805664062 13.3849983215332 L 48.99575805664062 38.99449157714844 C 48.99575805664062 39.82526016235352 48.482177734375 40.56951904296875 47.70547866821289 40.86433029174805 L 26.61396598815918 48.86983871459961 C 25.99938011169434 49.10311126708984 25.30939483642578 49.01948165893555 24.76833724975586 48.6461181640625 C 24.67184257507324 48.57953643798828 24.58227920532227 48.50524520874023 24.5002498626709 48.42439651489258 C 24.4182243347168 48.50524520874023 24.32868576049805 48.57951354980469 24.23219680786133 48.64609909057617 C 23.6911563873291 49.01945877075195 23.00118637084961 49.10311126708984 22.38660621643066 48.8698616027832 L 1.2928466796875 40.86434936523438 C 0.5161056518554688 40.5695686340332 0.002498626708984375 39.82527923583984 0.002498626708984375 38.99449157714844 L 0.002498626708984375 13.3849983215332 C 0.002498626708984375 12.84603881835938 0.2196769714355469 12.33526611328125 0.5960807800292969 11.96299362182617 C 0.2212753295898438 11.59445571899414 -0.0020294189453125 11.08423614501953 -0.002002716064453125 10.53641128540039 C -0.001964569091796875 9.705570220947266 0.5117378234863281 8.961280822753906 1.288547515869141 8.666561126708984 L 23.7885570526123 0.1300582885742188 C 24.01709175109863 0.04335403442382812 24.25754928588867 3.814697265625e-06 24.49800872802734 3.814697265625e-06 Z M 37.05620574951172 15.26616668701172 L 30.13203620910645 12.12789916992188 L 29.62617683410645 12.34542083740234 L 33.68810653686523 14.04141998291016 C 34.44394683837891 14.35700988769531 34.93096542358398 15.10157012939453 34.91722869873047 15.92053985595703 C 34.90838623046875 16.44734191894531 34.69348907470703 16.93644332885742 34.33741760253906 17.29556083679199 C 34.71661758422852 17.66820907592773 34.93550872802734 18.18088340759277 34.93550872802734 18.72200965881348 L 34.93550872802734 22.95039176940918 L 36.5600700378418 22.33436012268066 L 36.55825805664062 16.58737945556641 C 36.55810165405273 16.09008407592773 36.74200057983398 15.62371063232422 37.05620574951172 15.26616668701172 Z" stroke="none" fill="#0078d7"/></g></g></g></svg><div class="a-no-content-txt"><span class="fs-13">No cargoes available</span></div></div>',
            },
        ],
    },
    minHeight: 180,
    items: [
        {
            xtype: 'container',
            docked: 'bottom',
            cls: 'a-cargo-total',
            // bind: {
            //     hidden: '{activeBerth.selection.function == "Cargo operations" ? false : true}'
            // },
            layout: {
                type: 'vbox',
                align: 'right',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                    html: '',
                },
                {
                    xtype: 'div',
                    cls: 'a-total a-berth-total',
                    bind: {
                        html: '<div class="h5">BERTH QUANTITY</div><div class="a-qty a-berth-qty">{cargoGroupTotal} {cargoGroupUnit}</div>',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-total',
                    bind: {
                        html: '<div class="h5">TOTAL QUANTITY</div><div class="a-qty a-total-qty">{totalCargoes}</div>',
                    },
                },
            ],
        },
    ],
    // listeners: {
    //     childtap: function (cmp, item) {
    //         if (item.sourceElement.classList.value.indexOf('no_show') >= 0 || item.sourceElement.classList.value == 'x-button-el')
    //             return false;
    //     }
    // }
});
