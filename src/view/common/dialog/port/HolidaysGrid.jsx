Ext.define('Abraxa.view.common.port.HolidaysGrid', {
    extend: 'Abraxa.core.AbraxaFormList',
    xtype: 'common.port.holidaysgrid',
    itemId: 'portHolidaysGridItemId',
    shadow: false,
    cls: 'eventList abraxa-grid',
    height: 594,
    flex: 1,
    scrollable: 'y',
    ui: 'transparent',
    emptyText: 'No records available',
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    bind: {
        store: {
            bindTo: '{portServedHolidays}',
            deep: true,
        },
    },
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            docked: 'top',
            cls: 'c-grey',
            items: [
                {
                    xtype: 'div',
                    html: 'Date',
                    padding: '12 0 12 32',
                    style: 'color: rgba(96, 125, 139, 0.8); font-size: 13px; font-weight: 500;',
                    flex: 1,
                },
                {
                    xtype: 'div',
                    html: 'Description',
                    style: 'color: rgba(96, 125, 139, 0.8); font-size: 13px; font-weight: 500;',
                    padding: '12 0',
                    flex: 3,
                },
            ],
        },
    ],
    itemConfig: {
        viewModel: true,
        xtype: 'container',
        flex: 1,
        items: [
            {
                xtype: 'container',
                cls: 'a-bb-100',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'div',
                        flex: 1,
                        padding: '12 0 12 32',
                        bind: {
                            html: '<span class="">{record.date:date("j F")}</span>',
                        },
                    },
                    {
                        xtype: 'div',
                        flex: 3,
                        padding: '12 0',
                        bind: {
                            html: '<span class="fw-b">{record.description}</a></span>',
                        },
                    },
                ],
            },
        ],
    },
});
