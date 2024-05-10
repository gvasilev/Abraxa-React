Ext.define('Abraxa.view.settings.currencies.CurrenciesHistoricalGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.currencies.historical.grid',
    flex: 1,
    cls: 'a-users-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    bind: {
        store: '{historicalRates}',
    },
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-833 -450)"><g transform="translate(-1 105)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(865.666 488)"><rect width="6" height="5" transform="translate(42.333 11)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/><rect width="6" height="6" transform="translate(42.333 21)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/><rect width="6" height="5" transform="translate(42.333 32)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/><path d="M1,19.333V46H17V32.667h5.333V46h16V19.333L19.667,6ZM33,40.667H27.667V27.333h-16V40.667H6.333V22l13.333-9.333L33,22Z" transform="translate(-1 2)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/><path d="M10,3V8.253l5.333,3.813V8.333h24V45.667H28.667V51h16V3Z" transform="translate(14 -3)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/></g></g></svg><div class="a-no-content-txt">No historical rates available</div></div>',
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    columns: [
        {
            text: 'Date',
            cls: 'a-column-offset-x32',
            dataIndex: 'created_at',
            groupable: false,
            flex: 2,
            cell: {
                cls: 'a-cell-offset-x32 a-cell-date',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="hbox"><i class="md-icon-outlined md-16 mr-8">calendar_today</i>' +
                        Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(value, AbraxaConstants.formatters.date.dayAbbrMonYearHyphenTime24) +
                        '</div>'
                    );
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Exchange rate',
            dataIndex: 'exchange_rate',
            flex: 1.5,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    let selection = this.upVM().get('currenciessGrid.selection');
                    if (selection.get('id') == record.get('id')) {
                        return (
                            '<div class="hbox fw-b">' +
                            value +
                            '<i class="material-icons c-green ml-8 fs-18">check</i></div>'
                        );
                    }
                    return value;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Updated',
            dataIndex: 'created_by',
            flex: 1,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val, record) {
                if (val) {
                    let storeUsers = this.upVM().get('users');
                    let recordUser = storeUsers.findRecord('id', val);
                    if (recordUser) {
                        var assigned_to = recordUser.get('first_name')[0] + '. ' + recordUser.get('last_name'),
                            user_img = recordUser.get('profile_image')
                                ? '<img height="30" class="a_grid_action" src="' +
                                  recordUser.get('profile_image') +
                                  '"/>'
                                : '<i class="md-icon-outlined a_grid_action">person</i>';
                        return (
                            '<a class="a-person a-icon-round a_grid_action person_details" href="javascript:void(0)">' +
                            user_img +
                            ' ' +
                            Abraxa.getApplication()
                                .getController('AbraxaController')
                                .parseMomentDate(
                                    record.get('updated_at'),
                                    AbraxaConstants.formatters.date.dayAbbrMonYearHyphenTime24
                                ) +
                            '</a>'
                        );
                    }
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
    ],
});
