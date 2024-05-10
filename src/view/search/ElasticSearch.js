Ext.define('Abraxa.ElasticSearch', {
    extend: 'Ext.Dialog',
    xtype: 'elasticsearch',
    cls: 'border-radius a-bgr-white a-global-search',
    controller: 'searchcontroller',
    ui: 'slide-search',
    width: 640,
    maxHeight: '80%',
    top: 32,
    left: 0,
    right: 0,
    scrollable: 'y',
    closable: true,
    header: false,
    hideOnMaskTap: true,
    bodyPadding: 0,
    viewModel: {
        stores: {
            elasticSearch: {
                type: 'elasticsearch',
            },
        },
        formulas: {
            documents: {
                bind: {
                    bindTo: '{elasticSearch}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    if (store && store.count()) {
                        store.each(function (record) {
                            if (record.get('model') == 'document') data = record.get('items');
                        });
                        return data;
                    }
                },
            },
            portcalls: {
                bind: {
                    bindTo: '{elasticSearch}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    if (store && store.count()) {
                        store.each(function (record) {
                            if (record.get('model') == 'voyage') data = record.get('items');
                        });
                        return data;
                    }
                },
            },
            cargo: {
                bind: {
                    bindTo: '{elasticSearch}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    if (store && store.count()) {
                        store.each(function (record) {
                            if (record.get('model') == 'cargo') data = record.get('items');
                        });
                        return data;
                    }
                },
            },
            disbursements: {
                bind: {
                    bindTo: '{elasticSearch}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    if (store && store.count()) {
                        store.each(function (record) {
                            if (record.get('model') == 'disbursement') data = record.get('items');
                        });
                        return data;
                    }
                },
            },
            organizations: {
                bind: {
                    bindTo: '{elasticSearch}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    if (store && store.count()) {
                        store.each(function (record) {
                            if (record.get('model') == 'organization') data = record.get('items');
                        });
                        return data;
                    }
                },
            },
            contacts: {
                bind: {
                    bindTo: '{elasticSearch}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    if (store && store.count()) {
                        store.each(function (record) {
                            if (record.get('model') == 'contact') data = record.get('items');
                        });
                        return data;
                    }
                },
            },
        },
    },
    items: [
        // Search input
        {
            docked: 'top',
            xtype: 'searchfield',
            ui: 'field-xl no-border classic',
            itemId: 'vesselCombo',
            cls: 'a-field-icon icon-search vessel_combo_create',
            margin: '12 8',
            label: false,
            placeholder: 'Try me...',
            listeners: {
                painted: function (me) {
                    me.focus();
                },
                change: function (me, newValue, oldValue, eOpts) {
                    var store = this.upVM().get('elasticSearch');
                    if (newValue.length > 2) {
                        store.load({
                            params: {
                                query: newValue,
                            },
                        });
                    } else {
                        store.removeAll();
                    }
                },
            },
        },
        {
            items: [
                {
                    xtype: 'container',
                    cls: 'a-search-results',
                    flex: 1,
                    padding: '0 24',
                    items: [
                        {
                            xtype: 'container',
                            hidden: true,
                            bind: {
                                hidden: '{portcalls.length ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-search-header mt-0',
                                    items: [
                                        {
                                            xtype: 'div',
                                            bind: {
                                                bind: {
                                                    html: '<div>Port calls <span class="a-count">({portcalls.length})</span></div>',
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.componentdataview',
                                    minHeight: 0,
                                    ripple: true,
                                    itemRipple: true,
                                    itemConfig: {
                                        viewModel: true,
                                        items: [
                                            {
                                                xtype: 'container',
                                                model: 'portcall',
                                                cls: 'object_holder',
                                                bind: {
                                                    html: '<div class="object hbox"><div class="a-badge a-obj-logo a-logo-appointment mr-12"><i class="md-icon md-icon-outlined md-18">business_center</i></div><div><div><a href="javascript:void(0)"><strong>{record.vessel_name}</strong></a></div><div class="sm-title">{record.portcall.file_id}</div></div></span>',
                                                },
                                            },
                                        ],
                                    },
                                    bind: {
                                        store: {
                                            bindTo: '{portcalls}',
                                            deep: true,
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            bind: {
                                hidden: '{documents.length ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-search-header mt-0',
                                    items: [
                                        {
                                            xtype: 'div',
                                            bind: {
                                                bind: {
                                                    html: '<div>Documents <span class="a-count">({documents.length})</span></div>',
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.componentdataview',
                                    minHeight: 0,
                                    ripple: true,
                                    itemRipple: true,
                                    itemConfig: {
                                        viewModel: true,
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'object_holder',
                                                model: 'document',
                                                bind: {
                                                    html: '<div class="object hbox"><div class="file-icon-new file-icon-xs-new mr-12" data-type="{record.document.extension}"></div><div><div><a class="file_name" href="javascript:void(0);"><strong>{record.name}</strong></a></div><div class="sm-title">{record.document.object_meta_id}</div></div></div></div>',
                                                },
                                            },
                                        ],
                                    },
                                    bind: {
                                        store: {
                                            bindTo: '{documents}',
                                            deep: true,
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            bind: {
                                hidden: '{cargo.length ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-search-header mt-0',
                                    items: [
                                        {
                                            xtype: 'div',
                                            bind: {
                                                bind: {
                                                    html: '<div>Cargo <span class="a-count">({cargo.length})</span></div>',
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.componentdataview',
                                    minHeight: 0,
                                    ripple: true,
                                    itemRipple: true,
                                    itemConfig: {
                                        viewModel: true,
                                        items: [
                                            {
                                                xtype: 'container',
                                                model: 'cargo',
                                                cls: 'object_holder',
                                                bind: {
                                                    html: '<span class="object hbox"><span class="a-badge a-badge-cargo mr-12"><i></i></span><div><div><a href="javascript:void(0)"><strong>{record.commodity}</strong></a></div><div class="sm-title">#ABX-{record.portcall_id}</div></div></span>',
                                                },
                                            },
                                        ],
                                    },
                                    bind: {
                                        store: {
                                            bindTo: '{cargo}',
                                            deep: true,
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            bind: {
                                hidden: '{disbursements.length ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-search-header mt-0',
                                    items: [
                                        {
                                            xtype: 'div',
                                            bind: {
                                                bind: {
                                                    html: '<div>Disbursements <span class="a-count">({disbursements.length})</span></div>',
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.componentdataview',
                                    minHeight: 0,
                                    ripple: true,
                                    itemRipple: true,
                                    itemConfig: {
                                        viewModel: true,
                                        items: [
                                            {
                                                xtype: 'container',
                                                model: 'disbursement',
                                                cls: 'object_holder',
                                                bind: {
                                                    html: '<span class="object hbox"><div class="a-badge a-badge-financial mr-12"><i class="md-icon md-icon-outlined" style="font-size: 22px; margin-left: 2px;">attach_money</i></div><div><div><a href="javascript:void(0)"><strong>{record.org_name}</strong></a></div><div class="sm-title">#ABX-{record.portcall_id}</div></div></span>',
                                                },
                                            },
                                        ],
                                    },
                                    bind: {
                                        store: {
                                            bindTo: '{disbursements}',
                                            deep: true,
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            bind: {
                                hidden: '{organizations.length ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-search-header mt-0',
                                    items: [
                                        {
                                            xtype: 'div',
                                            bind: {
                                                bind: {
                                                    html: '<div>Companies <span class="a-count">({organizations.length})</span></div>',
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.componentdataview',
                                    minHeight: 0,
                                    ripple: true,
                                    itemRipple: true,
                                    itemConfig: {
                                        viewModel: true,
                                        items: [
                                            {
                                                xtype: 'container',
                                                model: 'company',
                                                cls: 'object_holder',
                                                bind: {
                                                    html: '<span class="object hbox"><div class="a-badge a-badge-company mr-12"><i class="md-icon md-icon-outlined md-18">business</i></div><div><div><a href="javascript:void(0)"><strong>{record.org_name}</strong></a></div><div class="sm-title">{record.org_email}</div></div></span>',
                                                },
                                            },
                                        ],
                                    },
                                    bind: {
                                        store: {
                                            bindTo: '{organizations}',
                                            deep: true,
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            bind: {
                                hidden: '{contacts.length ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-search-header mt-0',
                                    items: [
                                        {
                                            xtype: 'div',
                                            bind: {
                                                bind: {
                                                    html: '<div>Contacts <span class="a-count">({contacts.length})</span></div>',
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.componentdataview',
                                    minHeight: 0,
                                    ripple: true,
                                    itemRipple: true,
                                    itemConfig: {
                                        viewModel: true,
                                        items: [
                                            {
                                                xtype: 'container',
                                                model: 'contact',
                                                cls: 'object_holder',
                                                bind: {
                                                    html: '<span class="object hbox"><div class="a-person"><i class="md-icon md-icon-outlined md-24">person</i></div><div><div><a href="javascript:void(0)"><strong>{record.contact_full_name}</strong></a></div><div class="sm-title">{record.contact_email}</div></div></span>',
                                                },
                                            },
                                        ],
                                    },
                                    bind: {
                                        store: {
                                            bindTo: '{contacts}',
                                            deep: true,
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: '.object',
                            fn: 'previewObject',
                        },
                    },
                },
            ],
        },
    ],
    listeners: {
        hide: function () {
            this.destroy();
        },
    },
});
