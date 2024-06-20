Ext.define('Abraxa.view.tasks.TaskController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.task-controller',
    upload: function (files, record) {
        return new Ext.Promise(function (resolve, reject) {
            let me = this,
                fd = new FormData();
            fd.append('task_id', record.get('id'));
            fd.append('object_meta_id', record.get('id'));
            Ext.Array.each(files.getData().items, function (value, index) {
                if (!value.get('document_id')) {
                    fd.append('files[]', value.get('document').file);
                }
            });
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'task/' + record.get('id') + '/attachments',
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
