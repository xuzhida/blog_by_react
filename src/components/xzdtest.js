/**
 * Created by xuzhida on 2017/12/27.
 */
require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关的数据
let ImageDatas = require('json!../data/imageDatas.json');


//利用自执行函数，将图片名信息转成图片URL路径信息
//let yeomanImage = require('../images/yeoman.png');
function getImageUrl (arr){
    for(var i=0;i<arr.length;i++){
        var singleimage = arr[i];
        singleimage.imageUrl = require('../images/'+singleimage.fileName);
        arr[i] = singleimage;
    }
    return arr;
}
ImageDatas = getImageUrl(ImageDatas);


/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low , high){
    return Math.ceil(Math.random()*(high - low) + low);
}

/**
 * 获取旋转随机数
 */
function get30DegRandom(){
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

var ImgFigure = React.createClass({


    /**
     * imgFigure的点击处理函数
     */
    handleClick(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    render: function(){

        let styleObj = {};

        //如果props属性中制定了这张图片的位置，则使用
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }

        //如果图片的旋转角度有值并且不为0，则添加旋转角度
        if(this.props.arrange.rotate){
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }

        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';



        return(
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageUrl} className="img-shit"
                     alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
});



class ControllerUnit extends React.Component {
    //绑定hanleClick的作用域
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation;
        e.preventDefault;
    }

    render(){
        var controllerUnitClassName = 'controller-unit';

        //如果对应的图片是居中态，则显示控制按钮的居中态
        if(this.props.arrange.isCenter){
            controllerUnitClassName +=  ' isCenter';

            //如果同时对应的是翻转态图片，则控制按钮为翻转态
            if(this.props.arrange.isInverse){
                controllerUnitClassName +=  ' isInverse';
            }

        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        );
    }
}


class AppComponent extends React.Component {

    constructor() {
        super();
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: { //水平方向的取值范围
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: { //垂直方向
                x: [0, 0],
                topY: [0, 0]
            }
        };
        this.state = {
            imgsArrangeArr: [
                //{
                //  pos:{
                //    left:'0',
                //    top:'0'
                //  },
                //  rotate:0, //旋转角度
                //  isInverse:false //正反面,false表示正面
                //  isCenter:false 图片是否居中
                //}
            ]
        };
    }


    /**
     * 利用rearrange函数，居中对应index的图片
     * @param index 需要被居中图片的index
     * @returns {function}
     */

    center(index){
        return function(){
            this.rearrange(index);
        }.bind(this);
    }



    /**
     * 反转图片
     * @param 输入需要翻转图片的index
     * @returns 返回一个真正待被执行的函数
     */
    inverse(index){
        return function(){
            let imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });

        }.bind(this);
    }


    /**
     * 重新布局所有图片
     * @param centerIndex 指定居中排布哪一张图片
     */
    rearrange(centerIndex){
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTop = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
        //上侧区域图片数量
            topImgNum =Math.floor(Math.random() * 2),
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);


        //首先居中centerIndex的图片，居中的图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos : centerPos,
            rotate: 0,
            isCenter: true
        };


        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));

        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上测的图片
        imgsArrangeTopArr.forEach(
            function(value,index){
                imgsArrangeTopArr[index] = {
                    pos : {
                        top: getRangeRandom(vPosRangeTop[0],vPosRangeTop[1]),
                        left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                }
            }
        );

        //布局左右两侧的图片
        for(let i=0,j =imgsArrangeArr.length,k=j/2;i<j;i++){
            let hPosRangeLORX = null;


            //前半部分布局左边，右半部分布局右边
            if(i < k){
                hPosRangeLORX = hPosRangeLeftSecX;
            }else{
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i]={
                pos : {
                    top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }
        }


        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);

        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr:imgsArrangeArr
        });


    }

    componentDidMount() {
        //首先拿到舞台的大小
        let stageDom = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //拿到一个imgFigure的大小,这里取了imgFigure0的大小，因为所有的图片大小相同
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        //计算中心图片的位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        //计算左侧图片取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

        //计算右侧图片取值范围
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH + halfImgH;

        //计算上测区域图片排布的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
        //let num = Math.floor(Math.random() * 10);
        this.rearrange(0);
    }

    render() {

        let controllerUnits = [],
            imgFigures = [];

        ImageDatas.forEach(function(value,index){

            //初始化
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos:{
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false

                }
            }
            imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
            controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        }.bind(this));

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;