import { setAttribute, setComponentProps, createComponent } from './index'


export function diff(dom, vnode, container) {
    // 对比结点的变化
    const ret = diffNode(dom, vnode)
    if (container) {
        container.appendChild(ret)
    }
    return ret;
}

export function diffNode(dom, vnode) {
    let out = dom;
    if(vnode === undefined || vnode === null || typeof vnode === 'boolean') 
        vnode = '';
    if (typeof vnode === 'number') {
        vnode = String(vnode);
    }
    // 如果vnode是字符串
    if (typeof vnode === 'string') {
        if (dom && dom.nodeType === 3) { //判断是否更新类型是否是文本标签
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
    }
    // 非文本dom结点
    if (!dom) {
        out = document.createElement(vnode.tag);
    }
    // 比较子节点
    if (vnode.childrens &&
        vnode.childrens.length > 0 ||
        ( out.childNodes && 
          out.childNodes.length > 0
        )) {
        diffChildren(out, vnode.childrens);
    }
    diffAttribute(out, vnode);
    return out;
}
function diffComponent(dom, vnode) {
    let comp = dom;
    // 如果组件没有变化，重新设置props
    if (comp && comp.constructor === vnode.tag) {
        // 设置props
        setComponentProps(comp, vnode.attrs)
        // 赋值
        dom = comp.base;

    } else {
        // 组件类型发生变化
        if (comp) {
            // 先移除就组件
            unmountComponent(comp);
            comp = null;
        }
        // 创建新组建
        comp = createComponent(vnode.tag, vnode.attrs);
        // 设置组件属性
        setComponentProps(comp, vnode.attrs);
        // 给当前组件挂载base
        dom = comp.base;
    }
    return dom;
}
function unmountComponent(comp) {
    removeNode(comp.base)
}
function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeNode(dom);
    }
}
// 比较属性
function diffAttribute(dom, vnode) {
    // 保存之前dom所有属性
    const oldAttrs = {};
    const newAttrs = vnode.attrs;
    // dom原有节点 vnode虚拟DOM
    const domAttrs = dom.attributes;
    console.log(domAttrs);
    [...domAttrs].forEach((item, index) => {
        oldAttrs[item.name] = item.value;
    })
    // 比较  如果原来属性和新属性对比 不在新的属性中, 则将其移除掉(蛇者为undefine)
    for (let key in oldAttrs) {
        if (!(key in newAttrs)) {
            setAttribute(dom, key, undefined);
        }
    }
    // 更新 class='active'
    for (let key in newAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            setAttribute(dom, key, newAttrs[key])
        }
    }
    
}

// 比较子节点
function diffChildren(dom, vChildren) {
    const domChildren = dom.childNodes;
    const children = [];
    const keyed = {};

    // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开
    if (domChildren.length > 0) {
        domChildren.forEach((c) => {
            if (c.attributes && "key" in c.attributes) {
                keyed[c.attributes["key"]] = c;
            } else {
                children.push(c);
            }
        })
    }

    if (vChildren && vChildren.length > 0) {
        let min = 0;
        let count = children.length;
        [...vChildren].forEach((vChild, i) => {
            // 获取虚拟dom所有的key
            const key = vChild.key;
            let child;
            if (key) {
                // 如果有key, 找到对应key值的节点
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            } else if (count > min) {
                // 如果没有key, 则优先找类型相同的节点
                for (let j = min; j < count; j++) {
                    let c = children[j];
                    if (c) {
                        child = c;
                        children[j] = undefined;
                        if (j === count - 1) count--;
                        if (j === min) min++;
                        break;
                    } 
                }
            }
            // 对比
            child = diffNode(child, vChild);

            // 更新dom
            const f = domChildren[i];

            if (child && child !== dom && dom !== f) {
                // 如果更新前的对应位置为空，说明此节点是新增的
                if (!f) {
                    dom.appendChild(child);
                    // 如果更新后的节点和更新前对应位置的下一个结点一样
                } else if (child === f.nextSibling) {
                    removeNode(f);
                    // 将更新后的节点移动到正确的位置
                } else {
                    // 注意insertBefore的用法，第一个参数是要插入的节点
                    dom.insertBefore(child, f);
                }
            }

        })
    }

}

