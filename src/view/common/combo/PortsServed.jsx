import '../../../store/common/port/PortsServedAll';

Ext.define('Abraxa.view.common.combo.PortsServed', {
    extend: 'Ext.field.ComboBox',
    xtype: 'ports.served.combo',
    label: 'Ports',
    selectable: true,
    forceSelection: true,
    placeholder: 'Choose port',
    itemTpl: `<div class="combo-item">
                 <div class="sm-icon"><i class="md-icon-outlined md-18">place</i></div>
                      <span>
                        <label class="sm-type">{port.code}</label>
                         <tpl if="values.reference"><span class="sm-type ml-4">({reference})</span></tpl>
                        </span>
                   <div class="sm-value">{port.name}</div>
               </div>`,
    valueField: 'port_id',
    displayField: 'port_name',
    queryMode: 'local',
    store: {
        type: 'ports.served.all',
        autoLoad: true,
    },
});
