Ext.define('Abraxa.view.attachments.AttachmentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.attachment.controller',
    listen: {
        component: {
            'list[cls~=attachments_list]': {
                select: 'updateSelection',
            },
            '#pdf-attachment-viewer': {
                painted: 'loadViewer',
                destroy: 'destroyViewer',
            },
        },
    },
    documentForLoad: null,
    viewerHasLoaded: false,

    updateSelection(list, selection) {
        if (selection && selection.get('id'))
            this.loadDocument(Env.ApiEndpoint + 'get_pdf/' + selection.getDocument().get('id'));
    },

    destroyViewer(list, selection) {
        this.viewerHasLoaded = false;
    },

    loadDocument: function (data) {
        let me = this;
        if (me.viewerHasLoaded) {
            let instance = WebViewer.getInstance();
            instance.UI.loadDocument(data, {
                customHeaders: {
                    Authorization: 'Basic YWxhZGRpbjpvcGVuc2VzYW1l',
                },
            });
            // instance.UI.loadDocument(data.blob, {
            //     filename: data.name
            // });
            this.documentForLoad = null;
        } else {
            this.documentForLoad = data;
        }
    },

    loadViewer: function () {
        let me = this,
            username = Ext.getCmp('main-viewport').upVM().get('currentUser.full_name');

        if (this.viewerHasLoaded) return;
        WebViewer.default(
            {
                path: '/public/webviewer/',
                licenseKey:
                    'Abraxa Group Ltd (abraxa.com):OEM:Abraxa::B+:AMS(20240616):61DCB4C3076A84F3FB313BC9B263192E4E6F4FA156DD73040486F424E718C634D2B6F5C7',
                css: '/src/css/webviewer.css',
                // extension: 'docx',
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
                fullAPI: true,
                disableLogs: true,
                useDownloader: false,
            },
            document.getElementById('pdf-attachment-viewer')
        ).then((instance) => {
            const { documentViewer } = instance.Core;

            const { Tools, PageRotation, Annotations, annotationManager, AnnotationHistoryManager, Document } =
                instance.Core;
            me.viewerHasLoaded = true;
            me.documentViewer = documentViewer;
            me.annotManager = annotationManager;
            me.pageRotation = PageRotation;

            // var FitMode = instance.FitMode;
            // instance.setFitMode(instance.FitMode.FitWidth);

            if (me.documentForLoad) {
                instance.UI.loadDocument(me.documentForLoad, {});
            }

            const tool = documentViewer.getTool('AnnotationCreateRubberStamp');

            const customStamps = [
                {
                    title: 'ORIGINAL',
                    font: 'SF Pro',
                    bold: true,
                    // subtitle: "[By $currentUser at] h:mm:ss a, MMMM D, YYYY"
                },
                {
                    title: 'Reviewed',
                    subtitle: '[By $currentUser at] h:mm:ss a, MMMM D, YYYY',
                    color: new Annotations.Color('#D65656'),
                },
            ];
            tool.setCustomStamps(customStamps);
            tool.setStandardStamps(['Approved', 'AsIs', 'https://static.abraxa.com/images/logo.png']);
            instance.UI.setPrintQuality(2);
            instance.UI.disableElements(['toolbarGroup-Shapes']);
            instance.UI.disableElements(['toolbarGroup-Edit']);
            instance.UI.disableElements(['toolbarGroup-FillAndSign']);
            instance.UI.disableElements(['leftPanelButton']);
            instance.UI.disableFeatures([instance.UI.Feature.NotesPanel]);
            instance.UI.disableTools();
            instance.UI.enableTools([
                'AnnotationCreateFreeText',
                // 'AnnotationCreateFreeText2',
                // 'AnnotationCreateFreeText3',
                'AnnotationCreateTextHighlight',
                // 'AnnotationCreateTextHighlight2',
                // 'AnnotationCreateTextHighlight3',
                // 'AnnotationCreateTextHighlight4',
                'AnnotationCreateRubberStamp',
                'AnnotationCreateStamp',
                'AnnotationCreateSignature',
            ]);
            instance.Core.annotationManager.enableReadOnlyMode();

            // if (Ext.ComponentQuery.query('[cls~=collapsible_test]')[0].getCollapsed())
            //     Ext.ComponentQuery.query('[cls~=collapsible_test]')[0].expand();

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

            // instance.UI.setHeaderItems(function (header) {
            //     // header.getHeader('toolbarGroup-Annotate').push({
            //     //     type: 'toolGroupButton',
            //     //     toolGroup: 'lineTools',
            //     //     dataElement: 'lineToolGroupButton',
            //     //     title: 'annotation.line',
            //     // });
            //     // header.getHeader('toolbarGroup-Shapes').delete(6);
            //     header.getHeader('default').push({
            //         type: 'toolGroupButton',
            //         toolGroup: 'lineTools',
            //         dataElement: 'lineToolGroupButton',
            //         title: 'annotation.line',
            //     });
            // });

            instance.UI.setHeaderItems((header) => {
                header.push({
                    type: 'actionButton',
                    title: 'Download RAW',
                    img: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g></svg>',
                    onClick: async () => {
                        // const getFieldNameAndValue = (field) => {
                        //     // Do something with data

                        // }

                        // const fieldManager = annotationManager.getFieldManager();
                        // fieldManager.forEachField(function (field) {

                        // });

                        // // instance.UI.downloadPdf({
                        // //     includeAnnotations: true,
                        // //     flatten: true,
                        // // });
                        // return;

                        // Annotations.forEach(function (annot) {
                        //     if (annot instanceof Annotations.WidgetAnnotation) {
                        //         annot.fieldFlags.set('ReadOnly', true);
                        //     }
                        // });

                        // instance.UI.downloadPdf({
                        //     includeAnnotations: true,
                        //     flatten: true,
                        // });
                        // return;

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

                        const downloadFile = (blob, fileName) => {
                            const link = document.createElement('a');
                            // create a blobURI pointing to our Blob
                            link.href = URL.createObjectURL(blob);
                            link.download = fileName;
                            // some browser needs the anchor to be in the doc
                            document.body.append(link);
                            link.click();
                            link.remove();
                            // in case the Blob uses a lot of memory
                            setTimeout(() => URL.revokeObjectURL(link.href), 7000);
                        };

                        downloadFile(blob, doc.filename);

                        // const url = URL.createObjectURL(blob);
                        // window.saveAs(blob, doc.filename);
                    },
                });
            });

            instance.UI.setHeaderItems((header) => {
                header.push({
                    type: 'actionButton',
                    title: 'Print',
                    img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - print - line</title><path class="cls-1" d="M20,6H18V2H6V6H4A2,2,0,0,0,2,8v9a2,2,0,0,0,2,2H6v3H18V19h2a2,2,0,0,0,2-2V8A2,2,0,0,0,20,6ZM8,4h8V6H8Zm8,16H8V16h8Zm4-3H18V14H6v3H4V8H20Zm-4-7h2v2H16Zm-3,0h2v2H13Z"></path></svg>',
                    onClick: async () => {
                        instance.UI.print();
                    },
                });
            });

            instance.UI.setHeaderItems(function (header) {
                if (!me.getView().upVM().get('nonEditable')) {
                    header.push({
                        type: 'actionButton',
                        title: 'Delete',
                        img: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>',
                        onClick: async () => {
                            var record = me.getView().upVM().get('selectedAttachment'),
                                attachmentsStore = me.getView().upVM().get('attachments');

                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you want to delete this attachment?',
                                function (answer) {
                                    if (answer == 'yes') {
                                        let ids = [];
                                        attachmentsStore.remove(record);
                                        ids.push(record.get('id'));
                                        me.deleteFiles(ids, record);
                                        Ext.toast('Record updated', 1000);
                                        if (attachmentsStore.count())
                                            Ext.ComponentQuery.query('[cls~=attachments_list]')[0].select(0);
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

            // annotationManager.on('fieldChanged', (field, value) => {});
            documentViewer.addEventListener('documentLoaded', () => {
                Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(false);

                annotationManager.importAnnotations(
                    '<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields /><annots /><pages><defmtx matrix="1,0,0,-1,0,841.89" /></pages></xfdf>'
                );
                // instance.setZoomLevel('100%');
                // instance.setFitMode(instance.FitMode.FitWidth);
                documentViewer.getAnnotationsLoadedPromise().then(() => {
                    // let portcall = me.getView().upVM().get('object_record'),
                    //     cargo = portcall.cargoes().first();
                    // const fieldManager = annotationManager.getFieldManager();
                    // const field = fieldManager.getField('description_of_goods');
                    // if (field)
                    //     field.setValue(cargo.get('description_of_goods'));
                });
            });

            // documentViewer.on('annotationsLoaded', () => {
            //     const annots = annotationManager.getAnnotationsList();

            //     // remove annotations
            //     annotationManager.deleteAnnotations(annots);
            // });

            annotationManager.addEventListener('annotationChanged', (annotations, action, e) => {
                // if the annotation change occurs because of an import then
                // these are fields from inside the document
                // annotations.forEach((annot) => {
                //     if (annot instanceof Annotations.WidgetAnnotation) {
                //         annot.fieldFlags.set('ReadOnly', true);
                //     }
                // });
            });

            // Annotations.WidgetAnnotation.getCustomStyles = widget => {
            //     if (widget instanceof Annotations.TextWidgetAnnotation) {
            //
            //         // can check widget properties
            //         if (widget.fieldName === 'f1-1') {
            //             return {
            //                 'background-color': 'rgba(0, 120, 215, 0.06)'
            //             };
            //         }
            //         return {
            //             'background-color': 'rgba(0, 120, 215, 0.06)',
            //             'border-radius': '0',
            //             'border': '1px dashed rgba(77, 144, 254, 0.75)'
            //             // color: 'brown'
            //         };
            //     } else if (widget instanceof Annotations.PushButtonWidgetAnnotation) {
            //         return {
            //             'background-color': 'black',
            //             color: 'white'
            //         };
            //     } else if (widget instanceof Annotations.CheckButtonWidgetAnnotation) {
            //         return {
            //             'background-color': 'lightgray',
            //             opacity: 0.8
            //         };

            //     } else if (widget instanceof Annotations.RadioButtonWidgetAnnotation) {
            //         return {
            //             'background-color': 'lightgray !important',
            //             opacity: 0.8
            //         };
            //     }
            // };
        });
    },

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        Ext.get('dropped-container-attachments').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('dropped-container-attachments').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('dropped-container-attachments').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = this.getView().upVM().get('object_record').attachments(),
                len = files.length,
                targetComponent = Ext.get(event.browserEvent.target).component,
                totalSize = 0;

            for (var i = 0; i < len; i++) {
                totalSize += files.item(i).size;
                ext = files.item(i).name.split('.').pop();
                // let record = {
                //     document: {
                //         extension: ext,
                //         original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
                //         file: files.item(i),
                //         size: files.item(i).size
                //     },
                // };
                // fileStore.add(record);
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
                fileStore.remove(fileStore.last());
                return;
            }
            if (!len) return;
            this.upload(files, targetComponent);
        }
    },

    uploadFiles: function (element) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            totalSize = 0,
            files = element.getFiles(),
            fd = new FormData();
        Ext.getCmp('uploadProgress').show();
        let record = vm.get('object_record');
        fd.append('ownerable_id', record.get('id'));
        fd.append('attachmentable_id', record.get('id'));
        fd.append('attachmentable_type', record.get('model_name'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
            let ext = files.item(i).name.split('.').pop();
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
            me.clearFileUpload(element.id);
            Ext.getCmp('uploadProgress').hide();
            return;
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'attachments',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let jsonData = JSON.parse(response.responseText);
                record.load();
                Ext.getCmp('uploadProgress').hide();
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                Ext.getCmp('uploadProgress').hide();
                let result = Ext.decode(response.responseText);
                Ext.Msg.alert('Something went wrong', result.message);
                me.clearFileUpload(element.id);
            },
        });
    },

    upload: function (files, el) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            totalSize = 0,
            store = vm.get('object_record').attachments(),
            fd = new FormData();
        Ext.getCmp('uploadProgress').show();
        let record = vm.get('object_record');
        fd.append('ownerable_id', record.get('id'));
        fd.append('attachmentable_id', record.get('id'));
        fd.append('attachmentable_type', record.get('model_name'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
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
            me.clearFileUpload(el.id);
            return;
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'attachments',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                record.load();
                Ext.getCmp('uploadProgress').hide();
                me.clearFileUpload(el.id);
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                Ext.getCmp('uploadProgress').hide();
                let result = Ext.decode(response.responseText);
                Ext.Msg.warning('Unsupported file format', 'The file format you are trying to upload is not supported');
                me.clearFileUpload(el.id);
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

    deleteFiles: function (ids, record) {
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'attachments/' + record.get('id'),
            jsonData: {
                attachments: ids,
            },
            method: 'DELETE',
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                //resolve(true);
            },
            failure: function failure(response) {
                // resolve(false);
            },
        });
    },
});
