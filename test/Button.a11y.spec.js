describe('Ext.Button Accessibility', function () {
    let btn;

    beforeEach(function (done) {
        // Create a button instance and render to DOM
        btn = new Ext.Button({
            text: 'Test',
            renderTo: document.body
        });
        setTimeout(done, 100); // Wait for render
    });

    afterEach(function () {
        btn.destroy();
    });

    it('should not have role="presentation" on the main table', function () {
        const table = btn.el.dom;
        expect(table.getAttribute('role')).not.toBe('presentation');
    });

    it('should have high-contrast text color', function () {
        const textEl = btn.btnEl.dom;
        const color = window.getComputedStyle(textEl).color;
        // Should be rgb(17, 17, 17) for #111 fallback
        expect(['rgb(17, 17, 17)', 'rgb(0, 0, 0)']).toContain(color);
    });

    it('should not have nested tables by default', function () {
        const tables = btn.el.dom.querySelectorAll('table table');
        expect(tables.length).toBe(0);
    });
});