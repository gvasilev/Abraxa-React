Ext.define('Abraxa.view.notes.MentionDiv', {
    extend: 'Abraxa.core.components.Div',
    xtype: 'mention.div',
    testId: 'mentionDiv',
    initMention: function (el) {
        if (!myMention) {
            var data = Ext.getCmp('main-viewport').upVM().get('usersForMention');
            var fieldId = '#mention',
                myMention = new Mention({
                    input: el.querySelector(fieldId),
                    reverse: true,
                    options: data,
                    // update: function () {
                    //     document.querySelector('#data').innerHTML = JSON.stringify(this.findMatches(), null, '\t')
                    // },
                    match: function (word, option) {
                        return (
                            option.name.startsWith(word) ||
                            option.description.toLowerCase().indexOf(word.toLowerCase()) >= 0
                        );
                    },
                    template: function (option) {
                        switch (option.type) {
                            case 'user':
                                let avatar =
                                    '<div class="a-person a-icon-round"><span class="a-int">' +
                                    option.abbr +
                                    '</span></div>';
                                if (option.profile_image && option.profile_image != '') {
                                    let img = option.profile_image;
                                    avatar =
                                        '<div class="a-person a-icon-round"><img data-id="last_updated_by_appointments" class="a-profile-image" height="22" src="' +
                                        img +
                                        '"></div>';
                                }
                                return (
                                    avatar +
                                    ' ' +
                                    option.full_name +
                                    (option.description
                                        ? ' <span class="mention_description">(' + option.description + ')</span>'
                                        : '') +
                                    '<span class="menition_type">' +
                                    option.type +
                                    '</span>'
                                );

                            // case 'cargo':
                            //     return '<div class="a-cargo" style="margin-left: 32px">' + option.name + (option.description ? ' <span class="mention_description">(' + option.description + ')</span>' : '') + '<span class="menition_type">' + option.type + '</span></div>';

                            // case 'berth':
                            //     return '<div class="a-berth" style="margin-left: 32px">' + option.name + (option.description ? '&nbsp;<span class="mention_description">(' + option.description + ')</span>' : '') + '<span class="menition_type">' + option.type + '</span></div>';

                            // case 'file':
                            //     return '<div class="a-file" style="margin-left: 32px">' + option.name + (option.description ? ' <span class="mention_description">(' + option.description + ')</span>' : '') + '<span class="menition_type">' + option.type + '</span></div>';

                            // default:
                            //     return option.name + (option.description ? '&nbsp;<span class="mention_description">(' + option.description + ')</span>' : '') + '<span class="menition_type">' + option.type + '</span>';
                        }
                    },
                });

            // [optional] make sure focus is on the element
            el.querySelector(fieldId).focus();
            // select all the content in the element
            document.execCommand('selectAll', false, null);
            // collapse selection to the end
            document.getSelection().collapseToEnd();
            if (
                el.querySelector(fieldId).lastChild &&
                el.querySelector(fieldId).lastChild.scrollIntoView &&
                typeof el.querySelector(fieldId).lastChild.scrollIntoView == 'function'
            )
                el.querySelector(fieldId).lastChild.scrollIntoView();
        }
    },
    ui: 'classic no-border',
    placeholder: 'Leave a note',
    flex: 1,
    cls: 'mention_enabled input_with_mention_main',
    html: '<div id="mention" contenteditable="true" class="content_editable_element" data-placeholder="Leave a note"></div>',
    bind: {
        html: '<div id="mention" contenteditable="true" class="content_editable_element" data-placeholder="Leave a note">{record.note}</div>',
    },
    setHtml: function (html) {
        if (this.el.dom) {
            this.el.dom.innerHTML = html;
            this.initMention(this.el.dom);
        }
        return this;
    },
    listeners: {
        click: {
            element: 'element',
            delegate: 'a',
            fn: function (el) {
                let type = el.currentTarget.getAttribute('data-object-type');
                let vm = this.component.upVM();

                switch (type) {
                    case 'user':
                        let tipExist = Ext.getCmp('notesInputPersonTooltip');
                        if (tipExist) {
                            tipExist.destroy();
                        }
                        Ext.create('Abraxa.view.common.tooltips.PersonToolTip', {
                            id: 'notesInputPersonTooltip',
                            viewModel: {
                                parent: vm,
                                data: {
                                    user_id: el.currentTarget.getAttribute('data-object-id'),
                                    clickedElement: el.target,
                                },
                            },
                        }).showBy(el, 'bc-tc?');
                        break;
                }
            },
        },
    },
});
