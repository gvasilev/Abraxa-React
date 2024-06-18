import '../../../../core/components/Abraxa.OcrMask';

Ext.define('Abraxa.view.portcall.sof.SofController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.SofController',

    control: {
        'filebutton[itemId=sofOcrButton]': {
            change: 'onUploadSofOcr',
        },
    },

    connectToOcr: function (fileName) {
        const form = this.getView().find('formGeneralEvents'),
            fields = form.getFields(),
            me = this;

        const eventSource = new EventSource(Env.OCRDomain + '/chat/ocr/sof/' + fileName, {
            withCredentials: true,
        });

        eventSource.onmessage = function (event) {
            const eventData = JSON.parse(event.data);
            if (eventData.type === 'time_event') {
                eventData.default_sof_event_id = eventData.abraxa_event_name;
                eventData.event_date = eventData.date;
                eventData.event_from = eventData.from;
                eventData.event_to = eventData.to;
                eventData.event_comment = eventData.event ? 'Original event: ' + eventData.event : '';
                me.processOcrData(fields, eventData, 0, form);
            }
        };

        eventSource.addEventListener('server-close', function (event) {
            eventSource.close();
            me.processOcrData(fields, false, 0, form);
        });

        eventSource.onerror = function (err) {
            eventSource.close();
        };
    },

    submitSofForm: function (form, sync = true) {
        if (form.validate()) {
            let values = form.getValues(),
                berthCombo = form.getFields('da_berth_id'),
                grid = form.down('sof\\.general\\.events'),
                selectedEvent = grid.getSelection(),
                store = form.upVM().get('events');
            if (values.da_berth_id) {
                values.da_berth_name = berthCombo.getSelection().get('name');
            }
            values.default_sof_event_category_id = selectedEvent.get('type').category.id;
            values.default_sof_event_type_id = selectedEvent.get('type').id;
            values.event_name = selectedEvent.get('name');
            values.event_alias = selectedEvent.get('event_alias');

            store.add(values);
            if (sync) {
                store.sync({
                    success: function (record) {
                        Ext.toast('Record updated', 1000);
                        mixpanel.track('Add new sof event');
                    },
                });
            }
            store.sort();
            var picker = form.find('formSplit');
            picker.inputElement.dom.value = '';
            picker.getPicker().deselectAll();
            form.reset(true);
            form.find('formEvent').clearValue();
            form.find('formEvent').focus();
        }
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

    onUploadSofOcr: function (button, file) {
        const me = this;

        me.getView().setMasked({ xtype: 'OcrMask' });

        me.uploadOcrDocument(button.getFiles(), button.upVM().get('object_record')).then(function (result) {
            me.processOcr(result.responseText);
        });
    },

    processOcr: function (fileName) {
        const form = this.getView().find('formGeneralEvents'),
            me = this;

        form.setZIndex(100000);
        form.setDisabled(true);
        form.addCls('border-radius-5');

        document.querySelector('.ocr-mask-message').innerHTML = 'Processing OCR data...';

        me.connectToOcr(fileName);
    },

    simulateTyping: function (field, value, delay, callback) {
        const input = field.inputElement.dom;

        // Clear any existing value
        field.clearValue();
        field.focus();

        // Function to type one character at a time
        function typeChar(index) {
            if (value && index < value.length) {
                input.value += value.charAt(index);
                setTimeout(function () {
                    typeChar(index + 1);
                }, delay);
            } else if (callback) {
                callback();
            }
        }
        typeChar(0);
    },

    fillFormWithOcrData: function (fields, ocrData, finalCallback) {
        const me = this;
        const delayBetweenChars = 10; // 100 milliseconds delay between keystrokes
        const delayBetweenFields = 30; // 500 milliseconds delay between fields

        // Get the keys of ocrData
        const keys = Object.keys(ocrData);

        // Function to simulate typing and blur
        function typeAndBlurField(key, callback) {
            const field = fields[key];
            if (field) {
                me.simulateTyping(field, ocrData[key], delayBetweenChars, () => {
                    if (key === 'default_sof_event_id') {
                        let record = field.getStore().findRecord('name', ocrData[key]);
                        field.setValue(record.get('id'));
                    } else {
                        field.setValue(ocrData[key]);
                    }
                    console.log('Field', key, 'filled with OCR data:', ocrData[key]);
                    if (callback) callback();
                });
            } else {
                if (callback) callback();
            }
        }

        // Create a chain of typing actions
        function chainTypingActions(index) {
            if (index < keys.length) {
                setTimeout(
                    () => {
                        typeAndBlurField(keys[index], () => {
                            chainTypingActions(index + 1);
                        });
                    },
                    index === 0 ? 0 : delayBetweenFields
                );
            } else {
                if (finalCallback) finalCallback();
            }
        }

        // Start the chain of typing actions
        chainTypingActions(0);
    },

    processOcrData: function (fields, ocrData, index, form) {
        const me = this;
        if (ocrData) {
            me.fillFormWithOcrData(fields, ocrData, () => {
                me.submitSofForm(form, false);
            });
        } else {
            me.getView().unmask();
            form.removeCls('border-radius-5');
            form.setZIndex(null);
            form.setDisabled(false);
            form.reset(true);
            form.upVM()
                .get('events')
                .sync({
                    success: function (record) {
                        Ext.toast('OCR completed', 1000);
                    },
                });
        }
    },
});
