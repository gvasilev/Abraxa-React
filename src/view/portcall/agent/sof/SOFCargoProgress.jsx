import './SOFCargoProgressForm';

Ext.define('Abraxa.view.portcall.sof.SOFCargoProgress', {
    extend: 'Ext.Container',
    xtype: 'sof.cargo.progress',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-bnc-main a-bnc-progress',
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            html: '<h5>Cargo progress</h5>',
                        },
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            enableToggle: true,
                            bind: {
                                text: '{showGangsHolds ? "Hide advanced" : "Show advanced"}',
                                iconCls:
                                    '{showGangsHolds ? "md-icon-outlined md-icon-unfold-less" : "md-icon-outlined md-icon-unfold-more"}',
                            },
                            handler: function () {
                                let showGangsHolds = this.upVM().get('showGangsHolds');

                                if (showGangsHolds) {
                                    this.upVM().set('showGangsHolds', 0);
                                } else {
                                    this.upVM().set('showGangsHolds', 1);
                                }
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '0 -16 0 -24',
                    cls: 'a-sof-cargo-progress',
                    items: [
                        {
                            xtype: 'sof.cargo.progress.form',
                            docked: 'top',
                            subObject: 'progress',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
                        },
                        {
                            xtype: 'grid',
                            cls: 'abraxa-grid a-progress-grid',
                            ui: 'bordered',
                            minHeight: 124,
                            maxHeight: 1024,
                            columnResize: false,
                            hideHeaders: true,
                            plugins: {
                                gridcellediting: {
                                    selectOnEdit: false,
                                    triggerEvent: 'tap',
                                },
                            },
                            bind: {
                                store: '{cargoOps}',
                                hideHeaders: '{member && member.role == "can edit"}',
                                selectable: '{nonEditable ? false : true}',
                                // plugins: '{cargoProgressEditor}',
                                cls: 'abraxa-grid a-progress-grid {member && member.role == "can view" ? "a-progress-view" : ""}',
                            },
                            viewModel: true,
                            itemConfig: {
                                viewModel: true,
                            },
                            columns: [
                                {
                                    width: 36,
                                    sortable: false,
                                    editable: false,
                                    menuDisabled: true,
                                    cls: 'a-empty-column',
                                    cell: {
                                        cls: 'a-empty-cell',
                                    },
                                },
                                {
                                    dataIndex: 'cargo_id',
                                    text: 'Cargo',
                                    sortable: false,
                                    editable: true,
                                    menuDisabled: true,
                                    width: 284,
                                    cell: {
                                        encodeHtml: false,
                                        width: 284,
                                        cls: 'text-truncate',
                                    },
                                    editor: {
                                        field: {
                                            xtype: 'selectfield',
                                            margin: '0 4',
                                            ui: 'classic',
                                            placeholder: 'Choose cargo',
                                            displayField: 'commodity',
                                            valueField: 'id',
                                            displayTpl: new Ext.XTemplate('{[this.renderValue(values)]}', {
                                                renderValue: function (values) {
                                                    let str = values.commodity,
                                                        quantityStr = '';
                                                    if (values.bl_quantity) {
                                                        let unitStr = '';
                                                        if (values.bl_unit) {
                                                            unitStr = values.bl_unit;
                                                        }
                                                        quantityStr =
                                                            ' ' +
                                                            numeral(values.bl_quantity).format('0,0.[000]') +
                                                            ' ' +
                                                            unitStr;
                                                    }
                                                    str += quantityStr;
                                                    return str;
                                                },
                                            }),
                                            itemTpl: new Ext.XTemplate('{[this.renderValue(values)]}', {
                                                renderValue: function (values) {
                                                    let str = values.commodity,
                                                        quantityStr = '';
                                                    if (values.bl_quantity) {
                                                        let unitStr = '';
                                                        if (values.bl_unit) {
                                                            unitStr = values.bl_unit;
                                                        }
                                                        quantityStr =
                                                            ' ' +
                                                            numeral(values.bl_quantity).format('0,0.[000]') +
                                                            ' ' +
                                                            unitStr;
                                                    }
                                                    str += quantityStr;
                                                    return str;
                                                },
                                            }),
                                            bind: {
                                                store: '{cargoes}',
                                            },
                                        },
                                        listeners: {
                                            complete: function (editor) {
                                                let me = this,
                                                    store = me.upVM().get('cargoOps');

                                                store.sync({
                                                    success: function () {
                                                        let record = me.upVM().get('object_record');
                                                        if (
                                                            record &&
                                                            record.get('id') &&
                                                            Ext.isNumber(parseInt(record.get('id')))
                                                        ) {
                                                            let chart =
                                                                Ext.ComponentQuery.query('[itemId=cargoChart]')[0];
                                                            if (chart) {
                                                                let fusionchart = chart.getFusionChart();
                                                                Ext.Ajax.request({
                                                                    url:
                                                                        Env.ApiEndpoint +
                                                                        'kpi/cargo/3/' +
                                                                        record.get('id'),
                                                                    method: 'GET',
                                                                    success: function (response) {
                                                                        if (response) {
                                                                            var obj = Ext.decode(response.responseText);
                                                                            if (fusionchart && !fusionchart.disposed) {
                                                                                if (obj) {
                                                                                    fusionchart.setJSONData(obj);
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    failure: function failure(response) {},
                                                                });
                                                            }
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    renderer: function (value, record) {
                                        if (value) {
                                            let cargoStore = this.upVM().get('cargoes');

                                            if (cargoStore) {
                                                let record = cargoStore.getById(value);
                                                let str = record.get('commodity'),
                                                    cargoFunction = record.get('function') || '';

                                                quantityStr = '';
                                                if (record.get('bl_quantity')) {
                                                    let unitStr = '';
                                                    if (record.get('bl_unit')) {
                                                        unitStr = record.get('bl_unit');
                                                    }
                                                    quantityStr =
                                                        ' ' +
                                                        numeral(record.get('bl_quantity')).format('0,0.[000]') +
                                                        ' ' +
                                                        unitStr;
                                                }
                                                let cargoSpan = '';
                                                if (cargoFunction) {
                                                    cargoSpan =
                                                        '<span class="a-function a-function-sm function-' +
                                                        cargoFunction +
                                                        ' ml-4" title="' +
                                                        cargoFunction +
                                                        '">' +
                                                        record.get('function_abbr') +
                                                        '</span>';
                                                }
                                                str += quantityStr;
                                                return str + cargoSpan;
                                            }
                                            return AbraxaConstants.placeholders.emptyValue;
                                        }
                                    },
                                },
                                {
                                    dataIndex: 'date',
                                    text: 'Date',
                                    sortable: false,
                                    editable: true,
                                    menuDisabled: true,
                                    width: 204,
                                    cell: {
                                        encodeHtml: false,
                                    },
                                    editor: {
                                        field: {
                                            xtype: 'abraxa.datetimefield',
                                            margin: '0 4 0 4',
                                            ui: 'classic',
                                        },
                                        listeners: {
                                            beforestartedit: function (editor, target, value, el) {
                                                if (el.event) {
                                                    let field = el.event.target.classList.value;
                                                    if (field == 'time_field') {
                                                        editor.focusField = editor
                                                            .getField()
                                                            .down('abraxa\\.timefield');
                                                    } else {
                                                        editor.focusField = editor
                                                            .getField()
                                                            .down('abraxa\\.datefield');
                                                    }
                                                }
                                            },
                                            complete: function (editor) {
                                                let me = this,
                                                    store = me.upVM().get('cargoOps');

                                                store.sync({
                                                    success: function () {
                                                        let record = me.upVM().get('object_record');
                                                        if (
                                                            record &&
                                                            record.get('id') &&
                                                            Ext.isNumber(parseInt(record.get('id')))
                                                        ) {
                                                            let chart =
                                                                Ext.ComponentQuery.query('[itemId=cargoChart]')[0];
                                                            if (chart) {
                                                                let fusionchart = chart.getFusionChart();
                                                                Ext.Ajax.request({
                                                                    url:
                                                                        Env.ApiEndpoint +
                                                                        'kpi/cargo/3/' +
                                                                        record.get('id'),
                                                                    method: 'GET',
                                                                    success: function (response) {
                                                                        if (response) {
                                                                            var obj = Ext.decode(response.responseText);
                                                                            if (fusionchart && !fusionchart.disposed) {
                                                                                if (obj) {
                                                                                    fusionchart.setJSONData(obj);
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    failure: function failure(response) {},
                                                                });
                                                            }
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    renderer: function (value) {
                                        if (value) {
                                            let date = Ext.util.Format.date(value, 'd M y'),
                                                time = Ext.util.Format.date(value, 'H:i');

                                            return (
                                                '<div class="hbox" style="justify-content: space-between;"><span class="date_field">' +
                                                date +
                                                '</span><span class="time_field" style="width:74px;">' +
                                                time +
                                                '</span></div>'
                                            );
                                        }
                                    },
                                },
                                {
                                    cls: 'a-header-hidden',
                                    columns: [
                                        {
                                            dataIndex: 'handled',
                                            text: 'Handled',
                                            sortable: false,
                                            editable: true,
                                            menuDisabled: true,
                                            width: 110,
                                            cell: {
                                                encodeHtml: false,
                                            },
                                            editor: {
                                                field: {
                                                    xtype: 'abraxa.numberfield',
                                                    margin: '0 0 0 4',
                                                    ui: 'classic',
                                                },
                                                listeners: {
                                                    complete: function (editor) {
                                                        let me = this,
                                                            store = me.upVM().get('cargoOps');

                                                        store.sync({
                                                            success: function () {
                                                                let record = me.upVM().get('object_record');
                                                                if (
                                                                    record &&
                                                                    record.get('id') &&
                                                                    Ext.isNumber(parseInt(record.get('id')))
                                                                ) {
                                                                    let chart =
                                                                        Ext.ComponentQuery.query(
                                                                            '[itemId=cargoChart]'
                                                                        )[0];
                                                                    if (chart) {
                                                                        let fusionchart = chart.getFusionChart();
                                                                        Ext.Ajax.request({
                                                                            url:
                                                                                Env.ApiEndpoint +
                                                                                'kpi/cargo/3/' +
                                                                                record.get('id'),
                                                                            method: 'GET',
                                                                            success: function (response) {
                                                                                if (response) {
                                                                                    var obj = Ext.decode(
                                                                                        response.responseText
                                                                                    );
                                                                                    if (
                                                                                        fusionchart &&
                                                                                        !fusionchart.disposed
                                                                                    ) {
                                                                                        if (obj) {
                                                                                            fusionchart.setJSONData(
                                                                                                obj
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            failure: function failure(response) {},
                                                                        });
                                                                    }
                                                                }
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    },
                                                },
                                            },
                                            renderer: function (value, record) {
                                                if (value) {
                                                    return '<b>' + numeral(value).format('0,0.[000]') + '</b>';
                                                } else {
                                                    return '<span class="a-cell-placeholder">0,000.00</span>';
                                                }
                                            },
                                        },
                                        {
                                            dataIndex: 'handled_unit',
                                            sortable: false,
                                            editable: true,
                                            menuDisabled: true,
                                            width: 74,
                                            cell: {
                                                encodeHtml: false,
                                            },
                                            editor: {
                                                field: {
                                                    xtype: 'selectfield',
                                                    margin: '0 4 0 0',
                                                    ui: 'classic',
                                                    valueField: 'name',
                                                    displayField: 'name',
                                                    matchFieldWidth: false,
                                                    bind: {
                                                        store: '{defaultCargoUnits}',
                                                    },
                                                },
                                                listeners: {
                                                    complete: function (editor) {
                                                        let me = this,
                                                            store = me.upVM().get('cargoOps');
                                                        store.sync({
                                                            success: function () {
                                                                let record = me.upVM().get('object_record');
                                                                if (
                                                                    record &&
                                                                    record.get('id') &&
                                                                    Ext.isNumber(parseInt(record.get('id')))
                                                                ) {
                                                                    let chart =
                                                                        Ext.ComponentQuery.query(
                                                                            '[itemId=cargoChart]'
                                                                        )[0];
                                                                    if (chart) {
                                                                        let fusionchart = chart.getFusionChart();
                                                                        Ext.Ajax.request({
                                                                            url:
                                                                                Env.ApiEndpoint +
                                                                                'kpi/cargo/3/' +
                                                                                record.get('id'),
                                                                            method: 'GET',
                                                                            success: function (response) {
                                                                                if (response) {
                                                                                    var obj = Ext.decode(
                                                                                        response.responseText
                                                                                    );
                                                                                    if (
                                                                                        fusionchart &&
                                                                                        !fusionchart.disposed
                                                                                    ) {
                                                                                        if (obj) {
                                                                                            fusionchart.setJSONData(
                                                                                                obj
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            failure: function failure(response) {},
                                                                        });
                                                                    }
                                                                }
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    },
                                                },
                                            },
                                            renderer: function (value, record) {
                                                if (value) {
                                                    return value;
                                                }
                                            },
                                        },
                                    ],
                                },
                                {
                                    cls: 'a-header-hidden',
                                    hidden: true,
                                    columns: [
                                        {
                                            dataIndex: 'remaining',
                                            text: 'Remaining',
                                            sortable: false,
                                            editable: true,
                                            menuDisabled: true,
                                            width: 110,
                                            cell: {
                                                encodeHtml: false,
                                            },
                                            editor: {
                                                field: {
                                                    xtype: 'abraxa.numberfield',
                                                    margin: '0 0 0 4',
                                                    ui: 'classic',
                                                },
                                                listeners: {
                                                    complete: function (editor) {
                                                        let me = this,
                                                            store = me.upVM().get('cargoOps');

                                                        store.sync({
                                                            success: function () {
                                                                let record = me.upVM().get('object_record');
                                                                if (
                                                                    record &&
                                                                    record.get('id') &&
                                                                    Ext.isNumber(parseInt(record.get('id')))
                                                                ) {
                                                                    let chart =
                                                                        Ext.ComponentQuery.query(
                                                                            '[itemId=cargoChart]'
                                                                        )[0];
                                                                    if (chart) {
                                                                        let fusionchart = chart.getFusionChart();
                                                                        Ext.Ajax.request({
                                                                            url:
                                                                                Env.ApiEndpoint +
                                                                                'kpi/cargo/3/' +
                                                                                record.get('id'),
                                                                            method: 'GET',
                                                                            success: function (response) {
                                                                                if (response) {
                                                                                    var obj = Ext.decode(
                                                                                        response.responseText
                                                                                    );
                                                                                    if (
                                                                                        fusionchart &&
                                                                                        !fusionchart.disposed
                                                                                    ) {
                                                                                        if (obj) {
                                                                                            fusionchart.setJSONData(
                                                                                                obj
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            failure: function failure(response) {},
                                                                        });
                                                                    }
                                                                }
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    },
                                                },
                                            },
                                            renderer: function (value, record) {
                                                if (value) {
                                                    return '<b>' + numeral(value).format('0,0.[000]') + '</b>';
                                                } else {
                                                    return '<span class="a-cell-placeholder">0,000.00</span>';
                                                }
                                            },
                                        },
                                        {
                                            dataIndex: 'remaining_unit',
                                            sortable: false,
                                            editable: true,
                                            menuDisabled: true,
                                            width: 74,
                                            cell: {
                                                encodeHtml: false,
                                            },
                                            editor: {
                                                field: {
                                                    xtype: 'selectfield',
                                                    matchFieldWidth: false,
                                                    margin: '0 4 0 0',
                                                    ui: 'classic',
                                                    options: ['mts', 'cbm', 'cbft', 'units', 'Kilograms', 'TEU'],
                                                },
                                                listeners: {
                                                    complete: function (editor) {
                                                        let me = this,
                                                            store = me.upVM().get('cargoOps');

                                                        store.sync({
                                                            success: function () {
                                                                let record = me.upVM().get('object_record');
                                                                if (
                                                                    record &&
                                                                    record.get('id') &&
                                                                    Ext.isNumber(parseInt(record.get('id')))
                                                                ) {
                                                                    let chart =
                                                                        Ext.ComponentQuery.query(
                                                                            '[itemId=cargoChart]'
                                                                        )[0];
                                                                    if (chart) {
                                                                        let fusionchart = chart.getFusionChart();
                                                                        Ext.Ajax.request({
                                                                            url:
                                                                                Env.ApiEndpoint +
                                                                                'kpi/cargo/3/' +
                                                                                record.get('id'),
                                                                            method: 'GET',
                                                                            success: function (response) {
                                                                                if (response) {
                                                                                    var obj = Ext.decode(
                                                                                        response.responseText
                                                                                    );
                                                                                    if (
                                                                                        fusionchart &&
                                                                                        !fusionchart.disposed
                                                                                    ) {
                                                                                        if (obj) {
                                                                                            fusionchart.setJSONData(
                                                                                                obj
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            failure: function failure(response) {},
                                                                        });
                                                                    }
                                                                }
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    },
                                                },
                                            },
                                            renderer: function (value, record) {
                                                if (value) {
                                                    return value;
                                                }
                                            },
                                        },
                                    ],
                                },
                                {
                                    dataIndex: 'gangs',
                                    text: 'Gangs',
                                    sortable: false,
                                    editable: true,
                                    menuDisabled: true,
                                    width: 74,
                                    editor: {
                                        field: {
                                            xtype: 'numberfield',
                                            margin: '0 4',
                                            clearable: false,
                                            ui: 'classic',
                                        },
                                        listeners: {
                                            complete: function (editor) {
                                                let me = this,
                                                    store = me.upVM().get('cargoOps');

                                                store.sync({
                                                    success: function () {
                                                        let record = me.upVM().get('object_record');
                                                        if (
                                                            record &&
                                                            record.get('id') &&
                                                            Ext.isNumber(parseInt(record.get('id')))
                                                        ) {
                                                            let chart =
                                                                Ext.ComponentQuery.query('[itemId=cargoChart]')[0];
                                                            if (chart) {
                                                                let fusionchart = chart.getFusionChart();
                                                                Ext.Ajax.request({
                                                                    url:
                                                                        Env.ApiEndpoint +
                                                                        'kpi/cargo/3/' +
                                                                        record.get('id'),
                                                                    method: 'GET',
                                                                    success: function (response) {
                                                                        if (response) {
                                                                            var obj = Ext.decode(response.responseText);
                                                                            if (fusionchart && !fusionchart.disposed) {
                                                                                if (obj) {
                                                                                    fusionchart.setJSONData(obj);
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    failure: function failure(response) {},
                                                                });
                                                            }
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    bind: {
                                        hidden: '{!showGangsHolds}',
                                        ui: 'classic',
                                    },
                                },
                                {
                                    dataIndex: 'holds',
                                    text: 'Holds',
                                    sortable: false,
                                    editable: true,
                                    menuDisabled: true,
                                    width: 74,
                                    editor: {
                                        field: {
                                            xtype: 'textfield',
                                            margin: '0 4',
                                            clearable: false,
                                            ui: 'classic',
                                        },
                                        listeners: {
                                            complete: function (editor) {
                                                let me = this,
                                                    store = me.upVM().get('cargoOps');

                                                store.sync({
                                                    success: function () {
                                                        let record = me.upVM().get('object_record');
                                                        if (
                                                            record &&
                                                            record.get('id') &&
                                                            Ext.isNumber(parseInt(record.get('id')))
                                                        ) {
                                                            let chart =
                                                                Ext.ComponentQuery.query('[itemId=cargoChart]')[0];
                                                            if (chart) {
                                                                let fusionchart = chart.getFusionChart();
                                                                Ext.Ajax.request({
                                                                    url:
                                                                        Env.ApiEndpoint +
                                                                        'kpi/cargo/3/' +
                                                                        record.get('id'),
                                                                    method: 'GET',
                                                                    success: function (response) {
                                                                        if (response) {
                                                                            var obj = Ext.decode(response.responseText);
                                                                            if (fusionchart && !fusionchart.disposed) {
                                                                                if (obj) {
                                                                                    fusionchart.setJSONData(obj);
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    failure: function failure(response) {},
                                                                });
                                                            }
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    bind: {
                                        hidden: '{!showGangsHolds}',
                                    },
                                },
                                {
                                    dataIndex: 'comment',
                                    text: 'Comment',
                                    sortable: false,
                                    editable: true,
                                    menuDisabled: true,
                                    flex: 1,
                                    cell: {
                                        encodeHtml: false,
                                    },
                                    editor: {
                                        field: {
                                            xtype: 'textfield',
                                            margin: '0 0 0 4',
                                            placeholder: 'Comment',
                                            ui: 'classic',
                                        },
                                        listeners: {
                                            complete: function (editor) {
                                                let me = this,
                                                    store = me.upVM().get('cargoOps');

                                                store.sync({
                                                    success: function () {
                                                        let record = me.upVM().get('object_record');
                                                        if (
                                                            record &&
                                                            record.get('id') &&
                                                            Ext.isNumber(parseInt(record.get('id')))
                                                        ) {
                                                            let chart =
                                                                Ext.ComponentQuery.query('[itemId=cargoChart]')[0];
                                                            if (chart) {
                                                                let fusionchart = chart.getFusionChart();
                                                                Ext.Ajax.request({
                                                                    url:
                                                                        Env.ApiEndpoint +
                                                                        'kpi/cargo/3/' +
                                                                        record.get('id'),
                                                                    method: 'GET',
                                                                    success: function (response) {
                                                                        if (response) {
                                                                            var obj = Ext.decode(response.responseText);
                                                                            if (fusionchart && !fusionchart.disposed) {
                                                                                if (obj) {
                                                                                    fusionchart.setJSONData(obj);
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    failure: function failure(response) {},
                                                                });
                                                            }
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    renderer: function (value, record) {
                                        if (value) {
                                            return value;
                                        } else {
                                            return '<span class="a-cell-placeholder">Comment</span>';
                                        }
                                    },
                                },
                                {
                                    width: 48,
                                    cell: {
                                        cls: 'a-cell-more a-cell-actions a-actions-hover',
                                        encodeHtml: false,
                                        tools: [
                                            {
                                                xtype: 'button',
                                                ui: 'round tool-xs',
                                                iconCls: 'md-icon-remove-circle-outline',
                                                disabled: false,
                                                slug: 'portcallOpsCargoProgress',
                                                subObject: 'progress',
                                                bind: {
                                                    permission: '{userPermissions}',
                                                    cls: '{nonEditable ? "hidden" : ""}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                                tooltip: {
                                                    align: 'bc-tc?',
                                                    html: 'Delete',
                                                },
                                                handler: function (value, metadata) {
                                                    let me = this,
                                                        record = me.toolOwner.getRecord(),
                                                        store = me.upVM().get('cargoOps');
                                                    Ext.Msg.confirm(
                                                        'Delete',
                                                        'Are you sure you would like to delete this entry?',
                                                        function (answer) {
                                                            if (answer == 'yes') {
                                                                store.remove(record);
                                                                store.sync({
                                                                    success: function () {
                                                                        let record = me.upVM().get('object_record');
                                                                        if (
                                                                            record &&
                                                                            record.get('id') &&
                                                                            Ext.isNumber(parseInt(record.get('id')))
                                                                        ) {
                                                                            let chart =
                                                                                Ext.ComponentQuery.query(
                                                                                    '[itemId=cargoChart]'
                                                                                )[0];
                                                                            if (chart) {
                                                                                let fusionchart =
                                                                                    chart.getFusionChart();
                                                                                Ext.Ajax.request({
                                                                                    url:
                                                                                        Env.ApiEndpoint +
                                                                                        'kpi/cargo/3/' +
                                                                                        record.get('id'),
                                                                                    method: 'GET',
                                                                                    success: function (response) {
                                                                                        if (response) {
                                                                                            var obj = Ext.decode(
                                                                                                response.responseText
                                                                                            );
                                                                                            if (
                                                                                                fusionchart &&
                                                                                                !fusionchart.disposed
                                                                                            ) {
                                                                                                if (obj) {
                                                                                                    fusionchart.setJSONData(
                                                                                                        obj
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    failure: function failure(
                                                                                        response
                                                                                    ) {},
                                                                                });
                                                                            }
                                                                        }
                                                                        Ext.toast('Record updated');
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
                            listeners: {
                                beforeedit: function () {
                                    let canEdit = this.upVM().get('editableCargoProgress');
                                    if (!canEdit) {
                                        return false;
                                    }
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
