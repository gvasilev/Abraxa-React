Ext.define('Abraxa.view.portcall.appointment.AppointmentNominationInfo', {
    extend: 'Ext.Container',
    xtype: 'appointment.nomination.info',
    padding: '8 24',
    subObject: 'appointment',
    bind: {
        permission: '{userPermissions}',
        objectPermission: '{objectPermissions}',
    },
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'div',
                            html: "<div class='hbox'><div class='a-badge a-badge-nomination'><i class='md-icon-outlined'>business_center</i></div><div class='a-panel-title fs-14'>Nomination info</div></div>",
                            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right',
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let component = this.component;
                                        component.toggleCls('is-collapsed');
                                        component
                                            .up('container')
                                            .up('container')
                                            .up('container')
                                            .down('[cls~=a-collapsible-container]')
                                            .toggleCls('is-collapsed');
                                    },
                                },
                            },
                        },
                        // {
                        //     xtype: 'button',
                        //     height: 30,
                        //     right: 40,
                        //     bottom: 0,
                        //     top: 0,
                        //     style: 'margin: auto;',
                        //     ui: 'tool-text-sm normal',
                        //     iconCls: 'md-icon-outlined md-icon-unfold-more',
                        //     enableToggle: true,
                        //     text: 'Hub structure',
                        //     bind: {
                        //         hidden: '{currentUserType == "principal" ? true:false}'
                        //     },
                        //     handler: function (me) {
                        //         if (me.upVM().get('hubStructure')) {
                        //             me.upVM().set('hubStructure', false);
                        //             me.setIconCls('md-icon-outlined md-icon-unfold-more');
                        //         } else {
                        //             me.upVM().set('hubStructure', true);
                        //             me.setIconCls('md-icon-outlined md-icon-unfold-less');
                        //         }
                        //     }
                        // }
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-collapsible-container',
            items: [
                {
                    xtype: 'container',
                    showNoPermissions: true,
                    slug: 'portcallAppointmentNominationInfo',
                    bind: {
                        permission: '{userPermissions}',
                        cls: 'a-appointments-form',
                    },
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic',
                        flex: 1,
                    },
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    //hidden for principal
                                    xtype: 'organization.combo',
                                    label: 'Appointing party',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    placeholder: 'Choose Company',
                                    hidden: false,
                                    required: true,
                                    floatedPicker: {
                                        minWidth: 308,
                                    },
                                    // slug: 'portcallAppointmentNominationInfo',
                                    bind: {
                                        value: '{nomination.appointing_party_id}',
                                        inputValue: '{nomination.appointing_party_name}',
                                        readOnly: '{editableAppointingParty}',
                                        required: '{nonEditable ? false : true}',
                                        ui: '{editableAppointingParty ? "viewonly classic" : "hovered-border classic"}',
                                        // permission: '{userPermissions}'
                                    },
                                    listeners: {
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                        select: function () {
                                            let selection = this.getSelection(),
                                                record = this.upVM().get('nomination');
                                            record.set('appointing_party_name', selection.get('org_name'));
                                            record.set('appointing_party_email', selection.get('org_email'));
                                        },
                                        painted: function (me) {
                                            me.setError(null);
                                        },
                                        clearicontap: function () {
                                            let record = this.upVM().get('nomination');
                                            record.set('appointing_party_name', null);
                                            record.set('appointing_party_email', null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    labelAlign: 'left',
                                    // slug: 'portcallNominationVoyageNumber',
                                    label: 'Voy. number',
                                    placeholder: 'Voyage number',
                                    subObject: 'appointment',
                                    bind: {
                                        value: '{nomination.voyage_number}',
                                        permission: '{userPermissions}',
                                        readOnly: '{editableVoyageNumber}',
                                        ui: '{editableVoyageNumber ? "viewonly classic" : "hovered-border classic"}',
                                        // permission: '{userPermissions}',
                                        // objectPermission: '{objectPermissions}'
                                    },
                                    listeners: {
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'organization.combo',
                                    label: 'Nominating party',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    required: true,
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    placeholder: 'Choose Company',
                                    floatedPicker: {
                                        minWidth: 308,
                                    },
                                    slug: 'portcallAppointmentNominationInfo',
                                    bind: {
                                        value: '{nomination.nominating_party_id}',
                                        inputValue: '{nomination.nominating_party_name}',
                                        readOnly: '{nonEditable ? true : false}',
                                        required: '{nonEditable ? false : true}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    listeners: {
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                        select: function () {
                                            let selection = this.getSelection(),
                                                record = this.upVM().get('nomination');
                                            record.set('nominating_party_name', selection.get('org_name'));
                                            record.set('nominating_party_email', selection.get('org_email'));
                                        },
                                        painted: function (me) {
                                            me.setError(null);
                                        },
                                        clearicontap: function () {
                                            let record = this.upVM().get('nomination');
                                            record.set('nominating_party_name', null);
                                            record.set('nominating_party_email', null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    label: 'Nomination reference',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    clearable: false,
                                    slug: 'portcallNominationReference',
                                    placeholder: 'Nomination reference',
                                    bind: {
                                        value: '{nomination.nomination_reference}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    listeners: {
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'abraxa.datetimefield',
                                    label: 'Date received',
                                    labelAlign: 'left',
                                    // slug: 'portcallNominationDateReceived',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-time icon-rounded',
                                    bind: {
                                        dateTime: '{nomination.date_received}',
                                        hidden: '{currentUserType == "principal" ? true:false}',
                                        readOnly: '{editableDataReceived}',
                                        ui: '{editableDataReceived ? "viewonly classic" : "hovered-border classic"}',
                                        // permission: '{userPermissions}',
                                        // objectPermission: '{objectPermissions}'
                                    },
                                    listeners: {
                                        focusleave: function (me) {
                                            let record = this.upVM().get('nomination');
                                            record.set({
                                                date_received: me.getValue(),
                                            });
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Port function',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    forceSelection: true,
                                    placeholder: 'Function',
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'name',
                                    subObject: 'appointment',
                                    required: true,
                                    // slug: 'portcallAppointmentNominationInfo',
                                    bind: {
                                        value: '{nomination.port_function}',
                                        readOnly: '{editablePortFunction}',
                                        ui: '{editablePortFunction ? "viewonly classic" : "hovered-border classic"}',
                                        // permission: '{userPermissions}',
                                        // objectPermission: '{objectPermissions}'
                                    },
                                    store: {
                                        type: 'berth.function',
                                    },
                                    listeners: {
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Agency type',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    placeholder: 'Choose agency type',
                                    autoFocus: false,
                                    disabled: false,
                                    required: true,
                                    subObject: 'appointment',
                                    valueField: 'id',
                                    displayField: 'name',
                                    // slug: 'portcallAppointmentNominationInfo',
                                    store: {
                                        type: 'agency.types',
                                    },
                                    bind: {
                                        value: '{nomination.agency_type_id}',
                                        readOnly: '{editableAgencyType}',
                                        ui: '{editableAgencyType ? "viewonly classic" : "hovered-border classic"}',
                                        // permission: '{userPermissions}',
                                        // objectPermission: '{objectPermissions}'
                                    },
                                    listeners: {
                                        select: function () {
                                            let selection = this.getSelection(),
                                                record = this.upVM().get('nomination');
                                            record.set('agency_type_name', selection.get('name'));
                                        },
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'organization.combo',
                                    label: 'Lead agent',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    placeholder: 'Choose Company',
                                    slug: 'portcallNominationAgencyStructure',
                                    // hidden: true,
                                    floatedPicker: {
                                        minWidth: 308,
                                    },
                                    bind: {
                                        value: '{nomination.lead_agent_id}',
                                        inputValue: '{nomination.lead_agent_name}',
                                        // hidden: '{nomination.company_role == "lead agent" ? true : false}',
                                        disabled: '{nomination.company_role == "lead agent" ? true : false}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    listeners: {
                                        select: function () {
                                            let selection = this.getSelection(),
                                                record = this.upVM().get('nomination');
                                            record.set('lead_agent_name', selection.get('org_name'));
                                            record.set('lead_agent_email', selection.get('org_email'));
                                        },
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                        clearicontap: function () {
                                            let record = this.upVM().get('nomination');
                                            record.set('lead_agent_name', null);
                                            record.set('lead_agent_email', null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'organization.combo',
                                    label: 'Sub agent',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    placeholder: 'Choose Company',
                                    hidden: true,
                                    slug: 'portcallNominationAgencyStructure',
                                    floatedPicker: {
                                        minWidth: 308,
                                    },
                                    bind: {
                                        value: '{nomination.sub_agent_id}',
                                        inputValue: '{nomination.sub_agent_name}',
                                        hidden: '{nomination.company_role == "sub agent" ? true : false}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    listeners: {
                                        select: function () {
                                            let selection = this.getSelection(),
                                                record = this.upVM().get('nomination');
                                            record.set('sub_agent_name', selection.get('org_name'));
                                            record.set('sub_agent_email', selection.get('org_email'));
                                        },
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                        clearicontap: function () {
                                            let record = this.upVM().get('nomination');
                                            record.set('sub_agent_name', null);
                                            record.set('sub_agent_email', null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    label: 'Hub reference',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    clearable: false,
                                    placeholder: 'Hub reference',
                                    hidden: true,
                                    slug: 'portcallNominationAgencyStructure',
                                    bind: {
                                        value: '{nomination.hub_reference}',
                                        hidden: '{(nomination.sub_agent_id && currentUserType != "principal") ? false:true}',
                                        permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        focusleave: function () {
                                            let record = this.upVM().get('nomination');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
