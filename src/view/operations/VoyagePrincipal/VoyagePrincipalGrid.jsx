import './VoyagePrincipalGridViewModel';
import './VoyagePrincipalGridController';

Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyagePrincipalGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'VoyagesGrid',
    itemId: 'voyagesGrid',
    layout: 'fit',
    cls: 'abraxa-grid a-offset-grid',
    ui: 'bordered',
    scrollable: true,
    emptyText: 'There are no voyages to display.',
    flex: 1,
    hideHeaders: true,
    viewModel: 'VoyagePrincipalGridViewModel',
    controller: 'VoyagePrincipalGridController',
    stateful: ['plugins', 'columns'],
    stateId: 'voyages-principal-grid',
    plugins: {
        gridviewoptions: true,
        gridexporter: true,
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 50,
            loadPages: true,
            toolbar: {
                bordered: true,
                nextButton: {
                    ui: 'tool-sm round',
                },
                prevButton: {
                    ui: 'tool-sm round',
                },
                listeners: {
                    initialize: function() {
                        this.add({
                            xtype: 'div',
                            margin: '0 16',
                            cls: 'sm-title',
                            bind: {
                                html: '<strong>{totalRecordsPaggination}</strong> records',
                            },
                        });
                        this.add({
                            xtype: 'div',
                            width: '60%',
                        });
                    },
                },
            },
        },
    },
    bind: {
        store: '{voyagesPrincipal}',
    },
    itemConfig: {
        height: 64,
    },
    columns: [
        {
            text: 'Vessel/ID',
            dataIndex: 'vessel_name_link',
            minWidth: 240,
            width: 240,
            flex: 1,
            cls: 'a-header-offset-x24',
            cell: {
                cls: 'a-column-offset-x24',
                tpl: [
                    '<tpl if="vessel_name_string">{vessel_name_string}<tpl else>---</tpl>',
                    '<div class="a-val-sub">',
                    '<tpl if="voyage_number">{voyage_number}<tpl else>---</tpl>',
                    '</div>',
                ],
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link-xl',
                        fn: 'openVesselInfoDialog',
                    },
                },
            },
            exportRenderer: function(val, record) {
                let voyageName = record.get('vessel') ? record.get('vessel').name : record.get('vessel_name');
                let voyageId = record.get('voyage_number')
                    ? '#VOY-' + record.get('voyage_number')
                    : AbraxaConstants.placeholders.emptyValue;

                return voyageName + ' ' + voyageId;
            },
        },
        {
            text: 'Status',
            dataIndex: 'status_name',
            minWidth: 120,
            maxWidth: 120,
            cell: {
                tpl: [
                    '<tpl if="status_string">',
                    '<div class="a-status-badge a-status-md status-{status_string}"><span class="text-truncate">{status_name}</span></div>',
                    '<tpl else>',
                    '<div class="a-status-badge a-status-md">---</div>',
                    '</tpl>',
                ],
                encodeHtml: false,
            },
        },
        {
            text: 'Prefix',
            defaultWidth: 60,
            minWidth: 60,
            dataIndex: 'port_prefix',
            align: 'center',
            cell: {
                tpl: '<div class="a-val-sub">{port_prefix}</div>',
                encodeHtml: false,
            },
        },
        {
            text: 'Port',
            dataIndex: 'port_name',
            minWidth: 240,
            flex: 1,
            cell: {
                tpl: [
                    '<div class="a-val">',
                    '<tpl if="port_name"><div id="{port_id}" class="a-val-link">{port_name}</div><tpl else>---</tpl>',
                    ' (<tpl if="active_portcall">{active_portcall.port_function}<tpl else>---</tpl>)',
                    '</div>',
                    '<div class="a-val-sub">',
                    '<tpl if="port_eta"><span class="fw-b">ETA:</span> {port_eta}<tpl else>---</tpl>',
                    '</div>',
                ],
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link',
                        fn: 'openPortInfoDialog',
                    },
                },
            },
        },
        {
            text: 'Cargo',
            dataIndex: 'commodity_quantity',
            minWidth: 240,
            flex: 1.5,
            cell: {
                tpl: [
                    '<div class="a-val main">',
                    '<span id="{commodity_quantity.id}">{commodity_quantity.commodity_quantity}</span>',
                    '</div>',
                ],
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.main',
                        fn: function(me, el, eOpts) {
                            if (me.target.className === 'a-val-link single') {
                                const recordId = +me.target.id;
                                if (recordId) {
                                    Abraxa.Global.showCommodityDialog(recordId);
                                }
                            } else if (me.target.className === 'a-val-link') {
                                const commodities = this.component.getRecord().get('commodity_quantity').commodities;
                                if (commodities.length < 2) return;
                                Abraxa.getApplication()
                                    .getController('AbraxaController')
                                    .showCargoesTooltip(commodities, el);
                            }
                        },
                    },
                },
            },
            exportRenderer: function(val, record) {
                const commodities =
                    record && record.get('commodity_quantity') && record.get('commodity_quantity').commodities
                        ? record.get('commodity_quantity').commodities
                        : [];
                if (commodities && commodities.length > 0) {
                    const exportValue = commodities
                        .map((el) => (el.commodity || '-') + ' ' + (el.quantity || '-') + (el.bl_unit || '-'))
                        .join(';\n');
                    return exportValue;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Appointed agent',
            dataIndex: 'appointed_status_column',
            minWidth: 200,
            flex: 1.5,
            align: 'right',
            // tpl: '<div class="a-val-link">{appointed_agent}</div><div class="a-val-sub">{appointment_status} ({funded_currency} {funded_amount})</div>',
            // tpl: '<div class="a-val-link">{appointed_agent}</div><div class="a-val-sub">{appointment_status} ({funded_currency} {funded_amount})</div>',
            cell: {
                tpl: [
                    `<tpl if="appointed_status_column.hasAppointment"> <div class="a-val-link" data-company-email="{appointed_status_column.appointmentCompanyEmail}">
                {appointed_status_column.appointmentCompanyName}</div>
                  <div  class="a-val-sub">  {appointed_status_column.appointedStatus}</div>
                <tpl else>
                  <div  class="a-val-sub c-red">Not appointed</div></tpl>`,
                ],
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link',
                        fn: 'openAppointedAgentTooltip',
                    },
                },
            },
            exportRenderer: function(val, record) {
                if (val && val.appointmentCompanyName) {
                    return val.appointmentCompanyName;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Todos',
            dataIndex: '',
            defaultWidth: 140,
            minWidth: 140,
            html: AbraxaConstants.placeholders.emptyValue,
            cell: {
                bind: {
                    html: '<div class="a-val a-val-hbox a-val-sep-l"><i class="md-icon md-20 mr-8">task_alt</i><span class="fw-b">{count}</span>&nbsp;to-do\'s</div>',
                },
                encodeHtml: false,
                viewModel: {
                    data: {
                        count: 0,
                    },
                    formulas: {
                        initCount: {
                            bind: {
                                bindTo: '{tabChanged}',
                                deep: true,
                            },
                            get: function(tabChanged) {
                                setTimeout(() => {
                                    let count = 0;
                                    if (this.getView().getRecord().tasks().count() > 0) {
                                        count = this.getView()
                                            .getRecord()
                                            .tasks()
                                            .getData()
                                            .items.filter((el) => el.data.status !== 'completed').length;
                                    }
                                    this.set('count', count);
                                }, 0);
                            },
                        },
                        setCount: {
                            bind: {
                                bindTo: '{currentVoyage}',
                                deep: true,
                            },
                            get: function(currentVoyage) {
                                let count = 0;
                                if (this.getView().getRecord().tasks().count() > 0) {
                                    count = this.getView()
                                        .getRecord()
                                        .tasks()
                                        .getData()
                                        .items.filter((el) => el.data.status !== 'completed').length;
                                }
                                this.set('count', count);
                            },
                        },
                    },
                },
            },

            exportRenderer: function(val, record) {
                let count = 0;

                if (record._tasks && record.tasks() && record.tasks().count() > 0) {
                    count = record
                        .tasks()
                        .getData()
                        .items.filter((el) => el.data.status !== 'completed').length;
                }
                return count;
            },
        },
        {
            text: 'Assignee',
            dataIndex: 'assigned_user_name',
            align: 'center',
            defaultWidth: 78,
            minWidth: 78,
            cell: {
                tpl: [
                    '<div class="a-val a-person a-icon-round">',
                    '<tpl if="profile_image_url">',
                    '<img data-qtip="{assigned_user_name}"  data-qalign="bc-tc" data-qanchor="true" src="{profile_image_url}" height="30" alt="">',
                    '<tpl else>',
                    '<img data-qtip="{assigned_user_name}"  data-qalign="bc-tc" data-qanchor="true" src="' +
                    AbraxaConstants.urls.staticAbraxa +
                    'images/profile/no-image.svg" height="30" alt="">',
                    '</tpl>',
                    '</div>',
                ],

                encodeHtml: false,
            },

            exportRenderer: function(val, record) {
                if (val) {
                    return val;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            dataIndex: '',
            minWidth: 80,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        itemId: 'voyageDetailsMoreInfoButton',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            anchor: true,
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        // handler: 'openVoyageDetailsMoreInfoButton',
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: 'openVoyageDetails',
    },
});
