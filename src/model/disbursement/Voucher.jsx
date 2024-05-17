import '../document/Document.jsx';
Ext.define('Abraxa.model.disbursement.Voucher', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'disbursement_id',
            type: 'integer',
        },
        {
            name: 'portcall_id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'document_id',
            type: 'integer',
        },
        {
            name: 'expense_id',
            type: 'auto',
        },
        {
            name: 'account_currency',
            type: 'auto',
        },
        {
            name: 'currency',
            type: 'auto',
        },
        {
            name: 'exchange_rate',
            type: 'float',
            defaultValue: 1,
        },
        {
            name: 'price',
            type: 'float',
        },
        {
            name: 'calculated_price',
            type: 'float',
            depends: ['currency', 'price', 'exchange_rate'],
            convert: function (v, rec) {
                let accountCurrency = rec.get('account_currency'),
                    currency = rec.get('currency'),
                    rate = rec.get('exchange_rate'),
                    price = rec.get('price');

                if (rate) return price * rate;

                return price;
            },
        },
        {
            name: 'reference_number',
            type: 'auto',
        },
        {
            name: 'invoice_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'note',
            type: 'string',
        },
        {
            name: 'pdf',
            type: 'auto',
            persist: false,
        },
    ],
    idProperty: 'id',
    hasOne: [
        {
            name: 'document',
            model: 'Abraxa.model.document.Document',
            associatedKey: 'document',
            reference: 'document_id',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'disbursement_files/${portcall_id}',
    },

    loadPDF2: function () {
        let me = this;
        return new Ext.Promise(function (resolve, reject) {
            let file = me.getDocument(),
                sendData = {
                    id: file.get('id'),
                    object_meta_id: file.get('object_meta_id'),
                    object_id: file.get('object_id'),
                };

            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'get_pdf',
                jsonData: sendData,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            }).then(function (response) {
                var pdf = response.responseText;
                me.set('pdf', pdf);
                resolve(pdf);
                // pdfjsLib.GlobalWorkerOptions.workerSrc = '/src/pdfjs/build/pdf.worker.js';
                // var loadingTask = pdfjsLib.getDocument({
                //     data: atob(pdf)
                // });
                // loadingTask.promise.then(function (pdf) {
                //     me.set('pdf', pdf);
                //     resolve(pdf);
                // }, function (reason) {
                //     // PDF loading error
                //     console.error(reason);
                // });
            });
        });
    },
});
