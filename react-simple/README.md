# 安装parcel0配置打包
npm install -g parcel-bundler

# 安装babel插件，将jsx语法转换成js对象(虚拟DOM)
npm i babel-core babel-preset-env babel-plugin-transform-react-jsx

# 封装jsx和理解虚拟dom

# 组件和生命周期

# diff算法

为减少dom更新
需要找出渲染前后的部分，只更新一部分，找出更新部分

## 对比策略
1.对比当前真实dom和虚拟dom 对比过程中直接更新真实dom
2.对比同一层级的dom

# 异步的setState