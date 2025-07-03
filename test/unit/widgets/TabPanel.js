(function(){
    var suite = Ext.test.session.getSuite('Ext.TabPanel'),
        assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'keyboard navigation',

        setUp: function(){
            this.tabs = new Ext.TabPanel({
                renderTo: Ext.getBody(),
                activeTab: 0,
                width: 400,
                height: 100,
                items: [
                    {id: 't1', title: 'Tab1', html: '1'},
                    {id: 't2', title: 'Tab2', html: '2'},
                    {id: 't3', title: 'Tab3', html: '3'}
                ]
            });
        },

        tearDown: function(){
            this.tabs.destroy();
        },

        testArrowNavigation: function(){
            var e = new Ext.EventObjectImpl();
            e.keyCode = 39; // right
            this.tabs.keyNav.relay(e);
            assert.areSame(this.tabs.items.itemAt(1), this.tabs.focusedTab);

            e = new Ext.EventObjectImpl();
            e.keyCode = 37; // left
            this.tabs.keyNav.relay(e);
            assert.areSame(this.tabs.items.itemAt(0), this.tabs.focusedTab);
        },

        testActivation: function(){
            var e = new Ext.EventObjectImpl();
            e.keyCode = 39; // right
            this.tabs.keyNav.relay(e);
            e = new Ext.EventObjectImpl();
            e.keyCode = 13; // enter
            this.tabs.keyNav.relay(e);
            assert.areSame(this.tabs.items.itemAt(1), this.tabs.activeTab);
        }
    }));
})();
