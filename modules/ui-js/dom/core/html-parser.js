// Generated by CoffeeScript 1.10.0
var HtmlParser,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

module.exports = HtmlParser = (function() {
  var SINGLE_TAGS, TAG, TEXT, attrsRegExp, dotClassRegExp, tagRegExp;

  TAG = 0;

  TEXT = 1;

  SINGLE_TAGS = 'area base basefont bgsound br col command embed hr img input isindex keygen link meta param source track wbr'.split(/\s+/);

  tagRegExp = /<([\w-]+)\s*((?:[^>]+=("|').*?\3|[^>]+)\s*)*>|<\/([\w-]+)>/img;

  attrsRegExp = /(\S+?)\s*=\s*(?:(?:("|')(.*?)\2)|(\S+))|(\S+)/img;

  dotClassRegExp = /^\.(.+)/;

  function HtmlParser() {
    this.DOM = require('ui-js/dom/');
    return;
  }

  HtmlParser.prototype.parse = function(html) {
    var context, i, index, j, len, len1, node, nodes, token, tokens, type, value;
    html = html + '';
    context = this.DOM.createElement('tmp');
    tokens = this.getTokens(html);
    for (index = i = 0, len = tokens.length; i < len; index = ++i) {
      token = tokens[index];
      value = token.value;
      type = token.type;
      switch (type) {
        case TEXT:
          context.append(this.DOM.createText(value));
          break;
        case TAG:
          if (token.open) {
            node = this.DOM.createElement(value, token.attrs);
            context.append(node);
            if (indexOf.call(SINGLE_TAGS, value) < 0) {
              context = node;
            }
          } else {
            if (indexOf.call(SINGLE_TAGS, value) < 0) {
              context = context.parent;
            }
          }
      }
    }
    nodes = context.children.slice();
    for (j = 0, len1 = nodes.length; j < len1; j++) {
      node = nodes[j];
      node.remove();
    }
    return nodes;
  };

  HtmlParser.prototype.getTokens = function(html) {
    var prevEndIndex, tokens;
    prevEndIndex = 0;
    tokens = [];
    html.replace(tagRegExp, (function(_this) {
      return function(match, openTag, attrs, quote, closeTag, index) {
        if (index > prevEndIndex) {
          tokens.push({
            type: TEXT,
            value: html.slice(prevEndIndex, index)
          });
        }
        if (openTag) {
          tokens.push({
            type: TAG,
            open: true,
            value: openTag,
            attrs: _this.parseAttrs(attrs)
          });
        } else if (closeTag) {
          tokens.push({
            type: TAG,
            open: false,
            value: closeTag
          });
        }
        prevEndIndex = index + match.length;
      };
    })(this));
    if (html.length > prevEndIndex) {
      tokens.push({
        type: TEXT,
        value: html.slice(prevEndIndex, html.length)
      });
    }
    return tokens;
  };

  HtmlParser.prototype.parseAttrs = function(attrs) {
    var attrsObj, dotClasses, dotClassesStr;
    attrsObj = {};
    dotClasses = [];
    if (attrs != null) {
      attrs.replace(attrsRegExp, function(match, name, quote, value, value2, name2) {
        var dotClassName, ref;
        value = (ref = value != null ? value : value2) != null ? ref : '';
        name = name != null ? name : name2;
        if (dotClassRegExp.test(name) && !value) {
          dotClassName = name.match(dotClassRegExp)[1];
          dotClasses.push(dotClassName);
          return;
        }
        attrsObj[name] = value;
      });
    }
    if (dotClasses.length) {
      dotClassesStr = dotClasses.join(' ');
      if (attrsObj['class']) {
        attrsObj['class'] += " " + dotClassesStr;
      } else {
        attrsObj['class'] = dotClassesStr;
      }
    }
    return attrsObj;
  };

  return HtmlParser;

})();

//# sourceMappingURL=html-parser.js.map
