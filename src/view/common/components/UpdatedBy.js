Ext.define('Abraxa.app.view.commom.components.UpdatedBy', {
    extend: 'Ext.Container',
    xtype: 'updated-by',
    viewModel: {
        data: {
            recordUpdatedByModel: null,
        },
        formulas: {
            updated_by_img: {
                bind: {
                    bindTo: '{recordUpdatedByModel}',
                    deep: true,
                },
                get: function (record) {
                    if (record && record.get('updated_by')) {
                        var mainVM = Ext.getCmp('main-viewport').getViewModel(),
                            userStore = mainVM.get('users'),
                            userRecord = userStore.getById(record.get('updated_by'));
                        if (!userRecord) return '';
                        if (userRecord.get('profile_image') && userRecord.get('profile_image') != '') {
                            let img = userRecord.get('profile_image');
                            return (
                                '<img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                img +
                                '">'
                            );
                        } else {
                            return '<span class="a-int">' + userRecord.get('abbr') + '</span>';
                        }
                    }
                    if (record && record.get('task_updated_by_uid')) {
                        var mainVM = Ext.getCmp('main-viewport').getViewModel(),
                            userStore = mainVM.get('users'),
                            userRecord = userStore.getById(record.get('task_updated_by_uid'));
                        if (userRecord.get('profile_image') && userRecord.get('profile_image') != '') {
                            let img = userRecord.get('profile_image');
                            return (
                                '<img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                img +
                                '">'
                            );
                        } else {
                            return '<span class="a-int">' + userRecord.get('abbr') + '</span>';
                        }
                    }
                },
            },
            updatedBy: {
                bind: {
                    bindTo: '{recordUpdatedByModel}',
                    deep: true,
                },
                get: function (record) {
                    if (record && record.get('updated_at')) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(
                                record.get('updated_at'),
                                AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                            );
                    }
                    if (record && record.get('task_updated_date')) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(
                                record.get('task_updated_date'),
                                AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                            );
                    }
                },
            },
            updatedByFormat: {
                bind: {
                    bindTo: '{recordUpdatedByModel}',
                    deep: true,
                },
                get: function (record) {
                    if (record && record.get('updated_at')) {
                        var mainVM = Ext.getCmp('main-viewport').getViewModel(),
                            userStore = mainVM.get('users'),
                            userRecord = userStore.getById(record.get('updated_by'));
                        if (!userRecord) return 'unknown';
                        let first_name = userRecord.get('first_name');
                        let last_name = userRecord.get('last_name');
                        let localTime = moment.utc(record.get('updated_at')).toDate();
                        return (
                            first_name[0] +
                            '. ' +
                            last_name +
                            ' ' +
                            Abraxa.getApplication()
                                .getController('AbraxaController')
                                .parseMomentDate(
                                    record.get('updated_at'),
                                    AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                )
                        );
                    }
                    if (record && record.get('task_updated_date')) {
                        var mainVM = Ext.getCmp('main-viewport').getViewModel(),
                            userStore = mainVM.get('users'),
                            userRecord = userStore.getById(record.get('task_updated_by_uid'));
                        let first_name = userRecord.get('first_name');
                        let last_name = userRecord.get('last_name');
                        let localTime = moment.utc(record.get('task_updated_date')).toDate();
                        return (
                            first_name[0] +
                            '. ' +
                            last_name +
                            ' ' +
                            Abraxa.getApplication()
                                .getController('AbraxaController')
                                .parseMomentDate(
                                    record.get('task_updated_date'),
                                    AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                )
                        );
                    }
                },
            },
        },
    },
    bind: {
        html: '<div><div class="a-person a-icon-round">{updated_by_img}<span class="a-date">{updatedBy}</span></div></div>',
        tooltip: {
            html: 'Last updated by {updatedByFormat}',
            align: 'bc-tc?',
            anchor: true,
            anchorToTarget: true,
            showDelay: 0,
            hideDelay: 0,
            dismissDelay: 0,
            allowOver: false,
            closeAction: 'destroy',
        },
    },
    applyData: function (data) {
        let vm = this.upVM();
        if (data) {
            vm.set('recordUpdatedByModel', data);
            return data;
        }
    },
    listeners: {
        click: {
            element: 'element',
            delegate: 'div.a-person',
            fn: function (el) {
                if (this.component.upVM().get('recordUpdatedByModel.updated_by')) {
                    var user_id = this.component.upVM().get('recordUpdatedByModel.updated_by');
                    let tipExist = Ext.getCmp('createdByTool');
                    if (tipExist) {
                        tipExist.destroy();
                    }
                    var tooltip_el = Ext.create('Abraxa.view.common.tooltips.PersonToolTip', {
                        target: el.target,
                        id: 'createdByTool',
                        viewModel: {
                            data: {
                                user_id: user_id,
                                clickedElement: el.target,
                            },
                        },
                    }).show();
                }
                if (this.component.upVM().get('recordUpdatedByModel.task_updated_by_uid')) {
                    var user_id = this.component.upVM().get('recordUpdatedByModel.task_updated_by_uid');
                    let tipExist = Ext.getCmp('createdByTool');
                    if (tipExist) {
                        tipExist.destroy();
                    }
                    var tooltip_el = Ext.create('Abraxa.view.common.tooltips.PersonToolTip', {
                        target: el.target,
                        id: 'createdByTool',
                        viewModel: {
                            data: {
                                user_id: user_id,
                                clickedElement: el.target,
                            },
                        },
                    }).showBy(el.target, 'l-r?');
                }
            },
        },
    },
});
