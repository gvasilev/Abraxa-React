import './ProspectsChart';
import './BerthChart';
import './PortChart';
import './CargoChart';

Ext.define('Abraxa.view.portcall.kpi.KPIs', {
    extend: 'Ext.Container',
    xtype: 'portcall.sof.kpis',
    testId: 'portcallSofKPIs',
    bodyCls: 'a-documents-list a-ops-general-info a-layout-card-wrap',
    flex: 1,
    layout: 'fit',
    viewModel: {
        data: {
            activeView: 'berth',
            prospectDays: 0,
            currentDays: 0,
            days: 0,
            calculateProspects: 0,
        },
        formulas: {
            memberCount: {
                bind: {
                    bindTo: {
                        members: '{membersPerSection}',
                    },
                    deep: true,
                },
                get: function (data) {
                    if (data['members']) {
                        let members = data['members']['kpis'];

                        this.set('sectionMembers', members);
                        this.set('memberPreviewTitle', 'KPIs');

                        return members;
                    }
                },
            },
            calculateProspects: {
                bind: {
                    prospectDays: '{prospectDays}',
                    currentDays: '{currentDays}',
                },
                get: function (data) {
                    if (data.prospectDays && data.currentDays) {
                        let value = data.prospectDays - data.currentDays;
                        return numeral(value).format('0.[0]');
                    }
                },
            },
            calculateDuration: {
                bind: {
                    days: '{days}',
                    currentDays: '{currentDays}',
                },
                get: function (data) {
                    if (data.days && data.currentDays) {
                        let value = data.currentDays - data.days;
                        return numeral(value).format('0.[0]');
                    }
                    return 0;
                },
            },
            prospectsColor: {
                bind: {
                    bindTo: '{calculateProspects}',
                    deep: true,
                },
                get: function (value) {
                    if (Ext.Number.sign(value) === -1) {
                        return 'a-value-down';
                    }
                    if (Ext.Number.sign(value) === 1) {
                        return 'a-value-up';
                    }
                    return '';
                },
            },
            durationColor: {
                bind: {
                    bindTo: '{calculateDuration}',
                    deep: true,
                },
                get: function (value) {
                    if (Ext.Number.sign(value) === -1) {
                        return 'a-item-variation-down';
                    }
                    if (Ext.Number.sign(value) === 1) {
                        return 'a-item-variation-up';
                    }
                    return '';
                },
            },
        },
    },
    items: [
        {
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    cls: 'a-bb-100',
                    height: 64,
                    weight: 1,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'div',
                                    margin: '0 16 0 0',
                                    hidden: true,
                                    html: "<div class='a-badge a-badge-kpis'><i class='md-icon-outlined'>timeline</i></div>",
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-container-title',
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<span>KPIs</span>',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-subtitle',
                                            bind: {
                                                html: '<i class="md-icon-outlined md-icon-group"></i><a href="javascript:void(0)">{memberCount.length} members</a>',
                                                // hidden: '{nonEditable}'
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    fn: function () {
                                                        let vm = this.component.upVM(),
                                                            menu = Ext.create(
                                                                'Abraxa.view.portcall.MembersPreviewMenu',
                                                                {
                                                                    viewModel: {
                                                                        parent: vm,
                                                                    },
                                                                }
                                                            );
                                                        menu.showBy(this);
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    slug: 'portcallKpis',
                    showNoPermissions: true,
                    bind: {
                        permission: '{userPermissions}',
                    },
                    flex: 1,
                    layout: 'vbox',
                    cls: 'a-kpis-main',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-kpis-tabs',
                            docked: 'top',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'center',
                            },
                            items: [
                                {
                                    xtype: 'tabbar',
                                    testId: 'portcallSofKPIsTabbar',
                                    cls: 'a-main-tabs',
                                    animateIndicator: false,
                                    activeTab: 0,
                                    activeTabIndex: 0,
                                    defaults: {
                                        ui: 'tab-main',
                                        ripple: false,
                                    },
                                    items: [
                                        {
                                            text: 'Prospects',
                                            testId: 'portcallSofKPIsTabbarProspectsBtn',
                                        },
                                        {
                                            text: 'Port',
                                            testId: 'portcallSofKPIsTabbarPortBtn',
                                        },
                                        {
                                            text: 'Berth',
                                            testId: 'portcallSofKPIsTabbarBerthBtn',
                                        },
                                        {
                                            text: 'Cargo',
                                            testId: 'portcallSofKPIsTabbarCargoBtn',
                                        },
                                    ],
                                    listeners: {
                                        activeTabchange: function () {
                                            let activeTab = this.getActiveTab(),
                                                mainContainer = Ext.ComponentQuery.query('#chartCard')[0];
                                            mainContainer.setActiveItem(this.items.indexOf(activeTab));
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-kpis-card',
                            itemId: 'chartCard',
                            testId: 'portcallSofKPIsChartCard',
                            flex: 1,
                            layout: {
                                type: 'card',
                                deferRender: false,
                            },
                            defaults: {
                                hideMode: 'offsets',
                            },
                            items: [
                                {
                                    xtype: 'portcall.kpi.prospects.chart',
                                },
                                {
                                    xtype: 'portcall.kpi.port.chart',
                                },
                                {
                                    xtype: 'portcall.kpi.berth.chart',
                                },
                                {
                                    xtype: 'portcall.kpi.cargo.chart',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
