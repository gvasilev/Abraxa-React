Ext.define('Abraxa.view.portcall.principal.disbursements.services.DisbursementServicesGroupHeader', {
    extend: 'Ext.Container',
    xtype: 'DisbursementServicesGroupHeader',
    isGroupHeader: true,
    mixins: ['Ext.mixin.Toolable', 'Ext.dataview.Pinnable'],
    layout: {
        type: 'hbox',
        align: 'center',
    },
    height: 48,
    padding: 0,
    config: {
        /**
         * @cfg {Ext.dataview.ListGroup} group
         * The `ListGroup` instance for the this group.
         *
         * NOTE: Prior to version 7.0, this was the {@link Ext.data.Group collection}
         * of {@link Ext.data.Model records} in the group. Instead of `getGroup()` now
         * returning the collection of records, use `getGroup().data`.
         *
         * @readonly
         * @since 6.5.0
         */
        group: null,

        contentWidth: null,
        pdaTotal: null,
        ddaTotal: null,
        fdaTotal: null,
        variance: null,
    },
    classCls: Ext.baseCSSPrefix + 'itemheader',

    inheritUi: true,

    toolDefaults: {
        ui: 'itemheader',
    },

    template: [
        {
            reference: 'bodyElement',
            cls: Ext.baseCSSPrefix + 'body-el',
            uiCls: 'body-el',
        },
    ],
    updateGroup: function (group, oldGroup) {
        var me = this,
            data,
            grouper,
            html,
            list,
            tpl;

        if (oldGroup && group !== oldGroup && oldGroup.getHeader() === me) {
            oldGroup.setHeader(null);
        }

        if (group) {
            group.setHeader(me);

            list = me.parent;
            grouper = list.getStore().getGrouper();

            // See if the grouper belongs to this list and has a headerTpl override
            // in place (see Ext.grid.Column).
            tpl = (grouper && grouper.owner === list && grouper.headerTpl) || me.getTpl();

            if (tpl) {
                data = me.getGroupHeaderTplData();
                html = tpl.apply(data);
            }

            let disbursementCurrency = group.header.upVM().get('selectedDisbursement.disbursement_currency');
            me.pdaTotal = group.data.sum('pda_final_price');
            me.ddaTotal = group.data.sum('dda_final_price');
            me.fdaTotal = group.data.sum('fda_final_price');
            me.sdaTotal = group.data.sum('sda_final_price');
            me.variance = me.calculateVariance(me.pdaTotal, me.ddaTotal, me.fdaTotal);

            me.down('[cls~="group_header_title"]').setHtml(html || '\xa0');
            me.down('#pdaTotal').setHtml(
                '<span class="c-grey mr-8 fw-n">' +
                    disbursementCurrency +
                    '</span>' +
                    Ext.util.Format.number(group.data.sum('pda_final_price'), '0,000.00')
            );
            me.down('#ddaTotal').setHtml(
                '<span class="c-grey mr-8 fw-n">' +
                    disbursementCurrency +
                    '</span>' +
                    Ext.util.Format.number(group.data.sum('dda_final_price'), '0,000.00')
            );
            me.down('#fdaTotal').setHtml(
                '<span class="c-grey mr-8 fw-n">' +
                    disbursementCurrency +
                    '</span>' +
                    Ext.util.Format.number(group.data.sum('fda_final_price'), '0,000.00')
            );
            me.down('#sdaTotal').setHtml(
                '<span class="c-grey mr-8 fw-n">' +
                    disbursementCurrency +
                    '</span>' +
                    Ext.util.Format.number(group.data.sum('sda_final_price'), '0,000.00')
            );

            me.down('#variance').setHtml(me.variance);

            // me.down('#pdaTotal').setHidden(!group.collapsed);
            // me.down('#ddaTotal').setHidden(!group.collapsed);
            // me.down('#fdaTotal').setHidden(!group.collapsed);

            // if (group.collapsed) {
            //     me.addCls('a-bb-100');
            // } else {
            //     me.removeCls('a-bb-100');
            // }
        }
    },
    setGroup: function (group) {
        var me = this,
            was = me._group;

        // We short-circuit the change detection because the content of the group
        // can change but yet the reference is the same...
        me._group = group;
        me.updateGroup(group, was);

        return me;
    },
    getScrollerTarget: function () {
        return this.el;
    },

    doDestroy: function () {
        this.mixins.toolable.doDestroy.call(this);
        this.callParent();
    },

    calculateVariance: function (pda, dda, fda) {
        let start_price = pda ? pda : dda,
            final_price = fda ? fda : dda;

        //OLD BETTER LOGIC

        // if (final_price == 0 && start_price)
        //     final_price = start_price;

        // if (start_price == 0 && final_price)
        //     start_price = final_price;

        // if (!start_price && !final_price)
        //     return;

        if (final_price == 0 && start_price) return '<span class="a-cell-placeholder">---</span>';

        if (!start_price && final_price) return '<span class="a-cell-placeholder">---</span>';

        if (!start_price && !final_price) return '<span class="a-cell-placeholder">---</span>';

        if (start_price == final_price) return '<span class="a-cell-placeholder">---</span>';

        const reDiff = function relDiff(a, b) {
            return Math.abs((b - a) / a) * 100;
        };

        let variance = parseFloat(reDiff(start_price, final_price)).toFixed(1),
            sign = start_price > final_price ? '-' : start_price < final_price ? '+' : '',
            cls = start_price > final_price ? 'c-red' : start_price < final_price ? 'c-green' : 'c-blue',
            icon =
                start_price > final_price
                    ? 'trending_down'
                    : start_price < final_price
                      ? 'trending_up'
                      : 'trending_flat';

        return (
            '<div class="hbox ' +
            cls +
            '"><i class="material-icons-outlined md-16 ' +
            cls +
            '">' +
            icon +
            '</i><span class="ml-8">' +
            sign +
            '' +
            variance +
            '%</span></div>'
        );
    },

    privates: {
        augmentToolHandler: function (tool, args) {
            // args = [ itemHeader, tool, ev ]   ==>   [ list, info ]
            var info = (args[1] = {
                event: args.pop(),
                group: this.getGroup(),
                itemHeader: args[0],
                tool: args[1],
            });

            args[0] = info.list = this.parent;
        },

        getGroupHeaderTplData: function (skipHtml) {
            var group = this.getGroup(),
                list = this.parent,
                collection = group && group.data,
                data = collection && {
                    name: collection.getGroupKey(),
                    group: group,
                    groupField: list.getStore().getGrouper().getProperty(),
                    children: collection.items,
                    count: collection.length,
                };

            if (data && collection.getCount()) {
                data.value = collection.items[0].data[data.groupField];
            }

            if (!skipHtml) {
                data.html = Ext.htmlEncode(data.name);
            }

            // For Classic compat:
            data.groupValue = data.value;

            return data;
        },

        getList: function () {
            return this.parent; // backward compat
        },

        onToggleCollapse: function () {
            this.getGroup().toggleCollapsed();
        },

        updateContentWidth: function (width) {
            var el = this._toolDockWrap || this.bodyElement;

            if (el) {
                el.setWidth(width ? width : null);
            }
        },
    },
    items: [
        {
            xtype: 'div',
            cls: 'group_header_title cursor-pointer a-link',
            width: 238,
        },
        {
            xtype: 'div',
            matchesColumn: 'cost_center',
            width: 140,
            bind: {
                hidden: '{disbursementItemsGrid.grouped ? true : false}',
            },
        },
        {
            xtype: 'div',
            matchesColumn: 'accounting_code',
            width: 130,
        },
        {
            xtype: 'div',
            matchesColumn: 'vendor',
            width: 180,
        },
        {
            xtype: 'container',
            cls: 'text-right a-grid-compact a-cell-amount',
            itemId: 'pdaTotal',
            width: 160,
            // height: 48,
            padding: '16 12',
            bind: {
                hidden: '{(selectedDisbursement.pda_id || selectedDisbursement.type == "pda") && selectedDisbursement.type != "sda" ? false : true}',
            },
        },
        {
            xtype: 'container',
            cls: 'text-right a-grid-compact a-cell-amount',
            itemId: 'ddaTotal',
            padding: '16 12',
            width: 160,
            bind: {
                hidden: '{((selectedDisbursement.dda_id || selectedDisbursement.type == "dda") && selectedDisbursement.type != "pda") && selectedDisbursement.type != "sda" ? false : true}',
            },
        },
        {
            xtype: 'container',
            cls: 'text-right a-grid-compact a-cell-amount',
            itemId: 'sdaTotal',
            padding: '16 12',
            width: 160,
            bind: {
                hidden: '{selectedDisbursement.type == "sda" ? false : true}',
            },
        },
        {
            xtype: 'container',
            cls: 'text-right a-grid-compact a-cell-amount',
            itemId: 'fdaTotal',
            padding: '16 12',
            width: 160,
            bind: {
                hidden: '{selectedDisbursement.type == "fda" ? false : true}',
            },
        },
        {
            xtype: 'container',
            flex: 1,
            cls: 'a-grid-compact a-cell-amount',
            itemId: 'variance',
            padding: '16 12',
        },
    ],
    listeners: {
        click: {
            element: 'element',
            delegate: '.group_header_title',
            fn: function () {
                this.component.onToggleCollapse();
            },
        },
    },
});
