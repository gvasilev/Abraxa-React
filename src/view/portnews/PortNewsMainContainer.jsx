import './PortNewsMainViewModel';
import './PortNewsCardsDataView';
import './PortNewsMainFiltersMenu';
import './Header';
import './CreateNewPostDialog';

Ext.define('Abraxa.view.portnews.PortNewsMainContainer', {
    xtype: 'PortNewsMain',
    minWidth: '100%',
    extend: 'Ext.Container',
    viewModel: 'PortNewsMainViewModel',
    cls: 'a-portnews-main-container',
    layout: 'vbox',
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'container',
            cls: 'a-card-container a-portnews-inner-container',
            id: 'portnews_inner',
            flex: 1,
            layout: {
                type: 'vbox',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    items: [
                        {
                            xtype: 'button',
                            text: 'New post',
                            testId: 'newPostBtnTestId',
                            iconCls: 'md-icon-add',
                            cls: 'chameleon_add_portcall',
                            ui: 'action small',
                            hideMode: 'opacity',
                            handler: function () {
                                Ext.create('Abraxa.view.portnews.CreateNewPostDialog', {
                                    record: null,
                                }).show();
                            },
                            bind: {
                                hidden: '{currentUserType === "agent" ? false : true}',
                            },
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'classic filled-light',
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search news',
                            centered: true,
                            width: 300,
                            height: 42,
                            listeners: {
                                change: {
                                    buffer: 500,
                                    fn: function (field, newValue, oldValue, eOpts) {
                                        const store = Ext.getStore('portNewsStore');
                                        if (newValue.length === 0) store.removeFilter('portsSearchFilter');
                                        if (newValue.length <= 3) return;
                                        store.addFilter({
                                            id: 'portsSearchFilter',
                                            property: 'search',
                                            value: newValue,
                                            operator: '=',
                                            exactMatch: true,
                                        });
                                    },
                                },
                                action: function (me, newValue, oldValue, eOpts) {},
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Filter',
                            testId: 'newPostBtntestId',
                            ui: 'small',
                            cls: 'a-has-counter',
                            iconCls: 'md-icon-filter-alt',
                            bind: {
                                text: '{filterCount > 0 ? "Filter <em>" + filterCount + "</em>" : "Filter"}', //TODO
                                ui: '{isFilterOpened ? "normal-light small" : "default small"}',
                            },
                            handler: function () {
                                const vm = this.upVM();
                                vm.set('isFilterOpened', !vm.get('isFilterOpened'));
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        Ext.getCmp('portnews_inner').toggleCls('is-collapsed');
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'PortNewsCardsDataView',
                },
                {
                    xtype: 'PortNewsMainFiltersMenu',
                    hidden: true,
                    hideMode: 'offsets',
                    flex: 1,
                    docked: 'right',
                    bind: {
                        hidden: '{!isFilterOpened}',
                    },
                },
            ],
        },
    ],
});
