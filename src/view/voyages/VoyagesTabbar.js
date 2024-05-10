Ext.define('Abraxa.view.voyages.Tabbar', {
    extend: 'Ext.Container',
    xtype: 'voyages.tabbar',
    cls: 'a-bb-100',
    items: {
        xtype: 'container',
        cls: 'a-bgr-white',
        layout: {
            type: 'hbox',
            pack: 'space-between',
        },
        items: [
            {
                xtype: 'tabbar',
                reference: 'voyagesTabbar',
                publishes: ['activeTabIndex'],
                activeTabIndex: 0,
                items: [
                    {
                        text: 'Active',
                    },
                    {
                        text: 'Closed',
                    },
                ],
                listeners: {
                    activeTabchange: function (me, value) {
                        let inquiryArchived = me.upVM().get('inquiryArchived');
                        if (value.getText() == 'Closed') {
                            if (!inquiryArchived.isLoaded()) {
                                inquiryArchived.load();
                            }
                        }
                    },
                },
            },
            {
                xtype: 'searchfield',
                margin: '8 16',
                width: 300,
                listeners: {
                    change: function (field, newValue, oldValue, eOpts) {
                        var storeVoyages = this.upVM().get('voyages');
                        if (newValue == '') storeVoyages.removeFilter('search');
                    },
                    action: function (me, newValue, oldValue, eOpts) {
                        var query = this.getValue().toLowerCase();
                        var storeVoyages = this.upVM().get('voyages');
                        storeVoyages.removeFilter('search');
                        if (query.length > 2) {
                            storeVoyages.addFilter(
                                new Ext.data.Query({
                                    id: 'search',
                                    source: 'search_index like "' + query + '"',
                                })
                            );
                        }
                    },
                },
            },
            {
                xtype: 'container',
                padding: '8 16',
                items: [
                    {
                        xtype: 'button',
                        text: 'Create',
                        iconCls: 'md-icon-add',
                        ui: 'confirm raised round btn-normal',
                        handler: 'createVoyage',
                    },
                ],
            },
        ],
    },
});
