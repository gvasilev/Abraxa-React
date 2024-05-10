Ext.define('Abraxa.view.voyage.VoyageController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.VoyageController',

    bindings: {
        updateAppointmentId: '{appointmentId}',
    },

    control: {
        'list[cls~=portcalls-list]': {
            storechange: 'updateStore',
            // select: 'updateSelection',
            deselect: 'deselectList',
            childtap: 'selectPortcall',
        },
        'button[iconCls~=remove_agent]': {
            tap: 'removeAgent',
        },
        'button[iconCls~=add_cargo]': {
            tap: 'addCargo',
        },
        'button[iconCls~=remove_cargo]': {
            tap: 'removeCargo',
        },
        'button[iconCls~=add_instruction]': {
            tap: 'addInstruction',
        },
        'button[iconCls~=delete_instruction]': {
            tap: 'deleteInstruction',
        },
        'button[iconCls~=attach_file]': {
            change: 'instructionAttachFile',
        },
        'button[ui~=appoint_agent]': {
            tap: 'appointAgent',
        },
        'button[cls~=save_draft]': {
            tap: 'saveAsDraft',
        },
        'button[cls~=cancel_agent]': {
            tap: 'cancelAgent',
        },
        'button[iconCls~=edit_voyage]': {
            tap: 'editVoyage',
        },
        'list[xtype=VoyageAppointmentCargo]': {
            storechange: 'updateCargoStore',
        },
        'list[cls~=a-instructions-list]': {
            storechange: 'updateInstructionStore',
        },
        'button[cls~=preview_draft]': {
            tap: 'previewDraft',
        },
        'button[cls~=print_preview]': {
            tap: 'printPreview',
        },
        'button[cls~=appoint_agent]': {
            tap: 'appointAgentFromPreview',
        },
        'button[ui~=voyage_cancel]': {
            tap: 'voyageCancel',
        },
        'button[ui~=proceed_appoint]': {
            tap: 'proceedAppoint',
        },
        'button[ui~=remove_port]': {
            tap: 'removePort',
        },
        'button[ui~=add_port]': {
            tap: 'addPort',
        },
    },
    listen: {
        store: {
            '#voyageTypes': {
                load: 'onTypeLoad',
                datachange: 'onTypeLoad',
                metachange: 'onTypeLoad',
            },
        },
    },

    onTypeLoad: function (store) {
        let voyage = this.getView().upVM().get('object_record');
        if (voyage && voyage.get('type_id')) {
            let record = store.getById(voyage.get('type_id'));
            if (record) {
                this.getView().upVM().set('voyageType', record.get('name'));
            } else {
                this.getView().upVM().set('voyageType', AbraxaConstants.placeholders.emptyValue);
            }
        }
    },

    updateStore: function (sender, store) {
        let view = this.getView();
        let appointmentId = view.upVM().get('appointmentId');
        if (appointmentId && store) {
            let record = store.getById(appointmentId);
            if (record) {
                sender.select(record);
                view.upVM().set('proceedAppointment', true);
            }
        }
    },

    selectPortcall: function (grid, location) {
        if (location.event.target.classList.contains('x-input-el')) {
            return false;
        }
        this.proceedAppoint();
    },

    deselectList: function (list, records) {
        let view = this.getView();
        list.getStore().each(function (record) {
            record.set('is_checked', false);
        });
        view.upVM().set('proceedAppointment', false);
    },

    updateAppointmentId: function (appointmentId) {
        let list = Ext.ComponentQuery.query('[cls~=portcalls-list]')[0];
        if (!appointmentId) {
            if (list) {
                list.deselectAll();
            }
        } else {
            this.updateStore(list, list.getStore());
        }
    },

    removeAgent: function (button) {
        let combo = this.getView().lookupReference('agentCombo');
        if (combo) {
            combo.clearValue();
            button.upVM().get('nomination').set('lead_agent_name', null);
            button.upVM().get('nomination').set('lead_agent_email', null);
        }
    },

    addCargo: function () {
        let cargoList = this.getView().down('VoyageAppointmentCargo'),
            portcall = this.getView().lookupReference('appointmentList').getSelection();
        if (cargoList) {
            cargoList.getStore().add({
                nomination_id: portcall.getNomination().get('id'),
            });
        }
    },

    removeCargo: function (button) {
        let cargoList = this.getView().down('VoyageAppointmentCargo');
        if (cargoList) {
            cargoList.getStore().remove(button.upVM().get('record'));
        }
    },

    addInstruction: function () {
        let instructionList = this.getView().down('VoyageAppointmentInstruction').down('list');
        if (instructionList) {
            instructionList.getStore().add(Ext.create('Abraxa.model.portcall.Instruction'));
        }
    },

    deleteInstruction: function (button) {
        let instructionList = this.getView().down('VoyageAppointmentInstruction').down('list');
        if (instructionList) {
            instructionList.getStore().remove(button.upVM().get('record'));
        }
    },

    instructionAttachFile: function (button, newValue) {
        if (newValue) {
            let files = button.getFiles(),
                len = files.length,
                ext,
                fileStore = this.getView().upVM().get('files'),
                instruction = button.upVM().get('record'), //instruction
                attachments = instruction.attachments(),
                totalSize = 0;

            let calculateFileSize = function (size) {
                let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (size === 0) return '0 Byte';
                let i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
            };

            for (let i = 0; i < len; i++) {
                totalSize += files.item(i).size;
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
                let fileField = document.getElementById(button.id);
                // get the file upload parent element
                let parentNod = fileField.parentNode;
                // create new element
                let tmpForm = document.createElement('form');
                parentNod.replaceChild(tmpForm, fileField);
                tmpForm.appendChild(fileField);
                tmpForm.reset();
                parentNod.replaceChild(fileField, tmpForm);
                document.querySelector("input[type='file']").value = '';
                button.setValue(null);
                return;
            }
            for (var i = 0; i < len; i++) {
                ext = files.item(i).name.split('.').pop();
                let record = {
                    document: {
                        extension: ext,
                        size: calculateFileSize(totalSize),
                    },
                    name: files.item(i).name.split('.').shift(),
                    file: files.item(i),
                    instruction: instruction.get('id'),
                };
                fileStore.add(record);
                attachments.add(record);
            }
        }
        document.querySelector("input[type='file']").value = '';
        button.setValue(null);
    },
    upload: function (files, instruction, nomination, portcall) {
        return new Ext.Promise(function (resolve, reject) {
            let fd = new FormData();
            fd.append('ownerable_id', portcall.get('id'));
            fd.append('ownerable_type', portcall.get('model_name'));

            Ext.Array.each(files.getData().items, function (value, index) {
                fd.append('files[]', value.get('file'));
            });
            Ext.Ajax.request({
                url:
                    Env.ApiEndpoint +
                    'cdb/' +
                    nomination.get('lead_agent_id') +
                    '/instructions/' +
                    instruction.get('id') +
                    '/files',
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

    cancelAgent: function () {
        let list = Ext.ComponentQuery.query('[cls~=portcalls-list]')[0],
            portcall = this.getView().upVM().get('activePortcall');
        Ext.Msg.confirm(
            'Confirmation',
            'Would you like to discard all changes?',
            function (answer) {
                if (answer === 'yes') {
                    if (portcall) {
                        portcall.reject();
                    }
                    if (list) {
                        list.deselectAll();
                    }
                    Ext.getCmp('main-viewport').getController().redirectTo('#operations/voyage-planner');
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
                    enableToggle: true,
                    ui: 'action loading',
                    text: 'Discard',
                },
            ]
        );
    },

    editVoyage: function (btn) {
        let vm = this.getView().upVM();
        let selectedVoyage = vm.get('object_record');
        Ext.getCmp('main-viewport')
            .getController()
            .redirectTo('voyage/' + selectedVoyage.get('id') + '/update');
    },

    updateCargoStore: function (sender, store) {
        let me = this;
        let portcall = me.getView().upVM().get('activePortcall');
        if (
            portcall &&
            portcall.get('port_function') === 'Cargo operations' &&
            !portcall.get('is_locked_for_editing')
        ) {
            if (store && !store.getCount()) {
                me.addCargo();
            }
        }
    },

    updateInstructionStore: function (sender, store) {
        let me = this;
        let portcall = me.getView().upVM().get('activePortcall');
        if (portcall && !portcall.get('is_locked_for_editing')) {
            if (store && !store.getCount()) {
                me.addInstruction();
            }
        }
    },

    saveAsDraft: function (button) {
        let me = this;
        me.saveForm(button);
    },
    appointAgent: function (button) {
        let me = this,
            view = me.getView(),
            portcall = view.lookupReference('appointmentList').getSelection();
        if (portcall) {
            portcall.getNomination().set('need_appoint', true);
            me.saveForm(button);
        }
    },
    appointAgentFromPreview: function (button) {
        let me = this,
            view = Ext.ComponentQuery.query('[xtype=VoyageMainView]')[0],
            portcall = view.lookupReference('appointmentList').getSelection();
        if (portcall) {
            portcall.getNomination().set('need_appoint', true);
            me.saveForm(button, view);
        }
    },

    saveForm: function (button, anotherView = null) {
        let me = this,
            view = me.getView();
        if (anotherView) {
            view = anotherView;
        }
        let form = view.down('formpanel');
        if (form.validate()) {
            let portcall = view.lookupReference('appointmentList').getSelection();
            let nomination = portcall.getNomination();
            let instructions = portcall.instructions();
            let cargoes = portcall.cargoes();
            cargoes.getProxy().setExtraParams({
                portcall_id: portcall.get('id'),
            });
            let voyage = view.upVM().get('object_record');
            if (cargoes.getCount() && cargoes.needsSync) {
                cargoes.sync();
            }

            if (instructions.getCount() && instructions.needsSync) {
                instructions.each(function (instruction) {
                    instruction.set('owner_type', portcall.get('model_name'));
                    instruction.set('owner_id', portcall.get('id'));
                    const titleLabel = 'title';
                    const descriptionLabel = 'description';
                    Abraxa.getApplication()
                        .getController('AbraxaController')
                        .setInstructionTitleOrDescription(instruction);
                    if (
                        instruction.get(titleLabel) &&
                        instruction.get(titleLabel).length > 0 &&
                        instruction.get(descriptionLabel) &&
                        instruction.get(descriptionLabel).length > 0
                    ) {
                        instruction.save({
                            success: function (resp) {
                                if (instruction.attachments() && instruction.attachments().getCount()) {
                                    me.upload(instruction.attachments(), instruction, nomination, portcall).then(
                                        function (result) {}
                                    );
                                }
                            },
                        });
                    }
                });
            }
            portcall.save({
                success: function (rec) {
                    setTimeout(() => {
                        voyage.load();
                        me.showSuccessDialog(nomination);
                    }, 0);
                },
                failure: function (batch, operation) {
                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
                },
            });
        } else {
            button.toggle();
            form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
        }
    },

    voyageAction: function (button) {
        let view = this.getView(),
            form = view.down('formpanel');
        if (form.validate()) {
            let record = view.upVM().get('voyage');
            let isEdit = view.upVM().get('isEdit');
            let porcalls = record.portcalls();
            let itemsData = [];
            porcalls.each(function (item) {
                let itemData = item.getData();
                if (view.upVM().get('isEdit') && !Ext.isNumber(item.get('id'))) {
                    delete itemData['id'];
                }
                let date = moment(itemData.port_eta).format('YYYY-MM-DD HH:mm:ss');
                itemData.port_eta = date;
                itemsData.push(itemData);
            });
            record.set('portcalls', itemsData);
            if (!isEdit) {
                record.save({
                    success: function (rec) {
                        Ext.toast('Record created', 1000);
                        rec.load({
                            callback: function () {
                                if (Ext.ComponentQuery.query('[xtype=VoyagesGrid]')[0]) {
                                    let voyagesPrincipal =
                                        Ext.ComponentQuery.query('[xtype=VoyagesGrid]')[0].getStore();
                                    voyagesPrincipal.add(rec);
                                    voyagesPrincipal.commitChanges();
                                }
                            },
                        });
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo('voyage/' + rec.get('id') + '/appoint');
                    },
                    failure: function (record, response) {
                        let result = response.error.response.responseJson;
                        Ext.Msg.alert('Oops', result.message);
                    },
                });
            } else {
                record.save({
                    success: function (rec) {
                        Ext.toast('Record created', 1000);
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo('voyage/' + rec.get('id') + '/appoint');
                    },
                    failure: function (record, response) {
                        let result = response.error.response.responseJson;
                        Ext.Msg.alert('Oops', result.message);
                    },
                });
            }
        } else {
            button.toggle();
            view.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    previewDraft: function (button) {
        let view = this.getView(),
            voyage = view.upVM().get('object_record'),
            portcall = view.upVM().get('activePortcall');
        let form = view.down('formpanel');
        if (form.validate()) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'appointment-preview',
                jsonData: {
                    voyage: voyage.getData(),
                    portcall: portcall.getData({
                        associated: true,
                    }),
                },
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                success: function success(response) {
                    let dialog = Ext.create('Abraxa.view.voyage.AppointPreview', {
                        viewModel: {
                            parent: view.upVM(),
                        },
                        controller: 'VoyageController',
                    });
                    dialog.down('container[cls=main_content]').setHtml(response.responseText);
                    dialog.show();
                },
                failure: function failure(response) {
                    // resolve(false);
                },
            });
        } else {
            form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
        }
    },

    printPreview: function (button) {
        let view = this.getView();
        let content = view.down('container[cls=main_content]').getHtml();
        let left = (screen.width - 960) / 2;
        let top = (screen.height - 640) / 4;
        let mywindow = window.open(
            '',
            'PRINT',
            'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, height=640,width=960, top=' +
                top +
                ', left=' +
                left
        );
        mywindow.document.write(content);
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
        mywindow.close();
    },

    showSuccessDialog: function (nomination) {
        if (Ext.getCmp('showSuccessDialog')) {
            Ext.getCmp('SuccessfullyAppointDialog').destroy();
        }
        let dialog = Ext.create('Abraxa.view.voyage.SuccessfullyAppointDialog', {
            id: 'SuccessfullyAppointDialog',
            cls: 'abraxa_success_dialog a-dialog-success',
            viewModel: {
                data: {
                    nomination: nomination,
                },
            },
        });
        this.getView().setHidden(true);
        //this hide is needed when is call from preview
        Ext.ComponentQuery.query('[xtype=VoyageMainView]')[0].setHidden(true);
        dialog.show();
    },

    voyageCancel: function (button) {
        let me = this;
        Ext.Msg.confirm(
            'Confirmation',
            'Would you like to discard all changes?',
            function (answer) {
                if (answer === 'yes') {
                    me.getView().upVM().get('voyage').destroy();
                    Ext.getCmp('main-viewport').getController().redirectTo('#operations/voyage-planner');
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
                    enableToggle: true,
                    ui: 'action loading',
                    text: 'Discard',
                },
            ]
        );
    },
    proceedAppoint: function (button) {
        let me = this.getView();
        let selected = me.upVM().get('appointmentList.selection'),
            voyage = me.upVM().get('object_record');
        if (selected) {
            me.upVM().set('proceedAppointment', true);
            Ext.getCmp('main-viewport')
                .getController()
                .redirectTo('voyage/' + voyage.get('id') + '/appoint/' + selected.get('id'));
            if (button) {
                button.toggle();
            }
        } else {
            me.toggle();
            Ext.Msg.warning('Warning', 'Please select at least one port.');
        }
    },
    removePort: function (button) {
        let portcalls = this.getView().upVM().get('portcalls');
        if (portcalls) {
            portcalls.getSource().remove(button.upVM().get('record'));
        }
    },
    addPort: function (button) {
        let portcalls = this.getView().upVM().get('portcalls');
        if (portcalls) {
            portcalls.add(Ext.create('Abraxa.model.portcall.Portcall'));
        }
    },
});
