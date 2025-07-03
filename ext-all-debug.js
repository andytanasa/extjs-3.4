            cls: this.itemCls,
            tabIndex: 0,
            role: 'listbox'
        this.colorEls = this.el.select('a');
        this.colorEls.each(function(a, all, i){
            a.dom.tabIndex = -1;
            a.dom.id = this.id + '-color-' + i;
        }, this);
                this.mon(this.el, 'click', Ext.emptyFn, this, {delegate: 'a', preventDefault: true});
        this.mon(this.el, 'focus', function(){
            var idx = this.value ? this.colors.indexOf(this.value) : 0;
            this.focusItem(idx);
        }, this);
        this.keyNav = new Ext.KeyNav(this.el, {
            scope: this,
            left: this.focusPrev,
            right: this.focusNext,
            up: this.focusPrev,
            down: this.focusNext,
            space: this.selectFocused,
            enter: this.selectFocused
        });
            var a = el.child('a.color-'+color);
            a.addClass('x-color-palette-sel');
            if(a){
                this.el.dom.setAttribute('aria-activedescendant', a.dom.id);
                this.focusIndex = this.colorEls.indexOf(a.dom);
            }
    },

    focusItem : function(idx){
        var el = this.colorEls.item(idx);
        if(el){
            el.dom.focus();
            this.el.dom.setAttribute('aria-activedescendant', el.dom.id);
            this.focusIndex = idx;
        }
    },

    moveFocus : function(step){
        if(!this.colorEls){
            return;
        }
        var count = this.colorEls.getCount();
        var idx = (this.focusIndex + step + count) % count;
        this.focusItem(idx);
    },

    focusPrev : function(){
        this.moveFocus(-1);
    },

    focusNext : function(){
        this.moveFocus(1);
    },

    selectFocused : function(e){
        e.preventDefault();
        if(this.focusIndex >= 0){
            this.select(this.colors[this.focusIndex]);
        }

            tag:'ul', role:'tablist', cls:'x-tab-strip x-tab-strip-'+this.tabPosition}});
                 '<a class="x-tab-right" href="#" role="tab" tabIndex="0" aria-controls="{panelId}" aria-selected="false"><em class="x-tab-left">',
        this.keyNav = new Ext.KeyNav(this.strip, {
            scope: this,
            left: this.focusPrevTab,
            right: this.focusNextTab,
            home: this.focusFirstTab,
            end: this.focusLastTab,
            enter: this.activateFocusedTab,
            space: this.activateFocusedTab
        });
        var a = tabEl.child('a.x-tab-right', true);
        if (a) {
            a.setAttribute('tabIndex', '0');
            a.setAttribute('aria-controls', item.id);
            a.setAttribute('aria-selected', item == this.activeTab);
        }

            iconCls: item.iconCls || '',
            panelId: item.id
                    Ext.fly(oldEl).child('a.x-tab-right').dom.setAttribute('aria-selected', 'false');
                Ext.fly(el).child('a.x-tab-right').dom.setAttribute('aria-selected', 'true');
                this.focusedTab = item;
    // private
    findNextTab : function(start, step){
        var items = this.items.items,
            len = items.length,
            idx = start ? this.items.indexOf(start) : (step > 0 ? -1 : len),
            i, item;
        for(i = 0; i < len; ++i){
            idx = (idx + step + len) % len;
            item = items[idx];
            if(!item.disabled && !item.hidden){
                return item;
            }
        }
        return null;
    },

    // private
    focusTab : function(item){
        var el = Ext.get(item.tabEl).child('a.x-tab-right', true);
        if(el){
            el.focus();
        }
        this.focusedTab = item;
    },

    // private
    focusPrevTab : function(){
        var item = this.findNextTab(this.focusedTab || this.activeTab, -1);
        if(item){
            this.focusTab(item);
        }
    },

    // private
    focusNextTab : function(){
        var item = this.findNextTab(this.focusedTab || this.activeTab, 1);
        if(item){
            this.focusTab(item);
        }
    },

    // private
    focusFirstTab : function(){
        var item = this.findNextTab(null, 1);
        if(item){
            this.focusTab(item);
        }
    },

    // private
    focusLastTab : function(){
        var item = this.findNextTab(null, -1);
        if(item){
            this.focusTab(item);
        }
    },

    // private
    activateFocusedTab : function(){
        if(this.focusedTab){
            this.setActiveTab(this.focusedTab);
        }
    },

        if(this.disabled){
            this.el.dom.setAttribute('aria-disabled', true);
            btnEl.dom.setAttribute('aria-disabled', true);
            btnEl.dom.disabled = true;
        }
            this.el.dom.setAttribute('aria-disabled', disabled);
        }
        if(this.btnEl){
            this.btnEl.dom.disabled = disabled;
            this.btnEl.dom.setAttribute('aria-disabled', disabled);
    // private
    afterRender : function(){
        Ext.Toolbar.superclass.afterRender.apply(this, arguments);
        this.initKeyNav();
    },

    },

    // private
    initKeyNav : function(){
        var items = [];
        this.items.each(function(it){
            var el = it.btnEl || (it.getActionEl ? it.getActionEl() : it.el);
            if (el && typeof it.focus == 'function' && it.focus !== Ext.emptyFn) {
                el.dom.tabIndex = -1;
                el.on('focus', function(){
                    this.setActiveIndex(this.findFocusableIndex(el));
                }, this);
                items.push(el);
            }
        }, this);
        this.focusableEls = items;
        this.activeIndex = 0;
        if(items.length){
            items[0].dom.tabIndex = 0;
        }
        this.keyNav = new Ext.KeyNav(this.el, {
            scope: this,
            left: function(){ this.moveFocus(-1); },
            right: function(){ this.moveFocus(1); }
        });
    },

    // private
    findFocusableIndex : function(el){
        for(var i=0;i<this.focusableEls.length;i++){
            if(this.focusableEls[i] === el){
                return i;
            }
        }
        return -1;
    },

    // private
    setActiveIndex : function(idx){
        if(typeof idx != 'number' || idx < 0 || idx >= this.focusableEls.length){
            return;
        }
        var old = this.focusableEls[this.activeIndex];
        if(old){
            old.dom.tabIndex = -1;
        }
        this.activeIndex = idx;
        var el = this.focusableEls[idx];
        if(el){
            el.dom.tabIndex = 0;
        }
    },

    // private
    moveFocus : function(dir){
        if(!this.focusableEls || !this.focusableEls.length){
            return;
        }
        var idx = this.activeIndex || 0;
        idx = (idx + dir + this.focusableEls.length) % this.focusableEls.length;
        this.setActiveIndex(idx);
        this.focusableEls[idx].focus();
