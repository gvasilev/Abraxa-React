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
        // TODO CORE-2987: Refactor this store to use a more unique name; used in many places
        // (look for upVM().get('portcalls'), for example)
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
                    // TODO: CORE-2987: It seems portcallAgentGridActiveFilters is not used anywhere;
                    // However, removing it results in the grid stateful filters not always applied. Check why.
                    const portcallsAgentMainVM =
                        Ext.ComponentQuery.query('portcalls\\.agent\\.main')?.[0]?.getViewModel();
                    const filterCount = store.getFilters()?.count() || 0;
                    portcallsAgentMainVM?.set('portcallAgentGridActiveFilters', filterCount > 0 ? true : false);
                },
            },
        },
    },
    formulas: {
        totalPortcallsRecords: {
            bind: {
                bindTo: '{portcalls.totalCount}',
            },
            get: function (totalCount) {
                if (!totalCount) return 0;
                return totalCount;
            },
        },
    },
});
