Ext.define('Abraxa.view.portcall.sof.history.SofHistoryGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'sof.history.grid',
    cls: 'abraxa-grid a-sof-events',
    ui: 'bordered',
    flex: 1,
    itemRipple: false,
    scrollable: 'y',
    ripple: false,
    columnResize: false,
    scrollToTopOnRefresh: false,
    enableColumnMove: false,
    variableHeights: true,
    store: [],
    bind: {
        store: {
            bindTo: '{SofHistoryVersion.selection.events}',
            deep: true,
        },
    },
    loadingText: true,
    masked: {
        xtype: 'loadmask',
        message: 'Loading',
    },
    columns: [
        {
            text: '',
            width: 16,
            minWidth: 16,
            sortable: false,
            editable: true,
            menuDisabled: true,
        },
        {
            dataIndex: 'event_category_id',
            width: 60,
            padding: 0,
            text: 'Type',
            sortable: false,
            editable: true,
            menuDisabled: true,
            cell: {
                encodeHtml: false,
                padding: '0 0 0 16',
            },
            renderer: function (value, record) {
                let cls = '';
                switch (value) {
                    case 1:
                        cls = 'sof-event';
                        break;
                    case 2:
                        cls = 'sof-worked';
                        break;
                    case 3:
                        cls = 'sof-stopped';
                        break;
                    case 4:
                        cls = 'sof-shifting';
                        break;
                    case 5:
                        cls = 'sof-waiting';
                        break;
                }
                return '<div class="a-badge-sof ' + cls + '"></div>';
            },
        },
        {
            dataIndex: 'event_id',
            text: 'Event',
            sortable: false,
            editable: true,
            menuDisabled: true,
            width: 240,
            cell: {
                encodeHtml: false,
            },
            editor: {
                xtype: 'sof.general.events',
                padding: '0 4',
                ui: 'classic hovered-border',
                placeholder: 'Event name',
                bind: {
                    store: '{defaultGeneralEvents}',
                },
            },
            renderer: function (value, record) {
                if (value) {
                    return record.get('event_name');
                } else {
                    return '<span class="a-cell-placeholder">Event name</span>';
                }
            },
        },
        {
            dataIndex: 'event_date',
            text: 'Date',
            sortable: false,
            editable: true,
            menuDisabled: true,
            width: 124,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return moment(value).format('D MMM YY ddd');
                } else {
                    return '<span class="a-cell-placeholder">Date</span>';
                }
            },
        },
        {
            dataIndex: 'event_from',
            text: 'From',
            sortable: false,
            editable: true,
            menuDisabled: true,
            width: 66,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return moment(value).format('HH:mm');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            dataIndex: 'event_to',
            text: 'To',
            sortable: false,
            editable: true,
            menuDisabled: true,
            width: 66,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return moment(value).format('HH:mm');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            dataIndex: 'event_comment',
            text: 'Comment',
            sortable: false,
            editable: true,
            menuDisabled: true,
            flex: 1,
            cell: {
                encodeHtml: false,
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
            dataIndex: 'da_berth_name',
            text: 'Berth',
            sortable: false,
            editable: true,
            menuDisabled: true,
            width: 220,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record) {
                    if (record.get('berth')) {
                        return (
                            '<span class="c-link hbox"><i class="md-icon-outlined c-link mr-8">place</i><span class="text-truncate">' +
                            record.get('berth').name +
                            '</span></span>'
                        );
                    } else if (record.get('da_berth_name')) {
                        return (
                            '<span class="c-link hbox"><i class="md-icon-outlined c-link mr-8">place</i><span class="text-truncate">' +
                            record.get('da_berth_name') +
                            '</span></span>'
                        );
                    } else {
                        return '';
                    }
                }
            },
        },
    ],
    listeners: {
        painted: function (me) {
            me.setMasked(false);
        },
    },
});
