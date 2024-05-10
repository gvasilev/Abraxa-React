Ext.define('Abraxa.view.inquiries.InquiriesAssignTo', {
    xtype: 'inquiries.form-assign-to',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: 'Assign to',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 480,
    padding: '0 8 8 8',
    items: [
        {
            xtype: 'formpanel',
            itemId: 'inquiry-form-assign-to-itemid',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-field-assign',
                    flex: 1,
                    layout: 'hbox',
                    slug: 'portcallAssignTo',
                    viewModel: {
                        formulas: {
                            assignedToImage: {
                                bind: {
                                    bindTo: '{usersCombo.selection}',
                                    deep: true,
                                },
                                get: function (selection) {
                                    if (selection) {
                                        if (selection.get('profile_image')) {
                                            let userImage = selection.get('profile_image');
                                            return (
                                                '<div class="a-person a-icon-round">' +
                                                '<img class="a-profile-image a-user" src="' +
                                                userImage +
                                                '" width="24" alt="" />' +
                                                '</div>'
                                            );
                                        } else {
                                            return (
                                                '<div class="a-person a-icon-round"><span class="a-int a-user">' +
                                                selection.get('first_name')[0] +
                                                selection.get('last_name')[0] +
                                                '</span></div>'
                                            );
                                        }
                                    }
                                    return '<div class="a-field-icon icon-person icon-rounded"><div class="x-before-input-el"></div></div>';
                                },
                            },
                        },
                    },
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-assign-image',
                            left: 163,
                            bind: {
                                html: '{assignedToImage}',
                            },
                        },
                        {
                            xtype: 'user.combo',
                            flex: 1,
                            label: 'Assign to',
                            testId: 'inquiriesAssignToUserCombo',
                            placeholder: 'Choose assignee',
                            labelAlign: 'left',
                            reference: 'usersCombo',
                            clearable: true,
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-person icon-rounded',
                            flex: 1,
                            bind: {
                                cls: '{usersCombo.selection ? "a-field-icon icon-rounded":"a-field-icon icon-person icon-rounded"}',
                                value: '{portcall.assigned_to}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },

    buttons: [
        {
            text: 'Cancel',
            testId: 'inquiriesAssignToCancelButton',
            handler: function (me) {
                let dialog = me.up('dialog'),
                    record = dialog.upVM().get('portcall');
                record.reject();
                dialog.destroy();
            },
            margin: '0 8 0 0',
            ui: 'default',
        },
        {
            text: 'Save',
            testId: 'inquiriesAssignToSaveButton',
            ui: 'action',
            handler: function () {
                let record = this.upVM().get('portcall'),
                    dialog = this.up('dialog');
                record.save({
                    success: function (batch) {
                        Ext.toast('Record updated', 1000);
                        record.load();
                        dialog.destroy();
                    },
                    failure: function (batch) {
                        // Ext.Msg.alert('Something went wrong', 'Could not appoint this Inquiry!');
                    },
                });
            },
        },
    ],
});
