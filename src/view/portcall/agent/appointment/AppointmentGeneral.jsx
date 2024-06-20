import './AppointmentGeneralInfo';
import './AppointmentNominationInfo';
import './AppointmentCargo';
import './AppointmentInstructions';

Ext.define('Abraxa.view.portcall.appointment.AppointmentGeneral', {
    extend: 'Ext.Container',
    xtype: 'appointment.general',
    cls: 'a-appointment',
    flex: 1,
    // layout: {
    //     type: 'vbox',
    //     align: 'stretch'
    // },
    scrollable: 'y',
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            weight: 2,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    height: 64,
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-container-title',
                            items: [
                                {
                                    xtype: 'title',
                                    bind: {
                                        title: '<span>Appointment details</span>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-subtitle',
                                    html: '<i class="md-icon-outlined md-icon-group"></i><a href="javascript:void(0)">0 members</a>',
                                    bind: {
                                        html: '<i class="md-icon-outlined md-icon-group"></i><a href="javascript:void(0)">{appointmentMenuMembers.length} members</a>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            fn: function () {
                                                let vm = this.component.upVM(),
                                                    menu = Ext.create('Abraxa.view.portcall.MembersPreviewMenu', {
                                                        viewModel: {
                                                            parent: vm,
                                                        },
                                                    });
                                                menu.showBy(this);
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '8 24 0 24',
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'vessel.combo',
                            maxWidth: 496,
                            ui: 'field-xl no-border classic',
                            cls: 'a-field-icon icon-vessel vessel_combo_create w-50',
                            label: false,
                            triggers: null,
                            disabled: true,
                            bind: {
                                value: '{object_record.voyage.vessel_imo}',
                                inputValue: '{object_record.voyage.vessel_name}',
                            },
                            listeners: {
                                select: function (me, selection) {
                                    var record = this.upVM().get('object_record');
                                    if (selection) {
                                        if (selection.get('company_id')) {
                                            record.getVoyage().set('custom_vessel_id', selection.get('id'));
                                        } else {
                                            if (record.getVoyage().get('custom_vessel_id')) {
                                                record.getVoyage().set('custom_vessel_id', null);
                                            }
                                        }
                                        record.getVoyage().set('vessel_name', selection.get('name'));
                                        record.getVoyage().set('vessel_imo', selection.get('imo'));
                                    }
                                },
                                blur: function () {
                                    var record = this.upVM().get('object_record');
                                    record.save({
                                        success: function () {
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-outlined md-icon-edit',
                            slug: 'portcall',
                            bind: {
                                cls: '{editableVesselName ? "hidden" : ""}',
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Change vessel',
                                align: 'bc-tc?',
                                anchor: true,
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (me) {
                                Ext.create('Ext.Dialog', {
                                    closable: true,
                                    centered: true,
                                    width: 480,
                                    padding: '0 24 16',
                                    viewModel: {
                                        parent: me.upVM(),
                                    },
                                    cls: 'a-dialog-create a-dialog-has-icon',
                                    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">directions_boat</i></div>Change vessel',
                                    items: [
                                        {
                                            xtype: 'vessel.combo',
                                            maxWidth: 496,
                                            ui: 'field-xl no-border classic',
                                            cls: 'a-field-icon icon-search',
                                            label: false,
                                            autoSelect: false,
                                            triggers: {
                                                tbn: null,
                                            },
                                            bind: {
                                                value: '{object_record.voyage.vessel_imo}',
                                                inputValue: '{object_record.voyage.vessel_name}',
                                            },
                                            listeners: {
                                                select: function (field, selection) {
                                                    const record = this.upVM().get('object_record');

                                                    if (record && selection && !selection.isPhantom()) {
                                                        record.getVoyage().set('vessel_name', selection.get('name'));
                                                        record.getVoyage().set('vessel_imo', selection.get('imo'));
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                    buttons: [
                                        {
                                            text: 'Cancel',
                                            margin: '0 8 0 0',
                                            handler: function () {
                                                var record = this.upVM().get('object_record');
                                                record.getVoyage().reject();
                                                record.reject();
                                                this.up('dialog').destroy();
                                            },
                                        },
                                        {
                                            text: 'Save',
                                            enableToggle: true,
                                            ui: 'action loading',
                                            handler: function (me) {
                                                var record = this.upVM().get('object_record');
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                        record.getVoyage().load();
                                                        me.up('dialog').destroy();
                                                    },
                                                });
                                            },
                                        },
                                    ],
                                }).show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    html: '<hr>',
                },
            ],
        },
        {
            //General info
            xtype: 'appointment.general.info',
        },
        {
            xtype: 'div',
            margin: '0 24',
            html: '<hr>',
        },
        {
            //Nomination info
            xtype: 'appointment.nomination.info',
        },
        {
            xtype: 'div',
            margin: '0 24',
            html: '<hr>',
        },
        {
            //Cargoes
            xtype: 'container',
            padding: '8 24',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-cargo-titlebar',
                    items: [
                        {
                            xtype: 'div',
                            html: "<div class='hbox'><div class='a-badge a-badge-cargo'><i></i></div><div class='a-panel-title fs-14'>Cargoes</div></div>",
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
                                            .down('[cls~=a-collapsible-container]')
                                            .toggleCls('is-collapsed');
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '0 -24',
                    flex: 1,
                    layout: 'vbox',
                    bind: {
                        cls: 'a-collapsible-container a-master-form',
                    },
                    hideMode: 'display',
                    items: [
                        {
                            xtype: 'appointment.cargo',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'div',
            margin: '0 24',
            html: '<hr>',
        },
        {
            //Instructions
            xtype: 'appointment.instructions',
        },
        {
            xtype: 'div',
            margin: '16 24',
        },
        {
            xtype: 'notes.notify',
            height: '54',
            padding: '0 24',
            cls: 'a-notify a-bt-100',
            docked: 'bottom',
            viewModel: {
                data: {
                    editMode: true,
                    needSync: true,
                },
            },
        },
    ],
});
