Ext.define('Abraxa.view.portcall.appointment.AppointmentGeneralInfo', {
    extend: 'Ext.Container',
    xtype: 'appointment.general.info',
    testId: 'appointmentGeneralInfo',
    padding: '8 24',
    subObject: 'general',
    flex: 1,
    bind: {
        permission: '{userPermissions}',
        objectPermission: '{objectPermissions}',
    },
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'div',
                    html: "<div class='hbox'><div class='a-badge a-badge-general'><i class='md-icon-outlined'>edit_note</i></div><div class='a-panel-title fs-14'>General info</div></div>",
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
            cls: 'a-collapsible-container',
            items: [
                {
                    xtype: 'container',
                    showNoPermissions: true,
                    slug: 'portcallAppointmentGeneralInfo',
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
                            customComponentHolderId: 'appointmentGeneralForm',
                            slug: 'portcallAppointmentGeneralInfo',
                            bind: {
                                customComponents: '{currentCompany.custom_components}',
                                permission: '{userPermissions}',
                            },
                            defaults: {
                                // TO-DO: ГРУБО, ДА СЕ ПРЕГЛЕДА
                                // viewModel: {
                                //     formulas: {
                                //         setPermissionsToCustomComponents: function (get) {
                                //             get('currentCompany');
                                //             Ext.ComponentQuery.query('[userCls~=added-custom-component]').forEach(
                                //                 (element) => {
                                //                     element.setSlug('portcallAppointmentGeneralInfo');
                                //                     element.setBind({ permission: '{userPermissions}' });
                                //                 }
                                //             );
                                //         },
                                //     },
                                // },
                                listeners: {
                                    focusleave: function () {
                                        let record = this.upVM().get('object_record');
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
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'File ID',
                                    testId: 'appointmentGeneralInfoFileIdField',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    clearable: false,
                                    slug: 'portcallFileID',
                                    placeholder: 'File ID',
                                    disabled: true,
                                    bind: {
                                        // disabled: '{customSequence.portcall ? true : false}',
                                        value: '{object_record.file_id}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    margin: '2 0 0 0',
                                    cls: 'a-field-assign',
                                    flex: 1,
                                    layout: 'hbox',
                                    slug: 'portcallAssignTo',
                                    testId: 'appointmentGeneralInfoAssignToContainer',
                                    bind: {
                                        permission: '{userPermissions}',
                                        hidden: '{currentUserType == "principal" ? true:false}',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            left: 164,
                                            cls: 'a-assign-image',
                                            bind: {
                                                html: '{assignedToImage}',
                                            },
                                        },
                                        {
                                            xtype: 'user.combo',
                                            flex: 1,
                                            editable: false,
                                            label: 'Assigned to',
                                            testId: 'appointmentGeneralInfoAssignToField',
                                            placeholder: 'Choose assignee',
                                            labelAlign: 'left',
                                            reference: 'usersCombo',
                                            slug: 'portcallAssignTo',
                                            ui: 'classic hovered-border non-editable',
                                            bind: {
                                                cls: '{usersCombo.selection ? "a-field-icon icon-rounded":"a-field-icon icon-person icon-rounded"}',
                                                value: '{object_record.assigned_to}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                focusleave: function () {
                                                    let record = this.upVM().get('object_record');
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
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'abraxa.datetimefield',
                                    label: 'ETA',
                                    testId: 'appointmentGeneralInfoETAField',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-time icon-rounded',
                                    slug: 'portcallAppointmentGeneralInfo',
                                    bind: {
                                        dateTime: '{object_record.port_eta}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        objectPermission: '{objectPermissions}',
                                        permission: '{userPermissions}',
                                    },
                                    required: true,
                                    listeners: {
                                        blur: function (me) {
                                            let record = me.upVM().get('object_record');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                        let url =
                                                            Env.ApiEndpoint +
                                                            'kpi/portcall/prospects/' +
                                                            record.get('id');
                                                        Ext.ComponentQuery.query(
                                                            '[itemId=prospectChart]'
                                                        )[0].setChartDataUrl(url, 'json');
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'ports.served.combo',
                                    label: 'Port name',
                                    testId: 'appointmentGeneralInfoPortNameield',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-port icon-rounded current_port_combo',
                                    placeholder: 'Choose port',
                                    bind: {
                                        value: '{object_record.port_id}',
                                        inputValue: '{object_record.port_name}',
                                        readOnly: '{editablePortName}',
                                        ui: '{editablePortName ? "viewonly classic" : "hovered-border classic"}',
                                        // objectPermission: '{objectPermissions}',
                                        // permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        select: function () {
                                            if (this.getSelection()) {
                                                let record = this.upVM().get('object_record');
                                                record.set('port_name', this.getSelection().get('port_name'));
                                            }
                                        },
                                        focusleave: function () {
                                            let record = this.upVM().get('object_record');
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
