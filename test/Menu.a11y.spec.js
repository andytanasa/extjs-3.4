describe('Ext.menu.Menu Accessibility', function () {
    let menu;
    let btn;
    let container;

    beforeEach(function (done) {
        // Create a dedicated container for rendering
        container = document.createElement('div');
        container.id = 'test-menu-container';
        document.body.appendChild(container);
        // Create a menu instance and render to container
        menu = new Ext.menu.Menu({
            items: [
                { text: 'Item 1' },
                { text: 'Item 2', disabled: true },
                { text: 'Item 3' }
            ]
        });
        // Attach to a button for visibility
        btn = new Ext.Button({
            text: 'Show Menu',
            menu: menu,
            renderTo: container
        });
        setTimeout(done, 100); // Wait for render
    });

    afterEach(function () {
        btn.destroy();
        menu.destroy();
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        container = null;
    });

    it('should have role="menu" on the menu element', function () {
        menu.show(btn.el);
        const menuEl = menu.getEl().dom;
        expect(menuEl.getAttribute('role')).toBe('menu');
        menu.hide();
    });

    it('should have role="menuitem" or similar on menu items', function () {
        menu.show(btn.el);
        const items = menu.getEl().dom.querySelectorAll('.x-menu-list-item, .x-menu-item');
        expect(items.length).toBeGreaterThan(0);
        // Check at least one has a valid ARIA role
        const hasMenuItemRole = Array.from(items).some(function (el) {
            const role = el.getAttribute('role');
            return role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio';
        });
        expect(hasMenuItemRole).toBe(true);
        menu.hide();
    });

    it('should allow keyboard navigation (Tab/Arrow)', function (done) {
        menu.show(btn.el);
        const firstItem = menu.items.items[0].getEl().dom;
        firstItem.focus();
        // Simulate ArrowDown key
        const e = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        firstItem.dispatchEvent(e);
        setTimeout(function () {
            const activeEl = document.activeElement;
            expect(activeEl).not.toBe(firstItem); // Focus should move
            menu.hide();
            done();
        }, 50);
    });

    it('should not have role="presentation" on menu or items', function () {
        menu.show(btn.el);
        const menuEl = menu.getEl().dom;
        expect(menuEl.getAttribute('role')).not.toBe('presentation');
        const items = menu.getEl().dom.querySelectorAll('[role="presentation"]');
        expect(items.length).toBe(0);
        menu.hide();
    });
});
