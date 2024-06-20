import '../vouchers/VouchersDialog';

Ext.define('Abraxa.view.document.DocumentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.document.controller',

    documentForLoad: null,
    viewerHasLoaded: false,
    documentViewer: null,
    documentChanges: null,
    fieldsForChange: [],

    control: {
        'list[cls~=document_dialog_list]': {
            select: 'onListSelect',
        },
    },

    onListSelect: function (list, selection) {
        let me = this;
        if (selection.get('document_type') == 'cargo' || selection.get('document_type') == 'operational') {
            let cargo_id = selection.get('documentable_id'),
                object_record = me.getView().lookupViewModel().get('object_record'),
                data = object_record.getData(), //TO-DO: REDUCE OBJECT_RECORD ARRAY ASAP
                cargoes = object_record
                    .getNomination()
                    .cargoes()
                    .queryBy(function (rec, id) {
                        if (selection.get('document_type') == 'cargo') return rec.get('id') == cargo_id;

                        return true;
                    }).items,
                masters = Ext.pluck(object_record.masters().data.items, 'data'),
                voyage = object_record.getVoyage().getData(),
                nomination = object_record.getNomination().getData();

            data['cargoes'] = Ext.pluck(cargoes, 'data');
            data['masters'] = masters;
            data['voyage'] = voyage;
            data['nomination'] = nomination;

            const flattenObject = (obj, parentKey = '') => {
                if (parentKey !== '') parentKey += '.';
                let flattened = {};
                Object.keys(obj).forEach((key) => {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        Object.assign(flattened, flattenObject(obj[key], parentKey + key));
                    } else {
                        flattened[parentKey + key] = obj[key];
                    }
                });
                return flattened;
            };

            let flat = flattenObject(data);
            me.documentChanges = flat;
        } else {
            me.documentChanges = null;
        }
        me.currentDocument = selection;
    },

    updateDocumentFields: function () {
        let me = this,
            fieldManager = this.annotationManager.getFieldManager();

        me.fieldsForChange.forEach(function (field) {
            me.iframeDoc.getElementById(field.element).classList.remove('has_changed');
            me.iframeDoc.getElementById(field.element).classList.add('needs_change');
            field.field.setValue(field.newValue);
        });
        me.currentDocument.set('is_changed', true);
        me.documentChanges = null;
        Ext.getCmp('pedal').hide();
    },

    loadViewer: function () {
        let me = this,
            nonEditable = this.getView().upVM().get('nonEditable'),
            username = Ext.getCmp('main-viewport').upVM().get('currentUser.full_name');
        if (this.viewerHasLoaded) return;

        WebViewer.default(
            {
                path: '/public/webviewer/',
                licenseKey:
                    'Abraxa Group Ltd (abraxa.com):OEM:Abraxa::B+:AMS(20240616):61DCB4C3076A84F3FB313BC9B263192E4E6F4FA156DD73040486F424E718C634D2B6F5C7',
                css: '/src/css/webviewer.css',
                disabledElements: [
                    'leftPanelButton',
                    'menuButton',
                    'toolbarGroup-Shapes',
                    'toolbarGroup-Forms',
                    'stickyToolGroupButton',
                    'toolbarGroup',
                    'linkButton',
                    'contextMenuPopup',
                    'continuousPageTransitionButton',
                    'pageTransitionHeader',
                    'defaultPageTransitionButton',
                    'layoutHeader',
                    'singleLayoutButton',
                    'doubleLayoutButton',
                    'coverLayoutButton',
                    'viewControlsButton',
                ],
                annotationUser: username,
                isAdminUser: true,
                fullAPI: true,
                disableLogs: false,
                useDownloader: false,
            },
            document.getElementById('pdf-viewer')
        ).then((instance) => {
            const { documentViewer } = instance.Core;

            const { Tools, PageRotation, Annotations, annotationManager, AnnotationHistoryManager, Document } =
                instance.Core;

            me.viewerHasLoaded = true;
            me.getView().upVM().set('viewerHasLoaded', true);
            me.documentViewer = documentViewer;
            me.annotationManager = annotationManager;
            me.pageRotation = PageRotation;
            me.annotations = Annotations;
            me.iframeDoc = instance.UI.iframeWindow.document;

            if (me.documentForLoad) {
                instance.UI.loadDocument(me.documentForLoad, {
                    customHeaders: {
                        'Cross-Origin-Opener-Policy': 'same-origin',
                    },
                    filename: me.currentDocument.get('name') + '.' + me.currentDocument.get('extension'),
                });
            }

            const tool = documentViewer.getTool('AnnotationCreateRubberStamp');

            const customStamps = [
                {
                    title: 'ORIGINAL',
                    font: 'SF Pro',
                    bold: true,
                },
                {
                    title: 'Reviewed',
                    subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
                    color: new Annotations.Color('#D65656'),
                },
            ];
            tool.setCustomStamps(customStamps);
            tool.setStandardStamps([
                'https://static.abraxa.com/images/stamps/ORIGINAL-1.png',
                'https://static.abraxa.com/images/stamps/ORIGINAL-2.png',
                'https://static.abraxa.com/images/stamps/ORIGINAL-3.png',
                'https://static.abraxa.com/images/stamps/COPYNON-NEGOTIABLE-1.png',
                'https://static.abraxa.com/images/stamps/COPY NONNEGOTIABLE-2.png',
                'https://static.abraxa.com/images/stamps/DRAFT.png',
                'https://static.abraxa.com/images/stamps/original.png',
                'https://static.abraxa.com/images/stamps/first-original.png',
                'https://static.abraxa.com/images/stamps/second-original.png',
                'https://static.abraxa.com/images/stamps/third-original.png',
                'https://static.abraxa.com/images/stamps/draft-copy-outlined.png',
                'https://static.abraxa.com/images/stamps/draft-copy.png',
            ]);

            instance.UI.setPrintQuality(2);
            instance.UI.disableElements(['toolbarGroup-Shapes']);
            instance.UI.disableElements(['toolbarGroup-Edit']);
            instance.UI.disableElements(['toolbarGroup-FillAndSign']);
            instance.UI.disableElements(['leftPanelButton']);
            instance.UI.disableFeatures([instance.UI.Feature.NotesPanel]);
            instance.UI.disableTools();
            instance.UI.enableTools([
                'AnnotationCreateFreeText',
                'AnnotationCreateTextHighlight',
                'AnnotationCreateRubberStamp',
                'AnnotationCreateStamp',
                'AnnotationCreateSignature',
            ]);

            instance.UI.setHeaderItems((header) => {
                header.unshift(
                    {
                        type: 'actionButton',
                        title: 'Rotate left',
                        img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - page manipulation - page rotation - counterclockwise - line</title><path class="cls-1" d="M22.39,11.17H20.72a5,5,0,0,0-4.17-4.93V8.67L12.39,5.33,16.55,2V4.56a6.66,6.66,0,0,1,5.84,6.61Zm-8,1s0,0,0,.05V20.5a1.5,1.5,0,0,1-1.5,1.5h-9a1.5,1.5,0,0,1-1.5-1.5V8.5A1.5,1.5,0,0,1,3.89,7H9.18a.71.71,0,0,1,.2,0l.07,0a1.07,1.07,0,0,1,.22.15l4.5,4.5a.86.86,0,0,1,.15.22.19.19,0,0,0,0,.07A1.29,1.29,0,0,1,14.38,12.2Zm-2,7.8V13H9.14a.75.75,0,0,1-.75-.75V9h-4V20Z"></path></svg>',
                        onClick: async () => {
                            const doc = documentViewer.getDocument();
                            doc.rotatePages([documentViewer.getCurrentPage()], -PageRotation.E_90);
                        },
                    },
                    {
                        type: 'actionButton',
                        title: 'Rotate right',
                        img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - page manipulation - page rotation - clockwise - line</title><path class="cls-1" d="M22,7.83,18.67,12,15.33,7.83h2.43a5,5,0,0,0-4.93-4.16V2a6.64,6.64,0,0,1,6.61,5.83ZM14,12.2s0,0,0,.05V20.5A1.5,1.5,0,0,1,12.5,22h-9A1.5,1.5,0,0,1,2,20.5V8.5A1.5,1.5,0,0,1,3.5,7H8.8a.65.65,0,0,1,.19,0l.07,0a.86.86,0,0,1,.22.15l4.5,4.5a.66.66,0,0,1,.15.22s0,.05,0,.07A.65.65,0,0,1,14,12.2ZM12,20V13H8.75A.76.76,0,0,1,8,12.25V9H4V20Z"></path></svg>',
                        onClick: async () => {
                            const doc = documentViewer.getDocument();
                            doc.rotatePages([documentViewer.getCurrentPage()], PageRotation.E_90);
                        },
                    }
                );
            });

            instance.UI.setHeaderItems((header) => {
                header.push({
                    type: 'actionButton',
                    title: 'Download',
                    img: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g></svg>',
                    onClick: async () => {
                        const doc = documentViewer.getDocument();
                        const xfdfString = await annotationManager.exportAnnotations();
                        const options = {
                            xfdfString,
                            flatten: true,
                        };
                        const data = await doc.getFileData(options);
                        const arr = new Uint8Array(data);
                        const blob = new Blob([arr], {
                            type: 'application/pdf',
                        });

                        function downloadFile(filePath, fileName) {
                            var link = document.createElement('a');
                            link.href = filePath;
                            link.download = fileName ? fileName : filePath.substr(filePath.lastIndexOf('/') + 1);
                            link.click();
                        }

                        const url = URL.createObjectURL(blob);
                        downloadFile(url, doc.type != 'image' ? doc.filename : null);
                    },
                });
            });

            instance.UI.setHeaderItems((header) => {
                header.push({
                    type: 'actionButton',
                    title: 'Print',
                    img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - print - line</title><path class="cls-1" d="M20,6H18V2H6V6H4A2,2,0,0,0,2,8v9a2,2,0,0,0,2,2H6v3H18V19h2a2,2,0,0,0,2-2V8A2,2,0,0,0,20,6ZM8,4h8V6H8Zm8,16H8V16h8Zm4-3H18V14H6v3H4V8H20Zm-4-7h2v2H16Zm-3,0h2v2H13Z"></path></svg>',
                    onClick: async () => {
                        // export annotations from the document
                        const doc = documentViewer.getDocument();

                        // fix error when doc is null
                        if (!doc) return;

                        if (doc.type !== 'pdf') {
                            instance.UI.print();
                            return;
                        }
                        const xfdfString = await annotationManager.exportAnnotations();
                        const options = {
                            xfdfString,
                            flatten: false,
                        };
                        const data = await doc.getFileData(options);
                        const arr = new Uint8Array(data);
                        const blob = new Blob([arr], {
                            type: 'application/pdf',
                        });
                        const docForPrint = await documentViewer.getDocument().getPDFDoc();
                        const pageCount = await documentViewer.getDocument().getPageCount();
                        await docForPrint.flattenAnnotations();
                        await annotationManager.deleteAnnotations(annotationManager.getAnnotationsList());
                        const zoomLevel = instance.UI.getZoomLevel();
                        instance.UI.printInBackground({
                            includeComments: false,
                            includeAnnotations: false,
                            maintainPageOrientation: true,
                            onProgress: function (pageNumber, htmlElement) {
                                if (pageCount === pageNumber) {
                                    documentViewer.loadDocument(blob, { extension: 'pdf' }).then(() => {
                                        const selectedDocument = me.getView().upVM().get('selectedDocument');
                                        selectedDocument.set('is_changed', false);
                                        instance.UI.setZoomLevel(zoomLevel);
                                    });
                                }
                            },
                        });
                    },
                });
            });

            instance.UI.setHeaderItems(function (header) {
                // Do not display more info fields for Inquiry/Estimates PDA
                if (
                    !(
                        me.getView().upVM().get('object_record') &&
                        me.getView().upVM().get('object_record').get('inquiry_id')
                    )
                ) {
                    header.push({
                        type: 'actionButton',
                        title: 'More info',
                        img: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  width="24" height="24" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><path class="cls-1" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" /></svg>',
                        onClick: async () => {
                            let showPanel = me.getView().upVM().get('showInfoPanel');

                            me.getView().upVM().set('showInfoPanel', true);
                        },
                    });
                }

                //delete button
                if (me.currentDocument && me.currentDocument.get('is_locked') && nonEditable === null) {
                    nonEditable = true;
                }
                if (!nonEditable) {
                    header.push({
                        type: 'actionButton',
                        title: 'Delete',
                        img: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>',
                        onClick: async () => {
                            const record = me.getView().upVM().get('selectedDocument'),
                                store = me.getView().upVM().get('selectedDocuments');
                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you want to delete this document?',
                                function (answer) {
                                    if (answer == 'yes') {
                                        store.remove(record);
                                        record.store.remove(record);
                                        if (
                                            Ext.ComponentQuery.query('[itemId=documentSections]') &&
                                            Ext.ComponentQuery.query('[itemId=documentSections]').length
                                        ) {
                                            Ext.ComponentQuery.query('[itemId=documentSections]')[0]
                                                .upVM()
                                                .set('refreshFolderCount', new Date());
                                        }
                                        store.sync({
                                            success: function () {
                                                Ext.toast('Record deleted.');
                                                if (store.count())
                                                    Ext.ComponentQuery.query('[cls~=document_dialog_list]')[0].select(
                                                        0
                                                    );
                                            },
                                        });

                                        if (record && record.getDocumentAbraxaModelPortcallAttachment) {
                                            const attachment = record.getDocumentAbraxaModelPortcallAttachment();
                                            attachment.erase();
                                        }

                                        if (record && record.getFolderFile) {
                                            const folderFile = record.getFolderFile();
                                            folderFile.erase();
                                        }
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
                                        separator: true,
                                    },
                                ]
                            );
                        },
                    });
                }
            });

            annotationManager.addEventListener('fieldChanged', (field, value) => {
                const selectedDocument = me.getView().upVM().get('selectedDocument');
                selectedDocument.set('is_changed', true);
            });

            documentViewer.addEventListener('documentLoaded', () => {
                Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(false);
                Ext.getCmp('pedal').hide();
                const selectedDocument = me.getView().upVM().get('selectedDocument');
                const iframeDoc = instance.UI.iframeWindow.document;

                iframeDoc.getElementById('app').classList.remove('a-readonly');
                if (selectedDocument && selectedDocument.get('is_locked'))
                    iframeDoc.getElementById('app').classList.add('a-readonly');

                if (selectedDocument.get('estimate')) {
                    documentViewer
                        .getDocument()
                        .getFileData()
                        .then((doc) => {
                            let size = doc.byteLength;
                            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                            var i = 0;
                            while (size >= 1024) {
                                size /= 1024;
                                ++i;
                            }
                            selectedDocument.set('size', size.toFixed(1) + ' ' + units[i]);
                        });
                }

                documentViewer.getAnnotationsLoadedPromise().then(() => {
                    const selectedDocument = me.getView().upVM().get('selectedDocument');
                    const iframeDoc = instance.UI.iframeWindow.document;
                    const zoomOverlay = iframeDoc.getElementById('app');
                    const fieldManager = annotationManager.getFieldManager();

                    iframeDoc.getElementById('app').classList.remove('a-readonly');
                    if (selectedDocument && selectedDocument.get('is_locked'))
                        iframeDoc.getElementById('app').classList.add('a-readonly');

                    me.lockDocument(selectedDocument);

                    let data = me.documentChanges,
                        fieldsWithCahnges = [];

                    if (
                        selectedDocument.get('document_type') == 'cargo' ||
                        selectedDocument.get('document_type') == 'operational'
                    ) {
                        Object.keys(data).forEach(function (key) {
                            let documentField = fieldManager.getField(key);

                            if (documentField && data[key] && documentField.getValue() !== data[key]) {
                                fieldsWithCahnges.push({
                                    field: documentField,
                                    newValue: data[key],
                                    oldValue: documentField.getValue(),
                                    element: documentField.name,
                                    title: documentField.tooltipName,
                                });
                            }
                        });

                        me.fieldsForChange = fieldsWithCahnges;

                        me.checkDocumentEligibleForUpdate();
                    }
                });
            });

            annotationManager.addEventListener('annotationChanged', (annotations, action, e) => {
                const selectedDocument = me.getView().upVM().get('selectedDocument');

                // if the annotation change occurs because of an import then
                // these are fields from inside the document

                if (!e.imported) {
                    selectedDocument.set('is_changed', true);
                }

                if (action === 'add') {
                } else if (action === 'modify') {
                } else if (action === 'delete') {
                }
            });
        });
    },

    checkDocumentEligibleForUpdate: function () {
        let me = this,
            fieldsForChange = this.fieldsForChange,
            document = this.getView().upVM().get('selectedDocument');

        if (document.get('status') == 'draft') {
            fieldsForChange.forEach(function (field) {
                let element = me.iframeDoc.getElementById(field.element);
                if (element) {
                    element.classList.add('has_changed');
                    Ext.getCmp('pedal').show();
                }
            });
        } else {
            fieldsForChange.forEach(function (field) {
                let element = me.iframeDoc.getElementById(field.element);
                if (element) {
                    element.classList.remove('has_changed');
                    element.classList.remove('needs_change');
                    Ext.getCmp('pedal').hide();
                }
            });
        }
    },

    loadDocument: function (data) {
        let me = this;
        if (me.viewerHasLoaded) {
            let instance = WebViewer.getInstance();
            instance.UI.loadDocument(data, {
                customHeaders: {
                    'Cross-Origin-Opener-Policy': 'same-origin',
                },
                filename: this.currentDocument.get('name') + '.' + this.currentDocument.get('extension'),
            });
            this.documentForLoad = null;
        } else {
            this.documentForLoad = data;
        }
    },

    lockDocument: function (selectedDocument) {
        const annotations = this.annotationManager.getAnnotationsList(),
            instance = WebViewer.getInstance(),
            iframeDoc = instance.UI.iframeWindow.document;

        if (
            (selectedDocument && selectedDocument.get('is_locked')) ||
            selectedDocument.get('nonEditable') ||
            this.getView().upVM().get('nonEditable')
        ) {
            this.annotationManager.enableReadOnlyMode();
            if (selectedDocument.get('is_locked') || this.getView().upVM().get('nonEditable'))
                iframeDoc.getElementById('app').classList.add('a-readonly');

            annotations.forEach((annot) => {
                if (annot instanceof this.annotations.WidgetAnnotation) {
                    annot.fieldFlags.set('ReadOnly', true);
                }
            });
        } else {
            this.annotationManager.disableReadOnlyMode();
            iframeDoc.getElementById('app').classList.remove('a-readonly');
            instance.UI.disableTools();
            instance.UI.enableTools([
                'AnnotationCreateFreeText',
                'AnnotationCreateTextHighlight',
                'AnnotationCreateRubberStamp',
                'AnnotationCreateStamp',
                'AnnotationCreateSignature',
            ]);
            annotations.forEach((annot) => {
                if (annot instanceof this.annotations.WidgetAnnotation) {
                    annot.fieldFlags.set('ReadOnly', false);
                }
            });
        }
    },

    checkPermission: function () {
        //skip permission check for now
        return true;
    },

    upload: function (files, el, fromPreview) {
        let me = el,
            vm = el.upVM(),
            fd = new FormData(),
            controller = this,
            object_record = vm.get('object_record'),
            section,
            totalSize = 0,
            unsupported = false,
            allowedMime = ['application/pdf', 'image/png', 'image/jpeg'],
            store = object_record.documents(),
            selectedDocuments = vm.get('selectedDocuments'),
            folders = object_record.folders();

        section = vm.get('selectedSection.selection');

        let defaultFolder = folders.findRecord('is_default', 1);
        if (!section && defaultFolder) {
            section = defaultFolder;
        }
        let object_id = 3,
            object_meta_id = object_record.get('id');

        fd.append('folder', section.get('id'));
        fd.append('object_id', object_id);
        fd.append('object_meta_id', object_meta_id);
        fd.append('model_name', object_record.get('model_name'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
            totalSize += files.item(i).size;
        }
        if (unsupported) {
            Ext.create('Ext.MessageBox', {
                ui: 'warning',
                title: 'Upload Cancelled',
                innerCls: 'a-bgr-white',
                message: 'Unsupported file format. <br /> Allowed types are: PDF, JPEG, PNG</br>',
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
            controller.clearFileUpload(el.id);
            Ext.get('dropped-container').removeCls('a-dropped');
            Ext.getCmp('uploadProgress').hide();
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
            controller.clearFileUpload(el.id);
            Ext.get('dropped-container').removeCls('a-dropped');
            Ext.getCmp('uploadProgress').hide();
            return;
        }
        Ext.getCmp('uploadProgress').show();
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'documents/upload',
            rawData: fd,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                'Content-Type': null,
            },
            success: function (response) {
                let responseDocuments = Ext.decode(response.responseText).data;

                Ext.each(responseDocuments, function (doc) {
                    var model = Ext.create('Abraxa.model.document.Document', doc),
                        folder_file = new Abraxa.model.adocs.DocumentFolderFile(Object.assign({}, doc.folder_file));

                    model.setFolderFile(folder_file);
                    model.set('folder_id', section.get('id'));
                    section.documents().add(doc.folder_file);
                    store.add(model);
                    if (selectedDocuments) selectedDocuments.add(model);
                });
                store.commitChanges();
                me.upVM().set('refreshFolderCount', new Date());

                Ext.get('dropped-container').removeCls('a-dropped');
                Ext.getCmp('uploadProgress').hide();
                Ext.toast('Record updated', 2000);
                if (me.up('dialog') && !fromPreview) me.up('dialog').destroy();

                if (fromPreview) {
                    me.up('dialog').down('list[cls~=document_dialog_list]').select(store.last());
                }
            },
            failure: function failure(response) {
                Ext.get('dropped-container').removeCls('a-dropped');
            },
        });
    },
    clearFileUpload(id) {
        // get the file upload element
        fileField = document.getElementById(id);
        // get the file upload parent element
        parentNod = fileField.parentNode;
        // create new element
        tmpForm = document.createElement('form');
        parentNod.replaceChild(tmpForm, fileField);
        tmpForm.appendChild(fileField);
        tmpForm.reset();
        parentNod.replaceChild(fileField, tmpForm);
    },
    generateCargoDocs(cmp) {
        let vm = Ext.ComponentQuery.query(
                Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
            )[0].lookupViewModel(),
            object_record = cmp.upVM().get('object_record'),
            cargoSelection = cmp.upVM().get('documentsSelectedCargoes.selection'),
            document_types = cmp.upVM().get('selectedDocumentTypes.selection'),
            cargoes = [],
            documents = [],
            model_name;

        Ext.Array.each(cargoSelection, function (cargo) {
            model_name = cargo.get('model_name');
            cargoes.push(cargo.get('id'));
        });

        Ext.Array.each(document_types, function (blank) {
            let data = blank.getData();
            data.model_name = model_name;
            data.ids = cargoes;
            data.document_type = data.category.type;
            documents.push(data);
        });

        const requestObj = {
            data: documents,
        };

        const section = object_record.folders().findRecord('is_default', 1);
        if (section && section.get('id')) {
            requestObj.document_folder_id = section.get('id');
        }

        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'documents/generate',
            method: 'POST',
            jsonData: requestObj,
            success: function (response, opts) {
                let store = object_record.documents(),
                    selectedDocuments = new Ext.data.Store();

                Ext.each(Ext.decode(response.responseText), function (document) {
                    let model = Ext.create('Abraxa.model.document.Document', document),
                        folder_file = new Abraxa.model.adocs.DocumentFolderFile(
                            Object.assign({}, document.folder_file)
                        );

                    model.setFolderFile(folder_file);
                    model.set('folder_id', section.get('id'));
                    section.documents().add(document.folder_file);
                    store.add(model);
                    if (selectedDocuments) selectedDocuments.add(model);
                });
                vm.set('refreshFolderCount', new Date());

                let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                    viewModel: {
                        data: {
                            object_record: object_record,
                            documentForSelect: store.last(),
                            selectedDocuments: selectedDocuments,
                            needsPanel: false,
                            nonEditable: false,
                            members: cmp.upVM().get('members'),
                            isReadOnly: false,
                        },
                        formulas: {
                            selectedDocument: {
                                bind: {
                                    bindTo: '{documentsList.selection}',
                                },
                                get: function (record) {
                                    return record;
                                },
                            },
                            loadDocument: {
                                bind: {
                                    bindTo: '{selectedDocument.id}',
                                    // deep: true
                                },
                                get: function (id) {
                                    let record = this.get('selectedDocument');
                                    if (record) {
                                        var me = this;
                                        let file = record;

                                        me.getView()
                                            .getController()
                                            .loadDocument(Env.ApiEndpoint + 'get_pdf/' + file.get('id'));
                                    }
                                },
                            },
                        },
                    },
                });
                dialog.show();
                cmp.up('dialog').hide();
                mixpanel.track('Created a cargo document');
            },
        });
    },

    generateOperationalDocument(cmp) {
        let vm = Ext.ComponentQuery.query(
                Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
            )[0].lookupViewModel(),
            object_record = cmp.upVM().get('object_record'),
            document_types = cmp.upVM().get('operationalTemplate.selection'),
            documents = [];

        Ext.Array.each(document_types, function (blank) {
            let data = blank.getData();
            data.model_name = object_record.get('model_name');
            data.id = object_record.get('id');
            data.document_type = data.category.type;
            documents.push(data);
        });

        const requestObj = {
            data: documents,
        };

        const section = object_record.folders().findRecord('is_default', 1);

        if (section && section.get('id')) {
            requestObj.document_folder_id = section.get('id');
        }

        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'documents/generate',
            method: 'POST',
            jsonData: requestObj,
            success: function (response, opts) {
                let store = object_record.documents(),
                    selectedDocuments = new Ext.data.Store();

                Ext.each(Ext.decode(response.responseText), function (document) {
                    let model = Ext.create('Abraxa.model.document.Document', document),
                        folder_file = new Abraxa.model.adocs.DocumentFolderFile(
                            Object.assign({}, document.folder_file)
                        );

                    model.setFolderFile(folder_file);
                    model.set('folder_id', section.get('id'));
                    section.documents().add(document.folder_file);
                    store.add(model);
                    if (selectedDocuments) selectedDocuments.add(model);
                });
                vm.set('refreshFolderCount', new Date());
                let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                    viewModel: {
                        data: {
                            object_record: object_record,
                            documentForSelect: store.last(),
                            selectedDocuments: selectedDocuments,
                            needsPanel: false,
                            members: cmp.upVM().get('members'),
                            isReadOnly: false,
                        },
                        formulas: {
                            selectedDocument: {
                                bind: {
                                    bindTo: '{documentsList.selection}',
                                },
                                get: function (record) {
                                    return record;
                                },
                            },
                            loadDocument: {
                                bind: {
                                    bindTo: '{selectedDocument.id}',
                                },
                                get: function (id) {
                                    let record = this.get('selectedDocument');
                                    if (record) {
                                        var me = this;
                                        let file = record,
                                            pdf = record.get('pdf') ? true : false;

                                        me.getView()
                                            .getController()
                                            .loadDocument(Env.ApiEndpoint + 'get_pdf/' + record.get('id'));
                                    }
                                },
                            },
                        },
                    },
                });
                dialog.show();
                cmp.up('dialog').destroy();
                mixpanel.track('Created a cargo document');
            },
        });
    },
    generateSofDocument(cmp) {
        let vm = Ext.ComponentQuery.query(
                Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
            )[0].lookupViewModel(),
            object_record = cmp.upVM().get('object_record'),
            document_type = 'sof',
            operationalTemplate = cmp.upVM().get('operationalTemplate.selection'),
            document_name = cmp.upVM().get('documentName.value'),
            documentStore = cmp.upVM().get('object_record.documents'),
            formValues = cmp.up('dialog').down('formpanel').getValues(),
            documentDate = null;

        const section = object_record.folders().findRecord('is_default', 1);
        if (formValues.document_date) {
            documentDate = Abraxa.getApplication()
                .getController('AbraxaController')
                .parseMomentDate(formValues.document_date, 'MM/DD/YYYY');
        }

        const requestObj = {
            document_type: document_type,
            object_meta_id: object_record.get('id'),
            document_name: document_name,
            document_date: documentDate,
            place: formValues.place,
            event_group: formValues.event_group,
            include_bunkers: formValues.include_bunkers,
            include_cargoes: formValues.include_cargoes,
            time_format: formValues.time_format,
            company_id: operationalTemplate.get('company_id'),
        };

        if (section && section.get('id')) {
            requestObj.document_folder_id = section.get('id');
        }

        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'documents/generate_sof',
            method: 'POST',
            jsonData: requestObj,
            success: function (response, opts) {
                let selectedDocuments = new Ext.data.Store();

                Ext.each(Ext.decode(response.responseText), function (document) {
                    let model = Ext.create('Abraxa.model.document.Document', document),
                        folder_file = new Abraxa.model.adocs.DocumentFolderFile(
                            Object.assign({}, document.folder_file)
                        );

                    model.setFolderFile(folder_file);
                    model.set('folder_id', section.get('id'));
                    section.documents().add(document.folder_file);
                    documentStore.add(model);
                    if (selectedDocuments) selectedDocuments.add(model);
                });
                vm.set('refreshFolderCount', new Date());

                let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                    viewModel: {
                        data: {
                            object_record: object_record,
                            documentForSelect: documentStore.last(),
                            selectedDocuments: selectedDocuments,
                            needsPanel: false,
                            nonEditable: false,
                            members: cmp.upVM().get('members'),
                            isReadOnly: false,
                        },
                        formulas: {
                            selectedDocument: {
                                bind: {
                                    bindTo: '{documentsList.selection}',
                                },
                                get: function (record) {
                                    return record;
                                },
                            },
                            loadDocument: {
                                bind: {
                                    bindTo: '{selectedDocument.id}',
                                },
                                get: function (id) {
                                    let record = this.get('selectedDocument');
                                    if (record) {
                                        var me = this;

                                        me.getView()
                                            .getController()
                                            .loadDocument(Env.ApiEndpoint + 'get_pdf/' + record.get('id'));
                                    }
                                },
                            },
                        },
                    },
                });
                dialog.show();
                cmp.up('dialog').destroy();
                mixpanel.track('Created a SOF document');
            },
        });
    },

    generateFinancialDocument(cmp) {
        const controller = this;
        const portcallMainVM = Ext.ComponentQuery.query(
            Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
        )[0].lookupViewModel();

        const docFormVM = cmp.upVM();
        const object_record = docFormVM.get('object_record');
        const document_data = docFormVM.get('document_data');
        const selectedDocumentType = docFormVM.get('selectedDocumentType.selection');
        const disbursement = docFormVM.get('selectedDisbursement.selection');
        let record_items = cmp.up('dialog').down('[cls~=document_items_grid]').getSelections();
        const items = [];
        let form = cmp.up('dialog').down('formpanel');
        const foldersStore = cmp.upVM().get('object_record').folders();

        const defaultFolder = foldersStore.findRecord('is_default', 1);

        let section;

        if (defaultFolder) {
            section = defaultFolder;
        } else if (form && form.getValues().folder_id) {
            section = foldersStore.findRecord('id', form.getValues().folder_id);
        }

        if (section && section.get('id')) {
            document_data['document_folder_id'] = section.get('id');
        }

        // If the category of the document is "fda" include all disbursment items
        let category_system_extension = selectedDocumentType.get('category').system_extension;
        let disbursment_item_store = cmp.up('dialog').down('[cls~=document_items_grid]').getStore();
        let disbursment_items = disbursment_item_store.getData().items;

        if (category_system_extension === 'fda') {
            record_items = disbursment_items;
        }

        if (document_data['due_date']) {
            document_data['due_date'] = Abraxa.utils.Functions.formatStringToDate(
                document_data['due_date'],
                AbraxaConstants.formatters.date.yearMonthDayHyphen
            );
        }

        if (document_data['proforma_date']) {
            document_data['proforma_date'] = Abraxa.utils.Functions.formatStringToDate(
                document_data['proforma_date'],
                AbraxaConstants.formatters.date.yearMonthDayHyphen
            );
        }

        if (selectedDocumentType) {
            document_data['system_extension'] = selectedDocumentType.get('category').system_extension;
            document_data['extension'] = 'pdf';
        }

        if (record_items.length) {
            Ext.each(record_items, function (item) {
                let amount = 0;
                if (disbursement) {
                    amount = item.get(disbursement.get('type') + '_final_price');
                }
                items.push({
                    item_id: item.get('default_expense_item_id'),
                    item_disbursement_item: item.get('id'),
                    item_disbursement_item_category_name: Abraxa.utils.Functions.getNestedProperty(
                        item,
                        'data.default_expense_item.category.name'
                    ),
                    item_name: item.get('default_expense_item_name'),
                    item_amount: amount,
                    item_pda_amount: item.get('pda_final_price'),
                    item_dda_amount: item.get('dda_final_price'),
                    item_remark: item.get('comment'),
                });
            });
        }

        document_data['disbursement_items'] = JSON.stringify(items);
        document_data['ownerable_id'] = object_record.get('id');
        document_data['ownerable_type'] = object_record.get('model_name');
        document_data['disbursement_type'] = disbursement ? disbursement.get('type') : null;
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'documents/generate_financial',
            method: 'POST',
            jsonData: document_data,
            success: function (response, opts) {
                let store = object_record.documents(),
                    selectedDocuments = new Ext.data.Store();

                Ext.each(Ext.decode(response.responseText), function (document) {
                    let model = Ext.create('Abraxa.model.document.Document', document),
                        folder_file = new Abraxa.model.adocs.DocumentFolderFile(
                            Object.assign({}, document.folder_file)
                        );

                    model.setFolderFile(folder_file);
                    model.set('folder_id', section.get('id'));
                    section.documents().add(document.folder_file);
                    store.add(model);
                    if (selectedDocuments) selectedDocuments.add(model);
                });
                portcallMainVM.set('refreshFolderCount', new Date());
                let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                    viewModel: {
                        data: {
                            documentForSelect: store.last(),
                            selectedDocuments: selectedDocuments,
                            needsPanel: false,
                            nonEditable: false,
                            members: docFormVM.get('members'),
                            isReadOnly: false,
                        },
                        formulas: {
                            selectedDocument: {
                                bind: {
                                    bindTo: '{documentsList.selection}',
                                },
                                get: function (record) {
                                    return record;
                                },
                            },
                            loadDocument: {
                                bind: {
                                    bindTo: '{selectedDocument.id}',
                                },
                                get: function (id) {
                                    let record = this.get('selectedDocument');
                                    if (record) {
                                        var me = this;

                                        me.getView()
                                            .getController()
                                            .loadDocument(Env.ApiEndpoint + 'get_pdf/' + record.get('id'));
                                    }
                                },
                            },
                        },
                    },
                });
                dialog.show();
                cmp.up('dialog').destroy();
                object_record.set('updated_at', new Date());
                mixpanel.track('Created a financial document');
            },
        });
    },
    generateFinancialPdfDocument: function (cmp) {
        let expense = cmp.upVM().get('expense'),
            expenses = cmp.upVM().get('expenses'),
            object_record = cmp.upVM().get('object_record'),
            record_items = cmp.up('dialog').down('[cls~=document_items_grid]').getSelections(),
            selectedDocumment = cmp.upVM().get('selectedDocumentType.selection'),
            fromSupply = cmp.upVM().get('fromSupply'),
            vm = cmp.upVM(),
            selectedAccount;
        if (fromSupply) {
            let accounts = cmp.upVM().get('accounts');
            selectedAccount = accounts.getById(expense.get('account_id'));
        } else {
            selectedAccount = cmp.upVM().get('billingParty.selection');
        }
        let selectedDisbursement = cmp.upVM().get('selectedDisbursement'),
            items = [],
            document_data = cmp.upVM().get('document_data');

        if (!record_items || !record_items.length) {
            return AbraxaFunctions.alertNoServicesForInvoiceSelected();
        }

        Ext.each(record_items, function (item) {
            let amount = 0;
            if (item.get('sda_final_price')) {
                amount = item.get('sda_final_price');
            } else if (item.get('fda_final_price')) {
                amount = item.get('fda_final_price');
            } else if (item.get('dda_final_price')) {
                amount = item.get('dda_final_price');
            } else if (item.get('pda_final_price')) {
                amount = item.get('pda_final_price');
            }
            items.push({
                item_id: item.get('id'),
                item_disbursement_item: item.get('id'),
                item_disbursement_item_category_name: Abraxa.utils.Functions.getNestedProperty(
                    item,
                    'data.default_expense_item.category.name'
                ),
                item_name: item.get('default_expense_item_name'),
                item_amount: amount,
                item_pda_amount: item.get('pda_final_price'),
                item_dda_amount: item.get('dda_final_price'),
                item_remark: item.get('comment'),
            });
        });

        document_data.pdf = true;
        document_data.account_id = selectedAccount.get('id');
        document_data.isVoucher = true;
        document_data.disbursement_id = selectedDisbursement ? selectedDisbursement.get('id') : null;
        document_data.extension = selectedDocumment.get('category').system_extension;
        document_data.system_extension = selectedDocumment.get('category').system_extension;
        document_data.documentable_id = expense ? expense.get('id') : null;
        document_data.documentable_type = expense ? expense.get('model_name') : null;
        document_data.document_type = 'finance';
        document_data.ownerable_id = object_record.get('id');
        document_data.ownerable_type = object_record.get('model_name');

        const section = object_record.folders().findRecord('is_default', 1);
        if (section && section.get('id')) {
            document_data.document_folder_id = section.get('id');
        }

        document_data['disbursement_items'] = JSON.stringify(items);
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'documents/generate_financial',
            method: 'POST',
            jsonData: document_data,
            success: function (response, opts) {
                let vouchersStore = vm.get('vouchers'),
                    first;

                Ext.each(Ext.decode(response.responseText), function (response, index) {
                    // add document in documents
                    let document = Ext.create('Abraxa.model.document.Document', response[0]),
                        folder_file = new Abraxa.model.adocs.DocumentFolderFile(
                            Object.assign({}, response[0].folder_file)
                        );

                    document.setFolderFile(folder_file);
                    document.set('folder_id', section.get('id'));
                    section.documents().add(response[0].folder_file);
                    object_record.documents().add(document);
                    //end add document
                    //start add vouchers
                    if (response.vouchers) {
                        Ext.each(response.vouchers, function (voucherItem, index) {
                            let model = Ext.create('Abraxa.model.disbursement.Voucher', voucherItem),
                                voucher = new Abraxa.model.document.Document(Object.assign({}, voucherItem.document));
                            model.setDocument(voucher);
                            vouchersStore.add(model);
                            let expenseItem = expenses.getById(model.get('expense_id'));
                            expenseItem.vouchers().add(model);
                            expenseItem.vouchers().commitChanges();
                            if (index === 0) {
                                first = model;
                            }
                        });
                    }
                });
                let dialog = Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                    viewModel: {
                        parent: Ext.ComponentQuery.query(
                            Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type +
                                'portcall\\.main'
                        )[0].upVM(),
                        data: {
                            selectVoucher: first,
                            account_id: selectedAccount.get('id'),
                            accounts: vm.get('accounts'),
                            nonEditable: vm.get('nonEditable'),
                        },
                        formulas: {
                            selectedVoucher: {
                                bind: {
                                    bindTo: '{vouchersList.selection}',
                                    deep: true,
                                },
                                get: function (record) {
                                    if (record) {
                                        return record;
                                    }
                                },
                            },
                            loadDocument: {
                                bind: {
                                    bindTo: '{vouchersList.selection.id}',
                                    // deep: true
                                },
                                get: function (id) {
                                    let record = this.get('vouchersList.selection');
                                    if (record) {
                                        var me = this;
                                        let file = record.getDocument();
                                        me.getView()
                                            .getController()
                                            .loadDocument(Env.ApiEndpoint + 'get_pdf/' + file.get('id'));
                                        return record;
                                    }
                                },
                            },
                            canEditPerm: {
                                bind: {
                                    bindTo: '{disbursementRecord}',
                                    deep: true,
                                },
                                get: function (record) {
                                    if (record) {
                                        let objectPermissions = this.get('objectPermissions'),
                                            nonEditable = this.get('nonEditable'),
                                            permissionsStore = this.get('userPermissions'),
                                            result = false;
                                        if (record.get('is_locked')) {
                                            return false;
                                        } else {
                                            if (!nonEditable) {
                                                if (permissionsStore && Object.keys(permissionsStore).length > 0) {
                                                    let record = permissionsStore['disbursements'];
                                                    if (record && record.edit) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }
                                            } else {
                                                if (objectPermissions && objectPermissions['disbursements']) {
                                                    if (objectPermissions['disbursements'].can_edit) {
                                                        result = true;
                                                        if (
                                                            permissionsStore &&
                                                            Object.keys(permissionsStore).length > 0
                                                        ) {
                                                            let record = permissionsStore['disbursements'];
                                                            if (record && !record.edit) {
                                                                result = false;
                                                            }
                                                        }
                                                    }
                                                }
                                                return result;
                                            }
                                        }
                                    } else {
                                        return false;
                                    }
                                },
                            },
                            dragListeners: {
                                bind: {
                                    bindTo: '{userPermissions}',
                                    deeP: true,
                                },
                                get: function (store) {
                                    if (store && Object.keys(store).length > 0) {
                                        let record = store['portcallInvoiceCreate'];
                                        if (record && record.edit) {
                                            return {
                                                element: 'element',
                                                drop: 'onDrop',
                                                dragleave: 'onDragLeaveListItem',
                                                dragover: 'onDragOverListItem',
                                            };
                                        } else {
                                            return {};
                                        }
                                    } else {
                                        return {};
                                    }
                                },
                            },
                            nonEditableForSharing: {
                                bind: {
                                    bindTo: '{member}',
                                    deep: true,
                                },
                                get: function (member) {
                                    if (member && member.get('role') == 'can edit') {
                                        this.set('nonEditable', false);
                                    }
                                },
                            },
                        },
                    },
                });
                dialog.show();
                cmp.up('dialog').hide();
                object_record.set('updated_at', new Date());
            },
            failure: function (response, opts) {
                const dialog = cmp.up('dialog');
                if (dialog) {
                    dialog.setMasked(false);
                }
            },
        });
    },
    generateStowagePlanDocument(cmp) {
        let vm = Ext.ComponentQuery.query(
                Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
            )[0].lookupViewModel(),
            object_record = cmp.upVM().get('object_record'),
            document_type = 'operational',
            document_subtype = 'stowage_plan',
            operationalTemplate = cmp.upVM().get('operationalTemplate.selection'),
            document_name = cmp.upVM().get('documentName.value'),
            documentStore = cmp.upVM().get('object_record.documents'),
            formValues = cmp.up('dialog').down('formpanel').getValues(),
            cargoStore = cmp.upVM().get('cargoHoldsStore'),
            number_of_holds = formValues.number_of_holds,
            cargoData = Ext.encode(Ext.pluck(cargoStore.data.items, 'data').reverse());

        const requestObj = {
            document_type: document_type,
            document_subtype: document_subtype,
            object_meta_id: object_record.get('id'),
            document_name: document_name,
            company_id: operationalTemplate.get('company_id'),
            template: operationalTemplate.getData(),
            cargoes: cargoData,
            number_of_holds: number_of_holds,
            template_slug: operationalTemplate.get('slug') + number_of_holds,
        };

        const section = object_record.folders().findRecord('is_default', 1);

        if (section && section.get('id')) {
            requestObj.document_folder_id = section.get('id');
        }

        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'documents/generate-stowage-plan',
            method: 'POST',
            jsonData: requestObj,
            success: function (response, opts) {
                let selectedDocuments = new Ext.data.Store();

                Ext.each(Ext.decode(response.responseText), function (document) {
                    let model = Ext.create('Abraxa.model.document.Document', document),
                        folder_file = new Abraxa.model.adocs.DocumentFolderFile(
                            Object.assign({}, document.folder_file)
                        );

                    model.setFolderFile(folder_file);
                    model.set('folder_id', section.get('id'));
                    section.documents().add(document.folder_file);
                    documentStore.add(model);
                    if (selectedDocuments) selectedDocuments.add(model);
                });
                vm.set('refreshFolderCount', new Date());

                let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                    viewModel: {
                        data: {
                            object_record: object_record,
                            documentForSelect: documentStore.last(),
                            selectedDocuments: selectedDocuments,
                            needsPanel: false,
                            nonEditable: false,
                            members: cmp.upVM().get('members'),
                            isReadOnly: false,
                        },
                        formulas: {
                            selectedDocument: {
                                bind: {
                                    bindTo: '{documentsList.selection}',
                                },
                                get: function (record) {
                                    return record;
                                },
                            },
                            loadDocument: {
                                bind: {
                                    bindTo: '{selectedDocument.id}',
                                    // deep: true
                                },
                                get: function (id) {
                                    let record = this.get('selectedDocument');
                                    if (record) {
                                        var me = this;
                                        let file = record,
                                            pdf = record.get('pdf') ? true : false;

                                        me.getView()
                                            .getController()
                                            .loadDocument(Env.ApiEndpoint + 'get_pdf/' + record.get('id'));
                                    }
                                },
                            },
                        },
                    },
                });
                dialog.show();
                cmp.up('dialog').destroy();
                mixpanel.track('Created a SOF document');
            },
        });
    },
});
