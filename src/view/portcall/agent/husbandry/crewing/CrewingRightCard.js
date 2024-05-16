Ext.define('Abraxa.view.portcall.husbandry.crewing.CrewingRightCard', {
    extend: 'Ext.Container',
    xtype: 'husbandry.crewing.right.card',
    testId: 'husbandryCrewingRightCard',
    itemId: 'crewingRightCard',
    cls: 'a-right-container a-crewing-right-container',
    hidden: true,
    bind: {
        hidden: '{crewingGrid.selection && !crewingGrid.selection.is_checked ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    // minWidth: 480,
    // maxWidth: 480,
    viewModel: {
        data: {
            crewingAdvanced: false,
        },
        stores: {
            comments: {
                source: '{notes}',
                filters: '{noteFilter}',
            },
            objectTasks: {
                source: '{tasks}',
                filters: '{taskFilter}',
            },
            servicePerCrewing: {
                source: '{supplies}',
                filters: '{servicePerCrewingFilter}',
            },
        },
        formulas: {
            servicePerCrewingFilter: {
                bind: {
                    bindTo: '{crewingGrid.selection.services}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        let servicePerCrewing = this.get('servicePerCrewing');
                        if (servicePerCrewing) servicePerCrewing.clearFilter();
                        return function (rec) {
                            let serviceRecord = store.findRecord(
                                'da_crewing_and_visitors_service_types_id',
                                rec.get('id'),
                                0,
                                false,
                                false,
                                true
                            );
                            if (serviceRecord) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            noteFilter: {
                bind: {
                    bindTo: '{crewingGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('comments');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('noteable_type') == record.get('model_name') &&
                                rec.get('noteable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            taskFilter: {
                bind: {
                    bindTo: '{crewingGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('objectTasks');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('taskable_type') == record.get('model_name') &&
                                rec.get('taskable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            dialogTitle: {
                bind: {
                    bindTo: '{crewingGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let recordId = record.get('id');
                        if (record.get('parent_id')) {
                            recordId = record.get('parent_id');
                        }
                        return (
                            '<div class="a-badge a-badge-person"><i class="md-icon-outlined md-icon-person"></i></div><div><span class="a-panel-title">' +
                            record.get('name') +
                            '</span><span class="a-panel-id">#CW-' +
                            recordId +
                            '</span></div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
            crewing: {
                bind: {
                    bindTo: '{crewingGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record;
                    } else {
                        Ext.ComponentQuery.query('[itemId=crewingRightCard]')[0].hide();
                    }
                },
            },
            files: {
                bind: {
                    bindTo: '{crewingGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.attachments();
                    }
                },
            },
            showFiles: {
                bind: {
                    bindTo: '{files.count}',
                    deep: true,
                },
                get: function (count) {
                    if (count) {
                        return false;
                    }
                    return true;
                },
            },
            itemTemplate: {
                bind: {
                    bindTo: '{nonEditable}',
                    deep: true,
                },
                get: function (live) {
                    if (live) {
                        return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.document.name}.{record.document.extension}</a><span class="sm-title">{record.document.size}</span></div></div>';
                    }
                    return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.document.name}.{record.document.extension}</a><span class="sm-title">{record.document.size}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>';
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '{dialogTitle}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-outlined md-icon-add-task',
                            slug: 'taskCreate',
                            testId: 'husbandryCrewingRightCardTaskCreateBtn',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{object_record.is_archived ? true : false}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add task',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                let button = this;

                                // Check if a note is already opened
                                if (button.taskOpened) {
                                    return;
                                }

                                button.taskOpened = true;

                                let record = this.upVM().get('crewingGrid.selection'),
                                    subObjects = this.upVM().get('subObjects'),
                                    subObject = Ext.Array.filter(subObjects, function (rec) {
                                        return rec.id == record.get('id') && rec.model == record.get('model_name');
                                    })[0];
                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            subObjects: this.upVM().get('subObjects'),
                                            selectedSubObject: subObject ? subObject.id : null,
                                            relatedObject: true,
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            editMode: false,
                                            taskEdit: false,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: 3,
                                                object_meta_id: this.upVM().get('object_record').get('id'),
                                                taskable_type: this.upVM()
                                                    .get('crewingGrid.selection')
                                                    .get('model_name'),
                                                taskable_id: this.upVM().get('crewingGrid.selection').get('id'),
                                                priority: 'normal',
                                            }),
                                        },
                                    },
                                    // Add listeners to reset the flag when the task is closed
                                    listeners: {
                                        destroy: () => {
                                            button.taskOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                // Show the task
                                task.show();
                            },
                        },
                        {
                            xtype: 'filebutton',
                            ui: 'round tool-round-md',
                            text: '',
                            slug: 'portCallCrewingAttachments',
                            testId: 'husbandryCrewingRightCardAttachFileBtn',
                            subObject: 'crewing',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
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
                                            record = me.upVM().get('crewingGrid.selection'),
                                            fileStore = record.attachments(),
                                            portcall_id = me.upVM().get('object_record').get('id'),
                                            controller = me.find('crewingGrid').getController(),
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
                                        fileStore.needsSync = false;
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
                                        controller.upload(fileStore, record).then(function (result) {
                                            if (result) {
                                                Ext.toast('File uploaded', 1000);
                                                record.getProxy().setExtraParams({
                                                    portcall_id: portcall_id,
                                                });
                                                record.load();
                                            } else {
                                                Ext.Msg.alert('Something went wrong', 'Something went wrong');
                                            }
                                        });
                                    }
                                    document.querySelector("input[type='file']").value = '';
                                    me.setValue(null);
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'portcallCrewingDelete',
                            subObject: 'crewing',
                            testId: 'husbandryCrewingRightCardPortcallCrewingDeleteBtn',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (item, el, eOpts) {
                                let vm = this.upVM(),
                                    store = vm.get('crewings'),
                                    container = this.find('crewingRightCard'),
                                    record = vm.get('crewingGrid.selection');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function (batch) {
                                                    Ext.Msg.alert('Something went wrong', 'Could not delete record!');
                                                },
                                            });
                                        }
                                    },
                                    this,
                                    [
                                        {
                                            xtype: 'button',
                                            itemId: 'no',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'yes',
                                            ui: 'decline alt',
                                            text: 'Delete',
                                        },
                                    ]
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'husbandryCrewingRightCardExpandCloseBtn',
                            handler: function (me) {
                                let record = this.upVM().get('crewingGrid.selection'),
                                    grid = Ext.ComponentQuery.query('husbandry\\.crewing\\.grid')[0];

                                if (record) {
                                    record.reject();
                                    if (record.services()) {
                                        record.services().rejectChanges();
                                    }
                                }
                                grid.deselectAll();
                                me.up('[xtype=husbandry\\.crewing\\.right.\\card]').hide();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-portcall-info',
            layout: 'vbox',
            flex: 1,
            scrollable: 'y',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    scrollable: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            items: [
                                {
                                    xtype: 'container',
                                    // scrollable: 'y',
                                    // flex: 1,
                                    cls: 'general_data_container a-dialog-wrap',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            ui: 'field-xl no-border classic',
                                            itemId: 'visitorName',
                                            label: false,
                                            clearable: false,
                                            placeholder: 'Enter visitor name',
                                            testId: 'husbandryCrewingRightCardVisitorNameField',
                                            subObject: 'crewing',
                                            slug: 'portcallCrewing',
                                            bind: {
                                                permission: '{userPermissions}',
                                                value: '{crewing.name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly field-xl no-border classic" : "field-xl no-border classic"}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            required: true,
                                            listeners: {
                                                blur: function (me) {
                                                    let record = me.upVM().get('crewingGrid.selection'),
                                                        object_record = me.upVM().get('object_record');
                                                    record.getProxy().setExtraParams({
                                                        portcall_id: object_record.get('id'),
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
                                        {
                                            xtype: 'container',
                                            cls: 'a-general-form',
                                            margin: '0 0 16 0',
                                            testId: 'husbandryCrewingRightCardGeneralForm',
                                            defaults: {
                                                clearable: false,
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                                listeners: {
                                                    blur: function (me) {
                                                        let record = me.upVM().get('crewingGrid.selection'),
                                                            object_record = me.upVM().get('object_record');
                                                        record.getProxy().setExtraParams({
                                                            portcall_id: object_record.get('id'),
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
                                            items: [
                                                {
                                                    xtype: 'abraxa.emailfield',
                                                    label: 'Email',
                                                    cls: 'a-field-icon icon-email icon-rounded',
                                                    placeholder: 'Email',
                                                    testId: 'husbandryCrewingRightCardEmailField',
                                                    slug: 'portcallCrewing',
                                                    subObject: 'crewing',
                                                    bind: {
                                                        value: '{crewing.email}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'abraxa.phonefield',
                                                    label: 'Mobile',
                                                    testId: 'husbandryCrewingRightCardMobileField',
                                                    slug: 'portcallCrewing',
                                                    cls: 'a-field-icon icon-phone icon-rounded',
                                                    subObject: 'crewing',
                                                    bind: {
                                                        value: '{crewing.phone}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'country.combo',
                                                    label: 'Nationality',
                                                    testId: 'husbandryCrewingRightCardNationalityField',
                                                    cls: 'a-field-icon icon-flag icon-rounded',
                                                    subObject: 'crewing',
                                                    placeholder: 'Country',
                                                    forceSelection: false,
                                                    valueField: 'country_name',
                                                    displayField: 'country_name',
                                                    slug: 'portcallCrewing',
                                                    bind: {
                                                        value: '{crewing.nationality}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        objectPermission: '{objectPermissions}',
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
                                                    testId: 'husbandryCrewingRightCardCompanyField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    slug: 'portcallCrewing',
                                                    cls: 'a-field-icon icon-business icon-rounded',
                                                    placeholder: 'Company name',
                                                    subObject: 'crewing',
                                                    bind: {
                                                        value: '{crewing.company}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'Type',
                                                    testId: 'husbandryCrewingRightCardTypeField',
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
                                                    slug: 'portcallCrewing',
                                                    subObject: 'crewing',
                                                    bind: {
                                                        value: '{crewing.type_name}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
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
                                                    testId: 'husbandryCrewingRightCardRankField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    placeholder: 'Rank',
                                                    subObject: 'crewing',
                                                    slug: 'portcallCrewing',
                                                    bind: {
                                                        value: '{crewing.rank}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        objectPermission: '{objectPermissions}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'husbandry.crewing.actions.combo',
                                                    label: 'Action',
                                                    testId: 'husbandryCrewingRightCardActionField',
                                                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                    forceSelection: true,
                                                    placeholder: 'Choose action',
                                                    queryMode: 'local',
                                                    displayField: 'name',
                                                    slug: 'portcallCrewing',
                                                    valueField: 'id',
                                                    subObject: 'crewing',
                                                    bind: {
                                                        value: '{crewing.actions}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
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
                                                    testId: 'husbandryCrewingRightCardISPSClearedField',
                                                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                    placeholder: 'Choose agency type',
                                                    required: true,
                                                    autoFocus: false,
                                                    disabled: false,
                                                    subObject: 'crewing',
                                                    slug: 'portcallCrewing',
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
                                                        permission: '{userPermissions}',
                                                        value: '{crewing.isps}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'COVID-19 cleared',
                                                    testId: 'husbandryCrewingRightCardCOVID19ClearedField',
                                                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                    placeholder: 'Choose agency type',
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
                                                    slug: 'portcallCrewing',
                                                    subObject: 'crewing',
                                                    bind: {
                                                        value: '{crewing.covid19}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'Schengen visa',
                                                    testId: 'husbandryCrewingRightCardSchengenVisaField',
                                                    cls: 'a-field-icon icon-short icon-rounded non-editable',
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
                                                    margin: '4 0 0 0',
                                                    defaults: {
                                                        clearable: false,
                                                        labelAlign: 'left',
                                                        ui: 'classic hovered-border',
                                                        listeners: {
                                                            blur: function (me) {
                                                                let record = me.upVM().get('crewingGrid.selection'),
                                                                    object_record = me.upVM().get('object_record');
                                                                record.getProxy().setExtraParams({
                                                                    portcall_id: object_record.get('id'),
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
                                                    bind: {
                                                        hidden: '{crewingAdvanced ? false : true}',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'selectfield',
                                                            label: 'ID type',
                                                            testId: 'husbandryCrewingRightCardIDTypeField',
                                                            labelAlign: 'left',
                                                            slug: 'portcallCrewing',
                                                            ui: 'classic hovered-border',
                                                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                            clearable: false,
                                                            // required: true,
                                                            displayField: 'name',
                                                            valueField: 'value',
                                                            placeholder: 'ID type',
                                                            subObject: 'crewing',
                                                            bind: {
                                                                value: '{crewing.id_type}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
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
                                                            label: 'ID Number',
                                                            testId: 'husbandryCrewingRightCardIDNumberField',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            clearable: false,
                                                            placeholder: 'ID number',
                                                            slug: 'portcallCrewing',
                                                            subObject: 'crewing',
                                                            bind: {
                                                                value: '{crewing.id_number}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'abraxa.datefield',
                                                            label: 'Date of birth',
                                                            testId: 'husbandryCrewingRightCardDateOfBirthField',
                                                            cls: 'a-field-icon icon-date icon-rounded',
                                                            clearable: false,
                                                            placeholder:
                                                                AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                                            dateFormat:
                                                                AbraxaConstants.formatters.date
                                                                    .dayMonthYearSlashNoLeading,
                                                            slug: 'portcallCrewing',
                                                            subObject: 'crewing',
                                                            bind: {
                                                                value: '{crewing.date_of_birth}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'selectfield',
                                                            label: 'Vehicle',
                                                            testId: 'husbandryCrewingRightCardVehicleField',
                                                            labelAlign: 'left',
                                                            ui: 'classic hovered-border',
                                                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                            clearable: false,
                                                            displayField: 'name',
                                                            valueField: 'value',
                                                            reference: 'vehicle_type',
                                                            placeholder: 'Vehicle type',
                                                            slug: 'portcallCrewing',
                                                            subObject: 'crewing',
                                                            bind: {
                                                                value: '{crewing.vehicle_type}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
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
                                                            testId: 'husbandryCrewingRightCardRegistrationPlateField',
                                                            labelAlign: 'left',
                                                            ui: 'classic hovered-border',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            clearable: false,
                                                            placeholder: 'Vehicle registration plate',
                                                            subObject: 'crewing',
                                                            slug: 'portcallCrewing',
                                                            hidden: true,
                                                            bind: {
                                                                hidden: '{vehicle_type.selection && vehicle_type.selection.value == "car" ? false : true}',
                                                                value: '{crewing.registration_plate}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                objectPermission: '{objectPermissions}',
                                                                permission: '{userPermissions}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Flight details',
                                                            testId: 'husbandryCrewingRightCardFlightDetailsField',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            clearable: false,
                                                            slug: 'portcallCrewing',
                                                            placeholder: 'Enter flight details',
                                                            subObject: 'crewing',
                                                            bind: {
                                                                value: '{crewing.flight_details}',
                                                                readOnly: '{nonEditable ? true : false}',
                                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                                permission: '{userPermissions}',
                                                                objectPermission: '{objectPermissions}',
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '0 16 16 16',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm normal',
                                    testId: 'husbandryCrewingRightCardToggleAdvancedBtn',
                                    enableToggle: true,
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
                            xtype: 'container',
                            cls: 'a-portcall-extra',
                            margin: '0 0 8 0',
                            flex: 1,
                            // bind: {
                            //     hidden: '{servicePerCrewing.count ? false : true}'
                            // },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Services',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.formlist',
                                    testId: 'husbandryCrewingRightCardServicesList',
                                    minHeight: 48,
                                    bind: {
                                        store: '{servicePerCrewing}',
                                    },
                                    emptyText: 'No Services assigned',
                                    itemConfig: {
                                        viewModel: true,
                                        xtype: 'container',
                                        padding: '0 16 0 24',
                                        flex: 1,
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'space-between',
                                        },
                                        minHeight: 48,
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'hbox',
                                                bind: {
                                                    html: '<div class="a-badge a-badge-services mr-12"><i class="md-icon-outlined md-icon-layers"></i></div>{record.default_expense_item_name}',
                                                },
                                                flex: 1,
                                            },
                                            {
                                                xtype: 'tool',
                                                ui: 'tool-md',
                                                iconCls: 'md-icon-outlined md-icon-delete',
                                                slug: 'portcallCrewingUnassignService',
                                                subObject: 'crewing',
                                                bind: {
                                                    permission: '{userPermissions}',
                                                    cls: '{nonEditable ? "hidden" : ""}',
                                                    objectPermission: '{objectPermissions}',
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
                                                        me.upVM().get('crewing').services().remove(serviceRecord);
                                                        me.upVM()
                                                            .get('crewing')
                                                            .services()
                                                            .getProxy()
                                                            .setExtraParams({
                                                                portcall_id: me
                                                                    .upVM()
                                                                    .get('crewing')
                                                                    .get('portcall_id'),
                                                                crewing_id: me.upVM().get('crewing').get('id'),
                                                            });
                                                        me.upVM()
                                                            .get('crewing')
                                                            .services()
                                                            .sync({
                                                                success: function () {
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                            });
                                                    }
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '0 16 16 16',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'normal small',
                                    iconCls: 'md-icon-add',
                                    text: 'Assign service',
                                    testId: 'husbandryCrewingRightCardAssignServiceBtn',
                                    slug: 'portcallCrewingAssignService',
                                    subObject: 'crewing',
                                    bind: {
                                        cls: '{nonEditable ? "hidden" : ""}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    handler: function (me) {
                                        let selectedIds = [],
                                            record = me.upVM().get('crewingGrid.selection');
                                        selectedIds.push(record.get('id'));
                                        Ext.create('Abraxa.view.portcall.husbandry.crewing.AssignServices', {
                                            viewModel: {
                                                parent: me.upVM(),
                                                data: {
                                                    selectedIds: selectedIds,
                                                    grid: null,
                                                    appointmentId: me.upVM().get('object_record').get('id'),
                                                },
                                            },
                                        }).show();
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-portcall-extra',
                            slug: 'portCallCrewingAttachments',
                            testId: 'husbandryCrewingRightCardAttachmentsContainer',
                            bind: {
                                hidden: '{showFiles}',
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Attachments',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'list',
                                    cls: 'a-attachments-list',
                                    testId: 'husbandryCrewingRightCardAttachmentsList',
                                    layout: {
                                        type: 'hbox',
                                        wrap: true,
                                    },
                                    itemConfig: {
                                        cls: 'a-attachment-item',
                                        minWidth: 0,
                                        viewModel: {},
                                        layout: {
                                            type: 'hbox',
                                            pack: 'space-between',
                                        },
                                        bind: {
                                            tpl: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.document.name}.{record.document.extension}</a><span class="sm-title">{record.document.size}</span></div><span style="cursor: pointer; class="{nonEditable ? "d-none" : ""}"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>',
                                        },
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'div.a-attachment,i.remove_attachment',
                                                fn: function (cmp, a) {
                                                    let ids = [],
                                                        controller = this.component.find('crewingGrid').getController(),
                                                        crewing = this.component.upVM().get('crewing'),
                                                        record = this.component.upVM().get('record'),
                                                        object_record = this.component.upVM().get('object_record'),
                                                        documents = [];

                                                    var store = this.component.upVM().get('crewing.attachments');

                                                    store.each(function (attachment) {
                                                        if (attachment.getDocument())
                                                            documents.push(attachment.getDocument());
                                                    });

                                                    if (cmp.currentTarget.className == 'a-attachment') {
                                                        var document = record.getDocument();
                                                        if (document) {
                                                            Abraxa.getApplication()
                                                                .getController('AbraxaController')
                                                                .previewFile(
                                                                    this.component,
                                                                    document,
                                                                    documents,
                                                                    record
                                                                );
                                                        }
                                                    }
                                                    if (
                                                        cmp.currentTarget.className.indexOf('remove_attachment') !== -1
                                                    ) {
                                                        if (record) {
                                                            store.remove(record);
                                                            ids.push(record.get('id'));
                                                            let object_record = Ext.ComponentQuery.query(
                                                                window.CurrentUser.get('company').type +
                                                                    'portcall\\.main'
                                                            )[0]
                                                                .upVM()
                                                                .get('object_record');
                                                            Ext.Ajax.request({
                                                                url:
                                                                    Env.ApiEndpoint +
                                                                    'attachments/' +
                                                                    object_record.get('id'),
                                                                jsonData: {
                                                                    attachments: ids,
                                                                },
                                                                method: 'DELETE',
                                                                headers: {
                                                                    'Content-Type': null,
                                                                },
                                                                success: function (response) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    // crewing.load();
                                                                },
                                                                failure: function failure(response) {
                                                                    // resolve(false);
                                                                },
                                                            });
                                                        }
                                                    }
                                                },
                                            },
                                        },
                                    },
                                    bind: {
                                        store: '{crewing.attachments}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-tasks',
                    hidden: true,
                    slug: 'task',
                    bind: {
                        hidden: '{objectTasks.count ? false : true}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            testId: 'husbandryCrewingRightCardTasksList',
                            minHeight: 120,
                            bind: {
                                store: '{objectTasks}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-comments',
                    slug: 'portcallNotes',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            testId: 'husbandryCrewingRightCardCommentsList',
                            minHeight: 120,
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    testId: 'husbandryCrewingRightCardCommentsInput',
                    docked: 'bottom',
                    slug: 'portcallNotes',
                    bind: {
                        hidden: '{object_record.is_archived ? true : false}',
                        permission: '{userPermissions}',
                        viewModel: {
                            data: {
                                comments: '{comments}',
                                record: '{crewingGrid.selection}',
                            },
                        },
                    },
                },
            ],
        },
    ],
});
