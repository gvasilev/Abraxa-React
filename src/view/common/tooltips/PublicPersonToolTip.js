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

Ext.define('Abraxa.view.common.tooltips.PublicPersonToolTip', {
    extend: 'Abraxa.view.common.tooltips.AbraxaTooltip',
    xtype: 'public.person.tooltip',
    cls: 'a-person-tooltip',
    showAnimation: 'pop',
    viewModel: {
        data: {
            user: null,
            element_type: null,
            clickedElement: null,
            timeOutToHide: 1000,
        },
        formulas: {
            record_data: {
                bind: '{user}',
                get: function (record) {
                    var company_name = '';
                    var email = '';
                    var locationStr = null;
                    let country = this.get('countryStore');
                    var phone = '';
                    var avatar =
                        '<div class="a-profile-img a-no-img"><img width="72" height="72" src="' +
                        AbraxaConstants.urls.staticAbraxa +
                        'images/profile/no-image.svg"></div>';
                    if (record.org_name) {
                        company_name = record.org_name;
                    }
                    if (record.company && record.company.name) {
                        company_name = record.company.name;
                    } else if (record.company_info && record.company_info.name) {
                        company_name = record.company_info.name;
                    }
                    if (record.email) {
                        email = record.email;
                    }
                    if (record.contact_email) {
                        email = record.contact_email;
                    }
                    if (record.phone) {
                        phone = record.phone;
                    }
                    if (record.contact_phone) {
                        phone = record.contact_phone;
                    }

                    if (record.profile_image) {
                        avatar =
                            '<div class="a-profile-img"><img width="72" height="72" src="' +
                            record.profile_image +
                            '"></div>';
                    }
                    if (record.location) {
                        let loc = country.getById(record.location);
                        if (loc) {
                            locationStr = loc.get('country_name');
                        }
                    }
                    var response = {
                        abvr: record.abvr || '',
                        full_name: record.full_name || '',
                        company_name: company_name,
                        email: email,
                        phone: record.phone || null,
                        avatar: avatar,
                        position: record.position || null,
                        skype: record.skype || null,
                        location: locationStr,
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
        '<div class="tooltip-title">{avatar}<div class="sm-label">{company_name}</div><div class="label">{full_name}</div><div class="sub-title">{position}</div></div>' +
        '<div class="tooltip-content">' +
        '<ul>' +
        '<tpl if="email"><li class="email"><div class="hbox"><i class="md-icon-outlined">email</i><a class="c-blue" href="mailto:{email}">{email}</a></div></li></tpl>' +
        '<li class="phone"><div class="hbox"><i class="md-icon-outlined">settings_phone</i><tpl if="phone"><a class="c-blue" href="tel:{phone}">{phone}</a><tpl else ><span class="a-placeholder">---</span></div></li></tpl>' +
        '<li class="skype"><div class="hbox"><i><svg width="24" height="24" viewBox="0 0 24 24"><g transform="translate(-840 -356)"><rect width="24" height="24" transform="translate(840 356)" fill="none"/><path d="M19.582,11.067A8.591,8.591,0,0,0,9.726.764,4.979,4.979,0,0,0,2.781,7.5a8.592,8.592,0,0,0,9.985,10.169,4.98,4.98,0,0,0,6.815-6.6ZM15.6,13.328a3.917,3.917,0,0,1-1.744,1.324,7,7,0,0,1-2.683.472A6.55,6.55,0,0,1,8.1,14.479a4.03,4.03,0,0,1-1.414-1.255,2.739,2.739,0,0,1-.55-1.552,1.077,1.077,0,0,1,.358-.811,1.261,1.261,0,0,1,.9-.333,1.138,1.138,0,0,1,.756.263,1.95,1.95,0,0,1,.5.735,4.334,4.334,0,0,0,.493.874,1.9,1.9,0,0,0,.72.557,2.957,2.957,0,0,0,1.247.222,3.025,3.025,0,0,0,1.73-.45,1.26,1.26,0,0,0,.635-1.071,1.055,1.055,0,0,0-.332-.814,2.346,2.346,0,0,0-.916-.505c-.39-.122-.92-.253-1.575-.39a12.613,12.613,0,0,1-2.243-.671l-.007,0A3.708,3.708,0,0,1,6.924,8.2a2.681,2.681,0,0,1-.556-1.721,2.791,2.791,0,0,1,.583-1.738A3.629,3.629,0,0,1,8.618,3.58a7.29,7.29,0,0,1,2.519-.4,6.812,6.812,0,0,1,2,.264,4.436,4.436,0,0,1,1.418.707,3.075,3.075,0,0,1,.835.939,2.067,2.067,0,0,1,.269.979,1.231,1.231,0,0,1-1.234,1.2,1.084,1.084,0,0,1-.74-.231,2.766,2.766,0,0,1-.512-.682,2.834,2.834,0,0,0-.77-.953,2.417,2.417,0,0,0-1.434-.331,2.689,2.689,0,0,0-1.488.367.982.982,0,0,0-.532.823.757.757,0,0,0,.171.5,1.544,1.544,0,0,0,.512.389,3.79,3.79,0,0,0,.691.268c.239.066.639.164,1.188.291.579.124,1.117.261,1.608.407.1.029.2.059.29.089a6.127,6.127,0,0,1,1.469.671A2.928,2.928,0,0,1,15.85,9.9a3.057,3.057,0,0,1,.349,1.512A3.257,3.257,0,0,1,15.6,13.328Z" transform="translate(840.901 358.871)" fill="#6b7c93"/></g></svg></i><tpl if="skype">{skype}<tpl else ><span class="a-placeholder">---</span></div></li></tpl>' +
        '<li class="location"><div class="hbox"><i class="md-icon-outlined">place</i><tpl if="location"><span >{location}</span><tpl else ><span class="a-placeholder">---</span></tpl></div></li>' +
        '</ul>' +
        '</div>' +
        '</div>',
});
