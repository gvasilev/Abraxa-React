Ext.define('Abraxa.view.cdb.company.CompanyHeader', {
    extend: 'Ext.Container',
    xtype: 'company.header',
    layout: 'vbox',
    flex: 1,
    cls: 'a-company-header',
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    cls: 'a-main-titlebar',
                    items: [
                        {
                            xtype: 'div',
                            itemId: 'mainTitle',
                            bind: {
                                cls: 'a-main-title has-dropdown a-verification a-{object_record.compliance.status}',
                                html: "<h1>{object_record.org_name}</h1><i class='a-verification-icon {object_record.compliance.status != 'verified' ? 'md-icon-outlined' : '' } md-icon'></i>",
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let menu = Ext.create('Abraxa.view.main.RecentlyOpenedMenu', {
                                            viewModel: {
                                                parent: Ext.getCmp('main-viewport').getViewModel(),
                                            },
                                        });
                                        menu.showBy(this);
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-main-id',
                            hidden: true,
                            bind: {
                                html: 'CDB-{object_record.org_id}',
                            },
                            tooltip: {
                                html: 'Company overview',
                                anchor: true,
                                anchorToTarget: true,
                                align: 't50-b50',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                closeAction: 'destroy',
                            },
                            // listeners: {
                            //     click: {
                            //         element: "element",
                            //         fn: function fn() {
                            //             let portcall = this.component.upVM().get('object_record'),
                            //                 dialog = Ext.create('Abraxa.view.portcall.PortcallInfoDialog', {
                            //                     viewModel: {
                            //                         parent: this.component.upVM()
                            //                     }
                            //                 });
                            //             if (portcall) {
                            //                 dialog.getVM().set('portcall', portcall);
                            //                 dialog.getVM().set('dialog', true);
                            //                 dialog.show();
                            //             }
                            //         }
                            //     }
                            // }
                        },
                        {
                            xtype: 'tool',
                            cls: 'a-main-more',
                            // ui: 'tool-sm',
                            iconCls: 'md-icon-more-horiz',
                            tooltip: {
                                html: 'More actions',
                                anchor: true,
                                anchorToTarget: true,
                                align: 't50-b50',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                closeAction: 'destroy',
                            },
                            handler: function handler(owner, tool, e) {
                                let vm = this.upVM(),
                                    record = vm.get('object_record');
                                Ext.create('Abraxa.view.cdb.company.CompanyEditMenu', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            selectedCompany: record,
                                        },
                                    },
                                }).showBy(this);
                            },
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'status status-md default',
                                    bind: {
                                        text: '<i class="material-icons a-status-icon">star</i>{object_record.rating.name}',
                                        cls: 'a-main-status a-has-icon status-{object_record.rating.name}',
                                    },
                                    menu: {
                                        defaults: {
                                            handler: function () {
                                                var record = this.upVM().get('object_record'),
                                                    status_id = this.statusId;

                                                record.set('credit_rating', status_id);

                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                        listeners: {
                                            painted: function (me) {
                                                let store = Ext.ComponentQuery.query('[xtype=company]')[0]
                                                        .getVM()
                                                        .get('creditRatings'),
                                                    data = store.getData().getRange(),
                                                    items = [];
                                                Ext.each(data, function (value) {
                                                    let item = {
                                                        text: value.get('name'),
                                                        record: value,
                                                        statusId: value.get('id'),
                                                    };
                                                    items.push(item);
                                                });
                                                // items.push({
                                                //     xtype: 'button',
                                                //     margin: 4,
                                                //     flex: 1,
                                                //     text: 'Add new',
                                                //     ui: 'normal',
                                                //     iconCls: 'md-icon-add',
                                                //     handler: function (me) {
                                                //         let company_id = me.upVM().get('currentUser').get('current_company_id'),
                                                //             modal = Ext.create('Abraxa.view.cdb.forms.FormAddNewRating', {
                                                //                 viewModel: {
                                                //                     data: {
                                                //                         record: new Abraxa.model.cdb.CreditRating({
                                                //                             company_id: company_id
                                                //                         }),
                                                //                         store: store
                                                //                     }
                                                //                 }
                                                //             });
                                                //         modal.show();
                                                //     }
                                                // });
                                                me.setItems(items);
                                            },
                                        },
                                    },
                                },
                            ],
                        },

                        {
                            xtype: 'public.updated.by',
                            cls: 'a-main-updated',
                            hidden: true,
                            bind: {
                                hidden: '{object_record.updated_by_user ? false : true}',
                                data: {
                                    user: '{object_record.updated_by_user}',
                                    updated_at: '{object_record.updated_at}',
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'tabbar',
                    cls: 'a-main-tabs portcall_tabs',
                    animateIndicator: false,
                    activeTab: 0,
                    defaults: {
                        ui: 'tab-main',
                        ripple: false,
                    },
                    reference: 'companyMainTabbar',
                    publishes: {
                        activeTab: true,
                        activeTabIndex: true,
                    },
                    bind: {
                        activeTabIndex: '{activeCompanyTab}',
                    },
                    items: [
                        {
                            text: 'Profile',
                            type: 'summary.main',
                            hideMode: 'offsets',
                            hash: '',
                            testId: 'companyHeaderProfileButton',
                        },
                        {
                            text: 'Contacts',
                            type: 'cdb.company.contacts.main',
                            hideMode: 'offsets',
                            hash: 'contacts',
                            testId: 'companyHeaderContactsButton',
                        },
                        {
                            text: 'Financial',
                            type: 'financials.main',
                            hideMode: 'offsets',
                            hash: 'financial',
                            testId: 'companyHeaderFinancialButton',
                        },
                        {
                            text: 'Agreements',
                            type: 'summary.main',
                            hideMode: 'offsets',
                            hash: 'agreements',
                            testId: 'companyHeaderAgreementsButton',
                        },
                        {
                            text: 'Compliance',
                            type: 'summary.main',
                            hideMode: 'offsets',
                            hash: 'compliance',
                            testId: 'companyHeaderComplianceButton',
                        },
                        {
                            text: 'Files',
                            type: 'summary.main',
                            hideMode: 'offsets',
                            hash: 'files',
                            testId: 'companyHeaderFilesButton',
                        },
                    ],
                    listeners: {
                        activeTabchange: function (tabbar, newTab, oldTab) {
                            window.history.replaceState(
                                {},
                                '',
                                '#company/' + this.upVM().get('routeParams') + '/' + newTab.hash
                            );
                        },
                    },
                },
            ],
        },
    },
});
