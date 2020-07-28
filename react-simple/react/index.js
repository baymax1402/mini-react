import Component from './component'

function createElement(tag, attrs, ...childrens) {
    attrs = attrs || {}
    return {
        tag, 
        attrs, 
        childrens,
        key: attrs.key || null //标识真实与虚拟节点的查找关系
    }
}

export default {
    createElement,
    Component
};
