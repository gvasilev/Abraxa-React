import './_Page';
import './EditMenu';
import './AddModal';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.index.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'calculator.portcostengine.portsettings.index.grid',
    flex: 1,
    cls: 'a-detailed-grid a-disbursements-grid a-wps-financial-grid abraxa-grid',
    ui: 'bordered',
    reference: 'calculatorPortSettingsGrid',
    bind: {
        store: '{portsettings}',
    },
    itemConfig: {
        viewModel: true,
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            height: 64,
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    title: 'Ports',
                },
            ],
            bind: {
                hidden: '{portsettings.count ? false : true}',
            },
        },
        {
            xtype: 'container',
            docked: 'top',
            height: 64,
            cls: 'a-titlebar a-bb-100',
            bind: {
                hidden: '{portsettings.count ? false : true}',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Add port',
                    iconCls: 'md-icon-add',
                    hideMode: 'opacity',
                    ui: 'action small',
                    handler: function (btn, e) {
                        let vm = this.upVM();
                        let dialog = Ext.create('Abraxa.view.calculator.portcostengine.portsettings.index.AddModal', {
                            viewModel: {
                                parent: vm,
                                data: {
                                    record: Ext.create('Abraxa.model.calculator.PortSettings', {}),
                                },
                            },
                        });
                        dialog.show();
                    },
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Port',
            dataIndex: 'name',
            minWidth: 380,
            bind: {
                hidden: '{portsettings.count ? false : true}',
            },
            cell: {
                encodeHtml: false,
                renderer: function (value, record) {
                    return (
                        '<div class="hbox">' +
                        '<div class="a-badge a-badge-x32 a-badge-default"><i class="md-icon-outlined">anchor</i></div>' +
                        '<a href="javascript:void(0);"><span class="text-truncate fw-b c-blue ml-16">' +
                        value +
                        '</span></a>' +
                        '</div>'
                    );
                },
            },
        },
        {
            text: 'Currency',
            dataIndex: 'currency',
            width: 100,
            align: 'center',
            cls: 'a-column-bl a-column-br',
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl a-cell-br',
            },
            bind: {
                hidden: '{portsettings.count ? false : true}',
            },
        },
        {
            text: '',
            flex: 1,
            minWidth: 100,
            cell: {},
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
            minWidth: 110,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            bind: {
                hidden: '{portsettings.count ? false : true}',
            },
            toolDefaults: {
                xtype: 'tool',
            },
            tools: [
                {
                    type: 'gear',
                    hidden: true,
                    ui: 'tool-md',
                    right: 4,
                    handler: function () {
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

                            Ext.create('Abraxa.view.calculator.portcostengine.portsettings.index.EditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        record: record,
                                        store: store,
                                    },
                                },
                            }).showBy(this);
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
        zIndex: 999,
        layout: {
            type: 'vbox',
        },
        margin: '-50 0 0 0',
        centered: true,
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-38 -31)"><g transform="translate(-796 -314)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(60 53)"><path d="M30.667,35.333a6.667,6.667,0,1,1,6.667-6.667A6.686,6.686,0,0,1,30.667,35.333Zm20-6c0-12.1-8.833-20.667-20-20.667s-20,8.567-20,20.667c0,7.8,6.5,18.133,20,30.467C44.167,47.467,50.667,37.133,50.667,29.333ZM30.667,2c14,0,26.667,10.733,26.667,27.333q0,16.6-26.667,39.333Q4.017,45.917,4,29.333C4,12.733,16.667,2,30.667,2Z" transform="translate(9.333 4.667)" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No ports available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Add port',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                hideMode: 'opacity',
                handler: function (btn, e) {
                    let vm = this.upVM();
                    let dialog = Ext.create('Abraxa.view.calculator.portcostengine.portsettings.index.AddModal', {
                        viewModel: {
                            parent: vm,
                            data: {
                                record: Ext.create('Abraxa.model.calculator.PortSettings', {}),
                            },
                        },
                    });
                    dialog.show();
                },
            },
        ],
    },
    listeners: {
        childtap: function (me, selection, events) {
            if (!selection.cell.hasCls('stop_propagation')) {
                me.upVM().set('pageXtype', 'calculator.portcostengine.portsettings.show.page');
                me.upVM().set(
                    'subpageXtype',
                    'calculator.portcostengine.portsettings.show.nomenclatures.nomenclaturetree'
                );
            }
        },
        deselect: function (me, record, index) {
            me.upVM().set('pageXtype', null);
        },
    },
});
