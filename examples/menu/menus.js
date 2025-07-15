/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.onReady(function(){
    Ext.QuickTips.init();

    // Menus can be prebuilt and passed by reference
    var dateMenu = new Ext.menu.DateMenu({
        handler: function(dp, date){
            Ext.example.msg('Date Selected', 'You chose {0}.', date.format('M j, Y'));
        },
        ariaRole: 'menu' // Add ARIA role
    });

    var colorMenu = new Ext.menu.ColorMenu({
        handler: function(cm, color){
            Ext.example.msg('Color Selected', 'You chose {0}.', color);
        },
        ariaRole: 'menu' // Add ARIA role
    });

    var store = new Ext.data.ArrayStore({
        fields: ['abbr', 'state'],
        data : Ext.exampledata.states // from states.js
    });

    var combo = new Ext.form.ComboBox({
        store: store,
        displayField: 'state',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText: 'Select a state...',
        selectOnFocus: true,
        width: 135,
        getListParent: function() {
            return this.el.up('.x-menu');
        },
        iconCls: 'no-icon',
        ariaRole: 'combobox', // Add ARIA role
        ariaLabel: 'State selection' // Add ARIA label
    });

    var menu = new Ext.menu.Menu({
        id: 'mainMenu',
        style: {
            overflow: 'visible'     // For the Combo popup
        },
        ariaRole: 'menu', // Add ARIA role
        items: [
            { xtype: 'menutextitem', text: '<label for="' + combo.getId() + '">Select a state:</label>' },
            combo,                  // A Field in a Menu
            {
                text: 'I like Ext',
                checked: true,       // when checked has a boolean value, it is assumed to be a CheckItem
                checkHandler: onItemCheck,
                ariaRole: 'menuitemcheckbox', // Add ARIA role
                ariaLabel: 'I like Ext checkbox' // Add ARIA label
            }, '-', {
                text: 'Radio Options',
                menu: {        // <-- submenu by nested config object
                    ariaRole: 'menu', // Add ARIA role
                    items: [
                        '<b class="menu-title">Choose a Theme</b>',
                        {
                            text: 'Aero Glass',
                            checked: true,
                            group: 'theme',
                            checkHandler: onItemCheck,
                            ariaRole: 'menuitemradio', // Add ARIA role
                            ariaLabel: 'Aero Glass radio button' // Add ARIA label
                        }, {
                            text: 'Vista Black',
                            checked: false,
                            group: 'theme',
                            checkHandler: onItemCheck,
                            ariaRole: 'menuitemradio', // Add ARIA role
                            ariaLabel: 'Vista Black radio button' // Add ARIA label
                        }, {
                            text: 'Gray Theme',
                            checked: false,
                            group: 'theme',
                            checkHandler: onItemCheck,
                            ariaRole: 'menuitemradio', // Add ARIA role
                            ariaLabel: 'Gray Theme radio button' // Add ARIA label
                        }, {
                            text: 'Default Theme',
                            checked: false,
                            group: 'theme',
                            checkHandler: onItemCheck,
                            ariaRole: 'menuitemradio', // Add ARIA role
                            ariaLabel: 'Default Theme radio button' // Add ARIA label
                        }
                    ]
                }
            },{
                text: 'Choose a Date',
                iconCls: 'calendar',
                menu: dateMenu // <-- submenu by reference
            },{
                text: 'Choose a Color',
                menu: colorMenu // <-- submenu by reference
            }
        ]
    });

    var tb = new Ext.Toolbar();
    tb.render('toolbar');

    tb.add({
            text:'Button w/ Menu',
            iconCls: 'bmenu',  // <-- icon
            menu: menu,  // assign menu by instance
            ariaRole: 'button', // Add ARIA role
            ariaLabel: 'Button with menu' // Add ARIA label
        }, {
            text: 'Users',
            iconCls: 'user',
            menu: {
                xtype: 'menu',
                plain: true,
                ariaRole: 'menu', // Add ARIA role
                items: {
                    xtype: 'buttongroup',
                    title: 'User options',
                    autoWidth: true,
                    columns: 2,
                    defaults: {
                        xtype: 'button',
                        scale: 'large',
                        width: '100%',
                        iconAlign: 'left',
                        ariaRole: 'button' // Add ARIA role
                    },
                    items: [{
                        text: 'User<br/>manager',
                        iconCls: 'edit',
                        ariaLabel: 'User manager button' // Add ARIA label
                    },{
                        iconCls: 'add',
                        width: 'auto',
                        tooltip: 'Add user',
                        ariaLabel: 'Add user button' // Add ARIA label
                    },{
                        colspan: 2,
                        text: 'Import',
                        scale: 'small',
                        ariaLabel: 'Import button' // Add ARIA label
                    },{
                        colspan: 2,
                        text: 'Who is online?',
                        scale: 'small',
                        ariaLabel: 'Who is online button' // Add ARIA label
                    }]
                }
            }
        },
        new Ext.Toolbar.SplitButton({
            text: 'Split Button',
            handler: onButtonClick,
            tooltip: {text:'This is a an example QuickTip for a toolbar item', title:'Tip Title'},
            iconCls: 'blist',
            ariaRole: 'button', // Add ARIA role
            ariaLabel: 'Split button' // Add ARIA label
        })
    
    );
    tb.doLayout();
    

    // functions to display feedback
    function onButtonClick(btn){
        Ext.example.msg('Button Click','You clicked the "{0}" button.', btn.text);
    }

    function onItemClick(item){
        Ext.example.msg('Menu Click', 'You clicked the "{0}" menu item.', item.text);
    }

    function onItemCheck(item, checked){
        Ext.example.msg('Item Check', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
    }

    function onItemToggle(item, pressed){
        Ext.example.msg('Button Toggled', 'Button "{0}" was toggled to {1}.', item.text, pressed);
    }

});