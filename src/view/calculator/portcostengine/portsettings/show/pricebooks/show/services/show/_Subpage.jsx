import './ViewModel';
import './DataFieldAddModal';
import './DataFieldEditMenu';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show._Subpage', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.subpage',
    viewModel: 'calculator.portcostengine.pricebooks.show.services.show',
    reference: 'servicePage',
    flex: 1,
    scrollable: true,
    height: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            height: 64,
            cls: 'a-titlebar a-bb-100',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-keyboard-backspace',
                            ui: 'round default',
                            margin: '0 12 0 0',
                            handler: function (me) {
                                me.upVM().set(
                                    'subpageXtype',
                                    'calculator.portcostengine.portsettings.show.pricebooks.show.subpage'
                                );
                                let grid = Ext.ComponentQuery.query(
                                    'grid[reference=calculatorPriceBookServicesGrid]'
                                )[0];
                                grid.deselectAll();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Back <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                        {
                            xtype: 'title',
                            align: 'left',
                            bind: {
                                title: '{templateServiceRecord.name} ({templateServiceRecord.slug})',
                            },
                        },
                    ],
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
                            handler: function (me) {
                                let record = me.upVM().get('templateServiceRecord');
                                let store = me.upVM().getParent().getStore('calcpricebookservice');
                                let selectionPort = me.upVM().getParent().get('calculatorPortSettingsGrid.selection');
                                let priceBookRecord = this.upVM().get('priceBooksList').selection;

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer === 'yes') {
                                            store.remove(record);

                                            store.sync({
                                                success: function () {
                                                    let newServiceCount = priceBookRecord.get('serviceCount') - 1;
                                                    priceBookRecord.set('serviceCount', newServiceCount);

                                                    me.upVM().set(
                                                        'subpageXtype',
                                                        'calculator.portcostengine.portsettings.show.pricebooks.show.subpage'
                                                    );
                                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                    Ext.toast('Record deleted', 1000);
                                                },
                                                failure: function (batch, functions) {
                                                    store.rejectChanges();
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
                                            text: 'Delete',
                                            ui: 'decline alt',
                                            separator: true,
                                        },
                                    ]
                                );
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 24 24',
            reference: 'serviceForm',
            cls: 'a-bb-100',
            items: [
                {
                    xtype: 'div',
                    html: '<h3>Formula set</h3>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">Define and configure conditional formula sets for each individual service cost line.</p>',
                },
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    docked: 'top',
                },
                {
                    xtype: 'formpanel',
                    padding: 0,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add set',
                            ui: 'action small',
                            iconCls: 'md-icon-add',
                            handler: function (button) {
                                let newBlock = Ext.create('Abraxa.model.calculator.PriceBookServiceFormulaBlock', {});
                                button.upVM().get('templateServiceRecord').formula_blocks().add(newBlock);

                                let templateServiceRecord = button.upVM().get('templateServiceRecord');
                                templateServiceRecord.dirty = true;
                            },
                        },
                        {
                            xtype: 'abraxa.componentdataview',
                            ripple: false,
                            itemRipple: false,
                            layout: 'vbox',
                            width: '100%',
                            reference: 'blocksContainer',
                            bind: {
                                store: '{templateServiceRecord.formula_blocks}',
                            },
                            itemConfig: {
                                xtype: 'panel',
                                margin: '16 0',
                                border: true,
                                bodyBorder: true,
                                title: 'Formula set',
                                viewModel: {},
                                padding: 16,
                                items: [
                                    {
                                        xtype: 'abraxa.componentdataview',
                                        ripple: false,
                                        itemRipple: false,
                                        bind: {
                                            store: '{record.rules}',
                                        },
                                        itemConfig: {
                                            viewModel: {},
                                            xtype: 'container',
                                            margin: '0 0 8 0',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'selectfield',
                                                    width: 250,
                                                    margin: '0 8 0 0',
                                                    forceSelection: true,
                                                    required: true,
                                                    label: 'Rule type',
                                                    labelAlign: 'top',
                                                    placeholder: 'Field',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        value: '{record.type}',
                                                    },
                                                    store: {
                                                        data: [
                                                            {
                                                                name: 'Formula',
                                                                value: 'formula',
                                                            },
                                                            {
                                                                name: 'Region (categories)',
                                                                value: 'nomenclature_regions',
                                                            },
                                                            {
                                                                name: 'Cargo (categories)',
                                                                value: 'nomenclature_cargoes',
                                                            },
                                                            {
                                                                name: 'Vessel (categories)',
                                                                value: 'nomenclature_vessels',
                                                            },
                                                            {
                                                                name: 'Region (items)',
                                                                value: 'nomenclature_regions_items',
                                                            },
                                                            {
                                                                name: 'Cargo (items)',
                                                                value: 'nomenclature_cargoes_items',
                                                            },
                                                            {
                                                                name: 'Vessel (items)',
                                                                value: 'nomenclature_vessels_items',
                                                            },
                                                        ],
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;

                                                            // Do not update if this is the iniit of the combobox
                                                            if (
                                                                newValue !== field.upVM().get('record').getData().type
                                                            ) {
                                                                field.upVM().get('record').set('value', '');
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    width: 150,
                                                    margin: '0 8 0 0',
                                                    forceSelection: true,
                                                    label: 'Operator',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Operator',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    store: {
                                                        data: [
                                                            {
                                                                name: 'Is',
                                                                value: 'is_true',
                                                            },
                                                        ],
                                                    },
                                                    bind: {
                                                        hidden: '{record.type === "formula" ? false : true}',
                                                        value: '{record.operator}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    width: 150,
                                                    margin: '0 8 0 0',
                                                    forceSelection: true,
                                                    label: 'Operator',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Operator',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    store: {
                                                        data: [
                                                            {
                                                                name: 'In',
                                                                value: 'in',
                                                            },
                                                            {
                                                                name: 'Not in',
                                                                value: 'not_in',
                                                            },
                                                        ],
                                                    },
                                                    bind: {
                                                        hidden: '{record.type !== "formula" ? false : true}',
                                                        value: '{record.operator}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    width: 400,
                                                    margin: '0 8 0 0',
                                                    label: 'Value',
                                                    required: true,
                                                    placeholder: 'Value',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    ui: 'classic',
                                                    labelAlign: 'top',
                                                    bind: {
                                                        hidden: '{record.type === "formula" ? false : true}',
                                                        value: '{record.value}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_regions" ? false : true}',
                                                        value: '{record.value}',
                                                        store: {
                                                            data: '{nomenclatureRegionComboStore}',
                                                        },
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_cargoes" ? false : true}',
                                                        value: '{record.value}',
                                                        store: {
                                                            data: '{nomenclatureCargoComboStore}',
                                                        },
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        value: '{record.value}',
                                                        hidden: '{record.type === "nomenclature_vessels" ? false : true}',
                                                        store: {
                                                            data: '{nomenclatureVesselComboStore}',
                                                        },
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        value: '{record.value}',
                                                        hidden: '{record.type === "nomenclature_regions_items" ? false : true}',
                                                        store: {
                                                            data: '{nomenclatureRegionItemsComboStore}',
                                                        },
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_cargoes_items" ? false : true}',
                                                        value: '{record.value}',
                                                        store: {
                                                            data: '{nomenclatureCargoItemsComboStore}',
                                                        },
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        value: '{record.value}',
                                                        hidden: '{record.type === "nomenclature_vessels_items" ? false : true}',
                                                        store: {
                                                            data: '{nomenclatureVesselItemsComboStore}',
                                                        },
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'button',
                                                    width: 32,
                                                    height: 32,
                                                    margin: '26 0 0 0',
                                                    ui: 'tool-sm round',
                                                    iconCls: 'md-icon-outlined md-icon-delete',
                                                    handler: function () {
                                                        this.up('componentdataview')
                                                            .getStore()
                                                            .remove(this.upVM().get('record'));
                                                        let templateServiceRecord =
                                                            this.upVM().get('templateServiceRecord');
                                                        templateServiceRecord.dirty = true;
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Add Rule',
                                        ui: 'normal-light small',
                                        iconCls: 'md-icon-outlined md-icon-add',
                                        handler: (button) => {
                                            let newRule = Ext.create(
                                                'Abraxa.model.calculator.PriceBookServiceFormulaBlockRule',
                                                {}
                                            );
                                            button.upVM().get('record').rules().add(newRule);

                                            let templateServiceRecord = button.upVM().get('templateServiceRecord');
                                            templateServiceRecord.dirty = true;
                                        },
                                    },
                                    {
                                        xtype: 'textareafield',
                                        label: 'Result Formula',
                                        labelAlign: 'top',
                                        placeholder: 'e. g. QA * 100 + QB',
                                        cls: 'a-field-icon icon-functions icon-rounded',
                                        ui: 'classic',
                                        width: '50%',
                                        margin: '16 0 0 0',
                                        required: true,
                                        bind: {
                                            value: '{record.formula}',
                                        },
                                        listeners: {
                                            change: function (field, newValue, oldValue, eOpts) {
                                                let templateServiceRecord = field.upVM().get('templateServiceRecord');
                                                templateServiceRecord.dirty = true;
                                            },
                                        },
                                    },
                                ],
                                tools: [
                                    {
                                        type: 'close',
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        handler: function () {
                                            this.up('componentdataview').getStore().remove(this.upVM().get('record'));
                                            let templateServiceRecord = this.upVM().get('templateServiceRecord');
                                            templateServiceRecord.dirty = true;
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'textareafield',
                    width: 450,
                    margin: '16 0 0 0',
                    label: 'Default formula',
                    placeholder: 'e. g. QA * 100 + QB',
                    cls: 'a-field-icon icon-functions icon-rounded',
                    ui: 'classic',
                    labelAlign: 'top',
                    bind: {
                        value: '{templateServiceRecord.formula}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 24',
            items: [
                {
                    xtype: 'div',
                    html: '<h3>Questions</h3>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">Add optional questions in order to bring your service cost calculation to another level of precision.</p>',
                },
            ],
        },
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'grid',
                    infinite: false,
                    reference: 'calculatorPriceBookServiceDataFieldsGrid',
                    ui: 'bordered',
                    cls: 'abraxa-grid',
                    minHeight: 300,
                    bind: {
                        store: '{calcservicedatafield}',
                    },
                    plugins: {
                        gridrowdragdrop: true,
                    },
                    columns: [
                        {
                            width: 48,
                            menuDisabled: true,
                            resizable: false,
                            hideable: false,
                            editable: false,
                            sortable: true,
                            cls: 'a-column-actions',
                            cell: {
                                encodeHtml: false,
                                cls: 'no_expand a_grid_action a-cell-more',
                                tpl: '<i class="md-icon-outlined fs-16 cursor-drag">drag_indicator</i>',
                            },
                        },
                        {
                            text: 'Question name',
                            flex: 1,
                            sortable: false,
                            menuDisabled: true,
                            resizable: false,
                            hideable: false,
                            draggable: false,
                            dataIndex: 'label',
                            cell: {
                                encodeHtml: false,
                            },
                            renderer: function (val, record) {
                                return (
                                    '<span class="a-badge-clc">' +
                                    record.get('slug') +
                                    '</span><a class="fw-b" href="javascript:void(0)">' +
                                    val +
                                    '</a>'
                                );
                            },
                        },
                        {
                            text: '',
                            minWidth: 75,
                            sortable: false,
                            menuDisabled: true,
                            resizable: false,
                            draggable: false,
                            cell: {
                                cls: 'a-cell-more stop_propagation',
                                align: 'right',
                                toolDefaults: {
                                    zone: 'end',
                                },
                                tools: [
                                    {
                                        iconCls: 'md-icon-more-horiz',
                                        ui: 'tool-md round',
                                        tooltip: {
                                            anchorToTarget: true,
                                            align: 'bc-tc?',
                                            html: 'Delete',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            closeAction: 'destroy',
                                        },
                                        handler: function handler(owner, tool) {
                                            let vm = owner.upVM();
                                            let record = tool.record;
                                            let store = this.up('grid').getStore();

                                            Ext.create(
                                                'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.DataFieldEditMenu',
                                                {
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            record: record,
                                                            store: store,
                                                        },
                                                    },
                                                }
                                            ).showBy(this);
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-navigate-next',
                                        ui: 'tool-sm round normal raised',
                                        cls: 'chameleon_view_details_portcall',
                                        tooltip: {
                                            anchorToTarget: true,
                                            align: 'bc-tc?',
                                            html: 'View details',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            closeAction: 'destroy',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-bb-100',
                            padding: '0 24 16 24',
                            docked: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'action small',
                                    iconCls: 'md-icon-add',
                                    text: 'Add question',
                                    handler: function (me) {
                                        let vm = me.upVM();
                                        let questionStore = me.upVM().getStore('calcservicedatafield');

                                        let dialog = Ext.create(
                                            'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.DataFieldAddModal',
                                            {
                                                viewModel: {
                                                    parent: vm,
                                                    data: {
                                                        record: Ext.create('Abraxa.model.calculator.DataField', {}),
                                                        questionStore: questionStore,
                                                    },
                                                },
                                            }
                                        );

                                        dialog.show();
                                    },
                                },
                            ],
                        },
                    ],
                    listeners: {
                        childtap: function (me, selection, events) {
                            if (!selection.cell.hasCls('stop_propagation')) {
                                me.upVM().set(
                                    'subpageXtype',
                                    'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafields.show.subpage'
                                );
                                me.upVM().set('templateServiceDataFieldRecord', selection.record);
                            }
                        },
                        drop: function (node, data, overModel, dropPosition) {
                            if (!overModel) {
                                return false;
                            }
                            let store = this.upVM().get('calcservicedatafield');
                            let selectionPort = this.upVM().get('calculatorPortSettingsGrid.selection');
                            store.getProxy().setBatchActions(true);
                            store.getProxy().setAppendId(false);
                            store
                                .getProxy()
                                .setUrl(
                                    Env.ApiEndpoint +
                                        'pc/${portSettingsId}/templates/${priceBookId}/services/${serviceId}/fields/orders'
                                );
                            store.getProxy().getWriter().setRootProperty('data');

                            store.each(function (val, index) {
                                val.set('order', index + 1);
                                val.dirty = true;
                                store.addSorted(val);
                            });

                            store.sync({
                                success: function () {
                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                    Ext.toast('Record updated');
                                },
                            });

                            store.getProxy().setBatchActions(false);
                            store.getProxy().setAppendId(true);
                            store
                                .getProxy()
                                .setUrl(
                                    Env.ApiEndpoint +
                                        'pc/${portSettingsId}/templates/${priceBookId}/services/${serviceId}/fields'
                                );
                            store.getProxy().getWriter().setRootProperty(null);
                        },
                    },
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'mb-16',
            html: '<hr>',
        },
        {
            xtype: 'container',
            padding: '0 24 24',
            items: [
                {
                    xtype: 'div',
                    html: '<h3>Visibility conditions</h3>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">Define powerful optional conditions when an individual service cost is applicable.</p>',
                },
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    docked: 'top',
                },
                {
                    xtype: 'formpanel',
                    padding: 0,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add condition',
                            ui: 'action small',
                            iconCls: 'md-icon-add',
                            handler: function (button) {
                                let newBlock = Ext.create(
                                    'Abraxa.model.calculator.PriceBookServiceVisibilityFormulaBlock',
                                    {}
                                );
                                button.upVM().get('templateServiceRecord').visibility_formula_blocks().add(newBlock);

                                let templateServiceRecord = button.upVM().get('templateServiceRecord');
                                templateServiceRecord.dirty = true;
                            },
                        },
                        {
                            xtype: 'abraxa.componentdataview',
                            layout: 'vbox',
                            width: '100%',
                            reference: 'visibilityBlocksContainer',
                            bind: {
                                store: '{templateServiceRecord.visibility_formula_blocks}',
                            },
                            itemConfig: {
                                xtype: 'panel',
                                margin: '16 0',
                                border: true,
                                bodyBorder: true,
                                title: 'Condition',
                                cls: '',
                                viewModel: {},
                                padding: 16,
                                items: [
                                    {
                                        xtype: 'abraxa.componentdataview',
                                        bind: {
                                            store: '{record.rules}',
                                        },
                                        itemConfig: {
                                            viewModel: {},
                                            xtype: 'container',
                                            margin: '0 0 8 0',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'selectfield',
                                                    width: 250,
                                                    margin: '0 8 0 0',
                                                    forceSelection: true,
                                                    required: true,
                                                    label: 'Rule type',
                                                    labelAlign: 'top',
                                                    placeholder: 'Field',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        value: '{record.type}',
                                                    },
                                                    store: {
                                                        data: [
                                                            {
                                                                name: 'Formula',
                                                                value: 'formula',
                                                            },
                                                            {
                                                                name: 'Region (categories)',
                                                                value: 'nomenclature_regions',
                                                            },
                                                            {
                                                                name: 'Cargo (categories)',
                                                                value: 'nomenclature_cargoes',
                                                            },
                                                            {
                                                                name: 'Vessel (categories)',
                                                                value: 'nomenclature_vessels',
                                                            },
                                                            {
                                                                name: 'Region (items)',
                                                                value: 'nomenclature_regions_items',
                                                            },
                                                            {
                                                                name: 'Cargo (items)',
                                                                value: 'nomenclature_cargoes_items',
                                                            },
                                                            {
                                                                name: 'Vessel (items)',
                                                                value: 'nomenclature_vessels_items',
                                                            },
                                                        ],
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;

                                                            // Do not update if this is the iniit of the combobox
                                                            if (
                                                                newValue !== field.upVM().get('record').getData().type
                                                            ) {
                                                                field.upVM().get('record').set('value', '');
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    width: 150,
                                                    margin: '0 8 0 0',
                                                    forceSelection: true,
                                                    label: 'Operator',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Operator',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    store: {
                                                        data: [
                                                            {
                                                                name: 'Is',
                                                                value: 'is_true',
                                                            },
                                                        ],
                                                    },
                                                    bind: {
                                                        hidden: '{record.type === "formula" ? false : true}',
                                                        value: '{record.operator}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    width: 150,
                                                    margin: '0 8 0 0',
                                                    forceSelection: true,
                                                    label: 'Operator',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Operator',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    store: {
                                                        data: [
                                                            {
                                                                name: 'In',
                                                                value: 'in',
                                                            },
                                                            {
                                                                name: 'Not in',
                                                                value: 'not_in',
                                                            },
                                                        ],
                                                    },
                                                    bind: {
                                                        hidden: '{record.type !== "formula" ? false : true}',
                                                        value: '{record.operator}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    width: 400,
                                                    margin: '0 8 0 0',
                                                    label: 'Value',
                                                    required: true,
                                                    placeholder: 'Value',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    ui: 'classic',
                                                    labelAlign: 'top',
                                                    bind: {
                                                        hidden: '{record.type === "formula" ? false : true}',
                                                        value: '{record.value}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_regions" ? false : true}',
                                                        value: '{record.value}',
                                                        store: '{nomenclatureRegionComboStore}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_cargoes" ? false : true}',
                                                        value: '{record.value}',
                                                        store: '{nomenclatureCargoComboStore}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_vessels" ? false : true}',
                                                        value: '{record.value}',
                                                        store: '{nomenclatureVesselComboStore}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_regions_items" ? false : true}',
                                                        value: '{record.value}',
                                                        store: '{nomenclatureRegionItemsComboStore}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_cargoes_items" ? false : true}',
                                                        value: '{record.value}',
                                                        store: '{nomenclatureCargoItemsComboStore}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    width: 400,
                                                    multiSelect: true,
                                                    margin: '0 8 0 0',
                                                    label: 'Nomenclatures',
                                                    required: true,
                                                    labelAlign: 'top',
                                                    placeholder: 'Nomenclatures',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    itemTpl: '{name}',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    bind: {
                                                        hidden: '{record.type === "nomenclature_vessels_items" ? false : true}',
                                                        value: '{record.value}',
                                                        store: '{nomenclatureVesselItemsComboStore}',
                                                    },
                                                    listeners: {
                                                        change: function (field, newValue, oldValue, eOpts) {
                                                            let templateServiceRecord = field
                                                                .upVM()
                                                                .get('templateServiceRecord');
                                                            templateServiceRecord.dirty = true;
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'button',
                                                    width: 32,
                                                    height: 32,
                                                    margin: '26 0 0 0',
                                                    ui: 'tool-sm round',
                                                    iconCls: 'md-icon-outlined md-icon-delete',
                                                    handler: function () {
                                                        this.up('componentdataview')
                                                            .getStore()
                                                            .remove(this.upVM().get('record'));
                                                        let templateServiceRecord =
                                                            this.upVM().get('templateServiceRecord');
                                                        templateServiceRecord.dirty = true;
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Add Rule',
                                        ui: 'normal-light small',
                                        iconCls: 'md-icon-outlined md-icon-add',
                                        handler: (button) => {
                                            let newRule = Ext.create(
                                                'Abraxa.model.calculator.PriceBookServiceVisibilityFormulaBlockRule',
                                                {}
                                            );
                                            button.upVM().get('record').rules().add(newRule);

                                            let templateServiceRecord = button.upVM().get('templateServiceRecord');
                                            templateServiceRecord.dirty = true;
                                        },
                                    },
                                    {
                                        xtype: 'textareafield',
                                        label: 'Result Formula',
                                        labelAlign: 'top',
                                        placeholder: 'e. g. QA * 100 + QB',
                                        cls: 'a-field-icon icon-functions icon-rounded',
                                        ui: 'classic',
                                        width: '50%',
                                        margin: '16 0 0 0',
                                        required: true,
                                        bind: {
                                            value: '{record.formula}',
                                        },
                                        listeners: {
                                            change: function (field, newValue, oldValue, eOpts) {
                                                let templateServiceRecord = field.upVM().get('templateServiceRecord');
                                                templateServiceRecord.dirty = true;
                                            },
                                        },
                                    },
                                ],
                                tools: [
                                    {
                                        type: 'close',
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        handler: function () {
                                            this.up('componentdataview').getStore().remove(this.upVM().get('record'));
                                            let templateServiceRecord = this.upVM().get('templateServiceRecord');
                                            templateServiceRecord.dirty = true;
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'textareafield',
                    width: 450,
                    margin: '10 0 0 0',
                    label: 'Default visibility formula (rules to appear)',
                    placeholder: 'e. g. QA * 100 + QB',
                    cls: 'a-field-icon icon-functions icon-rounded',
                    ui: 'classic',
                    labelAlign: 'top',
                    bind: {
                        value: '{templateServiceRecord.visibility_formula}',
                    },
                    validators: function (value) {
                        let validationRegex = /^[\x20-\x7E]*$/;
                        if (!validationRegex.test(value)) {
                            return 'Prohibited character';
                        }
                        return true;
                    },
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
                            user: '{templateServiceRecord.updated_by_user}',
                            updated_at: '{templateServiceRecord.updated_at}',
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
                        let record = me.upVM().get('templateServiceRecord');
                        let form = me.up('formpanel');
                        let store = me.upVM().getParent().getStore('calcpricebookservice');
                        let selectionPort = me.upVM().getParent().get('calculatorPortSettingsGrid.selection');

                        if (record.dirty) {
                            store.sync({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, functions) {
                                    store.rejectChanges();
                                    Ext.ComponentQuery.query('container[reference=serviceForm]')[0]
                                        .down('form\\.error')
                                        .setHtml('Please fill all required fields')
                                        .show()
                                        .addCls('error');
                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                },
                            });
                        } else {
                            store.rejectChanges();
                        }
                    },
                },
            ],
        },
    ],
});
