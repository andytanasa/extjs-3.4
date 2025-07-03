(function(){
    var suite = Ext.test.session.getSuite('Ext.ColorPalette'),
        assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'keyboard navigation',

        setUp: function(){
            this.palette = new Ext.ColorPalette({
                renderTo: Ext.getBody(),
                value: '000000'
            });
        },

        tearDown: function(){
            this.palette.destroy();
        },

        testArrowNavigationSelect: function(){
            var e = new Ext.EventObjectImpl(),
                selected;

            this.palette.on('select', function(p, c){ selected = c; });

            e.keyCode = 39; // right
            this.palette.keyNav.relay(e);
            e = new Ext.EventObjectImpl();
            e.keyCode = 32; // space
            this.palette.keyNav.relay(e);

            assert.areEqual(this.palette.colors[1], selected);
        }
    }));
})();
