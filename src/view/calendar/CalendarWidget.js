Ext.define('Abraxa.view.calendar.CalendarWidget', {
    extend: 'Abraxa.core.components.Container',
    header: false,
    layout: 'fit',
    margin: '8px 16px 16px 8px',
    flex: 1,
    xtype: 'calendar.view.widget',
    items: [
        {
            xtype: 'calendar',
            ui: 'calendar-widget',
            timezoneOffset: 0,
            titleBar: null,
            align: 'center',
            style: {
                margin: '0 !important',
            },
            views: {
                day: {
                    xtype: 'calendar-day',
                    titleTpl: '{start:date("l F d, Y")}',
                    timeFormat: 'h:ia',
                    controlStoreRange: false,
                    startTime: 0,
                    endTime: 24,
                    label: 'Day',
                    weight: 10,
                    dayHeader: null,
                    allowSelection: false,
                    addForm: null,
                    editForm: null,
                    listeners: {
                        painted: function (me, el) {
                            var target = me.el.dom;
                            target.addEventListener('mouseover', function (target) {
                                if (
                                    target.relatedTarget &&
                                    target.relatedTarget.className === 'x-calendar-event-title'
                                ) {
                                    let tipExist = Ext.getCmp('calendarEventTooltip');
                                    if (tipExist) {
                                        tipExist.destroy();
                                    }
                                    var tip = Ext.create('Abraxa.view.common.AbraxaTooltip', {
                                        viewModel: {
                                            data: {
                                                clickedElement: target.relatedTarget,
                                            },
                                        },
                                        id: 'calendarEventTooltip',
                                        minWidth: 240,
                                        bodyPadding: '0 16 16',
                                        listeners: {
                                            beforeshow: function () {
                                                let html =
                                                    '<div class="hbox"><i class="material-icons fs-18 mr-8">today</i>' +
                                                    target.relatedTarget.innerHTML +
                                                    '</div>';
                                                this.setHtml(html);
                                            },
                                        },
                                    });
                                    tip.showBy(target.relatedTarget.closest('div.x-calendar-event'), 'tc-bc?');
                                }
                            });
                        },
                    },
                },
                week: {
                    xtype: 'calendar-week',
                    dayHeaderFormat: 'D d',
                    timeFormat: 'h:ia',
                    controlStoreRange: false,
                    titleTpl: '{start:date("j M")} - {end:date("j M Y")}',
                    label: 'Week',
                    weight: 20,
                    firstDayOfWeek: 1,
                    allowSelection: false,
                    visibleDays: 7,
                    addForm: null,
                    editForm: null,
                    listeners: {
                        painted: function (me, el) {
                            var target = me.el.dom;
                            target.addEventListener('mouseover', function (target) {
                                if (
                                    target.relatedTarget &&
                                    target.relatedTarget.className === 'x-calendar-event-title'
                                ) {
                                    let tipExist = Ext.getCmp('calendarEventTooltip');
                                    if (tipExist) {
                                        tipExist.destroy();
                                    }
                                    var tip = Ext.create('Abraxa.view.common.AbraxaTooltip', {
                                        viewModel: {
                                            data: {
                                                clickedElement: target.relatedTarget,
                                            },
                                        },
                                        id: 'calendarEventTooltip',
                                        minWidth: 240,
                                        bodyPadding: '0 16 16',
                                        listeners: {
                                            beforeshow: function () {
                                                let html =
                                                    '<div class="hbox"><i class="material-icons fs-18 mr-8">today</i>' +
                                                    target.relatedTarget.innerHTML +
                                                    '</div>';
                                                this.setHtml(html);
                                            },
                                        },
                                    });
                                    tip.showBy(target.relatedTarget.closest('div.x-calendar-event'), 'tc-bc?');
                                }
                            });
                        },
                    },
                },
                month: {
                    xtype: 'calendar-month',
                    titleTpl: '{start:date("F Y")}',
                    label: 'Month',
                    margin: 0,
                    style: {
                        background: 'white',
                    },
                    weight: 30,
                    firstDayOfWeek: 1,
                    visibleDays: 7,
                    timeFormat: 'h:ia',
                    allowSelection: false,
                    dayHeaderFormat: 'D d',
                    addForm: null,
                    editForm: null,
                    listeners: {
                        painted: function (me, el) {
                            var target = me.el.dom;
                            target.addEventListener('mouseover', function (target) {
                                if (
                                    target.relatedTarget &&
                                    target.relatedTarget.className === 'x-calendar-event-title'
                                ) {
                                    let tipExist = Ext.getCmp('calendarEventTooltip');
                                    if (tipExist) {
                                        tipExist.destroy();
                                    }
                                    var tip = Ext.create('Abraxa.view.common.AbraxaTooltip', {
                                        viewModel: {
                                            data: {
                                                clickedElement: target.relatedTarget,
                                            },
                                        },
                                        id: 'calendarEventTooltip',
                                        minWidth: 240,
                                        bodyPadding: '0 16 16',
                                        listeners: {
                                            beforeshow: function () {
                                                let html =
                                                    '<div class="hbox"><i class="material-icons fs-18 mr-8">today</i>' +
                                                    target.relatedTarget.innerHTML +
                                                    '</div>';
                                                this.setHtml(html);
                                            },
                                        },
                                    });
                                    tip.showBy(target.relatedTarget.closest('div.x-calendar-event'), 'tc-bc?');
                                }
                            });
                        },
                    },
                },
            },
            defaultView: 'month',
            createButton: null,
            titleBar: {
                xtype: 'toolbar',
                ui: 'calendar-toolbar',
                title: 'Calendar',
                manageBorders: false,
                border: true,
                shadow: true,
            },
            // todayButton: {
            //     xtype: "button",
            //     text: "Today",
            //     ui: "round btn-sm",
            //     margin: "0 8 0 8"
            // },
            todayButton: null,
            sideBar: null,
            store: {
                data: [],
            },
        },
    ],
});
