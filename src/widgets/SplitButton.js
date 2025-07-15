/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.SplitButton
 * @extends Ext.Button
 * A split button that provides a built-in dropdown arrow that can fire an event separately from the default
 * click event of the button.  Typically this would be used to display a dropdown menu that provides additional
 * options to the primary button action, but any custom handler can provide the arrowclick implementation.  Example usage:
 * <pre><code>
// display a dropdown menu:
new Ext.SplitButton({
	renderTo: 'button-ct', // the container id
   	text: 'Options',
   	handler: optionsHandler, // handle a click on the button itself
   	menu: new Ext.menu.Menu({
        items: [
        	// these items will render as dropdown menu items when the arrow is clicked:
	        {text: 'Item 1', handler: item1Handler},
	        {text: 'Item 2', handler: item2Handler}
        ]
   	})
});

// Instead of showing a menu, you provide any type of custom
// functionality you want when the dropdown arrow is clicked:
new Ext.SplitButton({
	renderTo: 'button-ct',
   	text: 'Options',
   	handler: optionsHandler,
   	arrowHandler: myCustomHandler
});
</code></pre>
 * @cfg {Function} arrowHandler A function called when the arrow button is clicked (can be used instead of click event)
 * @cfg {String} arrowTooltip The title attribute of the arrow
 * @constructor
 * Create a new menu button
 * @param {Object} config The config object
 * @xtype splitbutton
 */
Ext.SplitButton = Ext.extend(Ext.Button, {
	// private
    arrowSelector : 'em',
    split: true,

    // private
    initComponent : function(){
        Ext.SplitButton.superclass.initComponent.call(this);
        /**
         * @event arrowclick
         * Fires when this button's arrow is clicked
         * @param {MenuButton} this
         * @param {EventObject} e The click event
         */
        this.addEvents("arrowclick");
    },

    // private
   onRender : function(){
    Ext.SplitButton.superclass.onRender.apply(this, arguments);

    // Make the main button and arrow split accessible
    var btnEl = this.el.child('button'); // Main button element
    var arrowEl = this.el.child(this.arrowSelector); // Arrow element (the <em>)

    // 1. Main button ARIA
    if (btnEl) {
        btnEl.dom.setAttribute('role', 'button');
        btnEl.dom.setAttribute('tabindex', '0');
        btnEl.dom.setAttribute('aria-haspopup', this.menu ? 'true' : 'false');
        btnEl.dom.setAttribute('aria-expanded', 'false');
        btnEl.dom.setAttribute('aria-label', this.text || this.ariaLabel || 'Options');
        btnEl.dom.addEventListener('focus', function(){ btnEl.addClass('x-btn-focused'); });
        btnEl.dom.addEventListener('blur', function(){ btnEl.removeClass('x-btn-focused'); });
    }

    // 2. Arrow ARIA/label
    if (arrowEl) {
        arrowEl.dom.setAttribute('role', 'button');
        arrowEl.dom.setAttribute('tabindex', '0');
        // ARIA label for arrow (use tooltip, or fallback)
        var arrowLabel = this.arrowTooltip || (this.text ? this.text + ' menu' : 'Open options menu');
        arrowEl.dom.setAttribute('aria-label', arrowLabel);
        arrowEl.dom.setAttribute('aria-haspopup', this.menu ? 'true' : 'false');
        arrowEl.dom.setAttribute('aria-expanded', 'false');
        arrowEl.dom.addEventListener('focus', function(){ arrowEl.addClass('x-btn-arrow-focused'); });
        arrowEl.dom.addEventListener('blur', function(){ arrowEl.removeClass('x-btn-arrow-focused'); });
    }

    // 3. Keyboard events: open menu with Enter/Space/ArrowDown, focus management
    var that = this;
    if (btnEl) {
        btnEl.dom.addEventListener('keydown', function(e){
            if (e.key === 'Enter' || e.key === ' ') {
                that.onClick(e, btnEl.dom);
                e.preventDefault();
            } else if (e.key === 'ArrowDown' && that.menu) {
                that.showMenu();
                e.preventDefault();
            }
        });
    }
    if (arrowEl) {
        arrowEl.dom.addEventListener('keydown', function(e){
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                that.showMenu();
                e.preventDefault();
            }
        });
    }

    // 4. When menu opens/closes, update aria-expanded for both main and arrow
    if (this.menu) {
        this.menu.on('show', function(){
            if (btnEl) btnEl.dom.setAttribute('aria-expanded', 'true');
            if (arrowEl) arrowEl.dom.setAttribute('aria-expanded', 'true');
        });
        this.menu.on('hide', function(){
            if (btnEl) btnEl.dom.setAttribute('aria-expanded', 'false');
            if (arrowEl) arrowEl.dom.setAttribute('aria-expanded', 'false');
        });
    }

    // Existing arrow tooltip
    if (this.arrowTooltip) {
        arrowEl.dom[this.tooltipType] = this.arrowTooltip;
    }
},

    /**
     * Sets this button's arrow click handler.
     * @param {Function} handler The function to call when the arrow is clicked
     * @param {Object} scope (optional) Scope for the function passed above
     */
    setArrowHandler : function(handler, scope){
        this.arrowHandler = handler;
        this.scope = scope;
    },

    getMenuClass : function(){
        return 'x-btn-split' + (this.arrowAlign == 'bottom' ? '-bottom' : '');
    },

    isClickOnArrow : function(e){
	if (this.arrowAlign != 'bottom') {
	    var visBtn = this.el.child('em.x-btn-split');
	    var right = visBtn.getRegion().right - visBtn.getPadding('r');
	    return e.getPageX() > right;
	} else {
	    return e.getPageY() > this.btnEl.getRegion().bottom;
	}
    },

    // private
    onClick : function(e, t){
        e.preventDefault();
        if(!this.disabled){
            if(this.isClickOnArrow(e)){
                if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                    this.showMenu();
                }
                this.fireEvent("arrowclick", this, e);
                if(this.arrowHandler){
                    this.arrowHandler.call(this.scope || this, this, e);
                }
            }else{
                this.doToggle();
                this.fireEvent("click", this, e);
                if(this.handler){
                    this.handler.call(this.scope || this, this, e);
                }
            }
        }
    },

    // private
    isMenuTriggerOver : function(e){
        return this.menu && e.target.tagName == this.arrowSelector;
    },

    // private
    isMenuTriggerOut : function(e, internal){
        return this.menu && e.target.tagName != this.arrowSelector;
    }
});

Ext.reg('splitbutton', Ext.SplitButton);