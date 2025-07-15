module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
files: [
  'c:/Endava/EndevLocal/Ext.js.3.4/extjs-3.4/adapter/ext/ext-base.js',
  'c:/Endava/EndevLocal/Ext.js.3.4/extjs-3.4/ext-all.js',
  'c:/Endava/EndevLocal/Ext.js.3.4/extjs-3.4/test/**/*.spec.js'
],
    browsers: ['Chrome'],
    // ...other config
  });
};