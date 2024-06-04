import '../../../../../../controller/TariffTableController.jsx';
import '../../../../../../store/calculator/TarrifTableRows.jsx';
Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.tarifftables.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'calculator.portcostengine.portsettings.show.tarifftables.grid',
    flex: 1,
    ui: 'bordered',
    cls: 'a-calculator-tariff-table',
    controller: 'tariffTableController',
    weighted: true,
    plugins: {
        gridcellediting: {
            selectOnEdit: false,
            triggerEvent: 'tap',
        },
        // gridsummaryrow: {
        //     row: {
        //         xtype: 'gridsummaryrow',
        //         // border: false,
        //         cls: 'a-bgr-50',
        //         weight: 3,
        //         docked: 'top',
        //         scrollDock: 'start',
        //     },
        // },
    },
    selectable: false,
    viewModel: {
        stores: {
            columns: {
                source: '{tariffTablesList.selection.columns}',
                autoLoad: true,
                extraParams: {
                    portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                    portSettingsTariffTableId: '{tariffTablesList.selection.id}',
                },
                // updateProxy: function (proxy) {
                //     if (proxy) {
                //         proxy.onAfter(
                //             'extraparamschanged',
                //             function () {
                //                 if (
                //                     this.getProxy().getExtraParams().portSettingsId &&
                //                     this.getProxy().getExtraParams().portSettingsTariffTableId
                //                 ) {
                //                     this.load();
                //                 }
                //             },
                //             this
                //         );
                //     }
                // },
            },
            rows: {
                type: 'tarifftable.row.store',
                autoLoad: true,
                proxy: {
                    extraParams: {
                        portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                        portSettingsTariffTableId: '{tariffTablesList.selection.id}',
                    },
                },
                updateProxy: function (proxy) {
                    if (proxy) {
                        proxy.onAfter(
                            'extraparamschanged',
                            function () {
                                if (
                                    this.getProxy().getExtraParams().portSettingsId &&
                                    this.getProxy().getExtraParams().portSettingsTariffTableId
                                ) {
                                    this.load();
                                }
                            },
                            this
                        );
                    }
                },
            },
        },
        formulas: {
            dcolumns: {
                bind: {
                    bindTo: '{columns}',
                    deep: true,
                },
                get: function (store) {
                    let columns = [];
                    if (store && store.count()) {
                        store.each(function (record) {
                            columns.push(record.getData());
                        });
                        let editColumn = {
                            // width: 42,
                            flex: 1,
                            tools: null,
                            editable: false,
                            cell: {
                                align: 'right',
                                cls: 'a-cell-more a-cell-actions a-actions-hover',
                                encodeHtml: false,
                                tools: [
                                    {
                                        xtype: 'button',
                                        ui: 'round tool-xs',
                                        iconCls: 'md-icon-remove-circle-outline',
                                        bind: {
                                            disabled: '{!restrictions.canDeleteRows}',
                                        },
                                        tooltip: {
                                            align: 'bc-tc?',
                                            html: 'Delete',
                                        },
                                        handler: function (value, metadata) {
                                            let record = this.toolOwner.getRecord();
                                            let selectionPort = this.upVM().get('calculatorPortSettingsGrid.selection');
                                            let store = this.upVM().get('rows');
                                            Ext.Msg.confirm(
                                                'Delete',
                                                'Are you sure you want to delete this row?',
                                                function (answer) {
                                                    if (answer == 'yes') {
                                                        store.remove(record);
                                                        // record.erase();
                                                        store.sync({
                                                            success: function () {
                                                                store.load();
                                                                Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                                Ext.toast('Record updated');
                                                            },
                                                        });
                                                        // record.erase({
                                                        //     success: function () {
                                                        //         Ext.toast('Record updated');
                                                        //     },
                                                        // });
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
                        };
                        columns.push(editColumn);
                        return columns;
                    }
                },
            },
            tableSourceData: {
                bind: {
                    bindTo: '{tariffTablesList.selection}',
                    // deep: true,
                },
                get: function (data) {
                    if (data) {
                        let me = this;
                        data.getProxy().setExtraParams({
                            portSettingsId: me.get('calculatorPortSettingsGrid.selection.id'),
                        });
                        this.getView().getController().prepareTableData(data);
                        return data;
                    }
                },
                // get: function (data) {
                //     if (data.portSettingsId && data.portSettingsTariffTableId) {
                //         console.log(
                //             'Changing table to: ',
                //             data.portSettingsTariffTableId + ' ' + this.get('tariffTablesList.selection').get('label'),
                //             ' for port: ',
                //             data.portSettingsId
                //         );
                //         let me = this,
                //             record = Ext.create('Abraxa.model.calculator.TableSource', {
                //                 id: data.portSettingsTariffTableId,
                //             });
                //         record.getProxy().setExtraParams({
                //             portSettingsId: data.portSettingsId,
                //         });
                //         record.load({
                //             success: function (rec) {
                //                 me.getView().getController().prepareTableData(rec);
                //             },
                //         });

                //         return record;
                //     }
                // },
            },
            restrictions: {
                bind: {
                    bindTo: '{tableSourceData.behaviour}',
                },
                get: function (behavior) {
                    return behavior;
                },
            },
        },
    },
    sortable: false,
    columnLines: true,
    enableColumnMove: false,
    headerContainer: {
        xtype: 'headercontainer',
        weight: 2,
        border: false,
        weighted: true,
        defaults: {
            viewModel: {
                formulas: {
                    columnRecord: {
                        bind: {
                            bindTo: '{columns}',
                        },
                        get: function (store) {
                            let columnId = this.getView().getDataIndex(),
                                record = store.queryBy(function (rec) {
                                    return rec.get('dataIndex') == columnId;
                                }).items[0];

                            return record;
                        },
                    },
                    columnValueText: {
                        bind: {
                            bindTo: '{columnRecord}',
                        },
                        get: function (record) {
                            let string;
                            if (record && record.get('match') && record.get('match').value) {
                                switch (record.get('match').type) {
                                    case 'range':
                                        string = record.get('match').value.join('-');
                                        break;
                                    default:
                                        string = record.get('match').value;
                                }
                            }
                            if (record.get('dataIndex') === '_y') {
                                string = this.get('tariffTablesList.selection.ySource.reference');
                            }
                            return string;
                        },
                    },
                    recordIndex: {
                        bind: {
                            bindTo: '{columnRecord}',
                        },
                        get: function (record) {
                            let store = this.get('columns');
                            return store.indexOf(record);
                        },
                    },
                },
            },
            menuDisabled: true,
            cls: 'calculator_gridcell a-br-100',
            bind: {
                text: '{columnValueText}',
            },
            flex: 1,
            width: 'auto',
            tools: [
                {
                    xtype: 'button',
                    ui: 'tool-sm round',
                    zone: 'end',
                    right: 8,
                    iconCls: 'md-icon-more-vert md-icon-outlined',
                    arrow: false,
                    bind: {
                        hidden: '{recordIndex == 0}',
                    },
                    menu: {
                        items: [
                            {
                                text: 'Set value',
                                bind: {
                                    disabled: '{!restrictions.canEditColumns}',
                                },
                                handler: function () {
                                    let record = this.upVM().get('columnRecord');

                                    Ext.create('Ext.Dialog', {
                                        viewModel: {
                                            data: {
                                                record: record,
                                                columnStore: this.upVM().get('columns'),
                                                xInputType: this.upVM().get('tableSourceData.xType'),
                                            },
                                        },
                                        draggable: false,
                                        title: 'Column value',
                                        ui: 'dialog-sm type3',
                                        manageBorders: false,
                                        closable: true,
                                        layout: {
                                            type: 'vbox',
                                            align: 'stretch',
                                        },
                                        scrollable: true,
                                        items: [
                                            {
                                                xtype: 'formpanel',
                                                items: [
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-form',
                                                        defaults: {
                                                            labelSeparator: '',
                                                            ui: 'classic',
                                                            labelAlign: 'top',
                                                        },
                                                        items: [
                                                            // {
                                                            //     xtype: 'selectfield',
                                                            //     valueField: 'type',
                                                            //     displayField: 'name',
                                                            //     label: 'Type',
                                                            //     required: true,
                                                            //     bind: {
                                                            //         value: '{record.matchType}',
                                                            //     },
                                                            //     options: [
                                                            //         {
                                                            //             type: 'numeric',
                                                            //             name: 'Numeric',
                                                            //         },
                                                            //         {
                                                            //             type: 'string',
                                                            //             name: 'String',
                                                            //         },
                                                            //         {
                                                            //             type: 'range',
                                                            //             name: 'Range',
                                                            //         },
                                                            //     ],
                                                            // },
                                                            {
                                                                xtype: 'textfield',
                                                                hidden: true,
                                                                label: 'Value string',
                                                                stripCharsRe: /\W/g,
                                                                bind: {
                                                                    required: '{xInputType == "string" ? true : false}',
                                                                    hidden: '{xInputType == "string" ? false : true}',
                                                                    value: '{record.matchValue}',
                                                                },
                                                                listeners: {
                                                                    painted: function () {
                                                                        this.setError(false);
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                xtype: 'numberfield',
                                                                hidden: true,
                                                                label: 'Value number',
                                                                bind: {
                                                                    required:
                                                                        '{xInputType == "numeric" ? true : false}',
                                                                    hidden: '{xInputType == "numeric" ? false : true}',
                                                                    value: '{record.matchValue}',
                                                                },
                                                                listeners: {
                                                                    painted: function () {
                                                                        this.setError(false);
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                xtype: 'container',
                                                                hidden: true,
                                                                layout: {
                                                                    type: 'hbox',
                                                                    align: 'bottom',
                                                                },
                                                                bind: {
                                                                    hidden: '{xInputType == "range" ? false : true}',
                                                                },
                                                                defaults: {
                                                                    labelSeparator: '',
                                                                    ui: 'classic',
                                                                    labelAlign: 'top',
                                                                },
                                                                items: [
                                                                    {
                                                                        xtype: 'numberfield',
                                                                        label: 'From',
                                                                        bind: {
                                                                            required:
                                                                                '{xInputType == "range" ? true : false}',
                                                                            value: '{record.matchFrom}',
                                                                        },
                                                                        listeners: {
                                                                            painted: function () {
                                                                                this.setError(false);
                                                                            },
                                                                        },
                                                                    },
                                                                    {
                                                                        html: '-',
                                                                        margin: '0 8 10',
                                                                    },
                                                                    {
                                                                        xtype: 'numberfield',
                                                                        label: 'To',
                                                                        bind: {
                                                                            required:
                                                                                '{xInputType == "range" ? true : false}',
                                                                            value: '{record.matchTo}',
                                                                        },
                                                                        listeners: {
                                                                            painted: function () {
                                                                                this.setError(false);
                                                                            },
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                        buttonToolbar: {
                                            xtype: 'toolbar',
                                            docked: 'bottom',
                                            ui: 'toolbar-panel-bottom',
                                            border: true,
                                        },

                                        buttons: [
                                            {
                                                text: 'Cancel',
                                                handler: function (me) {
                                                    let record = me.upVM().get('record');
                                                    record.reject();
                                                    this.up('dialog').destroy();
                                                },
                                                ui: 'default',
                                            },
                                            {
                                                text: 'Save',
                                                ui: 'action',
                                                handler: function (item, el) {
                                                    let me = this,
                                                        dialog = this.up('dialog'),
                                                        form = dialog.down('formpanel'),
                                                        record = me.upVM().get('record'),
                                                        store = me.upVM().get('columnStore'),
                                                        action = me.upVM().get('action'),
                                                        xInputType = me.upVM().get('xInputType');
                                                    let selectionPort = me
                                                        .upVM()
                                                        .get('calculatorPortSettingsGrid.selection');
                                                    if (form.validate()) {
                                                        if (xInputType == 'range') {
                                                            record.set('matchValue', [
                                                                record.get('matchFrom'),
                                                                record.get('matchTo'),
                                                            ]);
                                                        }

                                                        record.set('match', {
                                                            type: xInputType,
                                                            value: record.get('matchValue'),
                                                        });
                                                        store.sync({
                                                            success: function () {
                                                                Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                                dialog.destroy();
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        ],
                                    }).show();
                                },
                            },
                            {
                                text: 'Set label',
                                handler: function () {
                                    let record = this.upVM().get('columnRecord');

                                    Ext.create('Ext.Dialog', {
                                        viewModel: {
                                            data: {
                                                record: record,
                                                columnStore: this.upVM().get('columns'),
                                            },
                                        },
                                        draggable: false,
                                        title: 'Column label',
                                        ui: 'dialog-sm type3',
                                        manageBorders: false,
                                        closable: true,
                                        layout: {
                                            type: 'vbox',
                                            align: 'stretch',
                                        },
                                        scrollable: true,
                                        items: [
                                            {
                                                xtype: 'formpanel',
                                                items: [
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-form',
                                                        defaults: {
                                                            labelSeparator: '',
                                                            ui: 'classic',
                                                            labelAlign: 'top',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'textfield',
                                                                label: 'Column label',
                                                                bind: {
                                                                    value: '{record.label}',
                                                                },
                                                                listeners: {
                                                                    painted: function () {
                                                                        this.setError(false);
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                        buttonToolbar: {
                                            xtype: 'toolbar',
                                            docked: 'bottom',
                                            ui: 'toolbar-panel-bottom',
                                            border: true,
                                        },

                                        buttons: [
                                            {
                                                text: 'Cancel',
                                                handler: function (me) {
                                                    let record = me.upVM().get('record');
                                                    record.reject();
                                                    this.up('dialog').destroy();
                                                },
                                                ui: 'default',
                                            },
                                            {
                                                text: 'Save',
                                                ui: 'action',
                                                handler: function (item, el) {
                                                    let me = this,
                                                        dialog = this.up('dialog'),
                                                        form = dialog.down('formpanel'),
                                                        store = me.upVM().get('columnStore');
                                                    let selectionPort = me
                                                        .upVM()
                                                        .get('calculatorPortSettingsGrid.selection');

                                                    if (form.validate()) {
                                                        store.sync({
                                                            success: function () {
                                                                Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                                dialog.destroy();
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        ],
                                    }).show();
                                },
                            },
                            {
                                text: 'Delete',
                                iconCls: 'md-icon-outlined md-icon-delete',
                                ui: 'decline',
                                separator: true,
                                bind: {
                                    disabled: '{!restrictions.canDeleteColumns}',
                                },
                                handler: function () {
                                    let record = this.upVM().get('columnRecord'),
                                        store = this.upVM().get('columns');
                                    let selectionPort = this.upVM().get('calculatorPortSettingsGrid.selection');

                                    Ext.Msg.confirm(
                                        'Delete',
                                        'Are you sure you would like to delete this column?',
                                        function (answer) {
                                            if (answer != 'yes') return;
                                            store.remove(record);
                                            store.sync({
                                                success: function () {
                                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                },
                                            });
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
                                            },
                                        ]
                                    );
                                },
                            },
                        ],
                    },
                },
            ],
            items: [
                {
                    xtype: 'container',
                    cls: 'colum-label',
                    bind: {
                        html: '{columnRecord.label ? columnRecord.label : "---"}',
                    },
                },
            ],
            // summaryCell: {
            //     xtype: 'widgetcell',
            //     cls: 'a-br-100 a-bgr-50',
            //     widget: {
            //         xtype: 'textfield',
            //         cls: 'a-bgr-50',
            //         ui: 'hovered-border',
            //         // textAlign: 'center',
            //         // bind: {
            //         //     value: '{columnRecord.label}',
            //         // },
            //         placeholder: 'Custom label',
            //         listeners: {
            //             focusleave: function () {
            //                 let record = this.ownerCmp.getColumn().upVM().get('columnRecord'),
            //                     store = this.ownerCmp.getColumn().upVM().get('columns');

            //                 if (record.get('label') != this.getValue()) {
            //                     record.set('label', this.getValue());
            //                     store.sync({
            //                         success: function () {

            //                         },
            //                     });
            //                 }
            //             },
            //             painted: function () {
            //                 let record = this.ownerCmp.getColumn().upVM().get('columnRecord');
            //                 if (record) this.setValue(record.get('label'));
            //             },
            //         },
            //     },
            // },
            editor: {
                field: {
                    stripCharsRe: /[^\x20-\x7E]*$/,
                },
                listeners: {
                    beforestartedit: function (editor, context) {
                        let recordIndex = editor.ownerCmp.getColumn().upVM().get('recordIndex'),
                            canEditYRows = this.upVM().get('restrictions.canEditYRows');

                        if (!recordIndex && !canEditYRows) return false;
                    },
                    complete: function (editor, context) {
                        let record = editor.ownerCmp.getRecord(),
                            yType = editor.ownerCmp.getColumn().upVM().get('tableSourceData.yType'),
                            xType = editor.ownerCmp.getColumn().upVM().get('tableSourceData.xType'),
                            recordIndex = editor.ownerCmp.getColumn().upVM().get('recordIndex'),
                            store = this.upVM().get('rows');
                        let selectionPort = editor.ownerCmp
                            .getColumn()
                            .upVM()
                            .get('calculatorPortSettingsGrid.selection');

                        if (yType == 'range') {
                            record.set('splitY', true);
                        }
                        // if (xType == 'range' && recordIndex) {
                        //     record.set('splitX', true);
                        // }
                        store.sync({
                            success: function () {
                                Abraxa.utils.Functions.updatePortCost(selectionPort);
                            },
                        });
                    },
                },
            },
        },
    },
    bind: {
        columns: '{dcolumns}',
        store: '{rows}',
        rowNumbers: {
            text: '',
            width: 50,
            maxWidth: 50,
            minWidth: 50,
            userCls: 'disb_special_column text-center',
            cell: {
                width: 50,
                align: 'center',
            },
            items: [
                {
                    xtype: 'container',
                    height: 56,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'center',
                    },
                    items: [
                        {
                            xtype: 'button',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add column',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            disabled: '{!restrictions.canAddColumns}',
                            iconCls: 'md-icon-outlined md-icon-add-box',
                            ui: 'normal-light small round',
                            handler: function (me) {
                                let store = me.up('grid').upVM().get('columns');
                                me.setDisabled(true);
                                let selectionPort = me.up('grid').upVM().get('calculatorPortSettingsGrid.selection');

                                store.add({});
                                store.sync({
                                    success: function () {
                                        Abraxa.utils.Functions.updatePortCost(selectionPort);
                                        me.setDisabled(false);
                                    },
                                });
                            },
                        },
                    ],
                },
            ],
            summaryCell: false,
            tools: {},
        },
    },
    itemconfig: {
        viewModel: true,
        listeners: {
            complete: function () {},
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            width: 50,
                            bind: {
                                html: '<div style="height: 30px; padding-top: 5px;"><span class="a-badge-clc">{tariffTablesList.selection.slug}</span></div>',
                            },
                        },
                        {
                            xtype: 'textfield',
                            width: 400,
                            left: 80,
                            ui: 'field-lg no-border classic',
                            label: false,
                            clearable: false,
                            placeholder: 'Table name',
                            required: true,
                            style: 'font-size: 16px; font-weight: 500 !important;',
                            bind: {
                                value: '{tariffTablesList.selection.label}',
                            },
                            listeners: {
                                painted: function () {
                                    this.focus();
                                },
                                blur: function () {
                                    let record = this.upVM().get('tariffTablesList.selection');

                                    if (record.dirty && record.get('label')) {
                                        record.save({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            right: 16,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-sm round',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    margin: '0 0 0 8',
                                    handler: function () {
                                        let vm = this.upVM(),
                                            record = vm.get('tariffTablesList.selection'),
                                            store = vm.get('tarifftable');
                                        let selectionPort = vm.get('calculatorPortSettingsGrid.selection');

                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you want to delete this tariff table?',
                                            function (answer) {
                                                if (answer == 'yes') {
                                                    store.remove(record);
                                                    store.sync({
                                                        success: function () {
                                                            let list = Ext.ComponentQuery.query(
                                                                'list[reference=tariffTablesList]'
                                                            )[0];

                                                            if (store.getCount()) {
                                                                // Auto select the last record in the list
                                                                list.select(store.getAt(store.getCount() - 1));
                                                                vm.set(
                                                                    'subpageXtype',
                                                                    'calculator.portcostengine.portsettings.show.tarifftables.grid'
                                                                );
                                                            } else {
                                                                // Auto select the first nomenclature
                                                                let nomenclatureList = Ext.ComponentQuery.query(
                                                                    'list[reference=nomenclaturesList]'
                                                                )[0];
                                                                nomenclatureList.select(
                                                                    nomenclatureList.getStore().getAt(0)
                                                                );
                                                                vm.set(
                                                                    'subpageXtype',
                                                                    'calculator.portcostengine.portsettings.show.nomenclatures.nomenclaturetree'
                                                                );
                                                            }
                                                            Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                            Ext.toast('Record deleted', 1000);
                                                        },
                                                    });
                                                    // record.erase({
                                                    //     success: function () {
                                                    //         Ext.toast('Record updated');
                                                    //     },
                                                    // });
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
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            right: 60,
                            items: [
                                {
                                    xtype: 'filebutton',
                                    cls: 'a-no-content-btn',
                                    text: 'Import',
                                    ui: 'normal-light small',
                                    iconCls: 'md-icon-outlined md-icon-cloud-upload',
                                    name: 'files',
                                    slug: 'cdb',
                                    accept: 'text/csv',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        change: function (button, filePath) {
                                            if (!button.actionTriggered) {
                                                Ext.Msg.confirm(
                                                    'Confirm',
                                                    'Importing a file will replace all the data in this table. Are you sure you want to import a file?',
                                                    function (buttonId) {
                                                        if (buttonId === 'yes') {
                                                            let vm = button.up('grid').upVM();
                                                            let uploadController = button.up('grid').getController();
                                                            let importPath =
                                                                'pc/' +
                                                                vm.get('rows').getProxy().getExtraParams()
                                                                    .portSettingsId +
                                                                '/tables/' +
                                                                vm.get('rows').getProxy().getExtraParams()
                                                                    .portSettingsTariffTableId +
                                                                '/import';
                                                            uploadController.uploadFile(
                                                                button,
                                                                filePath,
                                                                importPath,
                                                                vm
                                                            );
                                                        }

                                                        // set the flag to indicate that the action has been triggered
                                                        button.actionTriggered = true;

                                                        // Fixing same file upload bug
                                                        document.querySelector("input[type='file']").value = '';
                                                        button.setValue(null);
                                                    }
                                                );
                                            }

                                            // set the flag to indicate that the action can be triggered again
                                            button.actionTriggered = false;
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    // ui: 'tool-text-sm',
                                    ui: 'default btn-sm fw-n',
                                    arrow: false,
                                    text: 'Export',
                                    margin: '0 0 0 8',
                                    slug: 'dashboardMyPortcalls',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (item, el, eOpts) {
                                        let vm = this.upVM();

                                        // Get the selections from the ViewModel
                                        let portSettingsId = vm.get('calculatorPortSettingsGrid.selection.id');
                                        let tariffTableId = vm.get('tariffTablesList.selection.id');
                                        let tariffTableName = vm.get('tariffTablesList.selection').get('label');

                                        console.log(tariffTableName);

                                        Ext.Ajax.request({
                                            url:
                                                Env.ApiEndpoint +
                                                'pc/' +
                                                portSettingsId +
                                                '/tables/' +
                                                tariffTableId +
                                                '/export',
                                            method: 'POST',
                                            success: function (response, opts) {
                                                // Create a Blob with the response text
                                                let blob = new Blob([response.responseText], { type: 'text/csv' });

                                                // Create a link element
                                                let a = document.createElement('a');
                                                a.href = URL.createObjectURL(blob);
                                                a.download = tariffTableName + '.csv';

                                                // Append the link to the document and click it to trigger download
                                                document.body.appendChild(a);
                                                a.click();

                                                // Clean up the DOM by removing the link
                                                document.body.removeChild(a);
                                            },
                                            failure: function (response, opts) {
                                                Ext.Msg.alert('Something went wrong', 'Could not complete operation.');
                                            },
                                        });
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '12 24',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'normal-light small',
                            iconCls: 'md-icon-outlined md-icon-add',
                            text: 'Add row',
                            bind: {
                                disabled: '{!restrictions.canAddRows}',
                            },
                            handler: function (me) {
                                let store = me.up('grid').upVM().get('rows');
                                let selectionPort = me.up('grid').upVM().get('calculatorPortSettingsGrid.selection');
                                me.setDisabled(true);

                                store.add({});
                                store.sync({
                                    success: function () {
                                        Abraxa.utils.Functions.updatePortCost(selectionPort);
                                        me.setDisabled(false);
                                    },
                                });
                            },
                        },
                        {
                            xtype: 'container',
                            scrollable: true,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            defaults: {
                                ui: 'default outlined small',
                                margin: '0 16 0 0',
                                // flex: 1
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Choose Y source',
                                    bind: {
                                        text: 'Y source: {tableSourceData.ySource.reference}',
                                    },
                                    placeholder: 'Choose Y source',
                                    menu: {
                                        height: 268,
                                        minWidth: 300,
                                        autoHide: false,
                                        items: [
                                            {
                                                xtype: 'nestedlist',
                                                title: 'Data',
                                                displayField: 'text',
                                                flex: 1,
                                                bind: {
                                                    store: '{YsourceStore}',
                                                },
                                                backButton: {
                                                    ui: 'tool-sm round',
                                                    iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                                                    margin: '0 12 0 0',
                                                },
                                                listeners: {
                                                    select: function (me, list, selection) {
                                                        let tableSourceData = me.upVM().get('tableSourceData'),
                                                            columnStore = me.upVM().get('columns'),
                                                            rowStore = me.upVM().get('rows'),
                                                            menu = me.up('menu');

                                                        if (selection.get('leaf')) {
                                                            tableSourceData.set('ySource', {
                                                                type: selection.get('type'),
                                                                reference: selection.get('text'),
                                                            });
                                                            // list.deselectAll();
                                                            tableSourceData.save({
                                                                success: function () {
                                                                    columnStore.load();
                                                                    rowStore.load({
                                                                        success: function () {},
                                                                    });
                                                                    menu.hide();
                                                                },
                                                            });
                                                        }
                                                    },
                                                },
                                            },
                                            {
                                                text: 'Clear',
                                                iconCls: 'md-icon-outlined md-icon-delete',
                                                ui: 'decline',
                                                separator: true,
                                                handler: function (me) {
                                                    let tableSourceData = me.upVM().get('tableSourceData'),
                                                        columnStore = me.upVM().get('columns'),
                                                        list = me.up('menu').down('nestedlist');

                                                    tableSourceData.set('ySource', null);
                                                    tableSourceData.save({
                                                        success: function () {
                                                            list.getStore().reload();
                                                            columnStore.load();
                                                        },
                                                    });
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    xtype: 'button',
                                    text: 'Choose Y input type',
                                    bind: {
                                        text: 'Y input type: {tableSourceData.yType}',
                                        disabled: '{!restrictions.yTypeEnabled}',
                                    },
                                    menu: {
                                        // height: 260,
                                        minWidth: 180,
                                        defaults: {
                                            handler: function (btn) {
                                                let tableSourceData = btn.upVM().get('tableSourceData'),
                                                    columnStore = btn.upVM().get('columns');
                                                tableSourceData.set('yType', btn.type);
                                                tableSourceData.save({
                                                    success: function () {
                                                        columnStore.load();
                                                    },
                                                });
                                            },
                                        },
                                        items: [
                                            {
                                                text: 'String',
                                                type: 'string',
                                            },
                                            {
                                                text: 'Numeric',
                                                type: 'numeric',
                                            },
                                            {
                                                text: 'Range',
                                                type: 'range',
                                            },
                                        ],
                                    },
                                },
                                {
                                    xtype: 'button',
                                    text: 'Choose X source',
                                    bind: {
                                        text: 'X source: {tableSourceData.xSource.reference}',
                                    },
                                    menu: {
                                        height: 268,
                                        minWidth: 300,
                                        autoHide: false,
                                        items: [
                                            {
                                                xtype: 'nestedlist',
                                                title: 'Data',
                                                displayField: 'text',
                                                flex: 1,
                                                bind: {
                                                    store: '{XsourceStore}',
                                                },
                                                backButton: {
                                                    ui: 'tool-sm round',
                                                    iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                                                    margin: '0 12 0 0',
                                                },
                                                listeners: {
                                                    select: function (me, list, selection) {
                                                        let tableSourceData = me.upVM().get('tableSourceData'),
                                                            columnStore = me.upVM().get('columns'),
                                                            menu = me.up('menu');

                                                        if (selection.get('leaf')) {
                                                            tableSourceData.set('xSource', {
                                                                type: selection.get('type'),
                                                                reference: selection.get('text'),
                                                            });
                                                            tableSourceData.save({
                                                                success: function () {
                                                                    columnStore.load();
                                                                    menu.hide();
                                                                },
                                                            });
                                                        }
                                                    },
                                                },
                                            },
                                            {
                                                text: 'Clear',
                                                iconCls: 'md-icon-outlined md-icon-delete',
                                                ui: 'decline',
                                                separator: true,
                                                handler: function (me) {
                                                    let tableSourceData = me.upVM().get('tableSourceData'),
                                                        columnStore = me.upVM().get('columns'),
                                                        list = me.up('menu').down('nestedlist');

                                                    tableSourceData.set('xSource', null);
                                                    tableSourceData.save({
                                                        success: function () {
                                                            list.getStore().reload();
                                                            columnStore.load();
                                                        },
                                                    });
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    xtype: 'button',
                                    text: 'Choose X input type',
                                    bind: {
                                        text: 'X input type: {tableSourceData.xType}',
                                        disabled: '{!restrictions.xTypeEnabled}',
                                    },
                                    menu: {
                                        // height: 260,
                                        minWidth: 180,
                                        defaults: {
                                            handler: function (btn) {
                                                let tableSourceData = btn.upVM().get('tableSourceData'),
                                                    columnStore = btn.upVM().get('columns');
                                                tableSourceData.set('xType', btn.type);
                                                tableSourceData.save({
                                                    success: function () {
                                                        columnStore.load();
                                                    },
                                                });
                                            },
                                        },
                                        items: [
                                            {
                                                text: 'String',
                                                type: 'string',
                                            },
                                            {
                                                text: 'Numeric',
                                                type: 'numeric',
                                            },
                                            {
                                                text: 'Range',
                                                type: 'range',
                                            },
                                        ],
                                    },
                                },
                                {
                                    xtype: 'button',
                                    text: 'Choose cell input type',
                                    bind: {
                                        text: 'Cell input type: {tableSourceData.xCellsType}',
                                    },
                                    menu: {
                                        // height: 260,
                                        minWidth: 180,
                                        defaults: {
                                            handler: function (btn) {
                                                let tableSourceData = btn.upVM().get('tableSourceData'),
                                                    columnStore = btn.upVM().get('columns');
                                                tableSourceData.set('xCellsType', btn.type);
                                                tableSourceData.save({
                                                    success: function () {
                                                        columnStore.load();
                                                    },
                                                });
                                            },
                                        },
                                        items: [
                                            {
                                                text: 'String',
                                                type: 'string',
                                            },
                                            {
                                                text: 'Numeric',
                                                type: 'numeric',
                                            },
                                            {
                                                text: 'Formula',
                                                type: 'formula',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            height: '64',
            padding: '0 24',
            cls: 'a-bt-100',
            layout: {
                type: 'hbox',
                align: 'center',
            },
            docked: 'bottom',
            items: [
                {
                    xtype: 'div',
                    cls: 'text-info',
                    margin: '0 20 0 0',
                    html: 'Last updated',
                },
                {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{tariffTablesList.selection.updated_by_user}',
                            updated_at: '{tariffTablesList.selection.updated_at}',
                        },
                    },
                },
                {
                    xtype: 'div',
                    flex: 1,
                },
                {
                    xtype: 'button',
                    ui: 'action loading',
                    text: 'Save',
                    height: 36,
                    handler: function (me) {
                        let record = this.upVM().get('tariffTablesList.selection');

                        record.set('updated_at', new Date());

                        record.save({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            ],
        },
    ],
    listeners: {
        beforeedit: function (grid, cell) {
            let editor = cell.editor,
                store = grid.getStore();

            // editor.on('complete', function () {
            //     store.sync({
            //         success: function () {
            //             Ext.toast('Record updated');
            //         },
            //     });
            // });
        },
        painted: function (grid) {
            let editor = grid.getPlugin();

            // Ext.util.Observable.capture(editor, function (evname) {

            // });
        },
    },
});
