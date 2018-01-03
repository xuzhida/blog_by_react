require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';

let ImageDatas = require('../data/imageDatas.json');
//let yeomanImage = require('../images/yeoman.png');
function getImageUrl (arr){
    for(var i=0,j = arr.length;i < j;i++){
      let singleimage = arr[i];
      singleimage.imageUrl = require('../images/'+singleimage.fileName);
      arr[i] = singleimage;
    }
    return arr;
}
ImageDatas = getImageUrl(ImageDatas);

/**
 * 获取区间内的一个随机值
 **/
function getRangeRandom(low , high){
    return Math.ceil(Math.random()*(high - low) + low);
}

/**
 * 获取旋转随机数
 */
function get30DegRandom(){
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.Constant={
                centerPos:{
                    left:0,
                    top:0
                },
                hPosRange:{//初始化水平方向位置
                    leftSecX:[0,0],
                    rightSecX:[0,0],
                    y:[0,0]
                },
                vPosRange:{//初始化垂直方向位置
                    x:[0,0],
                    topY:[0,0]
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
     * 利用reArrange函数，居中对应index的图片
     * @param index 需要被居中图片的index
     * @returns {function}
     */

    center(index){
        return function(){
            this.reArrange(index);
        }.bind(this);
    }
    /**
     * 重新布局所有图片
     * @param centerIndex 指定居中排布哪一张图片
     */
    reArrange(centerIndex){
       let Constant = this.Constant,
           imgArrangeArr = this.state.imgsArrangeArr,
           centerPos = Constant.centerPos,
           hPosRange = Constant.hPosRange,
           vPosRange = Constant.vPosRange,
           hPosRangeLeftSecX = hPosRange.leftSecX,
           hPosRangeRightSecX = hPosRange.rightSecX,
           hPosRangeY = hPosRange.y,
           vPosRangeX = vPosRange.x,
           vPosRangeTopY = vPosRange.topY,
           //存储上部图片状态信息
           imgArrangeTopArr = [],
           //上部分图片数量
           topImgNum = Math.ceil(Math.random() * 2),
           //上部分图片从数组的那个地方拿出来的
           topImgSpliceIndex = 0,

            imgArrangeCenterArr = imgArrangeArr.splice(centerIndex,1);
        //首先居中centerIndex的图片，居中的图片不需要旋转
            imgArrangeCenterArr[0] = {
                    pos : centerPos,
                    rotate: 0,
                    isCenter: true
            };

            topImgSpliceIndex = Math.ceil(Math.random()*(imgArrangeArr.length - topImgNum));
            imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex,topImgNum);
            //布局位于上测的图片
            imgArrangeTopArr.forEach(
                function(value,index){
                    imgArrangeTopArr[index] = {
                        pos : {
                            top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                            left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                        },
                        rotate: get30DegRandom(),
                        isCenter: false
                    }
                    console.log(imgArrangeTopArr);
                }
            );
        console.log(topImgNum);


        //布局左右两侧的图片
            for(let i=0,j =imgArrangeArr.length,k=j/2;i<j;i++){
                let hPosRangeLORX = null;
                //前半部分布局左边，右半部分布局右边
                if(i < k){
                    hPosRangeLORX = hPosRangeLeftSecX;
                }else{
                    hPosRangeLORX = hPosRangeRightSecX;
                }

                imgArrangeArr[i]={
                    pos : {
                        top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                        left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                }
            }

            if(imgArrangeTopArr && imgArrangeTopArr[0]){
                imgArrangeArr.splice(topImgSpliceIndex,0,imgArrangeTopArr[0]);

            }

            imgArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);

            this.setState({
                imgsArrangeArr:imgArrangeArr
            });
    }
    //组件加载以后，为每张图片计算其位置范围
    componentDidMount(){

        //获取舞台大小
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW/2),
            halfStageH = Math.ceil(stageH/2);
        //获取imgfigure的大小
        var imgfDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgfDOM.scrollWidth,
            imgH = imgfDOM.scrollHeight,
            halfImgW = Math.ceil(imgW/2),
            halfImgH = Math.ceil(imgH/2);

        //计算中心点
        this.Constant.centerPos={
            left:halfStageW-halfImgW*1.2,
            top:halfStageH-halfImgH*2
        }
        //左右两侧位置
            this.Constant.hPosRange.leftSecX[0]=-halfImgW;
            this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW * 3;
            this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
            this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
            this.Constant.hPosRange.y[0]=-halfImgH;
            this.Constant.hPosRange.y[1]=stageH - halfImgH;
        //中间上下位置
            this.Constant.vPosRange.topY[0]=-halfImgH;
            this.Constant.vPosRange.topY[1]=halfStageH-halfImgH*5;
                this.Constant.vPosRange.x[0]=halfStageW-imgW;
                this.Constant.vPosRange.x[1]=halfStageW;

        //初始化 数组中第一张图片居中
        this.reArrange(0);
    }

  render() {
    var imgFigures = [];
        //controllerUnits = [];
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

          imgFigures.push(<ImageFigure key = {index} data={value} ref={'imgFigure'+index} imgarrshit={this.state.imgsArrangeArr[index]} center={this.center(index)}/>);
    }.bind(this));


    return (

        <section className="stage index" ref="stage">
          <section className="image-sec">
            {imgFigures}
          </section>
          <nav className="img-controller"></nav>
        </section>
    );
  }
}
var ImageFigure = React.createClass({
    /**
     * imgFigure的点击处理函数
     */
    handleClick(e){
        if(this.props.imgarrshit.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },
    render: function(){
      let styleObj = {},centerstyle = {};
      if(this.props.imgarrshit.pos)
      {
          styleObj= this.props.imgarrshit.pos;
      }
        if(this.props.imgarrshit.rotate){
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                styleObj[value] = 'rotate(' + this.props.imgarrshit.rotate + 'deg)';
            }.bind(this));
        }
        if(this.props.imgarrshit.isCenter){
            styleObj.zIndex = 11;
            styleObj.width=400;
            centerstyle.width=360;
            //styleObj.img.width=360;
            //console.log(styleObj);
            //console.log(this.props);
        }
      return(
      <figure  className="img-figure" style={styleObj} onClick={this.handleClick} >
        <img className="img-shit" style={centerstyle} src={this.props.data.imageUrl} alt = {this.props.data.title}/>
        <figcaption className="img-title">
          <h2>{this.props.data.title}</h2>
        </figcaption>
      </figure>

    );
  }
});

AppComponent.defaultProps = {
};

export default AppComponent;
