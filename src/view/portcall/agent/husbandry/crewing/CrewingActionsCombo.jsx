import '../../../../../store/portcalls/CrewingActions';

Ext.define('Abraxa.view.portcall.husbandry.crewing.CrewingActionsCombo', {
    extend: 'Ext.field.Select',
    xtype: 'husbandry.crewing.actions.combo',
    label: 'Action',
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    store: {
        type: 'portcall.crewingactions',
    },
});
