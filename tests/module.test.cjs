const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

for (const file of ['src/vido.js', 'dist/vido.min.js']) {
    test(`${file}: AMD returns the constructor without touching the DOM`, () => {
        let constructor;
        const define = factory => { constructor = factory(); };
        define.amd = {};
        vm.runInNewContext(fs.readFileSync(file, 'utf8'), { define });
        assert.equal(typeof constructor, 'function');
        assert.throws(() => constructor(), /el must be an element ID/);
    });

    test(`${file}: CommonJS export validates the mount before rendering`, () => {
        const context = { exports: {}, module: { exports: {} }, document: { getElementById: () => null } };
        vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
        assert.equal(typeof context.module.exports, 'function');
        assert.throws(() => context.module.exports({ el: '#missing' }), /target element not found/);
    });
}
