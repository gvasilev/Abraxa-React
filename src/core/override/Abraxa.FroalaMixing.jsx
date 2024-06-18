Ext.define('Abraxa.FroalaMixing', {
    override: 'Ext.froala.Mixin',

    onFroalaContentChanged: function () {
        if (this.getEditor()) {
            this.setValue(this.getEditor().html.get());
        }
    },

    updateDisabled: function (disabled) {
        var editor = this.getEditor();

        if (editor && disabled) {
            editor.edit[disabled ? 'off' : 'on']();
        }
    },
});
