import Component from '../react/component'
import { diff, diffNode } from './diff'

const ReactDOM = {
    render
}

function render(vnode, container) {
    return diff(undefined, vnode, container);
    // return container.appendChild(_render(vnode));
}

function _render(vnode)  {
    if(vnode === undefined || vnode === null || typeof vnode === 'boolean') 
        vnode = '';
    if (typeof vnode === 'number') {
        vnode = String(vnode);
    }
    // 如果vnode是字符串
    if (typeof vnode === 'string') {
        // 创建文本结点
        return document.createTextNode(vnode);
    }
    // 如果tag是函数,则渲染组件
    if (typeof vnode.tag === 'function') {
        // 1.创建组件
        const comp = createComponent(vnode.tag, vnode.attrs)
        // 2.设置组件的属性
        setComponentProps(comp, vnode.attrs);
        // 3.组件渲染的节点对象返回
        return comp.base;
    }
    //  否则就是一个虚拟dom对象
    const { tag, attrs, childrens } = vnode;
    const dom = document.createElement(tag);

    if (attrs) {
        // 有属性
        Object.keys(attrs).forEach(key => {
            const value = attrs[key];
            setAttribute(dom, key, value)
        })
    }

    // 递归渲染子节点
    if (childrens) {
        childrens.forEach(child => render(child, dom))
    }

    return dom;
}
// 设置属性
export function setAttribute(dom, key, value) {
    // 将属性名className 转成class
    if (key === 'className') {
        key = 'class';
    }

    // 如果是事件 onClick onBlur
    if (/on\w+/.test(key)) {
        key = key.toLowerCase();
        dom[key] = value || '';
    } else if (key === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        } else if (value && typeof value === 'object') {
            for (let k in value) {
                if (typeof value[k] === 'number') {
                    dom.style[k] = value[k] + 'px'
                } else {
                    dom.style[k] = value[k];
                }
            }
        }
    } else {
        // 其他属性
        if (key in dom) {
            dom[key] = value || ''
        }
        if (value) {
            dom.setAttribute(key, value);
        } else {
            dom.removeAttribute(key);
        }
    }
}
// 创建组件
export function createComponent(comp, props) {
    // 如果是类定义的组件，则创建实例返回
    let instance;
    if (comp.prototype && comp.prototype.render) {
        // 类
        instance = new comp(props);
    } else {
        // 函数 需要构造类,转成类组件 方便后面统一管理
        instance = new Component(props);
        instance.constructor = comp;
        instance.render = function() {
            return this.constructor(props);
        }
    }
    return instance;
}
// 设置组件属性
export function setComponentProps(comp, props) {
    if(!comp.base) {
        if (comp.compnentWillMount) {
            comp.compnentWillMount()
        } else if (comp.componentWillReceiveProps) {
            comp.componentWillReceiveProps()
        }
    }
    comp.props = props;
    renderComponent(comp);
}
// 渲染组件
export function renderComponent(comp) {
    const renderer = comp.render(); //返回jsx对象
    // const base = _render(renderer); //返回节点对象
    const base = diffNode(comp.base, renderer);
    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate();
    }
    if (comp.base && comp.componentDidUpdate) {
        comp.componentDidUpdate();
    } else if (comp.componentDidMount) {
        comp.componentDidMount();
    }
    // 节点替换
    // if (comp.base && comp.base.parentNode) {
    //     comp.base.parentNode.replaceChild(base, comp.base);
    // }
    comp.base = base;
}

export default ReactDOM;