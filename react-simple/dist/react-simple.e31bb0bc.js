// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffNode = diffNode;

var _index = require("./index");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function diff(dom, vnode, container) {
  // 对比结点的变化
  var ret = diffNode(dom, vnode);

  if (container) {
    container.appendChild(ret);
  }

  return ret;
}

function diffNode(dom, vnode) {
  var out = dom;
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'number') {
    vnode = String(vnode);
  } // 如果vnode是字符串


  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      //判断是否更新类型是否是文本标签
      if (dom.textContent !== vnode) {
        // 更新文本内容
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom && dom.parentNode) {
        // 将dom替换为out
        dom.parentNode.replaceNode(out, dom);
      }
    }

    return out;
  }

  if (typeof vnode.tag === 'function') {
    return diffComponent(out, vnode);
  } // 非文本dom结点


  if (!dom) {
    out = document.createElement(vnode.tag);
  } // 比较子节点


  if (vnode.childrens && vnode.childrens.length > 0 || out.childNodes && out.childNodes.length > 0) {
    diffChildren(out, vnode.childrens);
  }

  diffAttribute(out, vnode);
  return out;
}

function diffComponent(dom, vnode) {
  var comp = dom; // 如果组件没有变化，重新设置props

  if (comp && comp.constructor === vnode.tag) {
    // 设置props
    (0, _index.setComponentProps)(comp, vnode.attrs); // 赋值

    dom = comp.base;
  } else {
    // 组件类型发生变化
    if (comp) {
      // 先移除就组件
      unmountComponent(comp);
      comp = null;
    } // 创建新组建


    comp = (0, _index.createComponent)(vnode.tag, vnode.attrs); // 设置组件属性

    (0, _index.setComponentProps)(comp, vnode.attrs); // 给当前组件挂载base

    dom = comp.base;
  }

  return dom;
}

function unmountComponent(comp) {
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom);
  }
} // 比较属性


function diffAttribute(dom, vnode) {
  // 保存之前dom所有属性
  var oldAttrs = {};
  var newAttrs = vnode.attrs; // dom原有节点 vnode虚拟DOM

  var domAttrs = dom.attributes;
  console.log(domAttrs);

  _toConsumableArray(domAttrs).forEach(function (item, index) {
    oldAttrs[item.name] = item.value;
  }); // 比较  如果原来属性和新属性对比 不在新的属性中, 则将其移除掉(蛇者为undefine)


  for (var key in oldAttrs) {
    if (!(key in newAttrs)) {
      (0, _index.setAttribute)(dom, key, undefined);
    }
  } // 更新 class='active'


  for (var _key in newAttrs) {
    if (oldAttrs[_key] !== newAttrs[_key]) {
      (0, _index.setAttribute)(dom, _key, newAttrs[_key]);
    }
  }
} // 比较子节点


function diffChildren(dom, vChildren) {
  var domChildren = dom.childNodes;
  var children = [];
  var keyed = {}; // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开

  if (domChildren.length > 0) {
    domChildren.forEach(function (c) {
      if (c.attributes && "key" in c.attributes) {
        keyed[c.attributes["key"]] = c;
      } else {
        children.push(c);
      }
    });
  }

  if (vChildren && vChildren.length > 0) {
    var min = 0;
    var count = children.length;

    _toConsumableArray(vChildren).forEach(function (vChild, i) {
      // 获取虚拟dom所有的key
      var key = vChild.key;
      var child;

      if (key) {
        // 如果有key, 找到对应key值的节点
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (count > min) {
        // 如果没有key, 则优先找类型相同的节点
        for (var j = min; j < count; j++) {
          var c = children[j];

          if (c) {
            child = c;
            children[j] = undefined;
            if (j === count - 1) count--;
            if (j === min) min++;
            break;
          }
        }
      } // 对比


      child = diffNode(child, vChild); // 更新dom

      var f = domChildren[i];

      if (child && child !== dom && dom !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child); // 如果更新后的节点和更新前对应位置的下一个结点一样
        } else if (child === f.nextSibling) {
          removeNode(f); // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore的用法，第一个参数是要插入的节点
          dom.insertBefore(child, f);
        }
      }
    });
  }
}
},{"./index":"react-dom/index.js"}],"react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAttribute = setAttribute;
exports.createComponent = createComponent;
exports.setComponentProps = setComponentProps;
exports.renderComponent = renderComponent;
exports.default = void 0;

var _component = _interopRequireDefault(require("../react/component"));

var _diff = require("./diff");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ReactDOM = {
  render: render
};

function render(vnode, container) {
  var dom;
  return (0, _diff.diff)(dom, vnode, container); // return container.appendChild(_render(vnode));
}

function _render(vnode) {
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'number') {
    vnode = String(vnode);
  } // 如果vnode是字符串


  if (typeof vnode === 'string') {
    // 创建文本结点
    return document.createTextNode(vnode);
  } // 如果tag是函数,则渲染组件


  if (typeof vnode.tag === 'function') {
    // 1.创建组件
    var comp = createComponent(vnode.tag, vnode.attrs); // 2.设置组件的属性

    setComponentProps(comp, vnode.attrs); // 3.组件渲染的节点对象返回

    return comp.base;
  } //  否则就是一个虚拟dom对象


  var _vnode = vnode,
      tag = _vnode.tag,
      attrs = _vnode.attrs,
      childrens = _vnode.childrens;
  var dom = document.createElement(tag);

  if (attrs) {
    // 有属性
    Object.keys(attrs).forEach(function (key) {
      var value = attrs[key];
      setAttribute(dom, key, value);
    });
  } // 递归渲染子节点


  if (childrens) {
    childrens.forEach(function (child) {
      return render(child, dom);
    });
  }

  return dom;
} // 设置属性


function setAttribute(dom, key, value) {
  // 将属性名className 转成class
  if (key === 'className') {
    key = 'class';
  } // 如果是事件 onClick onBlur


  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || '';
  } else if (key === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && _typeof(value) === 'object') {
      for (var k in value) {
        if (typeof value[k] === 'number') {
          dom.style[k] = value[k] + 'px';
        } else {
          dom.style[k] = value[k];
        }
      }
    }
  } else {
    // 其他属性
    if (key in dom) {
      dom[key] = value || '';
    }

    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
} // 创建组件


function createComponent(comp, props) {
  // 如果是类定义的组件，则创建实例返回
  var instance;

  if (comp.prototype && comp.prototype.render) {
    // 类
    instance = new comp(props);
  } else {
    // 函数 需要构造类,转成类组件 方便后面统一管理
    instance = new _component.default(props);
    instance.constructor = comp;

    instance.render = function () {
      return this.constructor(props);
    };
  }

  return instance;
} // 设置组件属性


function setComponentProps(comp, props) {
  if (!comp.base) {
    if (comp.compnentWillMount) {
      comp.compnentWillMount();
    } else if (comp.componentWillReceiveProps) {
      comp.componentWillReceiveProps();
    }
  }

  comp.props = props;
  renderComponent(comp);
} // 渲染组件


function renderComponent(comp) {
  var renderer = comp.render(); //返回jsx对象
  // const base = _render(renderer); //返回节点对象

  var base = (0, _diff.diffNode)(comp.base, renderer);

  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate();
  }

  if (comp.base && comp.componentDidUpdate) {
    comp.componentDidUpdate();
  } else if (comp.componentDidMount) {
    comp.componentDidMount();
  } // 节点替换
  // if (comp.base && comp.base.parentNode) {
  //     comp.base.parentNode.replaceChild(base, comp.base);
  // }


  comp.base = base;
}

var _default = ReactDOM;
exports.default = _default;
},{"../react/component":"react/component.js","./diff":"react-dom/diff.js"}],"react-dom/set_state_queue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enqueueSetState = enqueueSetState;

var _index = require("./index");

/*
 * 1.异步更新state 短时间内把多个setState合并一个(队列: 先进先出)
 * 2.一段时间之后，循环清空队列，渲染组件
 */
var setStateQueue = [];
var renderQueue = []; //保存当前组件

function defer(fn) {
  return Promise.resolve().then(fn);
}

function enqueueSetState(stateChange, component) {
  if (setStateQueue.length === 0) {
    defer(flush);
  } //  1.一段时间内合并多个setState


  setStateQueue.push({
    stateChange: stateChange,
    component: component
  }); //  如果renderQueue里面没有组件，添加到队列中

  var r = renderQueue.some(function (item) {
    return item === component;
  });

  if (!r) {
    // 证明是第一次添加
    renderQueue.push(component);
  }
} //  一段时间之后


function flush() {
  var item, component; // 遍历状态

  while (item = setStateQueue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        _component = _item.component; // 保存之前的状态

    if (!_component.prevState) {
      _component.prevState = Object.assign({}, _component.state);
    }

    if (typeof stateChange === 'function') {
      // 是一个回调函数
      Object.assign(_component.state, stateChange(_component.prevState, _component.props));
    } else {
      // 是一个对象
      Object.assign(_component.state, stateChange);
    } // 赋值


    _component.prevState = _component.state;
  } // 遍历组件


  while (component = renderQueue.shift()) {
    (0, _index.renderComponent)(component);
  }
}
},{"./index":"react-dom/index.js"}],"react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _set_state_queue = require("../react-dom/set_state_queue");

var _reactDom = require("../react-dom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.props = props;
    this.state = {};
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(stateChange) {
      // // 对象浅拷贝
      // Object.assign(this.state, stateChange)
      // // 渲染组件
      // renderComponent(this);
      (0, _set_state_queue.enqueueSetState)(stateChange, this);
    }
  }]);

  return Component;
}();

var _default = Component;
exports.default = _default;
},{"../react-dom/set_state_queue":"react-dom/set_state_queue.js","../react-dom":"react-dom/index.js"}],"react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createElement(tag, attrs) {
  attrs = attrs || {};

  for (var _len = arguments.length, childrens = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    childrens[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    childrens: childrens,
    key: attrs.key || null //标识真实与虚拟节点的查找关系

  };
}

var _default = {
  createElement: createElement,
  Component: _component.default
};
exports.default = _default;
},{"./component":"react/component.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("./react"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// jsx语法
var ele = _react.default.createElement("div", {
  className: 'active',
  title: '123'
}, "hello,", _react.default.createElement("span", null, "react")); // 函数组件


function HomeTest() {
  return _react.default.createElement("div", {
    className: 'active',
    title: '123'
  }, "hello,", _react.default.createElement("span", null, "react"));
}

var Home = /*#__PURE__*/function (_React$Component) {
  _inherits(Home, _React$Component);

  var _super = _createSuper(Home);

  function Home(props) {
    var _this;

    _classCallCheck(this, Home);

    _this = _super.call(this, props);
    _this.state = {
      count: 1
    };
    return _this;
  }

  _createClass(Home, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      console.log('组件将要加载');
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      console.log('props');
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      console.log('组件将要更新');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      console.log('组件更新完成');
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('组件加载完成');

      for (var i = 0; i < 10; i++) {
        this.setState(function (prevState, prevProps) {
          console.log(prevState.count);
          return {
            count: prevState.count + 1
          };
        });
      }
    }
  }, {
    key: "handlerClick",
    value: function handlerClick() {
      this.setState({
        count: this.state.count + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: 'active',
        title: '123'
      }, "hello,", _react.default.createElement("span", null, "react"), _react.default.createElement("button", {
        onClick: this.handlerClick.bind(this)
      }, "\u70B9\u51FB", this.state.count, "\u6B21"));
    }
  }]);

  return Home;
}(_react.default.Component);

var title = 'active'; // ReactDOM.render(
//     ele, 
//     document.querySelector('#root')
// )

_reactDom.default.render(ele, document.querySelector('#root'));
/*
createElement(tag, attrs, child1, child2...)
*/
},{"./react":"react/index.js","./react-dom":"react-dom/index.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58618" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/react-simple.e31bb0bc.js.map