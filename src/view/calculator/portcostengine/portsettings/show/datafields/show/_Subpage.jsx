import './ViewModel';
import './ChoiceForm';
import './ChoiceFormNomenclature';
import './ComplexPrefixFormNomenclature';
import './ComplexForm';
import './ChoiceFormCustom';
import './NumberForm';
import './ComplexPrefixFormCustom';
import './ChoiceFormCustomFormula';
import './ChoiceFormTariffTable';
import './ComplexPrefixFormCustomFormula';
import './ComplexPrefixFormTariffTable';
import './ComplexSuffixFormCustom';
import './ComplexSuffixFormCustomFormula';
import './ComplexSuffixFormNomenclature';
import './ComplexSuffixFormTariffTable';

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
