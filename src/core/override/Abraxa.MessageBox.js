Ext.define('Abraxa.MessageBox', {
    override: 'Ext.MessageBox',
    manageBorders: false,
    zIndex: 9999,
    info: function (title, message, fn, scope) {
        return this.show({
            title: title || null,
            message: message || null,
            buttons: Ext.MessageBox.OK,
            defaultFocus: '#ok',
            prompt: false,
            ui: 'info',

            fn: function () {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            },
            scope: scope,
        });
    },

    warning: function (title, message, fn, scope) {
        return this.show({
            title:
                `<div class="hbox"><div class="a-badge a-badge-warning mr-16 my-8"><i class="material-icons-outlined">report_problem</i></div>${title}</div>` ||
                null,
            message: message || null,
            buttons: {
                Ok: {
                    ui: 'action',
                    text: 'OK',
                },
            },
            defaultFocus: '#ok',
            prompt: false,
            ui: 'warning',

            fn: function () {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            },
            scope: scope,
        });
    },

    error: function (title, message, fn, scope) {
        return this.show({
            title: title || null,
            message: message || null,
            buttons: Ext.MessageBox.OK,
            defaultFocus: '#ok',
            prompt: false,
            ui: 'error',

            fn: function () {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            },
            scope: scope,
        });
    },

    alert: function (title, message, fn, scope, buttons) {
        return this.show({
            title: title || null,
            message: message || null,
            buttons: buttons || Ext.MessageBox.OK,
            defaultFocus: '#ok',
            prompt: false,
            ui: 'alert',
            fn: function () {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            },
            scope: scope,
        });
    },

    confirm: function (title, message, fn, scope, buttons, icon) {
        if (icon) {
            title = `<div class="hbox">${icon}${title}</div>`;
        }
        return this.show({
            title: title || null,
            message: message || null,
            buttons: buttons || Ext.MessageBox.YESNO,
            defaultFocus: '#yes',
            prompt: false,
            scope: scope,
            ui: 'confirm',
            fn: function () {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            },
        });
    },

    prompt: function (title, message, fn, scope, multiLine, value, prompt, buttons) {
        return this.show({
            title: title || null,
            message: message || null,
            buttons: buttons || Ext.MessageBox.OKCANCEL,
            scope: scope,
            prompt: prompt || true,
            defaultFocus: 'textfield',
            multiLine: multiLine,
            value: value,
            ui: 'prompt',

            fn: function () {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            },
        });
    },

    validate: function (title, message, fn, scope) {
        return this.show({
            title: title || null,
            message: message || null,
            buttons: Ext.MessageBox.YESNO,
            defaultFocus: '#yes',
            prompt: false,
            scope: scope,
            ui: 'validate',

            fn: function () {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            },
        });
    },
});
