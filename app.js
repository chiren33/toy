/** @jsx h */

function setAttributes(dom,key,attr){
    //需要更严格的判断
    var eventpreFix = key.substring(0,2);
    var dataprefix = key.substring(0,5);

    if(eventpreFix==='on'){
        var eventType = key.substr(2);
        dom.addEventListener(eventType.toLowerCase(),attr)
    }else if(key==='className') {
        dom.setAttribute('class',attr)
    }else if(dataprefix==='data-'){
        dom.setAttribute(key,attr)
    }else {
        dom.setAttribute(key,attr)
    }
}

function setComponentProps(componentIns, props) {
    componentIns.props = props;
}

function renderComponent(componentIns) {
    var base = build(componentIns.render());
    return base;
}
function buildComponentFromVnode(vnode) {
    var componentIns = new vnode.nodeName();
    setComponentProps(componentIns, vnode.props);
    var base = renderComponent(componentIns);

    return base;
}
function Vnode(nodeName, props, children) {
    this.nodeName = nodeName;
    this.props = props;
    this.children = children;
    // this.element = null;
}
function build(vnode) {
    var element;
    if (typeof vnode === "string" || typeof vnode === "string") {
        element = document.createTextNode(vnode);
    }
    if (typeof vnode.nodeName === "string") {
        element = document.createElement(vnode.nodeName);
        for (var key in vnode.props) {
            if (vnode.props.hasOwnProperty(key)) {
                setAttributes(element,key,vnode.props[key])
            }
        }
        if (typeof vnode.children === "string") {
            var textNode = document.createTextNode(vnode.children);
            element.appendChild(textNode);
        } else {
            if (vnode.children.length && vnode.children.length > 0) {
                for (var i = 0; i < vnode.children.length; i++) {
                    element.appendChild(build(vnode.children[i]));
                }
            }
        }
    } else if (typeof vnode.nodeName === "function") {
        // setComponentProps(this.nodeName,this.props);
        element = buildComponentFromVnode(vnode);
    }

    return element && element;
}

function h(nodeName, props, ...children) {
    var childrenNodes;
    //如果只有一个子节点，且为字符串或数字，直接赋值给children，否则children为数组
    if (
        children.length &&
        children.length === 1 &&
        (typeof children[0] === "string" || typeof children[0] === "number")
    ) {
        childrenNodes = children[0];
    } else {
        childrenNodes = [...children];
    }

    return new Vnode(nodeName, props, childrenNodes);
}

function render(hf, container) {
    console.log(hf);
    var domNodes = build(hf);
    container.appendChild(domNodes);
}

class Component {
    render() {}
}
class Name extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <h2>{this.props.name}</h2>;
    }
}
class Age extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <h2 onClick={function(){alert('click')}}>
                {this.props.age}
                <span data-test='test'>岁</span>
            </h2>
        );
    }
}
render(
    // <Age age="24" />,
    <div id="div" className="haha">
        <Name  name="wdk"/>
        <Age age="24"/>
    </div>,
    // <div id="test">
    //     <span>hello world</span>
    // </div>,

    document.getElementById('app')
);
