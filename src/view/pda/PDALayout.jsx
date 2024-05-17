import './PDAViewModel';
import './PDAController';
import './PDALeftMenu';
import './PDAItemsGrid';
import './PDAGridViewReadOnly';
import './calculation/PDACalculationGridView';
import './PDADotsMenu';

Ext.define('Abraxa.view.pda.PDALayout', {
    extend: 'Ext.Container',
    xtype: 'pda.layout',
    alias: 'widget.pda',
    bodyCls: 'a-layout-card-wrap',
    viewModel: 'pda-viewmodel',
    controller: 'pda-controller',
    layout: 'fit',
    flex: 1,
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                { xtype: 'pda.left.menu' },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    flex: 1,
                    bind: {
                        items: '{showView}',
                    },
                },
            ],
        },
    ],
});
