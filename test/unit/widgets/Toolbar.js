/*!
 * Ext JS Library 3.4.0
 */
(function(){
    var suite = Ext.test.session.getSuite('Ext.Toolbar'),
        assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Keyboard navigation',

        setUp: function(){
            this.tb = new Ext.Toolbar({
                renderTo: Ext.getBody(),
                items: [
                    {text: 'One'},
                    {text: 'Two'},
                    {text: 'Three'}
                ]
            });
        },

        tearDown: function(){
            this.tb.destroy();
        },

        testArrowNavigation: function(){
            var els = this.tb.focusableEls;
            assert.areEqual(0, els[0].dom.tabIndex);
            assert.areEqual(-1, els[1].dom.tabIndex);
            this.tb.moveFocus(1);
            assert.areEqual(0, els[1].dom.tabIndex);
            assert.areEqual(-1, els[0].dom.tabIndex);
            this.tb.moveFocus(-1);
            assert.areEqual(0, els[0].dom.tabIndex);
        }
    }));
})();
