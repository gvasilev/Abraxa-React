import '../../../store/portcalls/Portcalls';
import '../../../store/portcalls/Statuses';

Ext.define('Abraxa.view.portcalls.agent.PortcallsAgentViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.portcalls-agent-viewmodel',
    data: {
        invitationTitle: 'Invitations',
        segmentedButtons: {},
        archiveMode: false,
        portcallAgentGridActiveFilters: false,
    },
    stores: {
        portcallAgentStatus: {
            type: 'portcall.statuses',
            autoLoad: true,
            filters: [
                {
                    property: 'is_archive',
                    operator: '=',
                    value: 0,
                    exactMatch: true,
                },
            ],
        },
        portcalls: {
            type: 'portcalls',
            autoSort: true,
            sorters: [
                {
                    property: 'created_at',
                    direction: 'DESC',
                },
            ],
            listeners: {
                beforeload: function (store, eOpts) {
                    Ext.ComponentQuery.query('portcalls\\.agent\\.main')[0]
                        .getViewModel()
                        .set('portcallAgentGridActiveFilters', store.getFilters().count() > 0 ? true : false);
                },
            },
        },
    },
    formulas: {
        portcallAgentGridActiveFilters: {
            bind: {
                bindTo: '{portcalls}',
                deep: true,
            },
            get: function (store) {
                let count = 0;
                if (store.getFilters().count() === 0) return;
                store.getFilters().items.forEach((item) => {
                    if (item && item.getId() !== 'archived') {
                        count++;
                    }
                });
                return count;
            },
        },
        totalPortcallsRecords: {
            bind: {
                bindTo: '{portcalls}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },
    },
});
