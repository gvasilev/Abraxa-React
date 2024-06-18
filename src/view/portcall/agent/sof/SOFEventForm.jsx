Ext.define('Abraxa.view.sof.portcall.sof.SOFEventForm', {
    extend: 'Ext.form.Panel',
    xtype: 'sof.event.form',
    cls: 'sof-events-form',
    itemId: 'formGeneralEvents',
    padding: 6,
    layout: 'hbox',
    shadow: false,
    scrollabble: false,
    defaults: {
        padding: '0 4',
        clearable: false,
        validateOnInit: 'none',
    },
    viewModel: {
        stores: {
            generalEvents: {
                source: '{defaultGeneralEvents}',
            },
        },
    },
    items: [
        {
            xtype: 'checkboxfield',
            width: 36,
            cls: 'sof_selection_checkbox',
            slug: 'portcallOpsSof',
            bind: {
                permission: '{userPermissions}',
            },
            listeners: {
                check: function () {
                    let grid = Ext.ComponentQuery.query('grid[cls~=a-sof-events]')[0];

                    grid.selectAll();
                },
                uncheck: function () {
                    let grid = Ext.ComponentQuery.query('grid[cls~=a-sof-events]')[0];

                    grid.deselectAll();
                },
            },
        },
        {
            xtype: 'sof.general.events',
            itemId: 'formEvent',
            ui: 'classic',
            width: 300,
            name: 'default_sof_event_id',
            placeholder: 'Event name',
            slug: 'portcallOpsSof',
            bind: {
                store: '{generalEvents}',
                permission: '{userPermissions}',
            },
            required: true,
            reference: 'selectedSofEvent',
            publishes: ['selection'],
            // listeners: {
            //     beforequery: function () {
            //         let category_id = this.upVM().get('addFormSelectedCategory.value');
            //         this.getStore().clearFilter();
            //         this.getStore().addFilter({
            //             property: 'event_category',
            //             value: category_id,
            //             operator: '=',
            //         });
            //     }
            // }
        },
        {
            xtype: 'abraxa.datefield',
            ui: 'classic',
            width: 124,
            name: 'event_date',
            placeholder: 'Date',
            required: true,
            slug: 'portcallOpsSof',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'abraxa.timefield',
            ui: 'classic',
            width: 66,
            slug: 'portcallOpsSof',
            placeholder: 'From',
            bind: {
                placeholder: '{selectedSofEvent.selection.type.category.id == 1 ? "Time" : "From"}',
                permission: '{userPermissions}',
            },
            name: 'event_from',
            padding: '0 4',
        },
        {
            xtype: 'abraxa.timefield',
            ui: 'classic',
            width: 66,
            name: 'event_to',
            placeholder: 'To',
            padding: '0 4',
            slug: 'portcallOpsSof',
            bind: {
                disabled: '{selectedSofEvent.selection.type.category.id == 1 ? true : false}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'textfield',
            ui: 'classic',
            flex: 1,
            minWidth: 170,
            name: 'event_comment',
            placeholder: 'Comment',
            slug: 'portcallOpsSof',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            ui: 'classic',
            width: 170,
            itemId: 'formSplit',
            padding: '0 4',
            xtype: 'selectfield',
            valueField: 'id',
            displayField: 'name',
            queryMode: 'local',
            placeholder: 'Assign to berth',
            name: 'da_berth_id',
            slug: 'portcallOpsSof',
            store: [],
            bind: {
                store: '{berths}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'button',
            width: 32,
            height: 32,
            margin: '2 0 0 4',
            iconCls: 'md-icon-add',
            ui: 'normal-light small round',
            slug: 'portcallOpsSof',
            bind: {
                permission: '{userPermissions}',
            },
            zIndex: 100,
            handler: function () {
                this.lookupController().submitSofForm(this.up('formpanel'));
            },
        },
    ],
});
