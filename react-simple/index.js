import React from './react';
import ReactDOM from './react-dom';

// jsx语法
const ele = (
    <div className='active' title='123'>
        hello,<span>react</span>
    </div>
)
// 函数组件
function HomeTest() {
    return (
        <div className='active' title='123'>
            hello,<span>react</span>
        </div>
    )
}

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 1
        }
    }
    componentWillMount() {
        console.log('组件将要加载')
    }
    componentWillReceiveProps(props) {
        console.log('props')
    }
    componentWillUpdate() {
        console.log('组件将要更新')
    }
    componentDidUpdate() {
        console.log('组件更新完成')
       
    }
    componentDidMount() {
        console.log('组件加载完成')
        for (let i = 0; i < 10; i++) {
            this.setState((prevState, prevProps) => {
                console.log(prevState.count);
                return {
                    count: prevState.count + 1
                }
            })
        }
    }
    handlerClick() {
        this.setState({
            count: this.state.count + 1
        })
    }
    render() {
        return (
            <div className='active' title='123'>
                hello,<span>react</span>
                <button onClick = {this.handlerClick.bind(this)}>
                    点击{this.state.count}次
                </button>
            </div>
        )
    }
}

const title = 'active'
// ReactDOM.render(
//     ele, 
//     document.querySelector('#root')
// )

ReactDOM.render(
    <Home />, 
    document.querySelector('#root')
)
/*
createElement(tag, attrs, child1, child2...)
*/ 