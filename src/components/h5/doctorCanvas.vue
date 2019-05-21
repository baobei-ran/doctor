<template>
    <div id='canvas_box' >
        <div :class="{'image': isImg }" id='imgsss'>
        <div class='html_content' ref='html_content' id='html'>
            <div class="canvas_head">
                <ul>
                    <li>处方编号：<span>{{ canvasdata.order_code }}</span></li>
                    <li>处方生成时间：<span>{{ canvasdata.creatime | filterTime }}</span></li>
                    <li>处方有效时间：<span>{{ canvasdata.undue_time | filterTime }}</span></li>
                </ul>
            </div>
            <h2>云医康互联网药店电子处方</h2>
            <div class="canvas_user">
                <ul>
                    <li>姓名：<span>{{ canvasdata.name }}</span></li>
                    <li>性别：
                        <span v-show='canvasdata.sex == 0'>男</span>
                        <span v-show='canvasdata.sex == 1'>女</span>
                    </li>
                    <li>年龄：<span>{{ canvasdata.age }}</span></li>
                
                    <li>肝功能：<span v-text='canvasdata.liver != "" ?canvasdata.liver: "正常" '></span></li>
                    <li>肾功能：<span v-text='canvasdata.kidney != "" ?canvasdata.kidney: "正常" '></span></li>
                    <li>备孕情况：<span v-text='canvasdata.yun != "" ?canvasdata.yun: "无" '></span></li>
                
                    <li>过敏史：<span v-text='canvasdata.allergy != "" ?canvasdata.allergy: "无" '></span></li>
                    <li>过往病史：<span v-text='canvasdata.ago != "" ?canvasdata.ago: "无" '></span></li>
                
                    <li>诊断结果：<span>{{ canvasdata.result }}</span></li>
                </ul>
            </div>
            <div class="canvas_drug">
                <p>Rp:</p>
                <ol v-for='(val,i) in durg'>
                    <li>{{ val.company }} {{val.name}} <span>*{{ val.num }}</span></li>
                    <li>用法：<b>{{ val.usage }}</b></li>
                </ol>
                <div class="tshi" id='seal'>
                    <img ref='chapter' :src="$https.baseURL+canvasdata.zhang_pic" alt="">
                </div>
            </div>
            <div class="msg">
                （以下空白，手写无效）
            </div>
            <div class="check">
                <ul>
                    <li><span>处方医师：</span><img ref='doctorImg' :src="$https.baseURL+canvasdata.signpic" alt=""></li>
                    <li v-if='canvasdata.signpic'><span>审核药师：</span><img ref='pharmacist' :src="$https.baseURL+canvasdata.yname_pic" alt=""></li>
                </ul>
            </div>
        </div>
        
        <div class="btn">
            <button @click='getClick'>保存处方</button>
        </div>
        </div>
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
    data () {
        return {
            canvasdata: {},
            durg: [],
            ti: '',
            imgUrl: '',
            isImg: false
        }
    },
   
    mounted () {
        var _this = this;
         _this.$https.post('/mobile/Doch5/recipe_look', {'id': this.$route.params.did }, function (res) {
            console.log(res.data)
            if (res.data.code == 1) {
                _this.canvasdata = res.data.data
                _this.durg = res.data.recipe_eat
                // _this.$nextTick(function () {
                //     if(_this.canvasdata.signpic) {
                //         _this.$refs.doctorImg.src = _this.$https.baseURL+_this.canvasdata.signpic
                //     }
                //     if (_this.canvasdata.zhang_pic) {
                //         _this.$refs.chapter.src = _this.$https.baseURL+_this.canvasdata.zhang_pic
                //     }
                //     if (_this.canvasdata.yname_pic) {
                //         _this.$refs.pharmacist.src = _this.$https.baseURL+_this.canvasdata.yname_pic
                //     }
                    
                // })
                setTimeout(function () {
                    _this.canvasImg()
                }, 300)  
            }
        })
        
    
    },
  methods: {
    
       getClick () {   // 调取安卓
            console.log(this.imgUrl)
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
                android.downLoad(this.imgUrl)
            }
            if (isiOS) {
                window.webkit.messageHandlers.downLoad.postMessage(this.imgUrl);
            }
        },
        canvasImg () {
            var _this = this;
            var cntElem = document.getElementById('html');
            cntElem.style['-webkit-transform'] = 'scale(1)';
            var shareContent = cntElem; //需要截图的包裹的（原生的）DOM 对象
            var width = shareContent.offsetWidth ; //获取dom 宽度
            var height = shareContent.offsetHeight; //获取dom 高度
            var canvas = document.createElement("canvas"); //创建一个canvas节点
            // var scale = 4; //定义任意放大倍数 支持小数
            var scale = window.devicePixelRatio * 2;//获取设备的显示参数
            canvas.width = width * scale; //定义canvas 宽度 * 缩放
            canvas.height = height * scale; //定义canvas高度 *缩放
            canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
            var opts = {
                background:null,
                scale: scale, // 添加的scale 参数
                canvas: canvas, //自定义 canvas
                // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                width: width, //dom 原始宽度
                height: height,
                dpi: 600,
                // useCORS: true // 【重要】开启跨域配置
            };
            html2canvas(shareContent, opts).then(function (canvas) {
                var urls = canvas.toDataURL('image/png');
                _this.imgUrl = urls
                cntElem.style['-webkit-transform'] = 'scale(0.5)'
                // var img = new Image()
                // img.src = urls
                // img.style = 'width: 100%;'
                // cntElem.style['display'] = 'none';
                // document.getElementById('imgsss').append(img)
                // _this.isImg = true
                document.getElementById('canvas_box').style['background'] = '#000';
                
            });
    
        }
      

    }
}
</script>
<style>
    .mint-indicator-mask {
        background: #000!important;
    }
</style>

<style lang="scss" scoped>

@function rem($px) {
    @return $px / 50 +rem;
}

.flex {
    display:-webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient:vertical;
    -webkit-box-direction:normal;
    -moz-box-orient:vertical;
    -moz-box-direction:normal;
    flex-direction:column;
    -webkit-flex-direction:column;
    align-items:center;
    -webkit-align-items:center;
    box-align:center;
    -moz-box-align:center;
    -webkit-box-align:center;
    -webkit-box-pack: center;
    -moz-justify-content: center;
    -webkit-justify-content: center;
    justify-content: center;
}
#canvas_box {
    width: 100%;
    height: 100%;
    color: #333;
    background: #fff;
    .image {
        width: 100%;
        height: 100%;
        display: -webkit-box; 
        display: -moz-box; 
        display: -webkit-flex; 
        display: -moz-flex; 
        display: -ms-flexbox; 
        display: flex;
        -webkit-align-items:center;
        box-align:center;
        -moz-box-align:center;
        -webkit-box-align:center;
        align-items:center;
        -webkit-box-pack: center;
        /* 12版 */
        -webkit-justify-content: center;
        -moz-justify-content: center;
        -ms-justify-content: center;
        -o-justify-content: center;
        justify-content: center;
    }
    .html_content {
        background: #fff;
        width: 200%;
        height: 100%;
        // overflow: hidden;
        zoom: 1;
        font-size: 18px;
        padding: 20px;
        -webkit-transform-origin-x: 0;    /*定义元素被置于x轴的何处*/
        -webkit-transform: scale(0.5);   /*定义元素被缩放*/
        .canvas_head {
            width: 100%;
            >ul {
                display: box;              
                display: -webkit-box;      
                display: -moz-box;       
                display: -ms-flexbox;
                display: -webkit-box;
                display: flex;
                
                li {
                    width: 100%;
                    font-size: 12px;
                    line-height: 30px;
                    letter-spacing: 1px;
                }
            }
        }
        h2 {
            font-size: 20px;
            padding: 20px;
            text-align: center;
            letter-spacing:2px;
        }
        .canvas_user {
            width: 100%;
            border-bottom:1px dashed #ccc;
            padding: 10px 0;
           > ul {
                display: box;              
                display: -webkit-box;      
                display: -moz-box;       
                display: -ms-flexbox;
                display: -webkit-box;
                display: flex;
                -webkit-flex-wrap: wrap;
                -moz-flex-wrap: wrap;
                -ms-flex-wrap: wrap;
                -o-flex-wrap: wrap;
                flex-wrap: wrap;
                li {
                    width: 33%;
                    height: 30px;
                    line-height: 30px;
                    letter-spacing: 1.5px;
                    font-size: 14px;
                }
            }
        }
        .canvas_drug {
            width: 100%;
            padding: 20px 0;
            position: relative;
            >p {
                font-weight: 550;
                font-size: 14px;
            }
            >ol {
                margin-top: 0 20px;
                font-size: 14px;
                // float: left;
                li {
                    padding-left: 20px;
                    line-height: 20px;
                    letter-spacing: 1.5px;
                    span {
                        margin-left: 16px;
                    }
                }
            }
            .tshi {
                position: absolute;
                right: 30px;
                bottom: 10px;
                font-size: 12px;
                width: 100px;
                height: 100px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
        }
        .msg {
            text-align: center;
            font-size: 10px;
            line-height: 14px;
            letter-spacing: 3px;
        }
        .check {
            margin: 30px 0;
            width: 100%;
            font-size: 15px;
            overflow: hidden;
            padding-bottom: 50px;
           > ul {
                width: 100%;
                display: box;              
                display: -webkit-box;      
                display: -moz-box;       
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                margin-bottom: 20px;
                li {
                    width: 50%;
                    display: box;              
                    display: -webkit-box;      
                    display: -moz-box;       
                    display: -ms-flexbox;
                    display: -webkit-flex;
                    display: flex;
                    align-items: center;
                    -webkit-align-items: center;
                    -moz-align-items: center;
                    -ms-align-items: center;
                    -o-align-items: center;
                    letter-spacing: rem(1);
                    margin-bottom: 10px;
                    > img {
                        max-width: 50px;
                        height: 30px;
                        display: block;
                        vertical-align: bottom;
                        margin-left: 10px;
                    }
                }
            }
        }
        
    }
    .btn {
        width: 100%;
        text-align: center;
        position: fixed;
        bottom: rem(15);
        left: 0;
        > button {
            color: #fff;
            background: rgba(255,255,255, .4);
            padding: rem(5) rem(10);
            border-radius: rem(3);
        }
    }
}
</style>

