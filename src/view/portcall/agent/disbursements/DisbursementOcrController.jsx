import '../../../../core/components/Abraxa.OcrMask';

Ext.define('Abraxa.view.portcall.agen.disbursements.DisbursementOcrController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.DisbursementOcrController',

    control: {
        'filebutton[itemId=daOcrButton]': {
            change: 'onUploadDaOcr',
        },
    },

    bindings: {
        generateMainServiceData: '{selectedDisbursement}',
    },

    generateMainServiceData: function (selectedDisbursement) {
        if (selectedDisbursement) {
            this.mainServiceData = {
                disbursement_id: selectedDisbursement.get('group_id'),
                account_id: selectedDisbursement.get('account_id'),
                account_name: selectedDisbursement.get('organization_name'),
                portcall_id: selectedDisbursement.get('portcall_id'),
                [selectedDisbursement.get('type') + '_id']: selectedDisbursement.get('id'),
                currency: selectedDisbursement.get('disbursement_currency'),
                exchange_rate: 1,
            };
        }
    },

    onUploadDaOcr: function (button, file) {
        const me = this;

        me.getView().find('disbursementDetails').setMasked({
            xtype: 'OcrMask',
        });

        me.uploadOcrDocument(button.getFiles(), button.upVM().get('object_record')).then(function (result) {
            me.connectToOcr(result.responseText);
        });
    },

    uploadOcrDocument: function (files, record) {
        return new Ext.Promise(function (resolve, reject) {
            const fd = new FormData();

            for (let i = 0; i < files.length; i++) {
                fd.append('file', files.item(i));
            }

            Ext.Ajax.request({
                url: Env.OCRDomain + 'upload-file',
                rawData: fd,
                withCredentials: true,
                headers: {
                    'Content-Type': null,
                },
                success: function (response) {
                    resolve(response);
                },
                failure: function failure(response) {
                    reject(response);
                },
            });
        });
    },

    connectToOcr: function (fileName) {
        const me = this;
        const eventSource = new EventSource(Env.OCRDomain + 'chat/disbursement/scan/' + fileName, {
            withCredentials: true,
        });

        document.querySelector('.ocr-mask-message').innerHTML = 'Processing OCR data...';

        eventSource.onmessage = function (event) {
            const sanitizedData = event.data.replace(/\\/g, '');
            const ocrServiceData = JSON.parse(sanitizedData);

            me.processOcrData(ocrServiceData);
        };

        eventSource.addEventListener('server-close', function (event) {
            eventSource.close();
            me.processOcrData(false);
        });

        eventSource.onerror = function (err) {
            eventSource.close();
        };
    },

    fillData: function (ocrServiceData, finalCallback) {
        const addServiceData = {
            ...ocrServiceData,
            ...this.mainServiceData,
            [this.getView().upVM().get('selectedDisbursement.type') + '_price']: ocrServiceData.price,
        };
        const store = this.getView().upVM().get('expenses');
        const expense = Ext.create('Abraxa.model.portcall.Expense', addServiceData);

        store.add(expense);
    },

    processOcrData: function (ocrServiceData) {
        const me = this,
            store = this.getView().upVM().get('expenses');

        if (ocrServiceData) {
            me.fillData(ocrServiceData);
        } else {
            store.sync({
                success: function () {
                    me.getView().find('disbursementDetails').setMasked(false);
                    Ext.toast('Record updated');
                },
            });
        }
    },
});
