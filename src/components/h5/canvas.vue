<template>
    <div id='canvas_box'>
        <div class='html_content' ref='html_content' id='html'>
            <div class="canvas_head">
                <ul>
                    <li>处方编号：<span>{{ canvasdata.number }}</span></li>
                    <li>处方生成时间：<span>{{ canvasdata.start_time | filterTime }}</span></li>
                    <li>处方有效时间：<span>{{ canvasdata.undue_time | filterTime }}</span></li>
                </ul>
            </div>
            <h2>云医康互联网药店电子处方</h2>
            <div class="canvas_user">
                <ul>
                    <li>姓名：<span>{{ canvasdata.name }}</span></li>
                    <li>性别：
                        <span v-show='canvasdata.sex == 1'>男</span>
                        <span v-show='canvasdata.sex == 2'>女</span>
                    </li>
                    <li>年龄：<span>{{ canvasdata.age }}</span></li>
                </ul>
                <ul>
                    <li>肝功能：<span v-text='canvasdata.liver != "" ?canvasdata.liver: "正常" '></span></li>
                    <li>肾功能：<span v-text='canvasdata.kidney != "" ?canvasdata.kidney: "正常" '></span></li>
                    <li>备孕情况：<span v-text='canvasdata.yun != "" ?canvasdata.yun: "无" '></span></li>
                </ul>
                <ul>
                    <li>过敏史：<span v-text='canvasdata.allergy != "" ?canvasdata.allergy: "无" '></span></li>
                    <li>过往病史：<span v-text='canvasdata.ago != "" ?canvasdata.ago: "无" '></span></li>
                </ul>
                <ul>
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
                    <img ref='chapter' src="" alt="">
                </div>
            </div>
            <div class="msg">
                （以下空白，手写无效）
            </div>
            <div class="check">
                <ul>
                    <li><span>处方医师：</span><img ref='doctorImg' src="" alt=""></li>
                    <!-- <li><span>审核药师：</span><img src="" alt=""></li> -->
                </ul>
            </div>
        </div>
        
        <div class="btn">
            <button @click='giveAndroid'>下载处方</button>
        </div>
        
    </div>
</template>

<script>
import { Indicator } from 'mint-ui';
import html2canvas from 'html2canvas'
export default {
    data () {
        return {
            canvasdata: {},
            durg: [],
            ti: '',
            imgUrl: '',

        }
    },
 mounted () {
    var _this = this;
    _this.$https.post('/mobile/doch5/user_recipe_detail', {'id': this.$route.params.did }, function (res) {
        // console.log(res.data)
        if (res.data.code == 1) {
            _this.canvasdata = res.data.data
            _this.durg = res.data.drug
            _this.$nextTick(() => {
                if(_this.canvasdata.signpic) {
                    _this.$refs.doctorImg.src = _this.$https.baseURL+_this.canvasdata.signpic
                }
                if (_this.canvasdata.seal) {
                    _this.$refs.chapter.src = _this.$https.baseURL+_this.canvasdata.seal
                }
                
            })
        }
    })

    setTimeout(() => {
        _this.canvasImg()
    }, 200)   
    Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
    });
 },
  methods: {
        giveAndroid () {   // 调取安卓 和 ios
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
            cntElem.style['-webkit-transform'] = 'scale(1)'
            var shareContent = cntElem; //需要截图的包裹的（原生的）DOM 对象
            var width = shareContent.offsetWidth; //获取dom 宽度
            var height = shareContent.offsetHeight; //获取dom 高度
            var canvas = document.createElement("canvas"); //创建一个canvas节点
            var scale = 2; //定义任意放大倍数 支持小数
            canvas.width = width * scale; //定义canvas 宽度 * 缩放
            canvas.height = height * scale; //定义canvas高度 *缩放
            canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
            var opts = {
                backgroundColor:null,
                scale: scale, // 添加的scale 参数
                canvas: canvas, //自定义 canvas
                // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                width: width, //dom 原始宽度
                height: height,
                dpi: 300,
                // useCORS: true // 【重要】开启跨域配置
            };

            html2canvas(shareContent, opts).then(function (canvas) {
                
                var img = canvas.toDataURL("image/jpeg");
                _this.imgUrl = img
                cntElem.style['-webkit-transform'] = 'scale(0.5)'
                document.getElementById('canvas_box').style['background'] = '#000';
                Indicator.close();
            });
    
        }
      

    }
}
</script>

<style lang="scss" scoped>

@function rem($px) {
    @return $px / 58.2 +rem;
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
    background: #ffff;
    letter-spacing: 1px;
    .html_content {
        background: #fff;
        width: 200%;
        height: 100%;
        overflow: hidden;
        font-size: rem(16);
        padding: rem(20) rem(30);
        zoom: 1;
        -webkit-transform-origin-x: 0;    /*定义元素被置于x轴的何处*/
        -webkit-transform: scale(1);   /*定义元素被缩放*/
        .canvas_head {
            width: 100%;
            >ul {
                display: box;              
                display: -webkit-box;      
                display: -moz-box;       
                display: -ms-flexbox;
                display: -webkit-box;
                display: flex;
                letter-spacing: 1px;
                li {
                    width: 33%;
                    font-size: rem(10);
                }
            }
        }
        h2 {
            font-size: rem(20);
            padding: rem(20);
            text-align: center;
            letter-spacing: rem(3);
        }
        .canvas_user {
            width: 100%;
            border-bottom:1px dashed #ccc;
            padding: rem(10) 0;
            ul {
                display: box;              
                display: -webkit-box;      
                display: -moz-box;       
                display: -ms-flexbox;
                display: -webkit-box;
                display: flex;
                font-size: rem(10);
                li {
                    width: 33%;
                    height: rem(30);
                    line-height: rem(30);
                    font-size: rem(16);
                    letter-spacing: rem(2);
                }
            }
        }
        .canvas_drug {
            width: 100%;
            padding: rem(20) 0;
            position: relative;
            >p {
                font-weight: 550;
                font-size: rem(12);
            }
            >ol {
                margin-top: rem(20);
                font-size: rem(10);
                li {
                    line-height: rem(30);
                    font-size: rem(16);
                    span {
                        margin-left: rem(14);
                    }
                }
            }
            .tshi {
                position: absolute;
                right: rem(30);
                bottom: rem(10);
                font-size: rem(8);
                width: rem(100);
                height: rem(100);

                img {
                    width: rem(100);
                    height: rem(100);
                    border-radius: 50%;
                }
            }
        }
        .msg {
            text-align: center;
            font-size: rem(10);
            line-height: rem(14);
            padding-bottom: rem(30);
        }
        .check {
            margin-top: rem(30);
            width: 100%;
            font-size: rem(14);
            overflow: hidden;
           > ul {
                display: box;              
                display: -webkit-box;      
                display: -moz-box;       
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
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
                    font-size: rem(14);
                    > img {
                        max-width: rem(40);
                        height: rem(30);
                        margin-left: rem(5);
                        display: block;
                        vertical-align: middle;
                    }
                }
            }
        }
        
    }
    .btn {
        width: 100%;
        text-align: center;
        position: fixed;
        bottom: rem(30);
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

