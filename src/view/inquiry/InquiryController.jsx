Ext.define('Abraxa.view.inquiry.InquiryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.inquiry-controller',
    requires: ['Ext.drag.Target'],

    init: function () {},
    // listen: {
    //     global: {
    //         refreshInquiryAgentActiveGrid: function () {
    //             Ext.ComponentQuery.query('inquiry\\.agent\\.active\\.grid')[0].getStore().load();
    //         },
    //     },
    // },
    createInquiry: function (btn) {
        let currentUser = btn.upVM().get('currentUser');
        Ext.create('Abraxa.view.inquiry.forms.CreateInquiry', {
            header: {
                bind: {
                    title: '{headerTitle}',
                },
            },
            viewModel: {
                parent: btn.upVM(),
                links: {
                    object_record: {
                        type: 'Abraxa.model.inquiry.Inquiry',
                        create: {
                            assigned_to: currentUser.get('id'),
                            currency: currentUser.getCompany().get('default_currency'),
                        },
                    },
                    voyage_data: {
                        type: 'Abraxa.model.voyage.Voyage',
                        create: true,
                    },
                    instruction: {
                        type: 'Abraxa.model.portcall.Instruction',
                        create: {
                            object_id: 6,
                        },
                    },
                },
                stores: {
                    suggestedOrganizations: Ext.create('Ext.data.Store'),
                    files: Ext.create('Ext.data.Store'),
                    additionalPortsFiltered: {
                        source: '{object_record.ports}',
                        filters: '{additionalPortFilter}',
                    },
                },
                data: {
                    object_id: 6,
                    editMode: false,
                    visibleInstruction: false,
                },
                formulas: {
                    addDefaultPort: {
                        bind: {
                            bindTo: '{object_record.ports}',
                            deep: true,
                        },
                        get: function (store) {
                            if (store && !store.getCount()) store.add({});
                        },
                    },
                    firstPort: {
                        bind: {
                            bindTo: '{object_record.ports}',
                            deep: true,
                        },
                        get: function (store) {
                            if (store && store.getCount()) {
                                return store.first();
                            }
                        },
                    },
                    additionalPortFilter: {
                        bind: {
                            bindTo: '{firstPort}',
                            deep: true,
                        },
                        get: function (record) {
                            if (record) {
                                let store = this.get('additionalPortsFiltered');
                                if (store) store.clearFilter();
                                return function (rec) {
                                    if (rec.get('id') != record.get('id')) {
                                        return true;
                                    }
                                };
                            }
                        },
                    },
                    showFiles: {
                        bind: {
                            filesCount: '{files.count}',
                            editMode: '{editMode}',
                        },
                        get: function (data) {
                            if (data) {
                                if (data.editMode) {
                                    return true;
                                } else {
                                    if (data.filesCount === 0) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        },
                    },
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
                    dragListeners: {
                        bind: {
                            bindTo: '{userPermissions}',
                            deeP: true,
                        },
                        get: function (store) {
                            return {
                                element: 'element',
                                drop: 'onDrop',
                                dragleave: 'onDragLeaveListItem',
                                dragover: 'onDragOverListItem',
                            };
                        },
                    },
                    headerTitle: {
                        bind: {
                            instructions: '{visibleInstruction}',
                        },
                        get: function (data) {
                            if (data) {
                                if (data.instructions) {
                                    return '<span class="a-dialog-instructions-title">Voyage instructions</span>';
                                }
                            }
                            return '<div class="a-badge a-badge-enquiry"><i class="md-icon-outlined">live_help</i></div>Create enquiry';
                        },
                    },
                    suggestedOrganizationsRequest: {
                        bind: {
                            bindTo: '{object_record.port_id}',
                        },
                        get: async function (port_id) {
                            let vm = this,
                                filter = [
                                    {
                                        property: 'port_id',
                                        value: port_id,
                                        operator: '=',
                                    },
                                ];
                            if (port_id) {
                                Ext.Ajax.request({
                                    url: Env.ApiEndpoint + 'suggested-organizations',
                                    method: 'GET',
                                    params: {
                                        filter: JSON.stringify(filter),
                                    },
                                    success: function (response) {
                                        if (response) {
                                            vm.get('suggestedOrganizations').add(Ext.decode(response.responseText));
                                        }
                                    },
                                    failure: function failure(response) {},
                                });
                            }
                        },
                    },
                },
            },
        }).show();
    },

    onCreate: function (btn) {
        let form = this.lookup('createInquiryAgent'),
            view = this.getView(),
            me = this,
            record = view.upVM().get('object_record'),
            inquiries = Ext.getStore('inquiries'),
            files = view.upVM().get('files'),
            invitations = view.upVM().get('invitations'),
            currentUserType = view.upVM().get('currentUserType'),
            editMode = view.upVM().get('editMode');

        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            record.setVoyage(view.upVM().get('voyage_data'));
            record.setInstruction(view.upVM().get('instruction'));
            if (editMode) {
                let instruction = record.getInstruction();
                instruction.getProxy().setExtraParams({
                    object_id: 3,
                    object_meta_id: record.get('id'),
                });
                instruction.save();
            }
            record.set('is_manual', true);
            record.save({
                success: function (rec) {
                    // Ext.fireEvent('refreshInquiryAgentActiveGrid');
                    if (editMode) {
                        Ext.toast('Record updated', 1000);
                        record.load();
                        btn.toggle();
                        view.destroy();
                    } else {
                        if (files.getCount() > 0) {
                            me.upload(files, record).then(function (result) {
                                if (result) {
                                    Ext.toast('Record created', 1000);
                                    btn.toggle();
                                    Ext.getCmp('main-viewport')
                                        .getController()
                                        .redirectTo('inquiry/' + record.get('id'));
                                    // mixpanel.track(
                                    //     "Inquiry created"
                                    // );
                                    view.destroy();
                                } else {
                                    Ext.Msg.warning(
                                        'Unsupported file format',
                                        'The file format you are trying to upload is not supported'
                                    );
                                }
                            });
                        } else {
                            Ext.toast('Record created', 1000);
                            btn.toggle();
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('inquiry/' + record.get('id'));
                            // mixpanel.track(
                            //     "Inquiry created"
                            // );
                            view.destroy();
                        }
                    }
                },
                failure: function (batch, operation) {
                    if (editMode) {
                        if (operation.error && operation.error.status == 403) {
                            if (portcalls) {
                                portcalls.reload();
                            }
                            let els = document.getElementsByClassName('x-mask'),
                                history = me.getViewModel().get('history');

                            Ext.create('Ext.MessageBox', {
                                ui: 'warning',
                                title: 'Permissions',
                                innerCls: 'a-bgr-white',
                                message:
                                    '<div class="text-center mt-8"><i class="md-icon-outlined fs-64">lock</i><p class="mb-0">You don\'t have permissions to view the selected port call.</p></div>',
                                width: 300,
                                dataTitle: 'Warning',
                                modal: true,
                                draggable: false,
                                bbar: {
                                    manageBorders: false,
                                    items: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            iconCls: 'md-icon-refresh',
                                            ui: 'action',
                                            text: 'Dashboard',
                                            hidden: history > 1 ? true : false,
                                            handler: function () {
                                                me.redirectTo('dashboard', {
                                                    replace: true,
                                                });
                                                Ext.Array.each(els, function (el) {
                                                    el.classList.remove('a-blurred');
                                                });
                                                this.up('dialog').destroy();
                                                return;
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'md-icon-arrow-back',
                                            ui: 'action',
                                            text: 'Back',
                                            hidden: history > 1 ? false : true,
                                            handler: function () {
                                                window.history.back();
                                                Ext.Array.each(els, function (el) {
                                                    el.classList.remove('a-blurred');
                                                });
                                                this.up('dialog').destroy();
                                                return;
                                            },
                                        },
                                    ],
                                },
                            }).show();
                            Ext.Array.each(els, function (el) {
                                el.classList.add('a-blurred');
                            });
                            view.destroy();
                            return;
                        }
                        if (operation.error && operation.error.status == 404) {
                            Ext.Msg.alert('Something went wrong', 'Something went wrong');
                        }
                    } else {
                        Ext.Msg.alert('Something went wrong', 'Something went wrong');
                    }
                },
            });
        } else {
            btn.toggle();
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        Ext.get('dropped-inquiry-create').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('dropped-inquiry-create').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('dropped-inquiry-create').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = this.getView().upVM().get('files'),
                len = files.length,
                targetComponent = Ext.get(event.browserEvent.target).component,
                totalSize = 0;

            let size = function (size) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (size == 0) return '0 Byte';
                var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
            };

            for (var i = 0; i < len; i++) {
                totalSize += files.item(i).size;
                ext = files.item(i).name.split('.').pop();
                let record = {
                    ext: ext,
                    firstName: files.item(i).name.split('.').shift(),
                    file: files.item(i),
                    size: size(totalSize),
                };
                fileStore.add(record);
            }
            if (totalSize > 10 * 1024 * 1024) {
                Ext.create('Ext.MessageBox', {
                    ui: 'warning',
                    title: 'Upload Cancelled',
                    innerCls: 'a-bgr-white',
                    message:
                        'Your file(s) payload size (' +
                        (totalSize / 1024 / 1024).toFixed(2) +
                        ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                        '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />',
                    width: 500,
                    dataTitle: 'Warning',
                    modal: true,
                    draggable: false,
                    bbar: {
                        manageBorders: false,
                        items: [
                            '->',
                            {
                                xtype: 'button',
                                ui: 'action',
                                text: 'Ok',
                                handler: function () {
                                    this.up('dialog').destroy();
                                },
                            },
                        ],
                    },
                }).show();
                document.querySelector("input[type='file']").value = '';
                me.setValue(null);
                return;
            }
            if (totalSize > 10 * 1024 * 1024) {
                Ext.create('Ext.MessageBox', {
                    ui: 'warning',
                    title: 'Upload Cancelled',
                    innerCls: 'a-bgr-white',
                    message:
                        'Your file(s) payload size (' +
                        (totalSize / 1024 / 1024).toFixed(2) +
                        ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                        '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />',
                    width: 500,
                    dataTitle: 'Warning',
                    modal: true,
                    draggable: false,
                    bbar: {
                        manageBorders: false,
                        items: [
                            '->',
                            {
                                xtype: 'button',
                                ui: 'action',
                                text: 'Ok',
                                handler: function () {
                                    this.up('dialog').destroy();
                                },
                            },
                        ],
                    },
                }).show();
                fileStore.remove(fileStore.last());
                return;
            }
            if (!len) return;
        }
    },
    upload: function (files, record) {
        return new Ext.Promise(function (resolve, reject) {
            let me = this,
                fd = new FormData();
            // fd.append('section', record.folders().getAt(0).get('id'));
            // fd.append('documentable_id', record.get('voyage').id);
            // fd.append('documentable_type', record.get('voyage').model_name);
            fd.append('ownerable_id', record.get('id'));
            fd.append('attachmentable_id', record.get('id'));
            fd.append('attachmentable_type', record.get('model_name'));

            Ext.Array.each(files.getData().items, function (value, index) {
                fd.append('files[]', value.get('file'));
            });
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'attachments',
                rawData: fd,
                headers: {
                    'Content-Type': null,
                },
                success: function (response) {
                    resolve(true);
                },
                failure: function failure(response) {
                    resolve(false);
                },
            });
        });
    },
});
