var m = require('mithril');
var Nav = require('./Nav');

var Layout = {
  view: function(vnode) {
    return m('.app-layout', [
      m(Nav),
      m('main.app-main', vnode.children)
    ]);
  }
};

module.exports = Layout;
