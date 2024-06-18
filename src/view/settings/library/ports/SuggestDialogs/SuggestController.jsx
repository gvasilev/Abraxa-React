Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.suggests.controller',

    bindings: {
        setCurrentUserEmail: '{currentUser}',
    },
    setCurrentUserEmail: function (user) {
        if (user && user.get('email')) {
            this.userEmail = user.get('email');
        }
    },
    control: {
        'button[ui~=portSubmission]': {
            tap: 'sendPortSuggestion',
        },
        'button[ui~=terminalSubmission]': {
            tap: 'sendTerminalSuggestion',
        },
        'button[ui~=berthSubmission]': {
            tap: 'sendBerthSuggestion',
        },
    },
    //promise to send suggestion
    sendNomenclature: function (data, url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    let errMsg = 'Request failed with status ' + xhr.status + '. <br /><br />';
                    const errObj = JSON.parse(xhr.responseText);
                    // Currently response looks like this, e.g.:
                    // UN/Locode: "String length must be greater than or equal to 5"
                    for (let key in errObj) {
                        errMsg += key + ': ' + errObj[key] + '. <br /><br />';
                    }
                    reject(errMsg);
                }
            };

            xhr.onerror = function () {
                reject('error');
            };

            // Prepare payload to conform with BE Nomenclature Schema
            for (let key in data) {
                let deleteDataProp = false;
                // Remove null values because the Schema does not support them:
                if (data[key] === null || data[key] === undefined) {
                    deleteDataProp = true;
                } else if (typeof data[key] === 'object') {
                    // Remove empty objects or objects with null values
                    // e.g. One such empty object was the non-required field coordinates_center: {}
                    if (Object.keys(data[key]).length === 0) {
                        deleteDataProp = true;
                    } else {
                        for (let subKey in data[key]) {
                            if (data[key][subKey] === null || data[key][subKey] === undefined) {
                                deleteDataProp = true;
                                break;
                            }
                        }
                    }
                }
                if (deleteDataProp === true) {
                    delete data[key];
                }
            }

            xhr.send(JSON.stringify(data));
        });
    },
    sendPortSuggestion: function (button) {
        const me = this;
        const view = this.getView();
        const componentDataview = view.down('componentdataview');
        const portRecord = view.upVM().get('record');
        const form = view.down('formpanel');
        const alternativeNames = componentDataview.getStore()?.collect('name');

        if (!form.validate()) return me.showRequiredFieldsError(view, button);

        if (alternativeNames?.length) {
            portRecord.set('meta_name_alternatives', alternativeNames);
        }

        const url = Env.nomenclatureEndPoint + 'api/submission/v1/ports/' + portRecord.get('submission_id');
        const data = portRecord.getData();

        // Nomencalture BE does not need id anymore. Delete it in case of old records.
        delete data['id'];

        me.sendNomenclature(data, url)
            .then(function (response) {
                Ext.toast('Your suggestion has been submitted', 1000);
                view.destroy();
            })
            .catch(function () {
                Ext.Msg.alert('Something went wrong', 'Cannot send suggestion!');
            });
    },
    sendTerminalSuggestion: function (button) {
        let me = this;
        let view = this.getView();
        let componentDataview = view.down('componentdataview');
        let terminalRecord = view.upVM().get('record');
        let form = view.down('formpanel');
        let alternativeNames = componentDataview.getStore().collect('name');

        if (!form.validate()) return me.showRequiredFieldsError(view, button);

        if (alternativeNames?.length) {
            terminalRecord.set('meta_name_alternatives', alternativeNames);
        }

        const url = Env.nomenclatureEndPoint + 'api/submission/v1/terminals/' + terminalRecord.get('submission_id');
        const data = terminalRecord.getData();

        // Nomencalture BE does not need id anymore. Delete it in case of old records.
        delete data['id'];

        me.sendNomenclature(data, url)
            .then(function (response) {
                Ext.toast('Your suggestion has been submitted', 1000);
                view.destroy();
            })
            .catch(function () {
                Ext.Msg.alert('Something went wrong', 'Cannot send suggestion!');
            });
    },
    sendBerthSuggestion: function (button) {
        const me = this;
        const view = this.getView();
        const componentDataview = view.down('[cls~=alternative_names]');
        const berthRecord = view.upVM().get('record');
        const form = view.down('formpanel');
        const alternativeNames = componentDataview.getStore()?.collect('name');

        if (!form.validate()) return me.showRequiredFieldsError(view, button);

        if (alternativeNames?.length) {
            berthRecord.set('meta_name_alternatives', alternativeNames);
        }

        const url = Env.nomenclatureEndPoint + 'api/submission/v1/berths/' + berthRecord.get('submission_id');
        const data = berthRecord.getData();

        // Nomencalture BE does not need id anymore. Delete it in case of old records.
        delete data['id'];

        me.sendNomenclature(data, url)
            .then(function (response) {
                Ext.toast('Your suggestion has been submitted', 1000);
                view.destroy();
            })
            .catch(function () {
                Ext.Msg.alert('Something went wrong', 'Cannot send suggestion!');
            });
    },
    showRequiredFieldsError: function (view, button) {
        const form = view.down('formpanel');

        view.down('[cls~="errors_div"]').setHidden(false);

        const validationErrors = form.getErrors();
        let htmlTpl = '<div class="fs-16 fw-b">Fill all required fields:</div><ul>';

        Ext.Object.each(validationErrors, function (error, value) {
            if (value) {
                htmlTpl += '<li><b>' + error + '</b> is required</li>';
            }
        });

        htmlTpl += '</ul>';
        view.down('[cls~="errors_div"]').getItems().getAt(1).setHtml(htmlTpl);
        view.getScrollable().scrollTo(0, 0, true);
        button.toggle();
    },
});
