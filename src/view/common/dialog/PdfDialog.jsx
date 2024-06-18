Ext.define('Abraxa.view.common.dialog.PdfDialog', {
    extend: 'Ext.Dialog',
    xtype: 'adocs-pdf-dialog',
    manageBorders: false,
    ui: 'dark',
    cls: 'a-dialog-docs',
    height: '90%',
    maxWidth: '65%',
    alwaysOnTop: true,
    minWidth: '960',
    minHeight: '64%',
    scrollable: true,
    tools: {
        save_file: {
            iconCls: 'md-icon-outlined md-icon-save-alt',
            tooltip: 'Download',
            handler: function () {
                var record = this.upVM().get('file'),
                    name = record.get('name'),
                    urlToSend = Env.ApiEndpoint + 'file/' + record.get('document_id') + '/download/' + name,
                    form = Ext.DomHelper.append(document.body, {
                        tag: 'form',
                        method: 'get',
                        standardSubmit: true,
                        action: urlToSend,
                    });
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
            },
        },
        close: {
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
    draggable: false,
    maximizable: true,
    modal: true,
    padding: 0,
    margin: 0,
    layout: 'fit',
    maximized: true,
    bind: {
        title: {
            padding: '8 0',
            html: '<div class="hbox"><span class="file-icon-new file-icon-sm-new file-icon-dark" data-type="{file.document.extension}"></span><span class="a-file-name" style="padding-left: 8px">{file.name}</span></div>',
        },
    },
    maximizeAnimation: null,
    restoreAnimation: null,
});
