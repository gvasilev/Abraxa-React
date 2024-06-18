/**
 * Call tooltip from any elemement
 *
 * param = user_id -> for Company Users
 * param = contact_id -> for Contacts Users
 * param_id = id of user/contact
 *
 Ext.create('Abraxa.view.common.PersonToolTip', {
 viewModel: {
 data: {
 param: param_id
 }
 }
 }).showBy(el, 'bc-tc?');

 */

import './AbraxaTooltip';

Ext.define('Abraxa.view.common.tooltips.PersonToolTip', {
    extend: 'Abraxa.view.common.tooltips.AbraxaTooltip',
    xtype: 'person.tooltip',
    cls: 'a-person-tooltip',
    // showAnimation: 'pop',
    viewModel: {
        data: {
            user_id: '',
            contact_id: '',
            person_record: null,
            user_record: null,
            element_type: null,
            clickedElement: null,
            timeOutToHide: 1000,
        },
        formulas: {
            user_record: {
                bind: {
                    bindTo: '{user_id}',
                    deep: true,
                },
                get: function(id) {
                    if (id) {
                        let store = Ext.getCmp('main-viewport').getVM().get('users');
                        let record = store.getById(id);
                        if (record) {
                            return record;
                        }
                    }
                },
            },
            person_record: {
                bind: {
                    bindTo: '{contact_id}',
                    deep: true,
                },
                get: function(id) {
                    if (id) {
                        let store = this.get('companyContactsRecords');
                        let record = store.findRecord('contact_id', id, 0, false, false, true);
                        if (record) {
                            return record;
                        }
                    }
                },
            },
            currentRecord: function(get) {
                if (get('user_record')) {
                    return get('user_record');
                }
                if (get('person_record')) {
                    return get('person_record');
                }
            },
            record_data: {
                bind: '{currentRecord}',
                get: function(record) {
                    var abvr = '';
                    var full_name = '';
                    var company_name = '';
                    var email = '';
                    var phone = '';
                    var avatar =
                        '<div class="a-profile-img a-no-img"><span class="a-online-status"></span><img width="72" height="72" src="' +
                        AbraxaConstants.urls.staticAbraxa +
                        'images/profile/no-image.svg"></div>';
                    if (record.get('abvr')) {
                        abvr = record.get('abvr');
                    }
                    if (record.get('full_name')) {
                        full_name = record.get('full_name');
                    }
                    if (record.get('contact_full_name')) {
                        full_name = record.get('contact_full_name');
                    }
                    if (record.get('org_name')) {
                        company_name = record.get('org_name');
                    }
                    if (record.get('company_name')) {
                        company_name = record.get('company_name');
                    }
                    if (record.get('email')) {
                        email = record.get('email');
                    }
                    if (record.get('contact_email')) {
                        email = record.get('contact_email');
                    }
                    if (record.get('phone')) {
                        phone = record.get('phone');
                    }
                    if (record.get('profile_image')) {
                        avatar =
                            '<div class="a-profile-img"><span class="a-online-status"></span><img width="72" height="72" src="' +
                            record.get('profile_image') +
                            '"></div>';
                    }
                    if (record.get('contact_phone')) {
                        phone = record.get('contact_phone')
                            ? record.get('contact_phone')
                            : AbraxaConstants.placeholders.emptySpan;
                    }
                    var response = {
                        abvr: abvr,
                        full_name: full_name,
                        company_name: company_name,
                        email: email,
                        phone: phone,
                        avatar: avatar,
                        notes: record.get('notes') || 'Some personal note',
                    };
                    return response;
                },
            },
        },
    },

    bind: {
        data: '{record_data}',
    },

    tpl:
        '<div class="tooltip-body">' +
        '<div class="tooltip-title">{avatar}<div class="sm-label">{company_name}</div><div class="label">{full_name}</div></div>' +
        '<div class="tooltip-content">' +
        '<ul>' +
        '<tpl if="email"><li class="email"><div class="hbox"><i class="md-icon-outlined">email</i><a class="c-blue" href="mailto:{email}">{email}</a></div></li></tpl>' +
        '<tpl if="phone"><li class="phone"><div class="hbox"><i class="md-icon-outlined">settings_phone</i><span class="c-blue">{phone}</span></div></li></tpl>' +
        '<tpl><li class="note"><div class="hbox"><i class="md-icon">short_text</i><span class="a-placeholder">{notes}</span></div></li></tpl>' +
        '</ul>' +
        '</div>' +
        '</div>',
});
