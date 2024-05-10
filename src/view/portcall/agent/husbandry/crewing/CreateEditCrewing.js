Ext.define('Abraxa.view.portcall.husbandry.crewing.CreateEditCrewing', {
    extend: 'Ext.Dialog',
    xtype: 'husbandry.crewing.create',
    testId: 'husbCrewingCreate',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 580,
    // height: '100%',
    minHeight: 580,
    maxHeight: '90%',
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: true,
    maximized: false,
    controller: 'crewing-controller',
    tools: {
        attach: {
            xtype: 'filebutton',
            slug: 'portCallCrewingAttachments',
            bind: {
                permission: '{userPermissions}',
            },
            ui: 'round tool-sm',
            text: '',
            accept: '.pdf,.doc,.docs,.xls,.xlsx,.txt,.zip,.jpeg,.pjpeg,.jpeg,.pjpeg,.png,.gif',
            iconCls: 'md-icon-attach-file',
            tooltip: {
                showOnTap: true,
                html: 'Attach file',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            listeners: {
                change: function (me, newValue) {
                    if (newValue) {
                        var files = this.getFiles(),
                            len = files.length,
                            ext,
                            fileStore = me.upVM().get('files'),
                            totalSize = 0;

                        for (var i = 0; i < len; i++) {
                            totalSize += files.item(i).size;
                            ext = files.item(i).name.split('.').pop();
                            let record = {
                                document: {
                                    extension: ext,
                                    original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
                                    file: files.item(i),
                                    size: files.item(i).size,
                                },
                            };
                            fileStore.add(record);
                        }
                        if (totalSize > 10 * 1024 * 1024) {
                            Ext.Msg.warning(
                                'Upload Cancelled',
                                'Your file(s) payload size (' +
                                    (totalSize / 1024 / 1024).toFixed(2) +
                                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />'
                            );
                            return;
                        }
                    }
                    document.querySelector("input[type='file']").value = '';
                    me.setValue(null);
                },
            },
        },
    },
    bind: {
        title: '<div class="a-badge a-badge-person"><i class="md-icon-outlined md-icon-person"></i></div>{editMode ? "Edit visitor":"Add visitor"}',
    },
    items: [
        {
            xtype: 'container',
            zIndex: '200',
            id: 'dropped-create-visitor',
            cls: 'a-drop-container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    flex: 1,
                    reference: 'createVisitor',
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-dialog-form a-general-form',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            ui: 'field-xl no-border classic',
                                            itemId: 'visitorName',
                                            label: false,
                                            placeholder: 'Enter visitor name',
                                            testId: 'husbCrewingCreateVisitorNameField',
                                            bind: {
                                                value: '{crewing.name}',
                                            },
                                            required: true,
                                            listeners: {
                                                painted: function (me) {
                                                    me.focus();
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.emailfield',
                                            label: 'Email',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-email icon-rounded',
                                            slug: 'portcallCrewing',
                                            placeholder: 'Email',
                                            testId: 'husbCrewingCreateEmailField',
                                            clearable: false,
                                            bind: {
                                                value: '{crewing.email}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.phonefield',
                                            label: 'Mobile',
                                            testId: 'husbCrewingCreateMobileField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-phone icon-rounded',
                                            slug: 'portcallCrewing',
                                            clearable: false,
                                            bind: {
                                                value: '{crewing.phone}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'country.combo',
                                            label: 'Nationality',
                                            testId: 'husbCrewingCreateNationalityField',
                                            cls: 'a-field-icon icon-flag icon-rounded',
                                            subObject: 'crewing',
                                            placeholder: 'Country',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            forceSelection: false,
                                            valueField: 'country_name',
                                            displayField: 'country_name',
                                            slug: 'portcallCrewing',
                                            bind: {
                                                value: '{crewing.nationality}',
                                                inputValue: '{crewing.nationality}',
                                                permission: '{userPermissions}',
                                            },
                                            listeners: {
                                                select: function (me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('crewing');
                                                        record.set('country_id', selection.get('country_id'));
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Company',
                                            testId: 'husbCrewingCreateCompanyField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            slug: 'portcallCrewing',
                                            cls: 'a-field-icon icon-business icon-rounded',
                                            placeholder: 'Company name',
                                            clearable: false,
                                            bind: {
                                                value: '{crewing.company}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Type',
                                            testId: 'husbCrewingCreateTypeField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                                            required: true,
                                            forceSelection: true,
                                            placeholder: 'Choose type',
                                            queryMode: 'local',
                                            displayField: 'name',
                                            valueField: 'id',
                                            options: [
                                                {
                                                    id: 'Crew',
                                                    name: 'Crew',
                                                },
                                                {
                                                    id: 'Visitor',
                                                    name: 'Visitor',
                                                },
                                            ],
                                            bind: {
                                                value: '{crewing.type_name}',
                                            },
                                            listeners: {
                                                select: function (me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('crewing');
                                                        record.set('type_name', selection.get('name'));
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Rank',
                                            testId: 'husbCrewingCreateRankField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            placeholder: 'Rank',
                                            // slug: 'portcallCrewingRank',
                                            bind: {
                                                value: '{crewing.rank}',
                                                // permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'husbandry.crewing.actions.combo',
                                            label: 'Action',
                                            testId: 'husbCrewingCreateActionField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                                            forceSelection: true,
                                            slug: 'portcallCrewing',
                                            placeholder: 'Choose action',
                                            queryMode: 'local',
                                            displayField: 'name',
                                            valueField: 'id',
                                            editable: false,
                                            bind: {
                                                value: '{crewing.actions}',
                                                permission: '{userPermissions}',
                                            },
                                            listeners: {
                                                select: function (me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('crewing');
                                                        record.set('action_name', selection.get('name'));
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'ISPS cleared',
                                            testId: 'husbCrewingCreateISPSclearedField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                                            placeholder: 'Please choose',
                                            required: true,
                                            autoFocus: false,
                                            disabled: false,
                                            options: [
                                                {
                                                    value: 1,
                                                    text: 'Yes',
                                                },
                                                {
                                                    value: 0,
                                                    text: 'No',
                                                },
                                            ],
                                            bind: {
                                                value: '{crewing.isps}',
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'COVID-19 cleared',
                                            testId: 'husbCrewingCreateCovid19clearedField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                                            placeholder: 'Please choose',
                                            required: true,
                                            autoFocus: false,
                                            disabled: false,
                                            options: [
                                                {
                                                    value: 'yes',
                                                    text: 'Yes',
                                                },
                                                {
                                                    value: 'no',
                                                    text: 'No',
                                                },
                                                {
                                                    value: 'pending',
                                                    text: 'Pending',
                                                },
                                            ],
                                            bind: {
                                                value: '{crewing.covid19}',
                                                disabled: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Schengen visa',
                                            testId: 'husbCrewingCreateSchengenField',
                                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                                            labelAlign: 'left',
                                            placeholder: 'Choose',
                                            autoFocus: false,
                                            disabled: false,
                                            clearable: true,
                                            options: [
                                                {
                                                    value: 1,
                                                    text: 'Yes',
                                                },
                                                {
                                                    value: 0,
                                                    text: 'No',
                                                },
                                            ],
                                            slug: 'portcallCrewing',
                                            subObject: 'crewing',
                                            bind: {
                                                value: '{crewing.schengen_visa}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                objectPermission: '{objectPermissions}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            hidden: true,
                                            bind: {
                                                hidden: '{crewingAdvanced ? false : true}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'ID type',
                                                    testId: 'husbCrewingCreateIDtypeField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                    clearable: false,
                                                    // required: true,
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    slug: 'portcallCrewing',
                                                    placeholder: 'ID type',
                                                    bind: {
                                                        value: '{crewing.id_type}',
                                                        permission: '{userPermissions}',
                                                    },
                                                    options: [
                                                        {
                                                            name: 'Passport',
                                                            value: 'passport',
                                                        },
                                                        {
                                                            name: 'EU ID Card',
                                                            value: 'eu id card',
                                                        },
                                                        {
                                                            name: 'Portkey',
                                                            value: 'portkey',
                                                        },
                                                        {
                                                            name: "Driver's License",
                                                            value: 'driver license',
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'ID number',
                                                    testId: 'husbCrewingCreateIDnumberField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    clearable: false,
                                                    // required: true,
                                                    placeholder: 'ID number',
                                                    slug: 'portcallCrewing',
                                                    bind: {
                                                        value: '{crewing.id_number}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'abraxa.datefield',
                                                    label: 'Date of birth',
                                                    testId: 'husbCrewingCreateDateOfBirthField',
                                                    labelAlign: 'left',
                                                    cls: 'a-field-icon icon-date icon-rounded',
                                                    ui: 'classic hovered-border',
                                                    clearable: false,
                                                    placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                                    dateFormat:
                                                        AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                                    slug: 'portcallCrewing',
                                                    bind: {
                                                        value: '{crewing.date_of_birth}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'Vehicle',
                                                    testId: 'husbCrewingCreateVehicleField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                    clearable: false,
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    reference: 'vehicle_type',
                                                    slug: 'portcallCrewing',
                                                    placeholder: 'Vehicle type',
                                                    bind: {
                                                        value: '{crewing.vehicle_type}',
                                                        permission: '{userPermissions}',
                                                    },
                                                    options: [
                                                        {
                                                            name: 'Car',
                                                            value: 'car',
                                                        },
                                                        {
                                                            name: 'Passenger',
                                                            value: 'passenger',
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Registration plate',
                                                    testId: 'husbCrewingCreateRegistrationPlateField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    clearable: false,
                                                    placeholder: 'Vehicle registration plate',
                                                    hidden: true,
                                                    slug: 'portcallCrewing',
                                                    bind: {
                                                        hidden: '{vehicle_type.selection && vehicle_type.selection.value == "car" ? false : true}',
                                                        value: '{crewing.registration_plate}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Flight details',
                                                    testId: 'husbCrewingCreateFlightDetailsField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    slug: 'portcallCrewing',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    clearable: false,
                                                    placeholder: 'Enter flight details',
                                                    bind: {
                                                        value: '{crewing.flight_details}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm normal',
                                    margin: '8 60',
                                    enableToggle: true,
                                    testId: 'husbCrewingCreateTogglAdvancedBtn',
                                    bind: {
                                        text: '{crewingAdvanced ? "Hide advanced" : "Show advanced"}',
                                        iconCls:
                                            '{crewingAdvanced ? "md-icon-outlined md-icon-unfold-less" : "md-icon-outlined md-icon-unfold-more"}',
                                    },
                                    handler: function () {
                                        let advancedMode = this.upVM().get('crewingAdvanced');

                                        if (advancedMode) {
                                            this.upVM().set('crewingAdvanced', false);
                                        } else {
                                            this.upVM().set('crewingAdvanced', true);
                                        }
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset',
                            html: '',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-portcall-extra',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-titlebar',
                                    margin: '8 0 8 72',
                                    html: '<div class="x-title">Services</div>',
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'abraxa.formlist',
                                            cls: 'a-services-form',
                                            itemId: 'serviceForm',
                                            padding: '0 24 8 72',
                                            bind: {
                                                store: '{servicePerCrewing}',
                                            },
                                            itemConfig: {
                                                viewModel: true,
                                                xtype: 'container',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                    pack: 'space-between',
                                                },
                                                minHeight: 48,
                                                items: [
                                                    {
                                                        xtype: 'div',
                                                        flex: 1,
                                                        cls: 'hbox',
                                                        bind: {
                                                            html: '<div class="a-badge a-badge-services mr-12"><i class="md-icon-outlined md-icon-assistant"></i></div>{record.default_expense_item_name}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'tool',
                                                        ui: 'tool-md',
                                                        iconCls: 'md-icon-outlined md-icon-delete',
                                                        slug: 'portcallCrewingUnassignService',
                                                        bind: {
                                                            permission: '{userPermissions}',
                                                            hidden: '{nonEditable}',
                                                        },
                                                        tooltip: {
                                                            anchorToTarget: true,
                                                            html: 'Unassign',
                                                            align: 'bc-tc?',
                                                            showDelay: 0,
                                                            hideDelay: 0,
                                                            dismissDelay: 0,
                                                            allowOver: false,
                                                            closeAction: 'destroy',
                                                        },
                                                        handler: function handler(me) {
                                                            if (me.upVM().get('editMode')) {
                                                                let store = me.upVM().get('crewing').services();
                                                                let serviceRecord = store.findRecord(
                                                                    'da_crewing_and_visitors_service_types_id',
                                                                    me.upVM().get('record').id,
                                                                    0,
                                                                    false,
                                                                    false,
                                                                    true
                                                                );
                                                                if (serviceRecord) {
                                                                    me.upVM()
                                                                        .get('crewing')
                                                                        .services()
                                                                        .remove(serviceRecord);
                                                                }
                                                            } else {
                                                                let store =
                                                                    Ext.ComponentQuery.query(
                                                                        '[itemId=serviceForm]'
                                                                    )[0].getStore();
                                                                let serviceRecord = store.findRecord(
                                                                    'id',
                                                                    me.upVM().get('record').id,
                                                                    0,
                                                                    false,
                                                                    false,
                                                                    true
                                                                );
                                                                if (serviceRecord) {
                                                                    store.remove(serviceRecord);
                                                                    let crewingServiceRecord = me
                                                                        .upVM()
                                                                        .get('crewing')
                                                                        .services()
                                                                        .findRecord(
                                                                            'id',
                                                                            me.upVM().get('record').id,
                                                                            0,
                                                                            false,
                                                                            false,
                                                                            true
                                                                        );
                                                                    if (crewingServiceRecord) {
                                                                        me.upVM()
                                                                            .get('crewing')
                                                                            .services()
                                                                            .remove(crewingServiceRecord);
                                                                    }
                                                                }
                                                            }
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 16 60',
                                            ui: 'normal small',
                                            iconCls: 'md-icon-add',
                                            text: 'Assign service',
                                            testId: 'husbCrewingCreateAssignServiceBtn',
                                            slug: 'portcallCrewingAssignService',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let record = me.upVM().get('crewing');
                                                if (me.upVM().get('editMode')) {
                                                    let selectedIds = [];
                                                    selectedIds.push(record.get('id'));
                                                    Ext.create(
                                                        'Abraxa.view.portcall.husbandry.crewing.AssignServices',
                                                        {
                                                            viewModel: {
                                                                parent: me.upVM(),
                                                                data: {
                                                                    selectedIds: selectedIds,
                                                                    grid: null,
                                                                    assingFromEdit: true,
                                                                    crewing: record,
                                                                    appointmentId: me
                                                                        .upVM()
                                                                        .get('object_record')
                                                                        .get('id'),
                                                                },
                                                            },
                                                        }
                                                    ).show();
                                                } else {
                                                    Ext.create(
                                                        'Abraxa.view.portcall.husbandry.crewing.AssignServices',
                                                        {
                                                            viewModel: {
                                                                parent: me.upVM(),
                                                                data: {
                                                                    selectedIds: null,
                                                                    assingFromCreate: true,
                                                                    crewing: record,
                                                                    grid: null,
                                                                    appointmentId: me
                                                                        .upVM()
                                                                        .get('object_record')
                                                                        .get('id'),
                                                                    servicePerCrewing: me
                                                                        .upVM()
                                                                        .get('servicePerCrewing'),
                                                                },
                                                            },
                                                        }
                                                    ).show();
                                                }
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-attachments-wrap',
                            slug: 'portCallCrewingAttachments',
                            bind: {
                                hidden: '{showFiles}',
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-titlebar',
                                    html: '<div class="x-title mb-8">Attachments</div>',
                                },
                                {
                                    xtype: 'list',
                                    margin: '0 0 0 -8',
                                    layout: {
                                        type: 'hbox',
                                        wrap: true,
                                    },
                                    bind: {
                                        store: '{files}',
                                    },
                                    itemTpl:
                                        '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{document.original_name}</a><span class="sm-title">{document.size} kb</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>',
                                    itemConfig: {
                                        cls: 'a-attachment-item',
                                        minWidth: 0,
                                        layout: {
                                            type: 'hbox',
                                            pack: 'space-between',
                                        },
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'i.remove_attachment',
                                            fn: function (cmp, a) {
                                                var store = this.component.getStore();
                                                var record = this.component.getSelection();
                                                store.remove(record);
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
            listeners: {
                element: 'element',
                drop: 'onDrop',
                dragleave: 'onDragLeaveListItem',
                dragover: 'onDragOverListItem',
            },
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'husbCrewingCreateCancelBtn',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('crewing');
                if (record) {
                    record.reject();
                    record.services().rejectChanges();
                }
                this.up('dialog').destroy();
            },
        },
        {
            bind: {
                text: '{editMode ? "Save" : "Create"}',
            },
            testId: 'husbCrewingCreateSaveBtn',
            enableToggle: true,
            ui: 'action loading',
            handler: 'onCreate',
        },
    ],
});
