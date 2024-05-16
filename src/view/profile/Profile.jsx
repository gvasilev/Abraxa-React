import './Security';
import './Signature';
import './SessionHistory';

Ext.define('Abraxa.view.profile.Main', {
    extend: 'Ext.Container',
    xtype: 'profile.main',
    cls: 'a-settings-main a-settings-profile',
    scrollable: true,
    items: [
        {
            xtype: 'div',
            html: '<h1 class="fw-n">My Profile</h1>',
        },
        {
            xtype: 'div',
            html: '<p class="text-info">Personalizing your profile and photo helps your teammates and clients recognize you better in Abraxa.</p>',
        },
        {
            xtype: 'div',
            margin: '16 0',
            html: '<hr>',
        },
        {
            xtype: 'container',
            cls: 'general_data_container',
            items: [
                {
                    xtype: 'container',
                    defaults: {
                        clearable: false,
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                        listeners: {
                            blur: function (me) {
                                let record = me.upVM().get('currentUser');
                                if (record.dirty) {
                                    record.save({
                                        success: function () {
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
                                }
                            },
                        },
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            disabled: true,
                            label: 'Company',
                            cls: 'a-field-icon icon-business icon-rounded',
                            placeholder: 'Company name',
                            bind: {
                                value: '{currentUser.company.name}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Position',
                            cls: 'a-field-icon icon-business_center icon-rounded',
                            placeholder: 'Add your position',
                            bind: {
                                value: '{currentUser.position}',
                            },
                        },
                        {
                            xtype: 'abraxa.emailfield',
                            label: 'Email',
                            cls: 'a-field-icon icon-email icon-rounded',
                            placeholder: 'Add your email address',
                            disabled: true,
                            bind: {
                                value: '{currentUser.email}',
                            },
                        },
                        {
                            xtype: 'abraxa.phonefield',
                            label: 'Phone number',
                            cls: 'a-field-icon icon-phone icon-rounded',
                            name: 'phone',
                            bind: {
                                value: '{currentUser.phone}',
                            },
                        },

                        {
                            xtype: 'textfield',
                            label: 'Skype',
                            cls: 'a-field-icon icon-skype icon-rounded',
                            placeholder: 'Add a Skype name',
                            bind: {
                                value: '{currentUser.skype}',
                            },
                        },
                        {
                            xtype: 'country.combo',
                            label: 'Location',
                            placeholder: 'Choose location',
                            cls: 'a-field-icon icon-rounded icon-location',
                            bind: {
                                value: '{currentUser.location}',
                            },
                            triggers: {
                                search: false,
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-profile-access',
            items: [
                {
                    xtype: 'div',
                    cls: 'a-item',
                    bind: {
                        html: '{userRole}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-item',
                    hidden: true,
                    bind: {
                        hidden: '{userTeam ? false:true}',
                        html: '{userTeam}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-item',
                    hidden: true,
                    bind: {
                        hidden: '{userOffice ? false:true}',
                        html: '{userOffice}',
                    },
                },
            ],
        },
    ],
});
