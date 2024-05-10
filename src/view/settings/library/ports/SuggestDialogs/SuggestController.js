Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.suggests.controller',

    bindings: {
        setCurrentUserEmail: '{currentUser}',
        setUserSubmission: '{userSubmissions}',
    },
    setCurrentUserEmail: function (user) {
        if (user && user.get('email')) {
            this.userEmail = user.get('email');
        }
    },
    setUserSubmission: function (emails) {
        if (emails) {
            this.userSubmissions = emails;
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
        let me = this;
        let view = this.getView();
        let componentDataview = view.down('componentdataview');
        let portRecord = view.upVM().get('record');
        let form = view.down('formpanel');
        let alternativeNames = componentDataview.getStore().collect('name');
        if (form.validate()) {
            if (alternativeNames.length) {
                portRecord.set('meta_name_alternatives', alternativeNames);
            }
            let data = {
                type: 'port',
                legacy_id: portRecord.get('legacy_id'),
                data: portRecord.getData(),
            };
            let url = Env.ApiEndpoint + 'submissions';

            if (Ext.Array.contains(me.userSubmissions, me.userEmail)) {
                url = Env.nomenclatureEndPoint + 'api/submission/v1/ports/' + portRecord.get('submission_id');
                data = portRecord.getData();
                if (!portRecord.get('uuid')) {
                    delete data['id'];
                }
            }
            me.sendNomenclature(data, url)
                .then(function (response) {
                    Ext.toast('Your suggestion has been submitted', 1000);
                    view.destroy();
                })
                .catch(function () {
                    Ext.Msg.alert('Something went wrong', 'Cannot send suggestion!');
                });
        } else {
            view.down('[cls~="errors_div"]').setHidden(false);
            let htmlTpl = '<div class="fs-16 fw-b">Fill all required fields:</div><ul></ul>';
            let validationErrors = form.getErrors();
            Ext.Object.each(validationErrors, function (error, value) {
                if (value) {
                    htmlTpl += '<li><b>' + error + '</b> is required</li>';
                }
            });
            htmlTpl += '</ul>';
            view.down('[cls~="errors_div"]').getItems().getAt(1).setHtml(htmlTpl);
            view.getScrollable().scrollTo(0, 0, true);
            button.toggle();
        }
    },
    sendTerminalSuggestion: function (button) {
        let me = this;
        let view = this.getView();
        let componentDataview = view.down('componentdataview');
        let terminalRecord = view.upVM().get('record');
        let form = view.down('formpanel');
        let alternativeNames = componentDataview.getStore().collect('name');
        if (form.validate()) {
            if (alternativeNames.length) {
                terminalRecord.set('meta_name_alternatives', alternativeNames);
            }
            let data = {
                type: 'terminal',
                legacy_id: terminalRecord.get('id'),
                // parent_id: terminalRecord.get('legacy_parent_id'),
                data: terminalRecord.getData(),
            };

            let url = Env.ApiEndpoint + 'submissions';
            if (Ext.Array.contains(me.userSubmissions, me.userEmail)) {
                url = Env.nomenclatureEndPoint + 'api/submission/v1/terminals/' + terminalRecord.get('submission_id');
                data = terminalRecord.getData();
                data.legacy_id = terminalRecord.get('id');
                // data.parent_id = terminalRecord.get('legacy_parent_id');

                if (!terminalRecord.get('uuid')) {
                    delete data['id'];
                }
            }
            me.sendNomenclature(data, url)
                .then(function (response) {
                    Ext.toast('Your suggestion has been submitted', 1000);
                    view.destroy();
                })
                .catch(function () {
                    Ext.Msg.alert('Something went wrong', 'Cannot send suggestion!');
                });
        } else {
            view.down('[cls~="errors_div"]').setHidden(false);
            let htmlTpl = '<div class="fs-16 fw-b">Fill all required fields:</div><ul></ul>';
            let validationErrors = form.getErrors();
            Ext.Object.each(validationErrors, function (error, value) {
                if (value) {
                    htmlTpl += '<li><b>' + error + '</b> is required</li>';
                }
            });
            htmlTpl += '</ul>';
            view.down('[cls~="errors_div"]').getItems().getAt(1).setHtml(htmlTpl);
            view.getScrollable().scrollTo(0, 0, true);
            button.toggle();
        }
    },
    sendBerthSuggestion: function (button) {
        let me = this;
        let view = this.getView();
        let componentDataview = view.down('[cls~=alternative_names]');
        let berthRecord = view.upVM().get('record');
        let form = view.down('formpanel');
        let alternativeNames = componentDataview.getStore().collect('name');
        if (form.validate()) {
            if (alternativeNames.length) {
                berthRecord.set('meta_name_alternatives', alternativeNames);
            }
            berthRecord.set('legacy_parent_id', berthRecord.get('id'));
            let data = {
                type: 'berth',
                legacy_id: berthRecord.get('id'),
                parent_id: berthRecord.get('parent_id'),
                data: berthRecord.getData(),
            };
            let url = Env.ApiEndpoint + 'submissions';
            if (Ext.Array.contains(me.userSubmissions, me.userEmail)) {
                url = Env.nomenclatureEndPoint + 'api/submission/v1/berths/' + berthRecord.get('submission_id');
                data = berthRecord.getData();

                if (!berthRecord.get('uuid')) {
                    delete data['id'];
                }
            }
            me.sendNomenclature(data, url)
                .then(function (response) {
                    Ext.toast('Your suggestion has been submitted', 1000);
                    view.destroy();
                })
                .catch(function () {
                    Ext.Msg.alert('Something went wrong', 'Cannot send suggestion!');
                });
        } else {
            view.down('[cls~="errors_div"]').setHidden(false);
            let htmlTpl = '<div class="fs-16 fw-b">Fill all required fields:</div><ul></ul>';
            let validationErrors = form.getErrors();
            Ext.Object.each(validationErrors, function (error, value) {
                if (value) {
                    htmlTpl += '<li><b>' + error + '</b> is required</li>';
                }
            });
            htmlTpl += '</ul>';
            view.down('[cls~="errors_div"]').getItems().getAt(1).setHtml(htmlTpl);
            view.getScrollable().scrollTo(0, 0, true);
            button.toggle();
        }
    },
});
