Ext.define('Abraxa.view.operations.PortcallsPrincipal.PortcallsPrincipalMainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.PortcallsPrincipalMainController',
    control: {
        'button[iconCls~=add_instruction]': {
            tap: 'addInstruction',
        },
        'button[iconCls~=add_cargo]': {
            tap: 'addCargo',
        },
        'list[cls~=a-instructions-list]': {
            storechange: 'updateInstructionStore',
        },
        'button[iconCls~=attach_file]': {
            change: 'instructionAttachFile',
        },
        'button[ui~=appointment_cancel]': {
            tap: 'appointmentCancel',
        },
        'button[cls~=preview_draft]': {
            tap: 'previewDraft',
        },
        'button[cls~=appoint_agent]': {
            tap: 'appointAgentFromPreview',
        },
        'button[iconCls~=remove_cargo]': {
            tap: 'removeCargo',
        },
        'button[iconCls~=remove_agent]': {
            tap: 'removeAgent',
        },
        'button[iconCls~=delete_instruction]': {
            tap: 'deleteInstruction',
        },
    },

    exportToExcel: function (button) {
        const gridSuffix = Ext.String.capitalize(
            this.getViewModel().get('currentTab').replace(/\s+/g, '').toLowerCase()
        );
        const grid = button.up('PortcallsPrincipalMain').down('PortCallsPricipalGrid' + gridSuffix);
        grid.saveDocumentAs({
            type: 'xlsx',
            title: 'Portcalls' + gridSuffix,
            includeSummary: true, // Add this line to include the summary row
            fileName: 'Portcalls' + gridSuffix + '.xlsx',
        });
    },

    openNewVoyageForm: function (btn) {
        Ext.getCmp('main-viewport').getController().redirectTo('appointment/create');
    },

    searchPortcalls: function (field, newValue, oldValue, eOpts) {
        const store = field.up('PortcallsPrincipalMain').upVM().get('portcallsPrincipal');
        if (newValue.length === 0) store.removeFilter('searchFilter');
        if (newValue.length <= 2) return;
        store.addFilter({
            id: 'searchFilter',
            property: 'search',
            value: newValue,
            operator: '=',
            exactMatch: true,
        });
    },

    activeTabchange: function (tabbar, newTab, oldTab) {
        const portcallsPrincipalMainViewModel = tabbar.up('PortcallsPrincipalMain').getViewModel();
        portcallsPrincipalMainViewModel.set('currentTab', newTab.valueId);
        const store = Ext.getStore('portcallsPrincipal');
        const activeFiltersIds = store
            .getFilters()
            .items.filter((id) => id.getId() !== 'searchFilter')
            .map((filter) => filter.getId());

        activeFiltersIds.forEach((filterId) => {
            store.removeFilter(filterId);
        });

        tabbar.query('button').forEach((button) => {
            button.setPressed(false);
            button.setDisabled(true);
        });

        store.addFilter({
            id: newTab.valueId,
            property: 'custom_status',
            operator: '=',
            value: newTab.valueId,
            exactMatch: true,
        });

        store.on('load', () => {
            tabbar.query('button').forEach((button) => {
                button.setDisabled(false);
            });
        });
    },
    addCargo: function () {
        let cargoList = this.getView().down('VoyageAppointmentCargo');
        if (cargoList) {
            cargoList.getStore().add({});
        }
    },
    addInstruction: function () {
        let instructionList = this.getView().down('VoyageAppointmentInstruction').down('list');
        if (instructionList) {
            instructionList.getStore().add(Ext.create('Abraxa.model.portcall.Instruction'));
        }
    },

    updateInstructionStore: function (sender, store) {
        let me = this;
        if (store && !store.getCount()) {
            me.addInstruction();
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
    createAppointmentSubmitButton: function (btn) {
        this.submitAppointment(btn);
    },

    submitAppointment: function (btn, anotherView = null) {
        btn.setDisabled(true);

        let me = this,
            view = me.getView();
        if (anotherView) {
            view = anotherView;
        }
        let form = view.down('formpanel');

        if (form.validate()) {
            let portcall = view.upVM().get('portcall');
            let nomination = portcall.getNomination();
            //set hideble for principals voyage grid
            portcall.getVoyage().set('hideable', 1);
            let instructions = portcall.instructions();
            portcall.save({
                success: function (rec) {
                    if (instructions.getCount() && instructions.needsSync) {
                        instructions.each(function (instruction) {
                            instruction.set('owner_type', rec.get('model_name'));
                            instruction.set('owner_id', rec.get('id'));
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
                                            me.upload(
                                                instruction.attachments(),
                                                instruction,
                                                nomination,
                                                portcall
                                            ).then(function (result) {});
                                        }
                                    },
                                });
                            }
                        });
                    }
                    setTimeout(() => {
                        Ext.toast(AbraxaConstants.messages.createRecord, 1000);
                        //destroy preview dialog if exists
                        if (anotherView) {
                            Ext.ComponentQuery.query('[xtype=AppointPreview]')[0].destroy();
                        }
                        me.redirectToOperationPortcalls();
                    }, 0);
                },

                failure: function (batch, operation) {
                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
                },
            });
        } else {
            btn.toggle();
            btn.setDisabled(false);
            form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
        }
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
    appointmentCancel: function (button) {
        let me = this;
        Ext.Msg.confirm(
            'Confirmation',
            'Would you like to discard all changes?',
            function (answer) {
                if (answer === 'yes') {
                    me.getView().upVM().get('portcall').destroy();
                    me.redirectToOperationPortcalls();
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

    redirectToOperationPortcalls() {
        Ext.getCmp('main-viewport').getController().redirectTo('#operations/port-calls');
    },

    previewDraft: function (button) {
        let view = this.getView(),
            portcall = view.upVM().get('portcall'),
            voyage = portcall.getVoyage();
        portcall.set('port', {
            port_name: voyage.get('port_name'),
        });
        portcall.set('port_function', portcall.getNomination().get('port_function'));
        voyage.set('vessel', {
            name: voyage.get('vessel_name'),
        });
        voyage.set('office', {
            office_name: voyage.get('office_name'),
        });
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
                        controller: 'PortcallsPrincipalMainController',
                    });
                    dialog.down('container[cls=main_content]').setHtml(response.responseText);
                    dialog.show();
                },
            });
        } else {
            form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
        }
    },

    appointAgentFromPreview: function (button) {
        let me = this,
            view = Ext.ComponentQuery.query('[xtype=CreateAppointment]')[0];
        me.submitAppointment(button, view);
    },

    removeCargo: function (button) {
        let cargoList = this.getView().down('VoyageAppointmentCargo');
        if (cargoList) {
            cargoList.getStore().remove(button.upVM().get('record'));
        }
    },
    removeAgent: function (button) {
        let combo = this.getView().lookupReference('agentCombo');
        if (combo) {
            combo.clearValue();
            button.upVM().get('portcall').getNomination().set('lead_agent_name', null);
            button.upVM().get('portcall').getNomination().set('lead_agent_email', null);
        }
    },
    deleteInstruction: function (button) {
        let instructionList = this.getView().down('VoyageAppointmentInstruction').down('list');
        if (instructionList) {
            instructionList.getStore().remove(button.upVM().get('record'));
        }
    },
});
