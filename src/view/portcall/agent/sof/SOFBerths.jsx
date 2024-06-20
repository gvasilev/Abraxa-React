import './SOFCargolist';
//import '../../../../core/components/fields/Abraxa.Draftfield';
Ext.define('Abraxa.view.portcall.sof.SOFBerths', {
    extend: 'Ext.Container',
    xtype: 'sof.berths',
    flex: 1,
    height: '100%',
    layout: 'hbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-bnc-main a-bnc-berths',
            scrollable: 'y',
            items: [
                {
                    padding: '0 24 0 0',
                    plugins: {
                        lazyitems: {
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar a-bb-100',
                                    padding: 0,
                                    subObject: 'berth',
                                    bind: {
                                        objectPermission: '{objectPermissions}',
                                        cls: '{nonEditable ? "hidden a-titlebar a-bb-100" : "a-titlebar a-bb-100"}',
                                    },
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: 'Berth',
                                            ui: 'action small',
                                            iconCls: 'md-icon-add',
                                            subObject: 'berth',
                                            slug: 'portcallBerthAdd',
                                            bind: {
                                                cls: '{nonEditable ? "hidden" : ""}',
                                                objectPermission: '{objectPermissions}',
                                                permission: '{userPermissions}',
                                            },
                                            handler: function () {
                                                let store = this.upVM().get('berths'),
                                                    berth_list = Ext.ComponentQuery.query('ops\\.berth\\.menu')[0];

                                                let record = {};

                                                store.add({
                                                    name: 'TBN',
                                                });
                                                store.sync({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                        mixpanel.track('Add berth');
                                                    },
                                                });
                                                berth_list.select(store.getData().getAt(store.getCount() - 1));
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-tools',
                                            bind: {
                                                hidden: '{berths.count ? false: true}',
                                            },
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            items: [
                                                {
                                                    xtype: 'checkbox',
                                                    boxLabel: 'Set as current',
                                                    slug: 'portcallBerthCurrent',
                                                    subObject: 'berth',
                                                    bind: {
                                                        checked: '{activeBerth.selection.is_current}',
                                                        cls: '{nonEditable ? "hidden" : ""}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                    listeners: {
                                                        click: {
                                                            element: 'boxElement',
                                                            scope: this,
                                                            fn: function (a, b, c, d) {
                                                                a.event.preventDefault();
                                                                var cmp = Ext.get(a.getTarget()).component;
                                                                var componentIsChecked = cmp.isChecked();
                                                                if (componentIsChecked) {
                                                                    cmp.uncheck();
                                                                } else {
                                                                    cmp.check();
                                                                }

                                                                let berthStore = cmp.upVM().get('berths'),
                                                                    record = cmp.upVM().get('activeBerth.selection');

                                                                berthStore.each(function (record) {
                                                                    record.set('is_current', 0);
                                                                });

                                                                record.set('is_current', componentIsChecked);

                                                                berthStore.sync({
                                                                    success: function () {
                                                                        Ext.toast('Record updated');
                                                                    },
                                                                });
                                                                return false;
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'button',
                                                    margin: '0 0 0 16',
                                                    iconCls: 'md-icon-outlined md-icon-delete',
                                                    ui: 'tool-text-sm',
                                                    text: 'Delete berth',
                                                    slug: 'portcallBerthDelete',
                                                    subObject: 'berth',
                                                    bind: {
                                                        cls: '{nonEditable ? "hidden" : ""}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                    handler: function () {
                                                        let berth = this.upVM().get('activeBerth.selection'),
                                                            cargoes = this.upVM().get('cargoes'),
                                                            berthStore = this.upVM().get('berths'),
                                                            events = this.upVM().get('events'),
                                                            berthCargoes = cargoes.queryBy(function (record) {
                                                                return record.get('berth_id') == berth.get('id');
                                                            }).items,
                                                            filteredBerths = berthStore.queryBy(function (record) {
                                                                return record.get('id') != berth.get('id');
                                                            }).items;

                                                        Ext.create('Ext.Dialog', {
                                                            title: 'Delete',
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
                                                                            xtype: 'div',
                                                                            html: 'Are you sure you would like to delete this entry?',
                                                                        },
                                                                        {
                                                                            xtype: 'container',
                                                                            margin: '16 0 0 0',
                                                                            hidden: true,
                                                                            bind: {
                                                                                hidden: '{berthCargoes.length ? false: true}',
                                                                            },
                                                                            items: [
                                                                                {
                                                                                    html: "The berth has cargoes assigned to it. If you'd like you can re-assign them, otherwise they will be deleted.",
                                                                                },
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
                                                                        text: 'Delete',
                                                                        ui: 'decline alt',
                                                                        handler: function (me) {
                                                                            let reassignedBerth =
                                                                                    this.upVM().get(
                                                                                        'reassignedBerth.value'
                                                                                    ),
                                                                                cargoes = this.upVM().get('cargoes'),
                                                                                berths = this.upVM().get('berths'),
                                                                                berth = this.upVM().get('berth'),
                                                                                berthIndex = berths.indexOf(berth);
                                                                            let count = berths.getCount(),
                                                                                recordIndex = berthIndex,
                                                                                selectedRecord = berthIndex - 1;
                                                                            if (count > 1 && recordIndex == 0) {
                                                                                selectedRecord = recordIndex;
                                                                            }
                                                                            const expenses = this.upVM().get('expenses');

                                                                            if (reassignedBerth) {
                                                                                cargoes.each(function (cargo) {
                                                                                    if (
                                                                                        cargo.get('berth_id') ==
                                                                                        berth.get('id')
                                                                                    ) {
                                                                                        cargo.set(
                                                                                            'berth_id',
                                                                                            reassignedBerth
                                                                                        );
                                                                                    }
                                                                                });
                                                                                cargoes.sync({
                                                                                    success: function (
                                                                                        response,
                                                                                        options
                                                                                    ) {
                                                                                        berths.remove(berth);
                                                                                        berths.sync({
                                                                                            success: function () {
                                                                                                Ext.toast(
                                                                                                    'Record updated',
                                                                                                    1000
                                                                                                );
                                                                                                me.up('dialog').close();
                                                                                                Ext.ComponentQuery.query(
                                                                                                    'ops\\.berth\\.menu'
                                                                                                )[0].select(
                                                                                                    berths
                                                                                                        .getData()
                                                                                                        .getAt(
                                                                                                            selectedRecord
                                                                                                        )
                                                                                                );
                                                                                                events.load();
                                                                                            },
                                                                                        });
                                                                                    },
                                                                                });
                                                                            } else {
                                                                                berths.remove(berth);
                                                                                berths.sync({
                                                                                    success: function () {
                                                                                        cargoes.each(function (cargo) {
                                                                                            if (
                                                                                                cargo.get('berth_id') ==
                                                                                                berth.get('id')
                                                                                            ) {
                                                                                                cargoes.remove(cargo);
                                                                                            }
                                                                                        });
                                                                                        if (cargoes.needsSync) {
                                                                                            cargoes.sync();
                                                                                        }
                                                                                        Ext.toast(
                                                                                            'Record updated',
                                                                                            1000
                                                                                        );
                                                                                        me.up('dialog').close();
                                                                                        let count = berths.getCount(),
                                                                                            recordIndex = berthIndex,
                                                                                            selectedRecord =
                                                                                                berthIndex - 1;
                                                                                        if (
                                                                                            count > 1 &&
                                                                                            recordIndex == 0
                                                                                        ) {
                                                                                            selectedRecord =
                                                                                                recordIndex;
                                                                                        }
                                                                                        Ext.ComponentQuery.query(
                                                                                            'ops\\.berth\\.menu'
                                                                                        )[0].select(
                                                                                            berths
                                                                                                .getData()
                                                                                                .getAt(selectedRecord)
                                                                                        );
                                                                                        events.load();
                                                                                    },
                                                                                });
                                                                            }
                                                                            if (expenses) {
                                                                                let records = expenses.queryBy(
                                                                                    function (rec) {
                                                                                        return (
                                                                                            rec.get('place_name') ==
                                                                                            berth.get('name')
                                                                                        );
                                                                                    }
                                                                                );
                                                                                if (records.items.length) {
                                                                                    Ext.each(
                                                                                        records.items,
                                                                                        function (value) {
                                                                                            value.set(
                                                                                                'place_name',
                                                                                                undefined
                                                                                            );
                                                                                            value.set(
                                                                                                'place_id',
                                                                                                undefined
                                                                                            );
                                                                                        }
                                                                                    );
                                                                                    if (expenses.needsSync) {
                                                                                        expenses.sync();
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        }).show();
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    bind: {
                                        hidden: '{berths.count ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            cls: 'a-berth-heading',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            items: [
                                                {
                                                    xtype: 'port.berths',
                                                    cls: 'a-field-icon icon-berth',
                                                    label: false,
                                                    flex: 1,
                                                    placeholder: 'Enter berth name',
                                                    store: [],
                                                    subObject: 'berth',
                                                    slug: 'portcallBerthTerminal',
                                                    ui: 'field-xl no-border classic',
                                                    bind: {
                                                        store: '{berthsStore}',
                                                        value: '{activeBerth.selection.berth_id}',
                                                        inputValue: '{activeBerth.selection.name}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly field-xl no-border classic" : "field-xl no-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                    listeners: {
                                                        select: function () {
                                                            if (this.getSelection()) {
                                                                let berth = this.getSelection();
                                                                let record = this.upVM().get('activeBerth.selection');
                                                                let expenses = this.upVM().get('expenses');
                                                                let cargoes = this.upVM().get('cargoes');
                                                                if (expenses) {
                                                                    let records = expenses.queryBy(function (rec) {
                                                                        return (
                                                                            rec.get('place_name') == record.get('name')
                                                                        );
                                                                    });
                                                                    if (records.items.length) {
                                                                        Ext.each(records.items, function (value) {
                                                                            value.set('place_name', berth.get('name'));
                                                                        });
                                                                        if (expenses.needsSync) {
                                                                            expenses.sync();
                                                                        }
                                                                    }
                                                                }
                                                                record.set('name', this.getSelection().get('name'));
                                                                record.set(
                                                                    'terminal_id',
                                                                    parseInt(this.getSelection().get('terminal_id'))
                                                                );
                                                                if (cargoes && cargoes.getCount()) {
                                                                    cargoes.each(function (cargo) {
                                                                        if (cargo.get('berth_id') == record.get('id')) {
                                                                            cargo.set('berth_name', berth.get('name'));
                                                                            cargo.set(
                                                                                'terminal_id',
                                                                                parseInt(berth.get('terminal_id'))
                                                                            );
                                                                        }
                                                                    });
                                                                    cargoes.sync();
                                                                }
                                                            }
                                                        },
                                                        blur: function () {
                                                            let berthStore = this.upVM().get('berths');
                                                            if (berthStore) {
                                                                berthStore.sync({
                                                                    success: function () {
                                                                        Ext.toast('Record updated', 1000);
                                                                    },
                                                                });
                                                            }
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-berth-form a-berth-general',
                                            maxWidth: 480,
                                            defaults: {
                                                cls: 'a-field-icon icon-short icon-rounded',
                                                labelAlign: 'left',
                                                ui: 'hovered-border classic',
                                                listeners: {
                                                    blur: function () {
                                                        let berthStore = this.upVM().get('berths');
                                                        if (berthStore) {
                                                            berthStore.sync({
                                                                success: function () {
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                            });
                                                        }
                                                    },
                                                },
                                            },
                                            items: [
                                                {
                                                    xtype: 'port.terminals',
                                                    label: 'Terminal',
                                                    slug: 'portcallBerthTerminal',
                                                    subObject: 'berth',
                                                    bind: {
                                                        store: '{terminals}',
                                                        value: '{activeBerth.selection.terminal_id}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                    listeners: {
                                                        select: function () {
                                                            let record = this.upVM().get('activeBerth.selection');

                                                            if (
                                                                this.getSelection().get('id') !=
                                                                record.get('terminal_id')
                                                            ) {
                                                                record.set('berth_id', null);
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'Function',
                                                    valueField: 'name',
                                                    displayField: 'name',
                                                    placeholder: 'Choose function',
                                                    slug: 'portcallBerthFunction',
                                                    subObject: 'berth',
                                                    bind: {
                                                        value: '{activeBerth.selection.function}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border non-editable classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                    store: {
                                                        type: 'berth.function',
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'Alongside',
                                                    placeholder: 'Enter side',
                                                    slug: 'portcallBerthAlongside',
                                                    subObject: 'berth',
                                                    bind: {
                                                        value: '{activeBerth.selection.side_alongside}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border non-editable classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                    options: ['Port side', 'Starboard side'],
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-berth-form a-berth-prospects',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    layout: {
                                                        type: 'hbox',
                                                        pack: 'space-between',
                                                        align: 'center',
                                                    },
                                                    defaults: {
                                                        cls: 'a-field-icon icon-rounded',
                                                        labelAlign: 'left',
                                                        ui: 'hovered-border classic',
                                                        listeners: {
                                                            focusleave: function () {
                                                                let berthStore = this.upVM().get('berths');
                                                                if (berthStore) {
                                                                    berthStore.sync({
                                                                        success: function () {
                                                                            Ext.toast('Record updated', 1000);
                                                                        },
                                                                    });
                                                                }
                                                            },
                                                        },
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'abraxa.datetimefield',
                                                            label: 'ETB',
                                                            dateFieldMaxWidth: 120,
                                                            margin: '0 16 0 0',
                                                            slug: 'portcallBerthEtb',
                                                            subObject: 'berth',
                                                            bind: {
                                                                dateTime: '{activeBerth.selection.etb}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                            listeners: {
                                                                focusleave: function () {
                                                                    let berthStore = this.upVM().get('berths'),
                                                                        record = this.upVM().get('object_record');
                                                                    if (berthStore) {
                                                                        berthStore.sync({
                                                                            success: function () {
                                                                                let url =
                                                                                    Env.ApiEndpoint +
                                                                                    'kpi/portcall-prospects/' +
                                                                                    record.get('id');
                                                                                Ext.ComponentQuery.query(
                                                                                    '[itemId=prospectChart]'
                                                                                )[0].setChartDataUrl(url, 'json');
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'abraxa.datetimefield',
                                                            label: 'Berthed',
                                                            slug: 'portcallBerthAtb',
                                                            subObject: 'berth',
                                                            dateFieldMaxWidth: 120,
                                                            bind: {
                                                                dateTime: '{activeBerth.selection.berthed}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                            listeners: {
                                                                focusleave: function () {
                                                                    let berthStore = this.upVM().get('berths'),
                                                                        record = this.upVM().get('object_record');
                                                                    if (berthStore) {
                                                                        berthStore.sync({
                                                                            success: function () {
                                                                                let url =
                                                                                    Env.ApiEndpoint +
                                                                                    'kpi/portcall-prospects/' +
                                                                                    record.get('id');
                                                                                Ext.ComponentQuery.query(
                                                                                    '[itemId=prospectChart]'
                                                                                )[0].setChartDataUrl(url, 'json');
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    layout: {
                                                        type: 'hbox',
                                                        pack: 'space-between',
                                                        align: 'center',
                                                    },
                                                    defaults: {
                                                        cls: 'a-field-icon icon-rounded',
                                                        labelAlign: 'left',
                                                        ui: 'hovered-border classic',
                                                        listeners: {
                                                            blur: function () {
                                                                let berthStore = this.upVM().get('berths');
                                                                if (berthStore) {
                                                                    berthStore.sync({
                                                                        success: function () {
                                                                            Ext.toast('Record updated', 1000);
                                                                        },
                                                                    });
                                                                }
                                                            },
                                                        },
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'abraxa.datetimefield',
                                                            label: 'ETC',
                                                            dateFieldMaxWidth: 120,
                                                            margin: '0 16 0 0',
                                                            slug: 'portcallBerthEtc',
                                                            subObject: 'berth',
                                                            bind: {
                                                                dateTime: '{activeBerth.selection.etc}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'abraxa.datetimefield',
                                                            label: 'Completed',
                                                            dateFieldMaxWidth: 120,
                                                            slug: 'portcallBerthAtc',
                                                            subObject: 'berth',
                                                            bind: {
                                                                dateTime: '{activeBerth.selection.completed}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    layout: {
                                                        type: 'hbox',
                                                        pack: 'space-between',
                                                        align: 'center',
                                                    },
                                                    defaults: {
                                                        cls: 'a-field-icon icon-rounded',
                                                        labelAlign: 'left',
                                                        ui: 'hovered-border classic',
                                                        listeners: {
                                                            blur: function () {
                                                                let berthStore = this.upVM().get('berths');
                                                                if (berthStore) {
                                                                    berthStore.sync({
                                                                        success: function () {
                                                                            Ext.toast('Record updated', 1000);
                                                                        },
                                                                    });
                                                                }
                                                            },
                                                        },
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'abraxa.datetimefield',
                                                            label: 'ETD',
                                                            dateFieldMaxWidth: 120,
                                                            slug: 'portcallBerthEtd',
                                                            subObject: 'berth',
                                                            margin: '0 16 0 0',
                                                            bind: {
                                                                dateTime: '{activeBerth.selection.etd}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'abraxa.datetimefield',
                                                            label: 'Departed',
                                                            slug: 'portcallBerthDeparted',
                                                            subObject: 'berth',
                                                            dateFieldMaxWidth: 120,
                                                            bind: {
                                                                dateTime: '{activeBerth.selection.departed}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'ml-16 pt-8',
                                            slug: 'portcallBerthOperationalRemarks',
                                            html: '<h5 class="mb-0">Operational remarks</h5>',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            margin: 8,
                                            slug: 'portcallBerthOperationalRemarks',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'textareafield',
                                                    label: false,
                                                    // maxHeight: '68',
                                                    scrollable: true,
                                                    minHeight: 64,
                                                    slug: 'portcallBerthOperationalRemarks',
                                                    subObject: 'berth',
                                                    ui: 'hovered-border classic',
                                                    placeholder: 'Enter remarks',
                                                    bind: {
                                                        value: '{activeBerth.selection.prospects}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                    listeners: {
                                                        focusleave: function () {
                                                            let berthStore = this.upVM().get('berths');

                                                            if (berthStore) {
                                                                berthStore.sync({
                                                                    success: function () {
                                                                        Ext.toast('Record updated', 1000);
                                                                    },
                                                                });
                                                            }
                                                        },
                                                        change: function () {
                                                            if (this.initialConfig.height) return;
                                                            if (!this.inputElement.dom.style.overflow)
                                                                this.inputElement.dom.style.overflow = 'hidden';
                                                            this.setHeight(1);
                                                            var reqHeight = this.inputElement.dom.scrollHeight;
                                                            this.setHeight(reqHeight + 2);
                                                            return;
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-separator',
                                            slug: 'portcallBerthDrafts',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            html: '<h5>Drafts</h5><div class="a-title a-fore">FORE</div><div class="a-title a-aft">AFT</div>',
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-berth-form a-berth-drafts',
                                            slug: 'portcallBerthDrafts',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    layout: 'hbox',
                                                    defaults: {
                                                        cls: 'a-field-icon icon-short icon-rounded',
                                                        labelAlign: 'left',
                                                        ui: 'hovered-border classic',
                                                        listeners: {
                                                            blur: function () {
                                                                let berthStore = this.upVM().get('berths');
                                                                if (berthStore) {
                                                                    berthStore.sync({
                                                                        success: function () {
                                                                            Ext.toast('Record updated', 1000);
                                                                        },
                                                                    });
                                                                }
                                                            },
                                                        },
                                                    },
                                                    items: [
                                                        //                                                        {
                                                        //                                                            xtype: 'draftfield',
                                                        //                                                            ui: 'hovered-border classic',
                                                        //                                                            label: 'Arrival',
                                                        //                                                            slug: 'portcallBerthDrafts',
                                                        //                                                            subObject: 'berth',
                                                        //                                                            options: ['m', 'dm', 'cm'],
                                                        //                                                            bind: {
                                                        //                                                                value: '{activeBerth.selection.arrival_drafts_fore}',
                                                        //                                                                valueUnit:
                                                        //                                                                    '{activeBerth.selection.arrival_drafts_fore_unit}',
                                                        //                                                                readOnly: '{nonEditable ? true : false}',
                                                        //                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        //                                                                permission: '{userPermissions}',
                                                        //                                                                objectPermission: '{objectPermissions}',
                                                        //                                                            },
                                                        //                                                        },
                                                        //                                                        {
                                                        //                                                            xtype: 'div',
                                                        //                                                            width: 60,
                                                        //                                                        },
                                                        //                                                        {
                                                        //                                                            xtype: 'draftfield',
                                                        //                                                            label: false,
                                                        //                                                            slug: 'portcallBerthDrafts',
                                                        //                                                            subObject: 'berth',
                                                        //                                                            options: ['m', 'dm', 'cm'],
                                                        //                                                            bind: {
                                                        //                                                                value: '{activeBerth.selection.arrival_drafts_aft}',
                                                        //                                                                valueUnit:
                                                        //                                                                    '{activeBerth.selection.arrival_drafts_aft_unit}',
                                                        //                                                                readOnly: '{nonEditable ? true : false}',
                                                        //                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        //                                                                permission: '{userPermissions}',
                                                        //                                                                objectPermission: '{objectPermissions}',
                                                        //                                                            },
                                                        //                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    layout: 'hbox',
                                                    slug: 'portcallBerthDrafts',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                    },
                                                    defaults: {
                                                        cls: 'a-field-icon icon-short icon-rounded',
                                                        labelAlign: 'left',
                                                        ui: 'hovered-border classic',
                                                        listeners: {
                                                            blur: function () {
                                                                let berthStore = this.upVM().get('berths');
                                                                if (berthStore) {
                                                                    berthStore.sync({
                                                                        success: function () {
                                                                            Ext.toast('Record updated', 1000);
                                                                        },
                                                                    });
                                                                }
                                                            },
                                                        },
                                                    },
                                                    items: [
                                                        //                                                        {
                                                        //                                                            xtype: 'draftfield',
                                                        //                                                            label: 'Departure',
                                                        //                                                            slug: 'portcallBerthDrafts',
                                                        //                                                            subObject: 'berth',
                                                        //                                                            options: ['m', 'dm', 'cm'],
                                                        //                                                            bind: {
                                                        //                                                                value: '{activeBerth.selection.departure_drafts_fore}',
                                                        //                                                                valueUnit:
                                                        //                                                                    '{activeBerth.selection.departure_drafts_fore_unit}',
                                                        //                                                                readOnly: '{nonEditable ? true : false}',
                                                        //                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        //                                                                permission: '{userPermissions}',
                                                        //                                                                objectPermission: '{objectPermissions}',
                                                        //                                                            },
                                                        //                                                        },
                                                        //                                                        {
                                                        //                                                            xtype: 'div',
                                                        //                                                            width: 60,
                                                        //                                                        },
                                                        //                                                        {
                                                        //                                                            xtype: 'draftfield',
                                                        //                                                            label: false,
                                                        //                                                            options: ['m', 'dm', 'cm'],
                                                        //                                                            slug: 'portcallBerthDrafts',
                                                        //                                                            subObject: 'berth',
                                                        //                                                            bind: {
                                                        //                                                                value: '{activeBerth.selection.departure_drafts_aft}',
                                                        //                                                                valueUnit:
                                                        //                                                                    '{activeBerth.selection.departure_drafts_aft_unit}',
                                                        //                                                                readOnly: '{nonEditable ? true : false}',
                                                        //                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        //                                                                permission: '{userPermissions}',
                                                        //                                                                objectPermission: '{objectPermissions}',
                                                        //                                                            },
                                                        //                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-separator',
                                            slug: 'portcallBerthTowage',
                                            html: '<h5>Port services</h5><div class="a-title a-toberth">TO BERTH</div><div class="a-title a-fromberth">FROM BERTH</div>',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.formlist',
                                            store: [],
                                            bind: {
                                                store: '{berthServices}',
                                            },
                                            minHeight: 48,
                                            emptyText: 'No port services',
                                            itemConfig: {
                                                viewModel: {
                                                    formulas: {
                                                        towage_sequence: {
                                                            bind: {
                                                                bindTo: '{berthServices}',
                                                                deep: true,
                                                            },
                                                            get: function (store) {
                                                                if (store) {
                                                                    let store = this.get('berthServices'),
                                                                        record = this.get('record'),
                                                                        count = store.indexOf(record);

                                                                    return 'Towage ' + (count == 0 ? '' : count + 1);
                                                                }
                                                            },
                                                        },
                                                        record_index: {
                                                            bind: {
                                                                bindTo: '{berthServices}',
                                                                deep: true,
                                                            },
                                                            get: function (store) {
                                                                if (store) {
                                                                    let store = this.get('berthServices'),
                                                                        record = this.get('record');

                                                                    return store.indexOf(record);
                                                                }
                                                            },
                                                        },
                                                    },
                                                },
                                                xtype: 'container',
                                                cls: 'a-berth-form a-berth-services',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        defaults: {
                                                            ui: 'hovered-border classic',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'numberfield',
                                                                cls: 'a-field-icon icon-short icon-rounded',
                                                                labelAlign: 'left',
                                                                placeholder: '0',
                                                                maxValue: 9,
                                                                clearable: false,
                                                                slug: 'portcallBerthTowage',
                                                                subObject: 'berth',
                                                                bind: {
                                                                    value: '{record.to_num}',
                                                                    label: '{record.service_type:capitalize()}',
                                                                    readOnly: '{nonEditable ? true : false}',
                                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                    permission: '{userPermissions}',
                                                                    objectPermission: '{objectPermissions}',
                                                                },
                                                                listeners: {
                                                                    blur: function () {
                                                                        if (this.getValue() > this.getMaxValue()) {
                                                                            this.setValue(this.getMaxValue());
                                                                        }
                                                                        let store = this.upVM().get('berthServices');

                                                                        store.sync({
                                                                            success: function () {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                xtype: 'organization.combo',
                                                                label: false,
                                                                matchFieldWidth: false,
                                                                slug: 'portcallBerthTowage',
                                                                subObject: 'berth',
                                                                bind: {
                                                                    value: '{record.to_company_id}',
                                                                    inputValue: '{record.to_company_name}',
                                                                    readOnly: '{nonEditable ? true : false}',
                                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                    placeholder:
                                                                        '{nonEditable ? "---" : "Enter company"}',
                                                                    permission: '{userPermissions}',
                                                                    objectPermission: '{objectPermissions}',
                                                                },
                                                                listeners: {
                                                                    blur: function () {
                                                                        let store = this.upVM().get('berthServices'),
                                                                            record = this.upVM().get('record');

                                                                        record.set('to_company_id', this.getValue());
                                                                        record.set(
                                                                            'to_company_name',
                                                                            this.getInputValue()
                                                                        );

                                                                        store.sync({
                                                                            success: function () {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    },
                                                                    painted: function () {
                                                                        let record = this.upVM().get('record');

                                                                        if (record)
                                                                            this.setInputValue(
                                                                                record.get('to_company_name')
                                                                            );
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        defaults: {
                                                            ui: 'hovered-border classic',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'numberfield',
                                                                cls: 'a-field-icon icon-short icon-rounded',
                                                                labelAlign: 'left',
                                                                label: false,
                                                                placeholder: '0',
                                                                clearable: false,
                                                                maxValue: 9,
                                                                slug: 'portcallBerthTowage',
                                                                subObject: 'berth',
                                                                bind: {
                                                                    value: '{record.from_num}',
                                                                    readOnly: '{nonEditable ? true : false}',
                                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                    permission: '{userPermissions}',
                                                                    objectPermission: '{objectPermissions}',
                                                                },
                                                                listeners: {
                                                                    blur: function () {
                                                                        if (this.getValue() > this.getMaxValue()) {
                                                                            this.setValue(this.getMaxValue());
                                                                        }
                                                                        let store = this.upVM().get('berthServices');

                                                                        store.sync({
                                                                            success: function () {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                xtype: 'organization.combo',
                                                                label: false,
                                                                matchFieldWidth: false,
                                                                slug: 'portcallBerthTowage',
                                                                subObject: 'berth',
                                                                bind: {
                                                                    value: '{nonEditable ? null : record.from_company_id}',
                                                                    inputValue: '{record.from_company_name}',
                                                                    readOnly: '{nonEditable ? true : false}',
                                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                    placeholder:
                                                                        '{nonEditable ? "---" : "Enter company"}',
                                                                    permission: '{userPermissions}',
                                                                    objectPermission: '{objectPermissions}',
                                                                },
                                                                listeners: {
                                                                    blur: function () {
                                                                        let store = this.upVM().get('berthServices'),
                                                                            record = this.upVM().get('record');

                                                                        record.set('from_company_id', this.getValue());
                                                                        record.set(
                                                                            'from_company_name',
                                                                            this.getInputValue()
                                                                        );

                                                                        store.sync({
                                                                            success: function () {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    },
                                                                    painted: function () {
                                                                        let record = this.upVM().get('record');

                                                                        if (record)
                                                                            this.setInputValue(
                                                                                record.get('from_company_name')
                                                                            );
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        flex: 1,
                                                        margin: '0 16 0 0',
                                                        hidden: true,
                                                        bind: {
                                                            hidden: '{record_index ? false : true}',
                                                        },
                                                        layout: {
                                                            type: 'hbox',
                                                            align: 'center',
                                                            pack: 'end',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'button',
                                                                ui: 'tool-sm round',
                                                                iconCls: 'md-icon-remove-circle-outline',
                                                                slug: 'portcallBerthTowage',
                                                                subObject: 'berth',
                                                                bind: {
                                                                    permission: '{userPermissions}',
                                                                    cls: '{nonEditable ? "hidden" : ""}',
                                                                    objectPermission: '{objectPermissions}',
                                                                },
                                                                tooltip: {
                                                                    anchorToTarget: true,
                                                                    html: 'Remove',
                                                                    align: 'bc-tc?',
                                                                    showDelay: 0,
                                                                    hideDelay: 0,
                                                                    dismissDelay: 0,
                                                                    allowOver: false,
                                                                    closeAction: 'destroy',
                                                                },
                                                                handler: function () {
                                                                    let store = this.upVM().get('berthServices'),
                                                                        record = this.upVM().get('record');
                                                                    Ext.Msg.confirm(
                                                                        'Delete',
                                                                        'Are you sure you want to delete this record?',
                                                                        function (answer) {
                                                                            if (answer == 'yes') {
                                                                                store.remove(record);

                                                                                if (!record.phantom) {
                                                                                    store.sync({
                                                                                        success: function () {
                                                                                            Ext.toast(
                                                                                                'Record updated',
                                                                                                1000
                                                                                            );
                                                                                        },
                                                                                    });
                                                                                }
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
                                                                                text: 'Delete',
                                                                                separator: true,
                                                                            },
                                                                        ]
                                                                    );
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    // {
                                                    //     xtype: 'container',
                                                    //     flex: 1,
                                                    //     layout: {
                                                    //         type: 'hbox',
                                                    //         align: 'center',
                                                    //         pack: 'end'
                                                    //     },
                                                    //     items: [{
                                                    //         xtype: 'button',
                                                    //         ui: 'tool-sm round normal-light',
                                                    //         iconCls: 'md-icon-add',
                                                    //         tooltip: {
                                                    //             anchorToTarget: true,
                                                    //             html: 'Add towage',
                                                    //             align: 'bc-tc?',
                                                    //             showDelay: 0,
                                                    //             hideDelay: 0,
                                                    //             dismissDelay: 0,
                                                    //             allowOver: false,
                                                    //             closeAction: 'destroy'
                                                    //         },
                                                    //     }]
                                                    // }
                                                ],
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '8 0 16 16',
                                            text: 'Service',
                                            ui: 'normal small',
                                            slug: 'portcallBerthTowage',
                                            subObject: 'berth',
                                            bind: {
                                                cls: '{nonEditable ? "hidden" : ""}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            height: 30,
                                            iconCls: 'md-icon-add',
                                            menu: {
                                                defaults: {
                                                    handler: function () {
                                                        let store = this.upVM().get('berthServices'),
                                                            record = this.upVM().get('activeBerth.selection');

                                                        store.add({
                                                            service_type: this.service_type,
                                                            da_berth_id: record.get('id'),
                                                            portcall_id: this.upVM().get('object_record.id'),
                                                        });
                                                    },
                                                },
                                                items: [
                                                    {
                                                        text: 'Towage',
                                                        service_type: 'towage',
                                                    },
                                                    {
                                                        text: 'Mooring',
                                                        service_type: 'mooring',
                                                    },
                                                    {
                                                        text: 'Pilotage',
                                                        service_type: 'pilotage',
                                                    },
                                                    {
                                                        text: 'River pilotage',
                                                        service_type: 'river pilotage',
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-bnc-cargoes',
            bind: {
                hidden: '{berths.count ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    padding: '0 16',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            padding: 0,
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Cargoes',
                                },
                            ],
                        },
                        {
                            xtype: 'button',
                            text: 'Assign cargo',
                            height: 28,
                            ui: 'normal small',
                            iconCls: 'md-icon-add',
                            slug: 'portcallCargoReAssign',
                            bind: {
                                hidden: '{nonEditable ? true : false}',
                                permission: '{userPermissions}',
                            },
                            handler: function () {
                                let berth = this.upVM().get('activeBerth.selection'),
                                    cargoes = this.upVM().get('object_record').getNomination().cargoes(),
                                    berthStore = this.upVM().get('berths'),
                                    events = this.upVM().get('events');

                                Ext.create('Ext.Dialog', {
                                    cls: 'a-dialog-create a-dialog-has-icon',
                                    title: '<div class="a-badge a-badge-cargo"><i></i></div>Assign cargo',
                                    width: 540,
                                    padding: '8 24',
                                    closable: true,
                                    viewModel: {
                                        data: {
                                            berth: berth,
                                            cargoes: cargoes,
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    cls: 'hbox justify-content-center',
                                                    minHeight: 300,
                                                    bind: {
                                                        hidden: '{cargoes.count ? true : false}',
                                                        html: '<div class="a-inner no-fill"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9972 -18910)"><g transform="translate(9138 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(10007 18945)"><g transform="translate(2.498 2.5)" fill="none" stroke-linejoin="round"><path d="M24.5,12.373h0l5.625-2.419V9.929l8.42,3.816L47,10.537,24.5,2,2,10.537l22.5,8.539,8.42-3.188ZM2,38.994,23.1,47V21.391L2,13.385Zm5.625-5.076,5.625,2.135v3.035L7.628,36.956Zm30.933-10.2-5.625,2.133V18.722L25.9,21.391V47L47,38.994V13.385l-8.438,3.2Z" stroke="none"/><path d="M 24.49800682067871 2 L 1.997997283935547 10.5364990234375 L 24.49800682067871 19.07525062561035 L 32.91750717163086 15.88700103759766 L 24.50025749206543 12.37250137329102 L 30.12525749206543 9.953750610351562 L 30.12525749206543 9.929000854492188 L 38.54475784301758 13.74499893188477 L 46.99800872802734 10.5364990234375 L 24.49800682067871 2 M 2.002498626708984 13.3849983215332 L 2.002498626708984 38.99449157714844 L 23.09625625610352 47 L 23.09625625610352 21.39049911499023 L 2.002498626708984 13.3849983215332 M 13.25249862670898 39.0889892578125 L 7.627498626708984 36.95600128173828 L 7.627498626708984 33.91849899291992 L 13.25249862670898 36.05376052856445 L 13.25249862670898 39.0889892578125 M 46.99575805664062 13.3849983215332 L 38.55825805664062 16.58675003051758 L 38.56050872802734 23.71475982666016 L 32.93550872802734 25.84774971008301 L 32.93550872802734 18.72200965881348 L 25.90424728393555 21.39049911499023 L 25.90424728393555 47 L 46.99575805664062 38.99449157714844 L 46.99575805664062 13.3849983215332 M 24.49800872802734 3.814697265625e-06 C 24.73846626281738 3.814697265625e-06 24.97892761230469 0.04335403442382812 25.20746612548828 0.1300582885742188 L 47.70746612548828 8.666561126708984 C 48.48425674438477 8.961280822753906 48.99794769287109 9.705539703369141 48.99800872802734 10.53636169433594 C 48.998046875 11.08366394042969 48.77520751953125 11.59341430664062 48.40104675292969 11.96188354492188 C 48.77816390991211 12.33425521850586 48.99575805664062 12.84549331665039 48.99575805664062 13.3849983215332 L 48.99575805664062 38.99449157714844 C 48.99575805664062 39.82526016235352 48.482177734375 40.56951904296875 47.70547866821289 40.86433029174805 L 26.61396598815918 48.86983871459961 C 25.99938011169434 49.10311126708984 25.30939483642578 49.01948165893555 24.76833724975586 48.6461181640625 C 24.67184257507324 48.57953643798828 24.58227920532227 48.50524520874023 24.5002498626709 48.42439651489258 C 24.4182243347168 48.50524520874023 24.32868576049805 48.57951354980469 24.23219680786133 48.64609909057617 C 23.6911563873291 49.01945877075195 23.00118637084961 49.10311126708984 22.38660621643066 48.8698616027832 L 1.2928466796875 40.86434936523438 C 0.5161056518554688 40.5695686340332 0.002498626708984375 39.82527923583984 0.002498626708984375 38.99449157714844 L 0.002498626708984375 13.3849983215332 C 0.002498626708984375 12.84603881835938 0.2196769714355469 12.33526611328125 0.5960807800292969 11.96299362182617 C 0.2212753295898438 11.59445571899414 -0.0020294189453125 11.08423614501953 -0.002002716064453125 10.53641128540039 C -0.001964569091796875 9.705570220947266 0.5117378234863281 8.961280822753906 1.288547515869141 8.666561126708984 L 23.7885570526123 0.1300582885742188 C 24.01709175109863 0.04335403442382812 24.25754928588867 3.814697265625e-06 24.49800872802734 3.814697265625e-06 Z M 37.05620574951172 15.26616668701172 L 30.13203620910645 12.12789916992188 L 29.62617683410645 12.34542083740234 L 33.68810653686523 14.04141998291016 C 34.44394683837891 14.35700988769531 34.93096542358398 15.10157012939453 34.91722869873047 15.92053985595703 C 34.90838623046875 16.44734191894531 34.69348907470703 16.93644332885742 34.33741760253906 17.29556083679199 C 34.71661758422852 17.66820907592773 34.93550872802734 18.18088340759277 34.93550872802734 18.72200965881348 L 34.93550872802734 22.95039176940918 L 36.5600700378418 22.33436012268066 L 36.55825805664062 16.58737945556641 C 36.55810165405273 16.09008407592773 36.74200057983398 15.62371063232422 37.05620574951172 15.26616668701172 Z" stroke="none" fill="#0078d7"/></g></g></g></svg><div class="a-no-content-txt fs-13">No cargoes available</div></div>',
                                                    },
                                                },
                                                {
                                                    xtype: 'list',
                                                    flex: 1,
                                                    infinite: true,
                                                    height: 400,
                                                    bind: {
                                                        hidden: '{cargoes.count ? false : true}',
                                                        store: '{cargoes}',
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
                                                            },
                                                        },
                                                        xtype: 'container',
                                                        height: 48,
                                                        cls: 'myStyle cargo_item a-bb-100',
                                                        layout: {
                                                            type: 'hbox',
                                                            align: 'middle',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'checkbox',
                                                                checked: true,
                                                                ui: 'medium',
                                                                margin: '0 20 0 4',
                                                            },
                                                            {
                                                                xtype: 'div',
                                                                bind: {
                                                                    html: '<div class="a-cargo-title"><span class="a-qty">{record.quantity ? (record.quantity:number("0,000.###")) : "0,000"}<em>{record.unit ? record.unit : ""}</em></span><span class="a-commodity">{record.commodity ? record.commodity : ("Cargo " + (recordIndex + 1) + "")}</span></div><div class="a-cargo-subtitle">#CARGO-{recordIndex + 1}</div>',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    bbar: {
                                        bind: {
                                            hidden: '{cargoes.count ? false : true}',
                                        },
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
                                                    let cargoes = this.upVM().get('cargoes'),
                                                        berth = this.upVM().get('berth');
                                                    let items = Ext.ComponentQuery.query('[cls~=cargo_item]');
                                                    Ext.each(items, function (item, index) {
                                                        if (item.down('checkbox').getChecked())
                                                            item.upVM().get('record').set('berth_id', berth.get('id'));
                                                        item.upVM().get('record').set('berth_name', berth.get('name'));
                                                    });
                                                    cargoes.sync({
                                                        success: function (response, options) {
                                                            Ext.toast('Record updated', 1000);
                                                            events.load();
                                                            me.up('dialog').close();
                                                        },
                                                    });
                                                },
                                            },
                                        ],
                                    },
                                }).show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'sof.cargolist',
                    reference: 'selectedCargo',
                    subObject: 'cargo',
                    bind: {
                        objectPermission: '{objectPermissions}',
                    },
                },
            ],
        },
    ],
});
