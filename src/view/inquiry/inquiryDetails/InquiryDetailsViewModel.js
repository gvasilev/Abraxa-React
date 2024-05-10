Ext.define('Abraxa.view.inquiry.inquiryDetails.InquiryDetailsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.inquiry-details-viewmodel',
    stores: {
        taskTemplates: {
            type: 'templates',
            autoLoad: true,
            filters: [
                {
                    property: 'type',
                    operator: '=',
                    value: 'disbursement',
                    exactMatch: true,
                },
            ],
        },
        offers: {
            source: '{object_record.offers}',
            sorters: [
                {
                    property: 'created_at',
                    direction: 'DESC',
                },
            ],
            extraParams: {
                inquiry_id: '{object_record.id}',
            },
        },
        amails: {
            source: '{object_record.amails}',
            extraParams: {
                object_id: 6,
                object_meta_id: '{object_record.id}',
            },
        },
    },
    formulas: {
        doDefaults: {
            bind: {
                bindTo: '{execInquiryDefaults}',
                deep: true,
            },
            get: function (rec) {
                if (rec) {
                    if (
                        Ext.ComponentQuery.query('[cls=inquiry_menu]')[0] &&
                        Ext.ComponentQuery.query('[cls=inquiry_menu]')[0].getStore() &&
                        Ext.ComponentQuery.query('[cls=inquiry_menu]')[0].getStore().count()
                    ) {
                        Ext.ComponentQuery.query('[cls=inquiry_menu]')[0].select(0);
                    }
                    Ext.getCmp('main-viewport').setMasked(false);
                    return rec;
                }
            },
        },
        notes: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = record.notes();
                    var mainVM = Ext.getCmp('main-viewport').getVM();
                    store.setRemoteFilter(false);
                    store.getProxy().setExtraParams({
                        object_id: 6,
                        object_meta_id: record.get('org_id'),
                    });
                    store.sort({
                        property: 'id',
                        direction: 'ASC',
                    });
                    store.addFilter({
                        id: 1000,
                        filterFn: function (record) {
                            return !record.phantom;
                        },
                    });
                    mainVM.set('notes', store);
                }
            },
        },
        tasks: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = record.tasks();
                    var mainVM = Ext.getCmp('main-viewport').getVM();
                    store.clearFilter();
                    store.setRemoteFilter(false);
                    mainVM.set('tasks', store);
                }
            },
        },
        inquirySectionIcon: {
            bind: {
                bindTo: '{inquiryMenu.selection}',
                deep: true,
            },
            get: function (selection) {
                if (selection) {
                    let slug = selection.get('slug'),
                        icon = '';
                    switch (slug) {
                        case 'supply':
                            icon = 'layers';
                            break;
                        case 'crewing':
                            icon = 'supervisor_account';
                            break;
                    }
                    return icon;
                }
            },
        },
        voyage: {
            bind: {
                bindTo: '{object_record.voyage}',
                deep: true,
            },
            get: function (voyage) {
                return voyage;
            },
        },
        vessel_data: {
            bind: {
                bindTo: '{voyage}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    //copy data
                    return Object.assign({}, record.get('vessel_data'));
                }
            },
        },
        vessel: {
            bind: {
                bindTo: '{object_record.voyage}',
                deep: true,
            },
            get: function (voyage) {
                if (voyage) {
                    if (voyage.get('custom_vessel')) {
                        return voyage.get('custom_vessel');
                    } else {
                        return voyage.get('vessel');
                    }
                }
            },
        },
        vesselImage: {
            bind: {
                bindTo: '{vessel}',
                deep: true,
            },
            get: function (vessel) {
                if (vessel) {
                    if (vessel.company_id && vessel.vessel_img) {
                        return vessel.vessel_img;
                    } else {
                        return AbraxaConstants.urls.staticAbraxa + 'ships/' + vessel.imo + '.jpg';
                    }
                }
            },
        },
        vesselTitle: {
            bind: {
                bindTo: '{vessel}',
                deep: true,
            },
            get: function (vessel) {
                if (vessel) {
                    let flag = null,
                        voyage = this.get('object_record').getVoyage();

                    if (voyage && vessel && vessel.flags && vessel.flags.country_code) {
                        flag =
                            'src="' +
                            AbraxaConstants.urls.staticAbraxa +
                            'flags/1x1/' +
                            vessel.flags.country_code.toLocaleLowerCase() +
                            '.svg"';
                    }
                    return (
                        '<img height=24" ' +
                        flag +
                        '  title="" alt=""/><div><div class="vessel-imo">IMO: ' +
                        vessel.imo +
                        '</div><a href="javascript:void(0);" class="vessel-name vessel">' +
                        voyage.get('vessel_name') +
                        '</a></div>'
                    );
                }
            },
        },
        etaRendererDate: {
            bind: {
                bindTo: '{object_record.port_eta}',
                deep: true,
            },
            get: function (date) {
                if (date) {
                    return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        assignTo: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    if (record.get('assigned_to')) {
                        let storeUsers = this.get('users');
                        let recordUser = storeUsers.findRecord('id', record.get('assigned_to'));
                        if (recordUser) {
                            var assigned_to = recordUser.get('first_name')[0] + '. ' + recordUser.get('last_name');
                            let str = '<span class="a-int">' + recordUser.get('abbr') + '</span>';
                            if (recordUser.get('profile_image') && recordUser.get('profile_image') != '') {
                                let img = recordUser.get('profile_image');
                                str =
                                    '<img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                    img +
                                    '">';
                            }

                            return (
                                '<div class="a-person a-icon-round">' +
                                str +
                                ' ' +
                                '<a class="a-person a_grid_action person_details" href="javascript:void(0)">' +
                                assigned_to +
                                '</a></div>'
                            );
                        } else {
                            return AbraxaConstants.placeholders.emptyValue;
                        }
                    }
                }
            },
        },
        instruction: {
            bind: {
                bindTo: '{object_record.instructions}',
                deep: true,
            },
            get: function (store) {
                let record = null;
                let object_record = this.get('object_record');
                if (store && store.first()) {
                    record = store.first();
                } else {
                    if (object_record && object_record.$className == 'Abraxa.model.inquiry.Inquiry') {
                        record = Ext.create('Abraxa.model.portcall.Instruction', {
                            owner_id: object_record.get('id'),
                            owner_type: object_record.get('model_name'),
                            title: 'Inquiry instruction',
                        });
                        store.add(record);
                    }
                }
                return record;
            },
        },
        isEmptyInstruction: {
            bind: {
                bindTo: '{instruction}',
                deep: true,
            },
            get: function (instruction) {
                if (instruction) {
                    return Ext.isNumber(instruction.get('id'));
                }
                return true;
            },
        },
        setAmailsUrl: {
            bind: {
                bindTo: '{amails}',
            },
            get: function (store) {
                if (store) {
                    store.getProxy().setUrl(Env.ApiEndpoint + 'inquiry/${object_meta_id}/amails');
                }
            },
        },
        nonEditable: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record && this.get('currentUser')) {
                    if (
                        record.get('company_id') != this.get('currentUser').get('current_company_id') ||
                        record.get('is_archived') ||
                        record.get('parent_id')
                    )
                        return true;

                    return false;
                }
            },
        },
    },
});
