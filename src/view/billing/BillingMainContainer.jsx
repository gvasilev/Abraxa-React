import '../../model/billing/BillingCompanyInfo';
import '../../react/Grid';
import DataGridDemo from '../../react/Grid';
import DataGridProDemo from '../../react/GridPro';

Ext.define('Abraxa.view.billing.BillingMainContainer', {
    extend: 'Ext.Container',
    xtype: 'billing.main',
    itemId: 'billingMain',
    layout: 'fit',
    flex: 1,
    bodyCls: 'a-layout-card-wrap a-billing',
    viewModel: {
        stores: {
            integrations: {
                autoLoad: true,
                type: 'integrations',
            },
        },
        formulas: {
            selectFirst: function (get) {
                Ext.ComponentQuery.query('[cls=billing_menu]')[0].select(0);
            },
            billingInfoRecord: {
                bind: {
                    bindTo: '{currentUser.current_company_id}',
                    deep: true,
                },
                get: function (id) {
                    if (id) {
                        let model = Ext.create('Abraxa.model.biling.Biling');
                        model.load();
                        return model;
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'container',
            scrollable: true,
            items: [
                {
                    xtype: 'container',
                    docked: 'left',
                    cls: 'a-left-menu billing_left_menu',
                    stateful: ['width', 'userCls'],
                    stateId: 'billingLeftMenu',
                    reference: 'billingLeftMenu',
                    publishes: ['userCls'],
                    userCls: 'is-expanded',
                    scrollable: true,
                    weight: 0,
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-menu-heading',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-heading',
                                    html: '<h5>Sections</h5>',
                                },
                                {
                                    xtype: 'button',
                                    ui: 'round',
                                    iconCls: 'md-icon-outlined md-icon-first-page',
                                    focusable: false,
                                    bind: {
                                        tooltip: {
                                            html: '<span class="tooltip_expand">{billingLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                            anchor: true,
                                            align: 'bc-tc?',
                                        },
                                    },
                                    handler: function () {
                                        let panel = Ext.ComponentQuery.query('[cls~=billing_left_menu]')[0],
                                            cls = panel.getUserCls() == 'is-expanded';

                                        if (cls != '') {
                                            panel.setUserCls('');
                                        } else {
                                            panel.setUserCls('is-expanded');
                                        }
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'billing_menu',
                            reference: 'billingMenu',
                            deselectable: false,
                            variableHeights: true,
                            data: [
                                {
                                    html: '<i class="md-icon-outlined">local_mall</i><span>Subscription plans</span>',
                                    tab: 'subscriptions',
                                    title: 'Subscription plans',
                                },
                                {
                                    html: '<i class="md-icon-outlined">business_center</i><span>Company info</span>',
                                    tab: 'company',
                                    title: 'Company info',
                                },

                                // {
                                //     html: '<i class="md-icon-outlined">dashboard_customize</i><span>Marketplace</span>',
                                //     tab: 'marketplace',
                                //     title: 'Marketplace'
                                // },
                                // {
                                //     html: '<i class="md-icon-outlined">receipt_long</i><span>Transactions</span>',
                                //     tab: 'transactions',
                                //     title: 'Transactions'
                                // },
                                // {
                                //     html: '<i class="md-icon-outlined">payment</i><span>Payment methods</span>',
                                //     tab: 'payment_methods',
                                //     title: 'Payment methods'
                                // },
                            ],
                            itemConfig: {
                                xtype: 'container',
                                cls: 'a-item',
                                viewModel: true,
                                items: [
                                    {
                                        cls: 'a-tab',
                                        bind: {
                                            html: '<div class="hbox">{record.html}</div>',
                                            tooltip: {
                                                html: '{billingLeftMenu.userCls ? "" : record.title}',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                                // anchorToTarget: false,
                                                align: 'bc-tc?',
                                                anchor: true,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '16 32',
                    scrollable: true,
                    flex: 1,
                    bind: {
                        hidden: '{billingMenu.selection.tab == "subscriptions" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            html: '<h1 class="fw-n">Subscription plans</h1><p class="text-info">Get the planning, control and reporting you need to manage your organization\'s  port calls.</p>',
                        },
                        {
                            xtype: 'container',
                            margin: '24 0 0 0',
                            cls: 'bordered border-radius',
                            items: [
                                {
                                    xtype: 'container',
                                    padding: 24,
                                    cls: 'a-bb-100',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            html:
                                                '<div class="a-obj-logo a-logo-lg a-logo-free a-shadow mr-24"><i class="md-icon-outlined">card_giftcard</i></div>' +
                                                '<div class="a-info"><div class="h3 m-0">Starter</div><div class="text-info"> Light & easy package for teams just getting started.</div></div>',
                                        },
                                        {
                                            xtype: 'div',
                                            bind: {
                                                hidden: '{currentUserPlan == "starter" ? false:true}',
                                            },
                                            html: '<i class="material-icons" style="font-size: 32px; color:#009688;">check</i>',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: 24,
                                    cls: 'a-bb-100',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            html:
                                                '<div class="a-obj-logo a-logo-lg a-logo-premium a-shadow mr-24"><i class="md-icon-outlined">card_giftcard</i></div>' +
                                                '<div class="a-info"><div class="h3 m-0">Premium</div><div class="text-info">The ultimate all-in-one package for companies that need to handle port calls with confidence.</div></div>',
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'premium',
                                            bind: {
                                                hidden: '{currentUserPlan == "premium" || currentUserPlan == "enterprise" ? true:false}',
                                            },
                                            text: 'Upgrade to Premium',
                                            handler: function () {
                                                window.open('https://www.abraxa.com/pricing/');
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            bind: {
                                                hidden: '{currentUserPlan == "premium" ? false:true}',
                                            },
                                            html: '<i class="material-icons" style="font-size: 32px; color:#009688;">check</i>',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: 24,
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            html:
                                                '<div class="a-obj-logo a-logo-lg a-logo-suite a-shadow mr-24"><i class="md-icon-outlined">card_giftcard</i></div>' +
                                                '<div class="a-info"><div class="h3 m-0">Enterprise</div><div class="text-info">For organizations that need additional control,customization & support.</div></div>',
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'default outlined',
                                            bind: {
                                                hidden: '{currentUserPlan == "enterprise" ? true:false}',
                                            },
                                            text: 'Contact us',
                                            handler: function () {
                                                window.open('https://www.abraxa.com/contact-us/');
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            bind: {
                                                hidden: '{currentUserPlan == "enterprise" ? false:true}',
                                            },
                                            html: '<i class="material-icons" style="font-size: 32px; color:#009688;">check</i>',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '16 0',
                            items: [
                                {
                                    xtype: 'container',
                                    padding: 24,
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            html: '<div class="a-info"><div class="h3 m-0">Delete Abraxa account</div><div class="text-info">Delete your account and everything associated with it.</div></div>',
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'decline alt',
                                            text: 'Delete account',
                                            handler: function () {
                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete your account?<br><br>This action cannot be undone and the account cannot be retrieved.',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.Ajax.request({
                                                                url: Env.ApiEndpoint + 'request_delete_accout',
                                                                method: 'POST',
                                                                success: function success(response) {
                                                                    var obj = Ext.decode(response.responseText);
                                                                    if (obj.success) {
                                                                        let title = 'Your request is sent.',
                                                                            content =
                                                                                'Your account will be deleted in 48 hours';
                                                                        Abraxa.popup.showSuccessDialog(title, content);
                                                                    }
                                                                },
                                                                failure: function failure(response) {
                                                                    Ext.Msg.alert('Status', 'Request Failed.');
                                                                },
                                                            });
                                                        }
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ]
                                                );
                                            },
                                        },
                                    ],
                                }
                            ],
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: {
                                type: 'vbox',
                                align: 'stretch',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h1 class="fw-n">React grid</h1><p class="text-info">This is a react data grid component.</p>',
                                },
                                {
                                    xtype: 'react-container',
                                    reactComponent: DataGridDemo(),
                                },
                                // {
                                //     xtype: 'div',
                                //     html: '<h1 class="fw-n">Data grid Pro</h1><p class="text-info">This is a data grid pro component.</p>',
                                // },
                                // {
                                //     xtype: 'react-container',
                                //     reactComponent: DataGridProDemo(),
                                // },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '16 32',
                    scrollable: true,
                    flex: 1,
                    bind: {
                        hidden: '{billingMenu.selection.tab == "company" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            html: '<h1 class="fw-n">Company Information</h1><p class="text-info">You can assign users to designated roles. Your point of contact will receive messaging and updates<br>from Abraxa related to usage, billing and renewals.</p>',
                        },
                        {
                            xtype: 'container',
                            margin: '24 0 0 0',
                            cls: 'bordered border-radius',
                            items: [
                                {
                                    xtype: 'container',
                                    padding: 24,
                                    cls: 'a-bb-100',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            html: '<div class="a-info"><div class="h3 m-0">Primary contact*</div><div class="text-info">I will be the main person in charge of our Abraxa account. <br>I will receive important account notifications.</div></div>',
                                        },
                                        {
                                            xtype: 'user.combo',
                                            minWidth: '220',
                                            editable: false,
                                            clearable: false,
                                            label: null,
                                            placeholder: 'Select a contact',
                                            ui: 'classic hovered-border non-editable',
                                            cls: 'a-field-icon icon-person icon-rounded',
                                            bind: {
                                                value: '{billingInfoRecord.primary_contact}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: 24,
                                    cls: 'a-bb-100',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            html: '<div class="a-info"><div class="h3 m-0">Billing contact</div><div class="text-info">I will be responsible for Abraxa billing and renewal notifications.</div></div>',
                                        },
                                        {
                                            xtype: 'user.combo',
                                            minWidth: '220',
                                            editable: false,
                                            clearable: false,
                                            label: null,
                                            placeholder: 'Select a contact',
                                            ui: 'classic hovered-border non-editable',
                                            cls: 'a-field-icon icon-person icon-rounded',
                                            bind: {
                                                value: '{billingInfoRecord.billing_contact}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: 24,
                                    cls: 'a-bb-100',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            html: '<div class="a-info"><div class="h3 m-0">Onboarding contact</div><div class="text-info">I will set up this account through the onboarding process with Abraxa.</div></div>',
                                        },
                                        {
                                            xtype: 'user.combo',
                                            minWidth: '220',
                                            editable: false,
                                            clearable: false,
                                            label: null,
                                            placeholder: 'Select a contact',
                                            ui: 'classic hovered-border non-editable',
                                            cls: 'a-field-icon icon-person icon-rounded',
                                            bind: {
                                                value: '{billingInfoRecord.onboarding_contact}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: 24,
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            html: '<div class="a-info"><div class="h3 m-0">Technical admin</div><div class="text-info">I will manage all technical settings for this account, such as domain & integration changes.</div></div>',
                                        },
                                        {
                                            xtype: 'user.combo',
                                            minWidth: '220',
                                            editable: false,
                                            clearable: false,
                                            label: null,
                                            placeholder: 'Select a contact',
                                            ui: 'classic hovered-border non-editable',
                                            cls: 'a-field-icon icon-person icon-rounded',
                                            bind: {
                                                value: '{billingInfoRecord.technical_admin}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '16 0',
                            layout: {
                                type: 'vbox',
                                align: 'right',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'action',
                                    text: 'Save',
                                    handler: function () {
                                        let vm = this.upVM(),
                                            record = vm.get('billingInfoRecord');
                                        if (record.dirty) {
                                            Ext.Msg.confirm(
                                                'Confirmation',
                                                'Are you sure you want to save this information?',
                                                function (answer) {
                                                    if (answer == 'yes') {
                                                        record.save({
                                                            success: function () {
                                                                Ext.toast('Record updated');
                                                            },
                                                            failure: function () {
                                                                Ext.Msg.alert(
                                                                    'Something went wrong',
                                                                    'Could not update record.'
                                                                );
                                                            },
                                                        });
                                                    } else {
                                                        record.reject();
                                                    }
                                                },
                                                this,
                                                [
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'no',
                                                        margin: '0 8 0 0',
                                                        text: 'Cancel',
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'yes',
                                                        enableToggle: true,
                                                        ui: 'action loading',
                                                        text: 'Yes',
                                                    },
                                                ]
                                            );
                                        }
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '16',
                    scrollable: true,
                    flex: 1,
                    bind: {
                        hidden: '{billingMenu.selection.tab == "marketplace" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            html: '<h1 class="fw-n">Marketplace</h1><p class="text-info">Explore integrations that help your business do more with Abraxa.</p>',
                            padding: '0 16',
                        },
                        {
                            xtype: 'abraxa.formlist',
                            flex: 1,
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            bind: {
                                store: '{integrations}',
                            },
                            itemConfig: {
                                viewModel: {},
                                xtype: 'container',
                                margin: 16,
                                cls: 'bordered border-radius',
                                width: '46.4%',
                                height: 216,
                                items: [
                                    {
                                        xtype: 'container',
                                        padding: 16,
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'hbox',
                                                bind: {
                                                    html:
                                                        '<div class="a-obj-logo x-shadow mr-16" style="width:52px; height:52px; border-radius:12px;"><img src="{record.logo}" width="52px" style="border-radius:12px;"></div>' +
                                                        '<div class="a-info"><div class="h3 m-0">{record.name}</div><div class="sm-title">{record.category}</div></div>',
                                                },
                                            },
                                            {
                                                xtype: 'div',
                                                margin: '22 0 0 0',
                                                cls: 'text-info',
                                                bind: {
                                                    html: '{record.info}',
                                                },
                                            },
                                            {
                                                xtype: 'div',
                                                flex: 1,
                                                cls: 'text-info',
                                                margin: '6 0 0 0',
                                                bind: {
                                                    html: '<a href="{record.website}"><strong>Learn more</strong></a>',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'toolbar',
                                        docked: 'bottom',
                                        flex: 1,
                                        padding: 16,
                                        layout: {
                                            type: 'hbox',
                                            pack: 'end',
                                        },
                                        items: [
                                            {
                                                xtype: 'button',
                                                ui: 'default outlined small',
                                                bind: {
                                                    hidden: '{record.company_integration || !record.available ? true : false}',
                                                },
                                                text: 'Contact us',
                                                handler: function () {
                                                    window.open('https://www.abraxa.com/contact-us/');
                                                },
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'tool-text-sm',
                                                iconCls: 'md-icon-outlined md-icon-settings',
                                                bind: {
                                                    hidden: '{record.company_integration && record.available ? false : true}',
                                                },
                                                text: 'Settings',
                                            },
                                            {
                                                xtype: 'div',
                                                html: 'Coming soon',
                                                style: 'color: #6b7c93; font-weight: 500; font-size: 14px;',
                                                bind: {
                                                    hidden: '{record.available ? true : false}',
                                                },
                                                disabled: true,
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'div',
                                        top: 24,
                                        right: 24,
                                        bind: {
                                            hidden: '{record.company_integration ? false : true}',
                                        },
                                        html: '<i class="material-icons" style="font-size: 32px; color:#009688;">check</i>',
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    ],
    listeners: {
        show: function (me) {
            if (
                !Ext.ComponentQuery.query('[itemId=billingMain]')[0].getVM().get('billingMenu.selection') &&
                Ext.ComponentQuery.query('[cls~=billing_menu]')[0]
            ) {
                Ext.ComponentQuery.query('[cls~=billing_menu]')[0].select(0);
            }
        },
    },
});
