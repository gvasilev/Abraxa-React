Ext.define('Abraxa.view.sof.portcall.sof.SOFCargoProgressForm', {
    extend: 'Ext.form.Panel',
    xtype: 'sof.cargo.progress.form',
    itemId: 'cargoOpsForm',
    padding: 6,
    layout: 'hbox',
    scrollabble: false,
    viewModel: {},
    defaults: {
        margin: '0 4',
        clearable: false,
        validateOnInit: 'none',
        ui: 'classic',
        labelAlign: 'top',
    },
    items: [
        {
            xtype: 'div',
            width: 8,
        },
        {
            xtype: 'selectfield',
            ui: 'classic',
            label: 'Cargo',
            placeholder: 'Choose cargo',
            itemId: 'cargoCombo',
            width: 280,
            displayField: 'commodity',
            displayTpl: new Ext.XTemplate('{[this.renderValue(values)]}', {
                renderValue: function (values) {
                    let str = values.commodity,
                        quantityStr = '';
                    if (values.bl_quantity) {
                        let unitStr = '';
                        if (values.bl_unit) {
                            unitStr = values.bl_unit;
                        }
                        quantityStr = ' (' + values.bl_quantity + ' ' + unitStr + ')';
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
                        quantityStr = ' (' + values.bl_quantity + ' ' + unitStr + ')';
                    }
                    str += quantityStr;
                    return str;
                },
            }),
            // displayTpl: new Ext.XTemplate('{values.commodity} <tpl if="values.bl_quantity">({values.bl_quantity} {values.bl_unit})</tpl>'),
            valueField: 'id',
            reference: 'cargoOpsSelection',
            slug: 'portcallOpsCargoProgress',
            bind: {
                store: '{cargoes}',
                permission: '{userPermissions}',
            },
            name: 'cargo_id',
            required: true,
        },
        {
            xtype: 'abraxa.datetimefield',
            width: 200,
            itemId: 'cargo_ops_date',
            label: 'Date',
            ui: 'classic',
            slug: 'portcallOpsCargoProgress',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'unit.field',
            label: 'Handled',
            itemId: 'cargo_ops_handled',
            labelWrap: true,
            width: 180,
            name: 'handled',
            required: true,
            slug: 'portcallOpsCargoProgress',
            matchFieldWidth: false,
            bind: {
                permission: '{userPermissions}',
                options: '{defaultCargoUnits}',
            },
        },
        {
            xtype: 'unit.field',
            label: 'Remaining',
            itemId: 'cargo_ops_remaining',
            disabled: true,
            readonly: true,
            width: 180,
            name: 'remaining',
            hidden: true,
            slug: 'portcallOpsCargoProgress',
            unitFieldMinWidth: 400,
            bind: {
                value: '{remaining}',
                permission: '{userPermissions}',
            },
            options: ['mts', 'cbm', 'cbft', 'units', 'Kilograms', 'TEU'],
        },
        {
            xtype: 'numberfield',
            ui: 'classic',
            width: 66,
            name: 'gangs',
            label: 'Gangs',
            placeholder: '0',
            slug: 'portcallOpsCargoProgress',
            bind: {
                hidden: '{!showGangsHolds}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'numberfield',
            ui: 'classic',
            width: 66,
            name: 'holds',
            label: 'Holds',
            placeholder: '0',
            slug: 'portcallOpsCargoProgress',
            bind: {
                hidden: '{!showGangsHolds}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'textfield',
            flex: 1,
            label: 'Comment',
            name: 'comment',
            placeholder: 'Comment',
            slug: 'portcallOpsCargoProgress',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'button',
            iconCls: 'md-icon-add',
            ui: 'normal-light round small',
            width: 32,
            height: 32,
            margin: '26 0 0 4',
            slug: 'portcallOpsCargoProgress',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function () {
                let form = this.find('cargoOpsForm'),
                    me = this;
                if (form.validate()) {
                    let values = form.getValues(),
                        store = this.upVM().get('cargoOps'),
                        ops_date = moment(this.find('cargo_ops_date').getDateTime())
                            .local()
                            .format('YYYY-MM-DD HH:mm:ss'),
                        handled = this.find('cargo_ops_handled').getValue(),
                        handled_unit = this.find('cargo_ops_handled').getValueUnit(),
                        remaining = this.find('cargo_ops_remaining').getValue(),
                        remaining_unit = this.find('cargo_ops_remaining').getValueUnit();

                    values.date = ops_date;
                    values.handled = handled;
                    values.handled_unit = handled_unit;
                    values.remaining = remaining;
                    values.remaining_unit = remaining_unit;

                    store.add(values);
                    store.sync({
                        success: function () {
                            let record = me.upVM().get('object_record');
                            if (record && record.get('id') && Ext.isNumber(parseInt(record.get('id')))) {
                                let chart = Ext.ComponentQuery.query('[itemId=cargoChart]')[0];
                                if (chart) {
                                    let fusionchart = chart.getFusionChart();
                                    Ext.Ajax.request({
                                        url: Env.ApiEndpoint + 'kpi/cargo/3/' + record.get('id'),
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
                            mixpanel.track('Add new cargo progress row');
                            Ext.toast('Record updated', 1000);
                        },
                    });
                    form.reset(true);
                    // form.find('cargoCombo').focus();
                }
            },
        },
    ],
});
