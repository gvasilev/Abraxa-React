Ext.define('Abraxa.view.common.button.UploadButton', {
    extend: 'Ext.field.FileButton',
    xtype: 'upload.button',
    cls: 'a-no-content-btn',
    text: 'Upload file',
    ui: 'normal-light medium',
    iconCls: 'md-icon-outlined md-icon-cloud-upload',
    name: 'files',
    accept: '.xls,.xlsx,.csv',
    section: null,
    storeForReload: null,
    listeners: {
        change: function (me, newValue) {
            if (newValue) {
                if (me.section) {
                    me.uploadFile(me.getFiles(), me);
                } else {
                    Ext.Msg.warning('Warning', 'Missing section in config');
                }
            }
            document.querySelector("input[type='file']").value = '';
            me.setValue(null);
        },
    },
    uploadFile: function (file, el) {
        if (!file || file.length == 0) return; // make sure we got something
        // Let's read content as file
        var fd = new FormData(),
            totalSize = file[0].size,
            me = this;
        fd.append('files', file[0]);
        fd.append('section', me.section);

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
            url: Env.ApiEndpoint + 'import',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let result = Ext.decode(response.responseText),
                    object_id = me.upVM().get('object_id'),
                    object_meta_id = me.upVM().get('object_meta_id');
                if (result) {
                    //check result sheets
                    if (result.sheets && result.sheets.length == 1) {
                        //one sheet show dialog for mapping;
                        let data = result.sheets[0].data,
                            columns = result.sheets[0].columns,
                            columns_for_map = result.sheets[0].columns_for_map,
                            columns_text = result.sheets[0].columns_text,
                            sheetInfo = {
                                file_name: result.file_name,
                                file_type: result.file_type,
                                section: result.section,
                                headerRowNumber: result.sheets[0].headerRowNumber,
                                sheetNumber: result.sheets[0].sheetNumber,
                                object_meta_id: object_meta_id,
                                object_id: object_id,
                            };
                        me.showDialog(data, columns, columns_for_map, sheetInfo, columns_text);
                    }
                    if (result.sheets && result.sheets.length > 1) {
                        //multiple sheets dialog
                        result.object_meta_id = object_meta_id;
                        result.object_id = object_id;
                        me.showMultipleSheetDialog(result);
                    }
                    if (result.sheets && result.sheets.length == 0) {
                        Ext.Msg.warning('Warning', 'No importable data found. Please check your file.');
                    }
                }
            },
        });
    },
    showDialog: function (data, columnHeaders, columnsForMap, sheetInfo, columns_text) {
        let gridColumns = [],
            store = new Ext.data.Store({
                proxy: {
                    type: 'memory',
                },
            }),
            me = this;
        columnsForMap.forEach(function (value) {
            store.add({
                id: value,
                name: Ext.String.capitalize(value.replace(/_/g, ' ')),
            });
        });
        columnHeaders.forEach(function (value, index) {
            let selectedValue = null;
            if (value) {
                let record = store.getById(value);
                if (record) {
                    selectedValue = value;
                }
                let column = {
                    xtype: 'gridcolumn',
                    dataIndex: value,
                    text: columns_text[index],
                    width: 220,
                    menuDisabled: true,
                    cls: value,
                    items: [
                        {
                            xtype: 'combobox',
                            placeholder: 'Choose field',
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'id',
                            name: value,
                            ui: 'classic',
                            padding: '6',
                            cls: 'a-bgr-50 a-bb-200 a-bt-200',
                            store: store,
                            value: selectedValue,
                            docked: 'top',
                        },
                    ],
                };
                gridColumns.push(column);
            }
        });

        Ext.create('Abraxa.view.common.dialog.common.ImportFileDialog', {
            viewModel: {
                data: {
                    gridData: data,
                    gridColumns: gridColumns,
                    sheetInfo: sheetInfo,
                    storeForReload: me.upVM().get(me.storeForReload),
                },
            },
        }).show();
    },
    showMultipleSheetDialog: function (data) {
        let me = this;
        Ext.create('Abraxa.view.common.dialog.common.MultipleSheetDialog', {
            viewModel: {
                data: {
                    sheets: data.sheets,
                    data: data,
                    button: me,
                },
            },
        }).show();
    },
    clearFileUpload(id) {
        // get the file upload element
        let fileField = document.getElementById(id),
            tmpForm = document.createElement('form'),
            parentNod = fileField.parentNode;

        parentNod.replaceChild(tmpForm, fileField);
        tmpForm.appendChild(fileField);
        tmpForm.reset();
        parentNod.replaceChild(fileField, tmpForm);
    },
});
