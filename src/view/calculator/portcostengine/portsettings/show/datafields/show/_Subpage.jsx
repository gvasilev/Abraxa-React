import './ViewModel.jsx';
import './ChoiceForm.jsx';
import './ChoiceFormNomenclature.jsx';
import './ComplexPrefixFormNomenclature.jsx';
import './ComplexForm.jsx';
import './ChoiceFormCustom.jsx';
import './NumberForm.jsx';
import './ComplexPrefixFormCustom.jsx';
import './ChoiceFormCustomFormula.jsx';
import './ChoiceFormTariffTable.jsx';
import './ComplexPrefixFormCustomFormula.jsx';
import './ComplexPrefixFormTariffTable.jsx';
import './ComplexSuffixFormCustom.jsx';
import './ComplexSuffixFormCustomFormula.jsx';
import './ComplexSuffixFormNomenclature.jsx';
import './ComplexSuffixFormTariffTable.jsx';
Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show._Subpage', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.datafields.show.subpage',
    viewModel: 'calculator.portcostengine.datafields.show',
    scrollable: true,
    flex: 1,
    bind: {
        items: '{dataFieldActiveItemForm}',
    },
});
