Ext.define('Abraxa.view.portcalls.agent.create.PortcallsAgentCreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portcalls-agent-create-controller',
    requires: ['Ext.drag.Target'],

    init: function () {},

    onCreate: function (btn, fromInquiry = false) {
        btn.setDisabled(true);
        let form = this.lookup('createPortcallAgent'),
            view = this.getView(),
            me = this,
            record = view.upVM().get('object_record'),
            inquiry = view.upVM().get('inquiry'),
            portcalls = Ext.getStore('portcalls'),
            files = view.upVM().get('files'),
            filesForUpload = [],
            inquiryFiles = [],
            invitations = view.upVM().get('invitations'),
            currentUserType = view.upVM().get('currentUserType'),
            editMode = view.upVM().get('editMode');

        if (fromInquiry) {
            record.getProxy().setUrl(Env.ApiEndpoint + 'inquiry/' + inquiry.get('id') + '/appoint');
            files.each(function (record) {
                if (!record.get('attachment_id')) {
                    filesForUpload.push(record);
                } else {
                    inquiryFiles.push(record.get('attachment_id'));
                }
            });
            if (inquiryFiles.length) {
                record.set('inquiry_attachments', inquiryFiles);
            }
        } else {
            filesForUpload = files.getData().getRange();
        }
        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            record.setVoyage(view.upVM().get('voyage_data'));
            record.setNomination(view.upVM().get('nomination'));
            Abraxa.getApplication()
                .getController('AbraxaController')
                .setInstructionTitleOrDescription(view.upVM().get('instruction'));
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
                    if (fromInquiry) {
                        record.getProxy().setUrl(Env.ApiEndpoint + 'portcall');
                    }
                    // Ext.fireEvent('refreshPortcallsGridActive');
                    if (editMode) {
                        Ext.toast('Record updated', 1000);
                        record.load();
                        btn.toggle();
                        mixpanel.track('Portcall edited');
                        view.destroy();
                    } else {
                        if (filesForUpload.length > 0) {
                            me.upload(filesForUpload, rec).then(function (result) {
                                if (result) {
                                    btn.toggle();
                                    if (currentUserType == 'principal') {
                                        invitations.reload();
                                    } else {
                                        Ext.getCmp('main-viewport')
                                            .getController()
                                            .redirectTo('portcall/' + record.get('id') + '/appointment');
                                    }
                                    Ext.toast('Record created', 1000);
                                    mixpanel.track('Portcall created');
                                    view.destroy();
                                } else {
                                    btn.setDisabled(false);
                                    Ext.Msg.warning(
                                        'Unsupported file format',
                                        'The file format you are trying to upload is not supported'
                                    );
                                }
                            });
                        } else {
                            Ext.toast('Record created', 1000);
                            btn.toggle();
                            if (currentUserType == 'principal') {
                                invitations.reload();
                            } else {
                                Ext.getCmp('main-viewport')
                                    .getController()
                                    .redirectTo('portcall/' + record.get('id') + '/appointment');
                            }
                            mixpanel.track('Portcall created');
                            view.destroy();
                        }
                    }
                },
                failure: function (batch, operation) {
                    const errMsgTitle = AbraxaConstants.messages.anErrorOccured.title;
                    const errMsg = AbraxaConstants.messages.anErrorOccured.message;

                    btn.setDisabled(false);
                    view.destroy();
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
                            return;
                        }
                        if (operation.error && operation.error.status == 404) {
                            Ext.Msg.warning(errMsgTitle, errMsg);
                        }
                    } else {
                        Ext.Msg.warning(errMsgTitle, errMsg);
                    }
                },
            });
        } else {
            btn.toggle();
            btn.setDisabled(false);
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        Ext.get('dropped-container-create').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('dropped-container-create').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('dropped-container-create').removeCls('a-dropped');
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
        let view = this.getView(),
            currentUserType = view.upVM().get('currentUserType');

        return new Ext.Promise(function (resolve, reject) {
            let me = this,
                fd = new FormData();
            fd.append('from_create', 1);
            if (currentUserType == 'agent') {
                fd.append('folder', record.get('folders')[0].id);
            }

            Ext.Array.each(files, function (value, index) {
                fd.append('files[]', value.get('file'));
            });
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'portcall/' + record.get('id') + '/documents',
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
