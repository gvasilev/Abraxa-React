Ext.define('Abraxa.app.view.commom.components.PublicUpdatedBy', {
    extend: 'Ext.Container',
    xtype: 'public.updated.by',
    viewModel: {
        data: {
            user: null,
            updated_at: null,
            updated_text: null,
            hide_tooltip: false,
            show_user_name: false,
        },
        formulas: {
            updated_by_img: {
                bind: {
                    bindTo: '{user}',
                    deep: true,
                },
                get: function (user) {
                    if (user) {
                        if (user.profile_image && user.profile_image != '') {
                            let img = user.profile_image;
                            return (
                                '<img data-id="last_updated_by_appointments" class="no_show a-profile-image" height="30" src="' +
                                img +
                                '">'
                            );
                        } else {
                            let abbr = user.first_name[0] + user.last_name[0];
                            return '<span class="a-int no_show">' + abbr + '</span>';
                        }
                    }
                    return '';
                },
            },
            showUserName: {
                bind: {
                    user: '{user}',
                    show_user_name: '{show_user_name}',
                },
                get: function (data) {
                    if (data.user && data.show_user_name) {
                        return (
                            '<span class="a-link">' + data.user.first_name[0] + '. ' + data.user.last_name + '</span>'
                        );
                    }
                    return '';
                },
            },
            updatedBy: {
                bind: {
                    user: '{user}',
                    updated_at: '{updated_at}',
                },
                get: function (data) {
                    if (data.user && data.updated_at) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(data.updated_at, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    } else if (data.user && !data.updated_at) {
                        return '';
                    }
                    return '<span class="a-cell-placeholder">---</span>';
                },
            },
            updatedByFormat: {
                bind: {
                    bindTo: '{user}',
                    deep: true,
                },
                get: function (user) {
                    if (user) {
                        let company = null;
                        if (user.company_info) {
                            company = user.company_info.name;
                        } else if (user.company) {
                            company = user.company.name;
                        }

                        let first_name = user.first_name,
                            last_name = user.last_name,
                            company_name = company,
                            localTime = null,
                            text = this.get('updated_text') ? this.get('updated_text') : 'Last updated by ';

                        if (this.get('updated_at')) {
                            localTime = this.get('updated_at');

                            return (
                                text +
                                first_name[0] +
                                '. ' +
                                last_name +
                                ' (' +
                                company_name +
                                ') ' +
                                Abraxa.getApplication()
                                    .getController('AbraxaController')
                                    .parseMomentDate(localTime, AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                            );
                        }
                    } else {
                        return AbraxaConstants.placeholders.emptyValue;
                    }
                },
            },
        },
    },
    bind: {
        html: '<div class="cursor-pointer"><div class="a-person a-icon-round no_show">{updated_by_img}{showUserName}<span class="a-date no_show">{updatedBy}</span></div></div>',
        tooltip: {
            html: '{updatedByFormat}',
            align: 'bc-tc?',
            anchor: true,
            anchorToTarget: true,
            showDelay: 0,
            hideDelay: 0,
            dismissDelay: 0,
            allowOver: false,
            closeAction: 'destroy',
            disabled: '{hide_tooltip ? true : false}',
        },
    },
    applyData: function (data) {
        let vm = this.upVM();
        if (data) {
            if (data.user) {
                vm.set('user', data.user);
            } else {
                vm.set('user', null);
            }
            if (data.updated_at) {
                vm.set('updated_at', data.updated_at);
            }
            if (data.show_user_name) {
                vm.set('show_user_name', data.show_user_name);
            }
            return data;
        }
    },
    listeners: {
        click: {
            element: 'element',
            delegate: 'div.a-person',
            fn: function (el) {
                if (this.component.upVM().get('user')) {
                    var user = this.component.upVM().get('user');
                    let tipExist = Ext.getCmp('createdByTool');
                    if (tipExist) {
                        tipExist.destroy();
                    }
                    if (user) {
                        Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                            target: el.target,
                            id: 'createdByTool',
                            viewModel: {
                                data: {
                                    user: user,
                                    clickedElement: el.target,
                                },
                            },
                        }).show();
                    }
                }
            },
        },
    },
});
