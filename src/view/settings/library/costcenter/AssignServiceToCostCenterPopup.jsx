Ext.define('Abraxa.view.settings.library.cost_center.AssignServiceToCostCenterPopup', {
    xtype: 'AssignServiceToCostCenterPopup',
    extend: 'Ext.Dialog',
    controller: 'CostCenterController',
    cls: 'a-dialog-create a-dialog-has-icon',
    closable: true,
    draggable: false,
    width: 540,
    maxHeight: '80%',
    minHeight: '80%',
    padding: 0,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        stores: {
            serviceStore: {
                type: 'default-expense-items',
                autoLoad: true,
                sorters: [
                    {
                        property: 'id',
                        direction: 'ASC',
                    },
                ],
            },
        },
        formulas: {
            selectedServices: {
                bind: {
                    bindTo: '{serviceStore}',
                    deep: true,
                },
                get: function (store) {
                    return store.queryBy(function (record) {
                        return record.get('is_checked') == true;
                    }).items;
                },
            },
        },
    },
    bind: {
        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">layers</i></div>Assign services to {costCenter.text}',
    },
    buttons: {
        ok: {
            text: 'Assign',
            ui: 'action loading',
            enableToggle: true,
            reference: 'assignServicesToCostCenterButton',
            publishes: 'pressed',
            bind: {
                text: '{assignServicesToCostCenterButton.pressed ? "Saving..." : "Assign"}',
                disabled: '{assignServicesToCostCenterButton.pressed}',
            },
            handler: 'assignServiceToCostCenter',
        },
        cancel: {
            text: 'Cancel',
            margin: '0 8',
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'searchfield',
            margin: '0 0 8 0',
            padding: '0 24',
            height: 40,
            ui: 'classic filled-light',
            cls: 'a-field-icon icon-search',
            placeholder: 'Search service',
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    var serviceStore = this.upVM().get('serviceStore');
                    if (newValue == '') serviceStore.removeFilter('search');
                },
                action: function (me, newValue, oldValue, eOpts) {
                    const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                    var serviceStore = this.upVM().get('serviceStore');
                    serviceStore.removeFilter('search');
                    if (query.length > 2) {
                        serviceStore.addFilter(
                            new Ext.data.Query({
                                id: 'search',
                                source: 'name like "' + query + '"',
                            })
                        );
                    }
                },
            },
        },
        {
            xtype: 'div',
            cls: 'sm-text text-info mb-8 mx-24',
            html: 'Choose a service to assign',
        },
        {
            xtype: 'list',
            infinite: false,
            flex: 1,
            bind: {
                store: '{serviceStore}',
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
                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-832 -520)"><g transform="translate(-2 175)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M20.667,23.667a9.333,9.333,0,1,0-9.333-9.333A9.344,9.344,0,0,0,20.667,23.667Zm0-13.333a4,4,0,1,1-4,4A3.995,3.995,0,0,1,20.667,10.333ZM20.8,37H9.387a27.664,27.664,0,0,1,11.28-2.667c.293,0,.613.027.907.027a12.213,12.213,0,0,1,4.373-4.827A31.269,31.269,0,0,0,20.667,29C14.427,29,2,32.12,2,38.333v4H20.667v-4A7.291,7.291,0,0,1,20.8,37Zm19.867-6.667c-4.907,0-14.667,2.693-14.667,8v4H55.333v-4C55.333,33.027,45.573,30.333,40.667,30.333Zm3.227-4.853a6.667,6.667,0,1,0-6.453,0,6.527,6.527,0,0,0,6.453,0Z" transform="translate(865.333 558.333)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/></g></svg><div class="a-no-content-txt">No services available</div></div>',
                    },
                ],
            },
            emptyTextDefaults: {
                xtype: 'emptytext',
                cls: 'a-empty-text',
            },
            itemConfig: {
                viewModel: {
                    formulas: {},
                },
                xtype: 'container',
                height: 48,
                cls: 'a-bb-100',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                margin: '0 24',
                items: [
                    {
                        xtype: 'checkbox',
                        ui: 'medium',
                        margin: '0 16 0 0',
                        bind: {
                            checked: '{record.is_checked}',
                        },
                    },
                    {
                        xtype: 'div',
                        cls: 'text-truncate',
                        width: 284,
                        bind: {
                            html: '{record.name}',
                        },
                    },
                ],
            },
        },
    ],
});
