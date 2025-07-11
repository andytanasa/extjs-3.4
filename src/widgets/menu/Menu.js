/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.menu.Menu
 * @extends Ext.Container
 * <p>A menu object.  This is the container to which you may add menu items.  Menu can also serve as a base class
 * when you want a specialized menu based off of another component (like {@link Ext.menu.DateMenu} for example).</p>
 * <p>Menus may contain either {@link Ext.menu.Item menu items}, or general {@link Ext.Component Component}s.</p>
 * <p>To make a contained general {@link Ext.Component Component} line up with other {@link Ext.menu.Item menu items}
 * specify <tt>iconCls: 'no-icon'</tt>.  This reserves a space for an icon, and indents the Component in line
 * with the other menu items.  See {@link Ext.form.ComboBox}.{@link Ext.form.ComboBox#getListParent getListParent}
 * for an example.</p>
 * <p>By default, Menus are absolutely positioned, floating Components. By configuring a Menu with
 * <b><tt>{@link #floating}:false</tt></b>, a Menu may be used as child of a Container.</p>
 *
 * @xtype menu
 */
Ext.menu.Menu = Ext.extend(Ext.Container, {
    /**
     * @cfg {Object} defaults
     * A config object that will be applied to all items added to this container either via the {@link #items}
     * config or via the {@link #add} method.  The defaults config can contain any number of
     * name/value property pairs to be added to each item, and should be valid for the types of items
     * being added to the menu.
     */
    /**
     * @cfg {Mixed} items
     * An array of items to be added to this menu. Menus may contain either {@link Ext.menu.Item menu items},
     * or general {@link Ext.Component Component}s.
     */
    /**
     * @cfg {Number} minWidth The minimum width of the menu in pixels (defaults to 120)
     */
    minWidth : 120,
    /**
     * @cfg {Boolean/String} shadow True or 'sides' for the default effect, 'frame' for 4-way shadow, and 'drop'
     * for bottom-right shadow (defaults to 'sides')
     */
    shadow : 'sides',
    /**
     * @cfg {String} subMenuAlign The {@link Ext.Element#alignTo} anchor position value to use for submenus of
     * this menu (defaults to 'tl-tr?')
     */
    subMenuAlign : 'tl-tr?',
    /**
     * @cfg {String} defaultAlign The default {@link Ext.Element#alignTo} anchor position value for this menu
     * relative to its element of origin (defaults to 'tl-bl?')
     */
    defaultAlign : 'tl-bl?',
    /**
     * @cfg {Boolean} allowOtherMenus True to allow multiple menus to be displayed at the same time (defaults to false)
     */
    allowOtherMenus : false,
    /**
     * @cfg {Boolean} ignoreParentClicks True to ignore clicks on any item in this menu that is a parent item (displays
     * a submenu) so that the submenu is not dismissed when clicking the parent item (defaults to false).
     */
    ignoreParentClicks : false,
    /**
     * @cfg {Boolean} enableScrolling True to allow the menu container to have scroller controls if the menu is too long (defaults to true).
     */
    enableScrolling : true,
    /**
     * @cfg {Number} maxHeight The maximum height of the menu. Only applies when enableScrolling is set to True (defaults to null).
     */
    maxHeight : null,
    /**
     * @cfg {Number} scrollIncrement The amount to scroll the menu. Only applies when enableScrolling is set to True (defaults to 24).
     */
    scrollIncrement : 24,
    /**
     * @cfg {Boolean} showSeparator True to show the icon separator. (defaults to true).
     */
    showSeparator : true,
    /**
     * @cfg {Array} defaultOffsets An array specifying the [x, y] offset in pixels by which to
     * change the default Menu popup position after aligning according to the {@link #defaultAlign}
     * configuration. Defaults to <tt>[0, 0]</tt>.
     */
    defaultOffsets : [0, 0],

    /**
     * @cfg {Boolean} plain
     * True to remove the incised line down the left side of the menu. Defaults to <tt>false</tt>.
     */
    plain : false,

    /**
     * @cfg {Boolean} floating
     * <p>By default, a Menu configured as <b><code>floating:true</code></b>
     * will be rendered as an {@link Ext.Layer} (an absolutely positioned,
     * floating Component with zindex=15000).
     * If configured as <b><code>floating:false</code></b>, the Menu may be
     * used as child item of another Container instead of a free-floating
     * {@link Ext.Layer Layer}.
     */
    floating : true,


    /**
     * @cfg {Number} zIndex
     * zIndex to use when the menu is floating.
     */
    zIndex: 15000,

    // private
    hidden : true,

    /**
     * @cfg {String/Object} layout
     * This class assigns a default layout (<code>layout:'<b>menu</b>'</code>).
     * Developers <i>may</i> override this configuration option if another layout is required.
     * See {@link Ext.Container#layout} for additional information.
     */
    layout : 'menu',
    hideMode : 'offsets',    // Important for laying out Components
    scrollerHeight : 8,
    autoLayout : true,       // Provided for backwards compat
    defaultType : 'menuitem',
    bufferResize : false,

    initComponent : function(){
        if(Ext.isArray(this.initialConfig)){
            Ext.apply(this, {items:this.initialConfig});
        }
        this.addEvents(
            /**
             * @event click
             * Fires when this menu is clicked (or when the enter key is pressed while it is active)
             * @param {Ext.menu.Menu} this
            * @param {Ext.menu.Item} menuItem The menu item that was clicked
             * @param {Ext.EventObject} e
             */
            'click',
            /**
             * @event mouseover
             * Fires when the mouse is hovering over this menu
             * @param {Ext.menu.Menu} this
             * @param {Ext.EventObject} e
             * @param {Ext.menu.Item} menuItem The menu item that was clicked
             */
            'mouseover',
            /**
             * @event mouseout
             * Fires when the mouse exits this menu
             * @param {Ext.menu.Menu} this
             * @param {Ext.EventObject} e
             * @param {Ext.menu.Item} menuItem The menu item that was clicked
             */
            'mouseout',
            /**
             * @event itemclick
             * Fires when a menu item contained in this menu is clicked
             * @param {Ext.menu.BaseItem} baseItem The BaseItem that was clicked
             * @param {Ext.EventObject} e
             */
            'itemclick'
        );
        Ext.menu.MenuMgr.register(this);
        if(this.floating){
            Ext.EventManager.onWindowResize(this.hide, this);
        }else{
            if(this.initialConfig.hidden !== false){
                this.hidden = false;
            }
            this.internalDefaults = {hideOnClick: false};
        }
        Ext.menu.Menu.superclass.initComponent.call(this);
        // Accessibility: label form fields before menu is shown
        this.on('beforeshow', function(){
            this.items.each(function(item){
                if(item.isFormField && item.el){
                    var inp = item.el.dom.getElementsByTagName('input')[0];
                    if(inp && item.emptyText){
                        inp.setAttribute('aria-label', item.emptyText);
                    }
                }
            });
        }, this);
        if(this.autoLayout){
            var fn = this.doLayout.createDelegate(this, []);
            this.on({
                add: fn,
                remove: fn
            });
        }
    },

    //private
    getLayoutTarget : function() {
        return this.ul;
    },

    // private
    onRender : function(ct, position){
        if(!ct){
            ct = Ext.getBody();
        }

        var dh = {
            id: this.getId(),
            cls: 'x-menu ' + ((this.floating) ? 'x-menu-floating x-layer ' : '') + (this.cls || '') + (this.plain ? ' x-menu-plain' : '') + (this.showSeparator ? '' : ' x-menu-nosep'),
            style: this.style,
            cn: [
                {tag: 'a', cls: 'x-menu-focus', href: '#', onclick: 'return false;', tabIndex: '-1'},
                {tag: 'ul', cls: 'x-menu-list'}
            ]
        };
        if(this.floating){
            this.el = new Ext.Layer({
                shadow: this.shadow,
                dh: dh,
                constrain: false,
                parentEl: ct,
                zindex: this.zIndex
            });
        }else{
            this.el = ct.createChild(dh);
        }
        Ext.menu.Menu.superclass.onRender.call(this, ct, position);

        if(!this.keyNav){
            this.keyNav = new Ext.menu.MenuNav(this);
        }
        // generic focus element
        this.focusEl = this.el.child('a.x-menu-focus');
        this.ul = this.el.child('ul.x-menu-list');
        // Accessibility: mark menu container and menu list
        this.el.dom.setAttribute('role', 'presentation');
        this.ul.dom.setAttribute('role', 'menu');
        // Accessibility: add labels for any form fields in the menu
        this.items.each(function(item){
            if(item.isFormField && item.emptyText && item.el){
                var inp = item.el.dom.getElementsByTagName('input')[0];
                if(inp){
                    inp.setAttribute('aria-label', item.emptyText);
                }
            }
        }, this);
        this.mon(this.ul, {
            scope: this,
            click: this.onClick,
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut
        });
        if(this.enableScrolling){
            this.mon(this.el, {
                scope: this,
                delegate: '.x-menu-scroller',
                click: this.onScroll,
                mouseover: this.deactivateActive
            });
        }
    },

    // private
    findTargetItem : function(e){
        var t = e.getTarget('.x-menu-list-item', this.ul, true);
        if(t && t.menuItemId){
            return this.items.get(t.menuItemId);
        }
    },

    // private
    onClick : function(e){
        var t = this.findTargetItem(e);
        if(t){
            if(t.isFormField){
                this.setActiveItem(t);
            }else if(t instanceof Ext.menu.BaseItem){
                if(t.menu && this.ignoreParentClicks){
                    t.expandMenu();
                    e.preventDefault();
                }else if(t.onClick){
                    t.onClick(e);
                    this.fireEvent('click', this, t, e);
                }
            }
        }
    },

    // private
    setActiveItem : function(item, autoExpand){
        if(item != this.activeItem){
            this.deactivateActive();
            if((this.activeItem = item).isFormField){
                item.focus();
            }else{
                item.activate(autoExpand);
            }
        }else if(autoExpand){
            item.expandMenu();
        }
    },

    deactivateActive : function(){
        var a = this.activeItem;
        if(a){
            if(a.isFormField){
                //Fields cannot deactivate, but Combos must collapse
                if(a.collapse){
                    a.collapse();
                }
            }else{
                a.deactivate();
            }
            delete this.activeItem;
        }
    },

    // private
    tryActivate : function(start, step){
        var items = this.items;
        for(var i = start, len = items.length; i >= 0 && i < len; i+= step){
            var item = items.get(i);
            if(item.isVisible() && !item.disabled && (item.canActivate || item.isFormField)){
                this.setActiveItem(item, false);
                return item;
            }
        }
        return false;
    },

    // private
    onMouseOver : function(e){
        var t = this.findTargetItem(e);
        if(t){
            if(t.canActivate && !t.disabled){
                this.setActiveItem(t, true);
            }
        }
        this.over = true;
        this.fireEvent('mouseover', this, e, t);
    },

    // private
    onMouseOut : function(e){
        var t = this.findTargetItem(e);
        if(t){
            if(t == this.activeItem && t.shouldDeactivate && t.shouldDeactivate(e)){
                this.activeItem.deactivate();
                delete this.activeItem;
            }
        }
        this.over = false;
        this.fireEvent('mouseout', this, e, t);
    },

    // private
    onScroll : function(e, t){
        if(e){
            e.stopEvent();
        }
        var ul = this.ul.dom, top = Ext.fly(t).is('.x-menu-scroller-top');
        ul.scrollTop += this.scrollIncrement * (top ? -1 : 1);
        if(top ? ul.scrollTop <= 0 : ul.scrollTop + this.activeMax >= ul.scrollHeight){
           this.onScrollerOut(null, t);
        }
    },

    // private
    onScrollerIn : function(e, t){
        var ul = this.ul.dom, top = Ext.fly(t).is('.x-menu-scroller-top');
        if(top ? ul.scrollTop > 0 : ul.scrollTop + this.activeMax < ul.scrollHeight){
            Ext.fly(t).addClass(['x-menu-item-active', 'x-menu-scroller-active']);
        }
    },

    // private
    onScrollerOut : function(e, t){
        Ext.fly(t).removeClass(['x-menu-item-active', 'x-menu-scroller-active']);
    },

    /**
     * If <code>{@link #floating}=true</code>, shows this menu relative to
     * another element using {@link #showat}, otherwise uses {@link Ext.Component#show}.
     * @param {Mixed} element The element to align to
     * @param {String} position (optional) The {@link Ext.Element#alignTo} anchor position to use in aligning to
     * the element (defaults to this.defaultAlign)
     * @param {Ext.menu.Menu} parentMenu (optional) This menu's parent menu, if applicable (defaults to undefined)
     */
    show : function(el, pos, parentMenu){
        if(this.floating){
            this.parentMenu = parentMenu;
            if(!this.el){
                this.render();
                this.doLayout(false, true);
            }
            this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign, this.defaultOffsets), parentMenu);
        }else{
            Ext.menu.Menu.superclass.show.call(this);
        }
    },

    /**
     * Displays this menu at a specific xy position and fires the 'show' event if a
     * handler for the 'beforeshow' event does not return false cancelling the operation.
     * @param {Array} xyPosition Contains X & Y [x, y] values for the position at which to show the menu (coordinates are page-based)
     * @param {Ext.menu.Menu} parentMenu (optional) This menu's parent menu, if applicable (defaults to undefined)
     */
    showAt : function(xy, parentMenu){
        if(this.fireEvent('beforeshow', this) !== false){
            this.parentMenu = parentMenu;
            if(!this.el){
                this.render();
            }
            if(this.enableScrolling){
                // set the position so we can figure out the constrain value.
                this.el.setXY(xy);
                //constrain the value, keep the y coordinate the same
                xy[1] = this.constrainScroll(xy[1]);
                xy = [this.el.adjustForConstraints(xy)[0], xy[1]];
            }else{
                //constrain to the viewport.
                xy = this.el.adjustForConstraints(xy);
            }
            this.el.setXY(xy);
            this.el.show();
            Ext.menu.Menu.superclass.onShow.call(this);
            if(Ext.isIE){
                // internal event, used so we don't couple the layout to the menu
                this.fireEvent('autosize', this);
                if(!Ext.isIE8){
                    this.el.repaint();
                }
            }
            this.hidden = false;
            this.focus();
            this.fireEvent('show', this);
        }
    },

    constrainScroll : function(y){
        var max, full = this.ul.setHeight('auto').getHeight(),
            returnY = y, normalY, parentEl, scrollTop, viewHeight;
        if(this.floating){
            parentEl = Ext.fly(this.el.dom.parentNode);
            scrollTop = parentEl.getScroll().top;
            viewHeight = parentEl.getViewSize().height;
            //Normalize y by the scroll position for the parent element.  Need to move it into the coordinate space
            //of the view.
            normalY = y - scrollTop;
            max = this.maxHeight ? this.maxHeight : viewHeight - normalY;
            if(full > viewHeight) {
                max = viewHeight;
                //Set returnY equal to (0,0) in view space by reducing y by the value of normalY
                returnY = y - normalY;
            } else if(max < full) {
                returnY = y - (full - max);
                max = full;
            }
        }else{
            max = this.getHeight();
        }
        // Always respect maxHeight
        if (this.maxHeight){
            max = Math.min(this.maxHeight, max);
        }
        if(full > max && max > 0){
            this.activeMax = max - this.scrollerHeight * 2 - this.el.getFrameWidth('tb') - Ext.num(this.el.shadowOffset, 0);
            this.ul.setHeight(this.activeMax);
            this.createScrollers();
            this.el.select('.x-menu-scroller').setDisplayed('');
        }else{
            this.ul.setHeight(full);
            this.el.select('.x-menu-scroller').setDisplayed('none');
        }
        this.ul.dom.scrollTop = 0;
        return returnY;
    },

    createScrollers : function(){
        if(!this.scroller){
            this.scroller = {
                pos: 0,
                top: this.el.insertFirst({
                    tag: 'div',
                    cls: 'x-menu-scroller x-menu-scroller-top',
                    html: '&#160;'
                }),
                bottom: this.el.createChild({
                    tag: 'div',
                    cls: 'x-menu-scroller x-menu-scroller-bottom',
                    html: '&#160;'
                })
            };
            this.scroller.top.hover(this.onScrollerIn, this.onScrollerOut, this);
            this.scroller.topRepeater = new Ext.util.ClickRepeater(this.scroller.top, {
                listeners: {
                    click: this.onScroll.createDelegate(this, [null, this.scroller.top], false)
                }
            });
            this.scroller.bottom.hover(this.onScrollerIn, this.onScrollerOut, this);
            this.scroller.bottomRepeater = new Ext.util.ClickRepeater(this.scroller.bottom, {
                listeners: {
                    click: this.onScroll.createDelegate(this, [null, this.scroller.bottom], false)
                }
            });
        }
    },

    onLayout : function(){
        if(this.isVisible()){
            if(this.enableScrolling){
                this.constrainScroll(this.el.getTop());
            }
            if(this.floating){
                this.el.sync();
            }
        }
    },

    focus : function(){
        if(!this.hidden){
            this.doFocus.defer(50, this);
        }
    },

    doFocus : function(){
        if(!this.hidden){
            this.focusEl.focus();
        }
    },

    /**
     * Hides this menu and optionally all parent menus
     * @param {Boolean} deep (optional) True to hide all parent menus recursively, if any (defaults to false)
     */
    hide : function(deep){
        if (!this.isDestroyed) {
            this.deepHide = deep;
            Ext.menu.Menu.superclass.hide.call(this);
            delete this.deepHide;
        }
    },

    // private
    onHide : function(){
        Ext.menu.Menu.superclass.onHide.call(this);
        this.deactivateActive();
        if(this.el && this.floating){
            this.el.hide();
        }
        var pm = this.parentMenu;
        if(this.deepHide === true && pm){
            if(pm.floating){
                pm.hide(true);
            }else{
                pm.deactivateActive();
            }
        }
    },

    // private
    lookupComponent : function(c){
         if(Ext.isString(c)){
            c = (c == 'separator' || c == '-') ? new Ext.menu.Separator() : new Ext.menu.TextItem(c);
             this.applyDefaults(c);
         }else{
            if(Ext.isObject(c)){
                c = this.getMenuItem(c);
            }else if(c.tagName || c.el){ // element. Wrap it.
                c = new Ext.BoxComponent({
                    el: c
                });
            }
         }
         return c;
    },

    applyDefaults : function(c) {
        if (!Ext.isString(c)) {
            c = Ext.menu.Menu.superclass.applyDefaults.call(this, c);
            var d = this.internalDefaults;
            if(d){
                if(c.events){
                    Ext.applyIf(c.initialConfig, d);
                    Ext.apply(c, d);
                }else{
                    Ext.applyIf(c, d);
                }
            }
        }
        return c;
    },

    // private
    getMenuItem : function(config) {
        config.ownerCt = this;

        if (!config.isXType) {
            if (!config.xtype && Ext.isBoolean(config.checked)) {
                return new Ext.menu.CheckItem(config);
            }
            return Ext.create(config, this.defaultType);
        }
        return config;
    },

    /**
     * Adds a separator bar to the menu
     * @return {Ext.menu.Item} The menu item that was added
     */
    addSeparator : function() {
        return this.add(new Ext.menu.Separator());
    },

    /**
     * Adds an {@link Ext.Element} object to the menu
     * @param {Mixed} el The element or DOM node to add, or its id
     * @return {Ext.menu.Item} The menu item that was added
     */
    addElement : function(el) {
        return this.add(new Ext.menu.BaseItem({
            el: el
        }));
    },

    /**
     * Adds an existing object based on {@link Ext.menu.BaseItem} to the menu
     * @param {Ext.menu.Item} item The menu item to add
     * @return {Ext.menu.Item} The menu item that was added
     */
    addItem : function(item) {
        return this.add(item);
    },

    /**
     * Creates a new {@link Ext.menu.Item} based an the supplied config object and adds it to the menu
     * @param {Object} config A MenuItem config object
     * @return {Ext.menu.Item} The menu item that was added
     */
    addMenuItem : function(config) {
        return this.add(this.getMenuItem(config));
    },

    /**
     * Creates a new {@link Ext.menu.TextItem} with the supplied text and adds it to the menu
     * @param {String} text The text to display in the menu item
     * @return {Ext.menu.Item} The menu item that was added
     */
    addText : function(text){
        return this.add(new Ext.menu.TextItem(text));
    },

    //private
    onDestroy : function(){
        Ext.EventManager.removeResizeListener(this.hide, this);
        var pm = this.parentMenu;
        if(pm && pm.activeChild == this){
            delete pm.activeChild;
        }
        delete this.parentMenu;
        Ext.menu.Menu.superclass.onDestroy.call(this);
        Ext.menu.MenuMgr.unregister(this);
        if(this.keyNav) {
            this.keyNav.disable();
        }
        var s = this.scroller;
        if(s){
            Ext.destroy(s.topRepeater, s.bottomRepeater, s.top, s.bottom);
        }
        Ext.destroy(
            this.el,
            this.focusEl,
            this.ul
        );
    }
});

Ext.reg('menu', Ext.menu.Menu);

// MenuNav is a private utility class used internally by the Menu
Ext.menu.MenuNav = Ext.extend(Ext.KeyNav, function(){
    function up(e, m){
        if(!m.tryActivate(m.items.indexOf(m.activeItem)-1, -1)){
            m.tryActivate(m.items.length-1, -1);
        }
    }
    function down(e, m){
        if(!m.tryActivate(m.items.indexOf(m.activeItem)+1, 1)){
            m.tryActivate(0, 1);
        }
    }
    return {
        constructor : function(menu){
            Ext.menu.MenuNav.superclass.constructor.call(this, menu.el);
            this.scope = this.menu = menu;
        },

        doRelay : function(e, h){
            var k = e.getKey();
//          Keystrokes within a form Field (e.g.: down in a Combo) do not navigate. Allow only TAB
            if (this.menu.activeItem && this.menu.activeItem.isFormField && k != e.TAB) {
                return false;
            }
            if(!this.menu.activeItem && e.isNavKeyPress() && k != e.SPACE && k != e.RETURN){
                this.menu.tryActivate(0, 1);
                return false;
            }
            return h.call(this.scope || this, e, this.menu);
        },

        tab: function(e, m) {
            e.stopEvent();
            if (e.shiftKey) {
                up(e, m);
            } else {
                down(e, m);
            }
        },

        up : up,

        down : down,

        right : function(e, m){
            if(m.activeItem){
                m.activeItem.expandMenu(true);
            }
        },

        left : function(e, m){
            m.hide();
            if(m.parentMenu && m.parentMenu.activeItem){
                m.parentMenu.activeItem.activate();
            }
        },

        enter : function(e, m){
            if(m.activeItem){
                e.stopPropagation();
                m.activeItem.onClick(e);
                m.fireEvent('click', this, m.activeItem);
                return true;
            }
        }
    };
}());
