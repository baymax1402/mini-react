import { renderComponent } from "./index";

/*
 * 1.异步更新state 短时间内把多个setState合并一个(队列: 先进先出)
 * 2.一段时间之后，循环清空队列，渲染组件
 */
const setStateQueue = [];
const renderQueue = []; //保存当前组件
function defer(fn) {
    return Promise.resolve().then(fn);
}
export function enqueueSetState(stateChange, component) {
    if (setStateQueue.length === 0) {
       defer(flush)
    }
    //  1.一段时间内合并多个setState
    setStateQueue.push({
        stateChange,
        component
    })
    //  如果renderQueue里面没有组件，添加到队列中
    let r = renderQueue.some(item => {
        return item === component;
    })
    if (!r) {
        // 证明是第一次添加
        renderQueue.push(component);
    }

}

//  一段时间之后
function flush() {
    let item, component;
    // 遍历状态
    while(item = setStateQueue.shift()) {
        const {
            stateChange,
            component
        } = item;
        // 保存之前的状态
        if (!component.prevState) {
            component.prevState = Object.assign({}, component.state);
        }
        if (typeof stateChange === 'function') {
            // 是一个回调函数
            Object.assign(component.state, stateChange(component.prevState, component.props));
        } else {
            // 是一个对象
            Object.assign(component.state, stateChange);
        }
        // 赋值
        component.prevState = component.state;
    }
    // 遍历组件
    while(component = renderQueue.shift()) {
        renderComponent(component);
    }
}

