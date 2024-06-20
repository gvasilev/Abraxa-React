Ext.define('Abraxa.view.vouchers.VoucherController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.voucher-controller',
    requires: ['Ext.drag.Target'],
    voucherDocument: null,
    documentForLoad: null,
    viewerHasLoaded: false,

    bindings: {
        initVoucher: '{loadDocument}',
    },
    initVoucher: function (voucher) {
        if (voucher && voucher.getDocument()) {
            this.voucherDocument = voucher.getDocument();
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
            document.getElementById('pdf-viewer')
        ).then((instance) => {
            const { documentViewer } = instance.Core;

            const { Tools, PageRotation, Annotations, annotationManager, AnnotationHistoryManager, Document } =
                instance.Core;
            me.viewerHasLoaded = true;
            me.documentViewer = documentViewer;
            me.annotManager = annotationManager;
            me.pageRotation = PageRotation;
            if (me.documentForLoad) {
                if (me.voucherDocument) {
                    instance.UI.loadDocument(me.documentForLoad, {
                        customHeaders: {
                            'Cross-Origin-Opener-Policy': 'same-origin',
                        },
                        filename: me.voucherDocument.get('name') + '.' + me.voucherDocument.get('extension'),
                    });
                } else {
                    //if voucher document is missing try to load without file name and extension and custom headers
                    //this will send additional HEAD request to bucket
                    instance.UI.loadDocument(me.documentForLoad, {});
                }
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
                    title: 'Download RAW',
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

                        const downloadFile = (blob, fileName) => {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = fileName;
                            document.body.append(link);
                            link.click();
                            link.remove();
                            // in case the Blob uses a lot of memory
                            setTimeout(() => URL.revokeObjectURL(link.href), 7000);
                        };

                        downloadFile(blob, doc.filename);
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
                const viewModel = me.getView().upVM();
                if (viewModel.get('is_owner')) {
                    //chek for user permission DEV-1051
                    if (
                        viewModel.get('userPermissions.portcallInvoiceDelete') &&
                        !viewModel.get('userPermissions.portcallInvoiceDelete.edit')
                    )
                        return;
                    header.push({
                        type: 'actionButton',
                        title: 'Delete',
                        img: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>',
                        onClick: async () => {
                            var record = me.getView().upVM().get('selectedVoucher'),
                                attachmentsStore = me.getView().upVM().get('vouchers');
                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you want to delete this voucher?',
                                function (answer) {
                                    if (answer == 'yes') {
                                        Ext.ComponentQuery.query(
                                            Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type +
                                                'portcall\\.main'
                                        )[0]
                                            .getController()
                                            .deleteVouchers([record]);
                                        if (attachmentsStore.count())
                                            Ext.ComponentQuery.query('[cls~=vouchers_list]')[0].select(0);
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

            documentViewer.addEventListener('documentLoaded', () => {
                Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(false);
                annotationManager.importAnnotations(
                    '<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields /><annots /><pages><defmtx matrix="1,0,0,-1,0,841.89" /></pages></xfdf>'
                );
            });
        });
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
            this.documentForLoad = null;
        } else {
            this.documentForLoad = data;
        }
    },
    checkPermission: function () {
        //skip permission check for now
        return this.getView().getVM().get('editableDisbursementPermissions');
    },
    upload: function (files, el, record) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            element = el,
            portcall_id = vm.get('object_record').get('id'),
            disbursement = vm.get('disbursementRecord'),
            account_id = vm.get('account_id'),
            xhr = new XMLHttpRequest(),
            formdata = new FormData(),
            expense = record,
            totalSize = 0,
            url = Env.ApiEndpoint + 'disbursement_uploadfiles';
        for (var i = 0; i < files.length; i++) {
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
        xhr.open('POST', url, true);

        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('id_token'));

        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
            }
        };

        xhr.onloadstart = function (e) {
            Ext.getCmp('uploadProgress').show();
        };

        xhr.onloadend = function (e) {
            Ext.getCmp('uploadProgress').hide();
        };

        xhr.onerror = function (e) {};

        xhr.onreadystatechange = function () {
            // Server Status 300 - Multiple Choices Avaible

            if (xhr.readyState == 4 && xhr.status == 300) {
                var data = JSON.parse(xhr.responseText);

                if (data.notallowed.length) {
                    Ext.Msg.alert(
                        'Unsupported file format',
                        'The file format you are trying to upload is not supported',
                        Ext.emptyFn
                    );
                }
                if (data.data.length) {
                    Ext.create({
                        xtype: 'split.files.dialog',
                        caller: me,
                        files: files,
                        mydata: data.data,
                        domEl: element,
                    }).show();
                }
            }

            // Server Status 200 - Succeful Upload

            if (xhr.readyState == 4 && xhr.status == 200) {
                if (element.xtype) {
                    //ext component
                    element.setValue(null);
                } else {
                    element.value = '';
                }
                Ext.toast('Record updated');

                if (expense) {
                    expense.set('exchange_rate', null);
                    expense.set('currency', null);
                    expense.save();
                }

                var data = JSON.parse(xhr.responseText);
                let store = vm.get('vouchers'),
                    list = Ext.ComponentQuery.query('[cls~=vouchers_list]')[0];
                if (data && data.vouchers) {
                    let vouchers = data.vouchers,
                        first = null;
                    Ext.each(vouchers, function (value, index) {
                        let model = Ext.create('Abraxa.model.disbursement.Voucher', value),
                            document = new Abraxa.model.document.Document(Object.assign({}, value.document));

                        model.setDocument(document);
                        store.add(model);
                        if (index == 0) {
                            first = model;
                        }
                    });
                    if (first) {
                        list.select(first);
                    }
                }
            }

            // Server Status 413 - Post request size exceeds server limit
            if (xhr.status == 413) {
                Ext.Msg.error(
                    'Server Error 413',
                    'Your files upload request exceeds maximum server allowed size per upload.</br>' +
                        'Please upload files on smaller chunks , or at reduced size'
                );
                return false;
            }

            // Server Error 500

            if (xhr.readyState == 4 && xhr.status == 500) {
                var errorMsg = '';
                try {
                    var responseMsg = JSON.parse(xhr.responseText);
                    errorMsg = responseMsg.message;
                } catch (e) {
                    errorMsg = JSON.parse(xhr.responseText.message) || 'Files failed to upload';
                }

                Ext.Msg.error('Server Error', errorMsg);
            }
        };

        for (var i = 0; i < files.length; i++) {
            formdata.append('files[]', files.item(i));
            formdata.append('split[]', files.item(i).split);
        }
        formdata.append('portcall_id', portcall_id);
        if (disbursement) {
            formdata.append('disbursement_id', disbursement.get('id'));
            if (!account_id) {
                formdata.append('account_id', disbursement.get('account_id'));
            }
        }
        if (account_id) {
            formdata.append('account_id', account_id);
        }
        xhr.send(formdata);
        mixpanel.track('Uploaded a voucher');
    },

    onDragOverListItem: function (target, info) {
        if (this.getView().upVM().get('nonEditable')) {
            return;
        }
        if (this.checkPermission()) {
            Ext.get('dropped-container-vouchers').addCls('a-dropped');
        } else {
            return false;
        }
    },

    onDragLeaveListItem: function (target, info) {
        if (this.checkPermission()) {
            Ext.get('dropped-container-vouchers').removeCls('a-dropped');
        } else {
            return false;
        }
    },

    onDrop: function (event, info, eOpts) {
        if (this.checkPermission()) {
            Ext.get('dropped-container-vouchers').removeCls('a-dropped');
            event.browserEvent.preventDefault();

            var me = this,
                view = this.getView(),
                el = view.element,
                dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                len = files.length,
                totalSize = 0;

            for (var i = 0; i < len; i++) {
                files.item(i).split = null;
                totalSize += files.item(i).size;
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

            if (!len) return;

            this.upload(files, el);
        } else {
            return false;
        }
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
});
