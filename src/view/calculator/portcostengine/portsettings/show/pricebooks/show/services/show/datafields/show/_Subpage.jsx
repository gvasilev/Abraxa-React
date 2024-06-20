import './ViewModel';
import './ChoiceForm';
import './ChoiceFormCustom';
import './ChoiceFormCustomFormula';
import './ChoiceFormNomenclature';
import './ChoiceFormTariffTable';
import './ComplexForm';
import './ComplexPrefixFormCustom';
import './ComplexPrefixFormCustomFormula';
import './ComplexPrefixFormNomenclature';
import './ComplexPrefixFormTariffTable';
import './ComplexSuffixFormCustom';
import './ComplexSuffixFormCustomFormula';
import './ComplexSuffixFormNomenclature';
import './ComplexSuffixFormTariffTable';
import './NumberForm';

Ext.define(
    'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafields.show._Subpage',
    {
        extend: 'Ext.Container',
        xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafields.show.subpage',
        viewModel: 'calculator.portcostengine.pricebooks.show.services.show.datafields.show',
        scrollable: true,
        flex: 1,
        layout: {
            type: 'card',
            flex: 1,
        },
        bind: {
            items: '{dataFieldActiveItemForm}',
        },
    }
);
