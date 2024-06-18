import './AddCurrency';

Ext.define('Abraxa.view.settings.currencies.CurrenciesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.currencies.grid',
    flex: 1,
    testId: 'settingsCurrenciesGrid',
    cls: 'a-users-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    itemConfig: {
        viewModel: {
            formulas: {
                setRecordForex: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        var store = this.get('currencyRates');
                        if (store && store.count()) {
                            let storeRecord = store.queryBy(function (rec) {
                                return rec.get('currency') == record.get('currency');
                            }).items[0];

                            if (!storeRecord) return; // The currencyRates store is not loaded or has no record for this currency

                            record.set('forex', storeRecord.get('exchange_rate') / 1);
                        }
                    },
                },
            },
        },
    },
    bind: {
        store: '{currencies}',
        hideHeaders: '{currencies.count ? false : true}',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-833 -450)"><g transform="translate(-1 105)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M27.753,23.725c-4-1.328-5.94-2.16-5.94-4.275,0-2.3,2.5-3.128,4.072-3.128a4.348,4.348,0,0,1,4.275,3.015l3.555-1.507A7.665,7.665,0,0,0,28,12.79V10H23.5v2.835a6.881,6.881,0,0,0-5.6,6.66c0,5.107,5.063,6.547,7.538,7.448,3.555,1.26,5.13,2.408,5.13,4.567,0,2.543-2.362,3.623-4.455,3.623-4.095,0-5.265-4.208-5.4-4.7l-3.735,1.507A9.246,9.246,0,0,0,23.5,38.6v2.9H28V38.71c.9-.2,6.525-1.327,6.525-7.245C34.525,28.337,33.153,25.593,27.753,23.725ZM5.5,46H1V32.5H14.5V37H8.92A20.245,20.245,0,0,0,46,25.75h4.5a24.756,24.756,0,0,1-45,14.243ZM1,25.75A24.756,24.756,0,0,1,46,11.508V5.5h4.5V19H37V14.5h5.58A20.245,20.245,0,0,0,5.5,25.75Z" transform="translate(869.25 486.25)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/></g></svg><div class="a-no-content-txt">No currencies available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Currency',
                testId: 'settingsCurrenciesGridAddCurrencyBtn',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: function (btn, e) {
                    Ext.create('Abraxa.view.settings.currencies.AddCurrency', {
                        viewModel: {
                            parent: btn.upVM(),
                            data: {
                                editMode: false,
                                currency: Ext.create('Abraxa.model.settings.company.CompanyCurrency', {
                                    company_id: btn.upVM().get('currentCompany').get('id'),
                                    base_currency: btn.upVM().get('currentCompany').get('default_currency'),
                                }),
                            },
                        },
                    }).show();
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    reference: 'currenciessGrid',
    columns: [
        {
            text: 'Currency',
            cls: 'a-column-offset-x32',
            dataIndex: 'currency',
            groupable: false,
            flex: 4,
            minWidth: 320,
            cell: {
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    let description = '';
                    if (record.get('description')) {
                        description = '<div class="sm-title">' + record.get('description') + '</div>';
                    }
                    return (
                        '<div class="hbox a_grid_action"><div class="mini-icon hbox" data-flag="{currency}"><img src="https://static.abraxa.com/flags/1x1/' +
                        value.substr(0, 2).toLowerCase() +
                        '.svg" class="a-flag-x32 a-flag-outlined a-img-round" /></div><div class="ml-16"><div class="text-truncate fw-b c-blue">' +
                        value +
                        '</div><div class="sm-title text-truncate">' +
                        description +
                        '</div></div>'
                    );
                }
            },
        },
        {
            text: 'Exchange rate',
            dataIndex: 'forex',
            minWidth: 220,
            cell: {
                cls: 'a-cell-users-heads',
                encodeHtml: false,
            },
            renderer: function (value, record, grid) {
                let cls = '';
                const forexExchangeRate = record.get('forex');
                const exchangeRate = record.get('exchange_rate');
                if (forexExchangeRate > exchangeRate) {
                    cls = 'c-red';
                } else if (forexExchangeRate < exchangeRate) {
                    cls = 'c-teal';
                }
                return '<div class="fw-b ' + cls + '">' + Abraxa.utils.Functions.formatROE(exchangeRate) + '</div>';
            },
        },
        {
            text: 'Forex rate',
            minWidth: 220,
            bind: {
                dataIndex: '{forex}',
            },
            cell: {
                cls: 'c-text',
                encodeHtml: false,
            },
            renderer: function (value, record, grid) {
                return record.get('forex');
            },
        },
        {
            text: 'Rates',
            minWidth: 220,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function () {
                return '<svg xmlns="http://www.w3.org/2000/svg" width="80.6" height="26.2" viewBox="0 0 80.6 26.2"><path d="M0,26H7l3-1,4-5,3-2h4l3-2h4l3,2h4l3-3,4-2,3-1,4,1,3-3,4-2,3-1,4-3,3,1,4-3,3,2,4,1,3-4" transform="translate(0 -0.55)" fill="none" stroke="#009688" stroke-width="1.5"/></svg>';
            },
        },
        {
            text: 'Updated by',
            dataIndex: 'updated_by',
            minWidth: 200,
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
        {
            dataIndex: '',
            minWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cls: 'a-column-actions',
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        testId: 'settingsCurrenciesGridMoreActionsBtn',
                        arrow: false,
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        menu: {
                            cls: 'a-main-edit-menu',
                            // width: 160,
                            ui: 'has-icons medium',
                            items: [
                                {
                                    text: 'Update rate',
                                    testId: 'settingsCurrenciesGridUpdateRateMenuBtn',
                                    iconCls: 'md-icon-outlined md-icon-edit',
                                    slug: 'settingsCurrencyROE',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (me) {
                                        let dialog = Ext.create('Abraxa.view.settings.currencies.AddCurrency', {
                                            viewModel: {
                                                parent: me.upVM(),
                                                data: {
                                                    editMode: true,
                                                    currency: Ext.create(
                                                        'Abraxa.model.settings.company.CompanyCurrency',
                                                        {
                                                            company_id: me.upVM().get('currentCompany').get('id'),
                                                            base_currency: me
                                                                .upVM()
                                                                .get('currentCompany')
                                                                .get('default_currency'),
                                                            exchange_rate: me.upVM().get('record').get('forex'),
                                                            description: me.upVM().get('record').get('description'),
                                                            currency: me.upVM().get('record').get('currency'),
                                                        }
                                                    ),
                                                },
                                            },
                                        });
                                        dialog.show();
                                    },
                                },
                            ],
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        testId: 'settingsCurrenciesGridViewDetailsBtn',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function () {
                            let upContainer = Ext.ComponentQuery.query('[itemId=currenciesMainContainer]')[0],
                                downContainer = Ext.ComponentQuery.query('[itemId=currenciesDetalsContainer]')[0];
                            upContainer.setHidden(true);
                            downContainer
                                .setShowAnimation({
                                    type: 'slide',
                                    direction: 'left',
                                })
                                .setHidden(false);
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (me, selection) {
            let record = selection.record;
            if (record && selection.cell && !selection.cell.hasCls('no_expand')) {
                let upContainer = Ext.ComponentQuery.query('[itemId=currenciesMainContainer]')[0],
                    downContainer = Ext.ComponentQuery.query('[itemId=currenciesDetalsContainer]')[0];
                upContainer.setHidden(true);
                downContainer.setHidden(false);
            }
        },
    },
});
