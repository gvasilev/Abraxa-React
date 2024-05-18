import './ViewModel.jsx';
import './ChoiceForm.jsx';
import './ChoiceFormCustom.jsx';
import './ChoiceFormCustomFormula.jsx';
import './ChoiceFormNomenclature.jsx';
import './ChoiceFormTariffTable.jsx';
import './ComplexForm.jsx';
import './ComplexPrefixFormCustom.jsx';
import './ComplexPrefixFormCustomFormula.jsx';
import './ComplexPrefixFormNomenclature.jsx';
import './ComplexPrefixFormTariffTable.jsx';
import './ComplexSuffixFormCustom.jsx';
import './ComplexSuffixFormCustomFormula.jsx';
import './ComplexSuffixFormNomenclature.jsx';
import './ComplexSuffixFormTariffTable.jsx';
import './NumberForm.jsx';

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
