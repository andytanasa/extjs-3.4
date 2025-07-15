/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.onReady(function() {
    var form = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        layout:'absolute',
        url:'save-form.php',
        defaultType: 'textfield',

         items: [
            // "Send To" label
            {
                x: 0, y: 5,
                xtype: 'label',
                text: 'Send To:',
                forId: 'to-input'
            },
            // "Send To" field
            {
                x: 60, y: 0,
                name: 'to',
                id: 'to-input',
                anchor: '100%'
            },
            // "Subject" label
            {
                x: 0, y: 35,
                xtype: 'label',
                text: 'Subject:',
                forId: 'subject-input'
            },
            // "Subject" field
            {
                x: 60, y: 30,
                name: 'subject',
                id: 'subject-input',
                anchor: '100%'
            },
            // "Message" label
            {
                x: 0, y: 65,
                xtype: 'label',
                text: 'Message:',
                forId: 'msg-input'
            },
            // "Message" textarea
            {
                x: 60, y: 60,
                xtype: 'textarea',
                name: 'msg',
                id: 'msg-input',
                anchor: '100% 100%'
            }
        ]
    });

    var window = new Ext.Window({
        title: 'Resize Me',
        width: 500,
        height:300,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        bodyStyle:'padding:5px;',
        buttonAlign:'center',
        items: form,

        buttons: [{
            text: 'Send'
        },{
            text: 'Cancel'
        }]
    });

    window.show();
});