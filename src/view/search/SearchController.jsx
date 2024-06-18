Ext.define('Abraxa.searchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.searchcontroller',

    previewObject: function (element) {
        let cmp = Ext.fly(element.currentTarget).up('.object_holder').component,
            vm = cmp.upVM(),
            record = cmp.upVM().get('record'),
            type = cmp.model;

        switch (type) {
            case 'document':
                this.previewDocument(vm, record, cmp);
                break;

            case 'portcall':
                window.location.hash = '#portcall/' + record.get('portcall').id;
                cmp.up('elasticsearch').close();
                break;

            case 'disbursement':
                window.location.hash = '#portcall/' + record.get('portcall_id') + '/disbursements';
                cmp.up('elasticsearch').close();
                break;

            case 'cargo':
                window.location.hash = '#portcall/' + record.get('portcall_id') + '/ops';
                cmp.up('elasticsearch').close();
                break;

            case 'company':
                window.location.hash = '#companydatabase/companies/' + record.get('org_id');
                cmp.up('elasticsearch').close();
                break;

            case 'contact':
                window.location.hash = '#companydatabase/contacts/' + record.get('contact_id');
                cmp.up('elasticsearch').close();
                break;
        }
    },

    previewDocument: function (vm, record, cmp) {
        if (record.get('document')) {
            let document = Ext.create('Abraxa.model.adocs.Document', record.get('document')),
                docData = new Abraxa.model.adocs.DocumentData(Object.assign({}, record.get('document').data)),
                folder_file = new Abraxa.model.adocs.DocumentFolderFile(
                    Object.assign({}, record.get('document').document_folder_file)
                );

            document.setDocumentData(docData);
            document.setDocumentAdocsDocumentFolderFile(folder_file);

            if (document.get('document_type') == 'uploaded') {
                var data = {
                    object_id: 3,
                    object_meta_id: document.get('object_meta_id'),
                    file_id: document.get('id'),
                };
                Abraxa.getApplication().getController('AbraxaController').previewFile(record, data);
                // cmp.up('elasticsearch').close();
            } else {
                Abraxa.model.portcall.Portcall.load(record.get('document').object_meta_id, {
                    success: function (rec, operation) {
                        // Ext.getCmp('main-viewport').getVM().set('object_meta_id', rec.get('id'));
                        let ids = [],
                            object_record = rec,
                            cdbStore = vm.get('organizations'),
                            userPermissions = vm.get('userPermissions'),
                            allDocuments = [document],
                            selectedFile = document,
                            cargoes = object_record.cargoes();

                        cargoes.getProxy().setExtraParams({
                            object_id: 3,
                            object_meta_id: record.get('id'),
                        });

                        if (selectedFile) {
                            let store = Ext.create('Abraxa.store.adocs.Documents');
                            let editor = Ext.create('Abraxa.view.adocs.DocumentEditor', {
                                viewModel: {
                                    data: {
                                        document_type: document.get('document_type'),
                                        object_record: object_record,
                                        cargoes: object_record.cargoes(),
                                        organizations: cdbStore,
                                        userPermissions: userPermissions,
                                        selectedRecord: selectedFile,
                                        allDocuments: Ext.create('Ext.data.Store', {
                                            data: allDocuments,
                                        }),
                                        isLocked: true,
                                        nonEditable: true,
                                    },
                                    formulas: {
                                        pages: {
                                            bind: {
                                                bindTo: '{selectedDocument.selection}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record) {
                                                    let store = record.pages();
                                                    store.getProxy().setExtraParams({
                                                        document_id: this.get('selectedDocument.selection.id'),
                                                    });
                                                    return store;
                                                }
                                            },
                                        },
                                        documentData: {
                                            bind: {
                                                bindTo: '{selectedDocument.selection}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record) {
                                                    return record.getDocumentData();
                                                }
                                            },
                                        },
                                    },
                                },
                            });
                            store.setData(allDocuments);
                            store.setGrouper({
                                groupFn: function (record) {
                                    return record.getDocumentData().get('cargo_id');
                                },
                            });
                            store.filter({
                                filterFn: function (record) {
                                    return (
                                        record.getDocumentData().get('cargo_id') ==
                                        selectedFile.getDocumentData().get('cargo_id')
                                    );
                                },
                            });
                            editor.getVM().set('documents', store);
                            editor.getVM().set('object_record', object_record);
                            editor.down('document\\.cargo\\.edit\\.panel').getVM().set('object_record', object_record);
                            editor.show();
                        }
                        cmp.up('elasticsearch').close();
                    },
                });
            }
        }
    },
});
