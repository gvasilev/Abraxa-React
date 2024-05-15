import './CostCenterController.jsx';
import './CreateCostCenterPopup.jsx';
Ext.define('Abraxa.view.settings.library.cost_center.CostCenterGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'CostCenterGrid',
    controller: 'CostCenterController',
    cls: 'a-offset-grid abraxa-grid',
    ui: 'bordered',
    shadow: false,
    itemId: 'costCenterGrid',
    flex: 1,
    grouped: false,
    selectable: {
        mode: 'single',
    },
    bind: {
        store: '{costCenterStore}',
        hideHeaders: '{costCenterStore.count ? false : true}',
    },
    reference: 'costCenterGrid',
    itemConfig: {
        height: 48,
        viewModel: true,
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            bind: {
                hidden: '{costCenterGridStore.count ? false : true}',
            },
            padding: '0 24 0 32',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Add cost center',
                    ui: 'action small',
                    iconCls: 'md-icon-add',
                    handler: 'showCreateCostCenterPopup',
                },
            ],
        },
    ],
    emptyText: {
        xtype: 'container',
        zIndex: 999,
        layout: {
            type: 'vbox',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"> <g id="Group_20498" data-name="Group 20498" transform="translate(-673 -606)"> <g id="Group_20495" data-name="Group 20495" transform="translate(-161 261)" opacity="0.6"> <circle id="Ellipse_775" data-name="Ellipse 775" cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/> </g> <g id="Group_20497" data-name="Group 20497" transform="translate(708 638)"> <path id="Path_9931" data-name="Path 9931" d="M53.05,6.55,48.5,2,43.95,6.55,39.4,2,34.85,6.55,30.3,2,25.75,6.55,21.2,2,16.65,6.55,12.1,2V44.467H3v9.1a9.088,9.088,0,0,0,9.1,9.1H48.5a9.088,9.088,0,0,0,9.1-9.1V2ZM39.4,56.6H12.1a3.042,3.042,0,0,1-3.033-3.033V50.534H39.4Zm12.133-3.033a3.033,3.033,0,0,1-6.067,0v-9.1h-27.3V11.1H51.534Z" transform="translate(-3 -2)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> <rect id="Rectangle_4305" data-name="Rectangle 4305" width="16" height="8" transform="translate(19 14.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> <rect id="Rectangle_4306" data-name="Rectangle 4306" width="8" height="8" transform="translate(40 14.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> <rect id="Rectangle_4307" data-name="Rectangle 4307" width="16" height="5" transform="translate(19 25.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> <rect id="Rectangle_4308" data-name="Rectangle 4308" width="8" height="5" transform="translate(40 25.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/></g></g></svg><div class="a-no-content-txt">No cost centers available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Cost center',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: 'showCreateCostCenterPopup',
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    columns: [
        {
            text: 'Cost center',
            dataIndex: 'name',
            minWidth: 150,
            cls: 'a-column-offset-x32',
            cell: {
                cls: 'a-cell-offset-x32',
                tpl: '<span class="fw-b c-blue">{[values.name ? values.name : "---"]}</span>',
                encodeHtml: false,
            },
        },
        {
            text: 'Cost center ID',
            dataIndex: 'reference_id',
            minWidth: 150,
            cell: {
                encodeHtml: false,
                tpl: '{[values.reference_id ? values.reference_id : "---"]}',
            },
        },
        {
            text: 'Services',
            minWidth: 150,
            cell: {
                bind: {
                    tpl: '<span class="a-status-badge status-admin a-status-sm status-round">{record.services ? record.services.length : 0}</span>',
                },
                encodeHtml: false,
            },
        },
        {
            text: 'Updated by',
            minWidth: 180,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
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
            //This is set in this way, because for some unexpected reason,
            //the width of the cell is not being set correctly by the framework.
            //After the grid is rendered and is empty for the beggining.
            //This is a workaround to set the width of the cell manually. To reach the right grid behaviour.
            //WDEV-122 can see the issue.
            dataIndex: '',
            flex: 1,
            cell: {
                encodeHtml: false,
                cls: '_align-cell-cost-centers-grid',
            },
            renderer: function (value, record) {
                Ext.select('._align-cell-cost-centers-grid').elements[0].style = `width: ${this._computedWidth}px`;
                return '';
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
            toolDefaults: {
                xtype: 'tool',
            },
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
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
});
