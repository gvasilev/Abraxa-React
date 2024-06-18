import './ViewModel';
import './ServicesAddModal';
import './ServicesEditMenu';
import './VariablesAddModal';
import './VariablesEditMenu';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show._Subpage', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.subpage',
    viewModel: 'calculator.portcostengine.pricebooks.show',
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
                    xtype: 'title',
                    bind: {
                        title: '{priceBooksList.selection.name} <span class="sm-title">({calcpricebookservice.count})</span>',
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
                            handler: function(me) {
                                let record = me.upVM().get('priceBooksList').selection;
                                let store = me.upVM().getParent().getStore('calcpricebook');
                                let selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection');

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function(answer) {
                                        if (answer === 'yes') {
                                            store.remove(record);

                                            store.sync({
                                                success: function() {
                                                    let list = Ext.ComponentQuery.query(
                                                        'list[reference=priceBooksList]',
                                                    )[0];

                                                    if (list.getStore().getCount()) {
                                                        // Auto select the last record in the list
                                                        list.select(
                                                            list.getStore().getAt(list.getStore().getCount() - 1),
                                                        );
                                                        me.upVM().set(
                                                            'subpageXtype',
                                                            'calculator.portcostengine.portsettings.show.pricebooks.show.subpage',
                                                        );
                                                    } else {
                                                        // Auto select the first nomenclature
                                                        let nomenclatureList = Ext.ComponentQuery.query(
                                                            'list[reference=nomenclaturesList]',
                                                        )[0];
                                                        nomenclatureList.select(nomenclatureList.getStore().getAt(0));
                                                        me.upVM().set(
                                                            'subpageXtype',
                                                            'calculator.portcostengine.portsettings.show.nomenclatures.nomenclaturetree',
                                                        );
                                                    }
                                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                    Ext.toast('Record deleted', 1000);
                                                },
                                                failure: function(batch, functions) {
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
                                    ],
                                );
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            reference: 'priceBookForm',
            cls: 'a-bb-100',
            items: [
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    docked: 'top',
                },
                {
                    xtype: 'formpanel',
                    padding: '24',
                    scrollable: false,
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'bottom',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            items: [
                                {
                                    xtype: 'textfield',
                                    minWidth: 460,
                                    label: 'Price book name',
                                    placeholder: 'Price book name',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    ui: 'classic',
                                    required: true,
                                    labelAlign: 'top',
                                    bind: {
                                        value: '{recordCopy.name}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'button',
                            ui: 'action',
                            text: 'Save',
                            height: 38,
                            margin: '0 0 4 16',
                            handler: function(me) {
                                let record = me.upVM().get('priceBooksList').selection;
                                let recordCopy = me.upVM().get('recordCopy');
                                let form = me.up('formpanel');
                                let store = me.upVM().getParent().getStore('calcpricebook');
                                let selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection');

                                record.set(recordCopy.getData());

                                if (record.dirty) {
                                    store.sync({
                                        success: function() {
                                            Ext.toast('Record updated', 1000);
                                            Ext.ComponentQuery.query('container[reference=priceBookForm]')[0]
                                                .down('form\\.error')
                                                .hide()
                                                .removeCls('error');
                                            Abraxa.utils.Functions.updatePortCost(selectionPort);
                                        },
                                        failure: function(batch, functions) {
                                            store.rejectChanges();
                                            Ext.ComponentQuery.query('container[reference=priceBookForm]')[0]
                                                .down('form\\.error')
                                                .setHtml('Please fill all required fields')
                                                .show()
                                                .addCls('error');
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
        },
        {
            xtype: 'container',
            padding: '0 24',
            items: [
                {
                    xtype: 'div',
                    html: '<h2 class="mt-16 mb-0">Services</h2>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">Create, manage and link your individual services in your port price book.</p>',
                },
            ],
        },
        {
            xtype: 'container',
            height: 48,
            bind: {
                cls: '{calcpricebookservice.count ? "a-bb-100" : ""}',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Add service',
                    iconCls: 'md-icon-add',
                    margin: '0 0 16 24',
                    hideMode: 'opacity',
                    ui: 'action small',
                    handler: function(btn, e) {
                        let vm = this.upVM().getParent();
                        let priceBookRecord = this.upVM().get('priceBooksList').selection;

                        let dialog = Ext.create(
                            'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.ServicesAddModal',
                            {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        record: Ext.create('Abraxa.model.calculator.PriceBookService', {}),
                                        priceBookRecord: priceBookRecord,
                                    },
                                    stores: {
                                        defaultExpenseItems: {
                                            type: 'default-expense-items',
                                            autoLoad: true,
                                        },
                                    },
                                },
                            },
                        );
                        dialog.show();
                    },
                },
            ],
        },
        {
            xtype: 'grid',
            infinite: false,
            reference: 'calculatorPriceBookServicesGrid',
            minHeight: 200,
            cls: 'abraxa-grid',
            ui: 'bordered',
            bind: {
                store: '{calcpricebookservice}',
            },
            itemConfig: {
                viewModel: true,
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
                    text: 'Service name',
                    dataIndex: 'name',
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                    },
                    bind: {
                        hidden: '{calcpricebookservice.count ? false : true}',
                    },
                    renderer: function(val) {
                        return (
                            '<div class="hbox"><div class="a-badge small mr-16 a-badge-services"><i class="md-icon-outlined md-icon-layers"></i></div><a class="fw-b" href="javascript:void(0)">' +
                            val +
                            '</a></div>'
                        );
                    },
                },
                {
                    text: 'Slug',
                    dataIndex: 'slug',
                    flex: 1,
                },
                {
                    text: 'Last updated by',
                    minWidth: 180,
                    cell: {
                        cls: 'a-cell-date',
                        align: 'right',
                        encodeHtml: false,
                        xtype: 'widgetcell',
                        widget: {
                            xtype: 'public.updated.by',
                            cls: 'no_show',
                            bind: {
                                data: {
                                    user: '{record.updated_by_user}',
                                    updated_at: '{record.updated_at}',
                                },
                            },
                        },
                    },
                },
                {
                    dataIndex: '',
                    bind: {
                        hidden: '{calcpricebookservice.count ? false : true}',
                    },
                    minWidth: 75,
                    sortable: false,
                    menuDisabled: true,
                    resizable: false,
                    hideable: false,
                    editable: false,
                    ignore: true,
                    toolDefaults: {
                        xtype: 'tool',
                    },
                    tools: [
                        {
                            type: 'gear',
                            hidden: true,
                            ui: 'tool-md',
                            right: 4,
                            handler: function() {
                                this.up('grid').getPlugin('gridviewoptions').showViewOptions();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Customize',
                                align: 'bc-tc?',
                            },
                        },
                    ],
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
                                    html: 'More actions',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    closeAction: 'destroy',
                                },
                                handler: function handler(owner, tool, e) {
                                    let store = this.up('grid').getStore();
                                    let record = tool.record;
                                    let vm = this.up('grid').upVM();
                                    let priceBookRecord = this.upVM().get('priceBooksList').selection;

                                    Ext.create(
                                        'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.ServicesEditMenu',
                                        {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    record: record,
                                                    store: store,
                                                    priceBookRecord: priceBookRecord,
                                                },
                                            },
                                        },
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
            emptyText: {
                xtype: 'container',
            },
            listeners: {
                childtap: function(me, selection, events) {
                    if (!selection.cell.hasCls('stop_propagation')) {
                        me.upVM().set('templateServiceRecord', selection.record);
                        me.upVM().set(
                            'subpageXtype',
                            'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.subpage',
                        );
                    }

                    // Resets error div on service change
                    if (Ext.ComponentQuery.query('container[reference=serviceForm]')[0]) {
                        Ext.ComponentQuery.query('container[reference=serviceForm]')[0]
                            .down('form\\.error')
                            .hide()
                            .removeCls('error');
                    }
                },
                drop: function(node, data, overModel, dropPosition) {
                    if (!overModel) {
                        return false;
                    }
                    let store = this.upVM().get('calcpricebookservice');
                    let selectionPort = this.upVM().get('calculatorPortSettingsGrid.selection');

                    store.getProxy().setBatchActions(true);
                    store.getProxy().setAppendId(false);
                    store
                        .getProxy()
                        .setUrl(Env.ApiEndpoint + 'pc/${portSettingsId}/templates/${priceBookId}/services/orders');
                    store.getProxy().getWriter().setRootProperty('data');

                    store.each(function(val, index) {
                        val.set('order', index + 1);
                        val.dirty = true;
                        store.addSorted(val);
                    });

                    store.sync({
                        success: function() {
                            Ext.toast('Record updated');
                            Abraxa.utils.Functions.updatePortCost(selectionPort);
                        },
                    });

                    store.getProxy().setBatchActions(false);
                    store.getProxy().setAppendId(true);
                    store.getProxy().setUrl(Env.ApiEndpoint + 'pc/${portSettingsId}/templates/${priceBookId}/services');
                    store.getProxy().getWriter().setRootProperty(null);
                },
            },
        },
        {
            xtype: 'container',
            padding: '0 24',
            margin: '24 0 0 0',
            items: [
                {
                    xtype: 'div',
                    html: '<h2 class="mt-16 mb-0">Variables</h2>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">Create powerful variables which can be used multiple times throughout your price book configuration.</p>',
                },
            ],
        },
        {
            xtype: 'container',
            height: 48,
            bind: {
                cls: '{calcpricebookvariable.count ? "a-bb-100" : ""}',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Add variable',
                    iconCls: 'md-icon-add',
                    margin: '0 0 16 24',
                    hideMode: 'opacity',
                    ui: 'action small',
                    handler: function(btn, e) {
                        let vm = this.upVM();

                        let dialog = Ext.create(
                            'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.VariablesAddModal',
                            {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        record: Ext.create('Abraxa.model.calculator.PriceBookService', {}),
                                    },
                                },
                            },
                        );
                        dialog.show();
                    },
                },
            ],
        },
        {
            xtype: 'grid',
            infinite: false,
            reference: 'calculatorPriceBookVariablesGrid',
            minHeight: 400,
            cls: 'abraxa-grid a-offset-grid',
            ui: 'bordered grid-lg',
            bind: {
                store: '{calcpricebookvariable}',
            },
            columns: [
                //hide slug column and display all in Variable name column
                //Request by Jordan Todorov

                // {
                //     text: 'Slug',
                //     dataIndex: 'slug',
                //     cls: 'a-column-offset-x24',
                //     width: 100,
                //     cell: {
                //         cls: 'a-cell-offset-x24',
                //         encodeHtml: false,
                //     },
                //     renderer: function (val) {
                //         return '<span class="a-badge-clc">' + val + '</span>';
                //     },
                //     bind: {
                //         hidden: '{calcpricebookvariable.count ? false : true}',
                //     },
                // },
                {
                    text: 'Variable name',
                    cls: 'a-column-offset-x24',
                    dataIndex: 'label',
                    flex: 1,
                    cell: {
                        cls: 'a-cell-offset-x24',
                        encodeHtml: false,
                    },
                    renderer: function(val, record) {
                        return (
                            '<span class="a-badge-clc">' +
                            record.get('slug') +
                            '</span><a class="fw-b" href="javascript:void(0)">' +
                            val +
                            '</a>'
                        );
                    },
                    bind: {
                        hidden: '{calcpricebookvariable.count ? false : true}',
                    },
                },
                {
                    dataIndex: '',
                    bind: {
                        hidden: '{calcpricebookvariable.count ? false : true}',
                    },
                    minWidth: 75,
                    sortable: false,
                    menuDisabled: true,
                    resizable: false,
                    hideable: false,
                    editable: false,
                    ignore: true,
                    toolDefaults: {
                        xtype: 'tool',
                    },
                    tools: [
                        {
                            type: 'gear',
                            hidden: true,
                            ui: 'tool-md',
                            right: 4,
                            handler: function() {
                                this.up('grid').getPlugin('gridviewoptions').showViewOptions();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Customize',
                                align: 'bc-tc?',
                            },
                        },
                    ],
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
                                    html: 'More actions',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    closeAction: 'destroy',
                                },
                                handler: function handler(owner, tool, e) {
                                    let store = this.up('grid').getStore();
                                    let record = tool.record;
                                    let vm = this.up('grid').upVM();

                                    Ext.create(
                                        'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.VariablesEditMenu',
                                        {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    record: record,
                                                    store: store,
                                                },
                                            },
                                        },
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
            emptyText: {
                xtype: 'container',
            },
            listeners: {
                childtap: function(me, selection, events) {
                    if (!selection.cell.hasCls('stop_propagation')) {
                        me.upVM().set(
                            'subpageXtype',
                            'calculator.portcostengine.portsettings.show.pricebooks.show.variables.show.subpage',
                        );
                        me.upVM().set('templateVariableRecord', selection.record);
                    }

                    // Resets error div on variable change
                    if (Ext.ComponentQuery.query('container[reference=templateVariableForm]')[0]) {
                        Ext.ComponentQuery.query('container[reference=templateVariableForm]')[0]
                            .down('form\\.error')
                            .hide()
                            .removeCls('error');
                    }
                },
            },
        },
    ],
});
