<template>
    <div class="detail">
        
       <div class="box">
            <div class="section"  id='html'>
                <div class="check" v-show='datalist.flag == 0'>
                    未审核
                </div>
                <div class="check" v-show='datalist.flag == 1'>
                    审核通过
                </div>
                <div class="check" v-show='datalist.flag == 2'>
                    审核未通过
                </div>
                <div class="check" v-show='datalist.flag == 3'>
                    已过期
                </div>
            <div class="bg_f">
                <div class="canvas">
                     
                            <div class='html_content' ref='html_content' id='htmls'>
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
                                                <span v-show='canvasdata.sex == 0'>男</span>
                                                <span v-show='canvasdata.sex == 1'>女</span>
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
                                        <div class="tshi">
                                            <img :src="$http.baseURL+canvasdata.seal" alt="">
                                        </div>
                                    </div>
                                    <div class="msg">
                                        （以下空白，手写无效）
                                    </div>
                                    <div class="check">
                                        <ul>
                                            <li><span>处方医师：</span><img ref='doctorImg' :src="$http.baseURL+canvasdata.signpic" alt=""></li>
                                            <!-- <li><span>审核药师：</span><img src="../common/img/img_dtzs.png" alt=""></li> -->
                                        </ul>
                                    </div>
                            </div>
        
                </div>
                <span @click='outImg'>查看完整处方</span>
            </div>


            
        <div class="detail_con" >        
            <ul>
                <li><span  class="blue">开具医生：</span><span>{{ datalist.true_name }}</span></li>
                <li><span>处方单号：</span><span>{{ datalist.number }}</span></li>
                <li><span>开具时间：</span><span>{{ datalist.creatime | filterTime }}</span></li>
            </ul>
            <div class="msg">
                <div><span  class="blue" >患者信息：</span><span>{{ datalist.name }} <b>|</b> <i v-text='datalist.sex ==0? "男" : "女"' ></i> <b>|</b> {{ datalist.age }}</span></div>
                <div class="left"><span>诊断结果：</span><span>{{ datalist.result }}</span></div>
                <div class="left"><span>处理意见：</span><span>{{ datalist.opinion }}</span></div>
            </div>
        </div>
        <div class="recipe">
            <h4>处方中的药品</h4>
            <ul>
                <li v-for='(val,i) in drop' :key='i'>
                    <div> <span>{{ val.name }}</span><b>x{{ val.num }}</b></div>
                    <p>用法用量：{{ val.usage }}</p>
                </li>
            </ul>
        </div>

        
            
        <dl class="dl" v-show='datalist.flag == 1 || datalist.flag == 3'>
            <dt>
                审核药师：<span>{{ datalist.flag_name }}</span>
            </dt>
            <dd>
                审核时间：<span>{{ datalist.flag_time | filterTime }}</span>
            </dd>
        </dl>
           

            
        </div>
             



       </div>
       
    </div>
</template>
<script>

export default {
    data () {
        return {
            datalist: {
                true_name: '',
                number: '',
                start_time: '',
                name: '',
                age: '',
                sex: '',
                result: '',
                opinion: '',
                status: ''
            },
            drop: [],
            imgUrl: '',
            userId: '',
            canvasdata: {},
            durg: [],
            ti: '',
            imgUrl: '',
        }
    },
    mounted () {
        var _this = this;
        this.userId = this.$route.params.did
        this.$https.post('/mobile/Doch5/recipe_look', {'id': this.$route.params.did }, function (res) {
            console.log(res.data)
            if (res.data.code == 1) {
                if (res.data) {
                    _this.datalist = res.data.data
                    _this.drop = res.data.recipe_eat
                }
            } else {
                _this.datalist = []
                _this.drop = []
            }
        })

        _this.$https.post('/mobile/Doch5/recipe_look',  {'id': this.$route.params.did }, function (res) {
            // console.log(res.data)
            if (res.data.code == 1) {
                _this.canvasdata = res.data.data
                _this.durg = res.data.recipe_eat
            }
        })

    },
   methods: {       
       outImg () {
           this.$router.push({ name: 'doctordownload', params: { 'id': this.userId }})
       }
   }
   
}
</script>
<style lang='scss' scoped>
@function rem($px) {
    @return $px / 100 + rem;
}
$color: #333;

.detail {
    width: 100%;
    height: 100%;
    color: $color;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    background-color: #F9F9F9;
    font-size: rem(16);
    color: #333;
    padding-bottom: rem(22);
    
    .box {
        width: 100%;
        -prefix-box-flex: 1; 
        -webkit-box-flex: 1; 
        -webkit-flex: 1; 
        -moz-box-flex: 1; 
        -ms-flex: 1; 
        flex: 1; 
        overflow: auto;
        .section {
        width: 100%;
        .check {
            font-size: rem(40);
            font-weight:550;
            height: rem(141);
            padding: 0 rem(22);
            line-height: rem(141);
        }
        .bg_f {
            background-color: #fff;
            padding: rem(32) rem(22);
            height: rem(360);
            position: relative;
            >.canvas {
                width: 100%;
                height: 100%;
                overflow: hidden;
               
               
            }
            >span {
                position: absolute;
                bottom: rem(13+32);
                left: 50%;
                display: block;
                width: rem(240);
                // height: rem(50);
                border-radius: rem(25);
                background: rgb(0,0,0);
                opacity: .5;
                color: #fff;
                text-align: center;
                // line-height: rem(50);
                padding: rem(10) rem(10) rem(12) rem(10);
                -webkit-transform: translateX(-50%); 
                -o-transform: translateX(-50%); 
                -ms-transform: translateX(-50%); 
                -moz-transform: translateX(-50%); 
                transform: translateX(-50%); 
            }
        }
       
        


        .detail_con {
            font-size: rem(28);
            margin-top: rem(22);
            background: #fff;
            .blue {
                border-left: 3px solid #5189F6;
            }
            ul {
                font-weight: 400;
                width: 100%;
                padding: rem(20) 0;
                li {
                    width: 100%;
                    padding:rem(20) 0;
                    display: -webkit-flex;
                    display: flex;
                    span:first-child {
                        color: #808080;
                        display: block;
                        width: 30%;
                        padding-left: rem(20);
                    }
                    span:last-child {
                        color: #333;
                    }
                }
            }
            ul:first-child {
                border-bottom: 1px solid rgba(224,224,224,1);
            }
            .msg {
                width: 100%;
                
                > div {
                    padding: rem(30) 0;
                    overflow: hidden;
                    line-height:rem(44);
                    border-bottom: 1px solid #E0E0E0;
                     span:first-child {
                        color: #808080;
                        display: block;
                        float: left;
                        padding-left: rem(20);
                        width: 30%;
                    }
                    span:last-child {
                        
                        color: #333;
                        float: left;
                        b {
                            color: #E0E0E0;
                        }
                    }
                }
                .left {
                    padding: rem(30) rem(20);
                    overflow: hidden;
                    line-height:rem(44);
                    border-bottom: 1px solid #E0E0E0;
                    > span:first-child {
                        padding-left:0;
                        width: 29%;
                    }
                    
                }
            }

        }
        .recipe {
                width: 100%;
                margin-top: rem(22);
                background: #fff;
                padding-top: rem(36);
                h4 {
                    line-height: rem(42);
                    padding:0 rem(16);
                    font-size: rem(28);
                    border-left: 3px solid #5189F6;
                }
                ul {
                    li {
                        padding: rem(42) rem(23);
                        font-size: rem(28);
                        border-bottom:1px solid #E0E0E0;
                        div {
                           
                           b {
                               float: right;
                               color:#808080;
                           }
                        }
                        p {
                            margin-top: rem(32);
                            color: #808080;
                        }
                    }
                }
            }

        
        
        .dl {
            width: 100%;
            margin-top: rem(22);
            background: #fff;
            padding: rem(20) 0 rem(40);
            dt {
                border-left: 3px solid #5189F6;
                display:box;
                display:-webkit-box;
                display:-webkit-flex; 
                display:-moz-box; 
                display:-ms-flexbox; 
                display:flex;
                padding-left: rem(23);
                font-size: rem(28);
                span:first-child {
                        color: #808080;
                        display: block;
                        width: 30%;
                    }
                    span:last-child {
                        color: #333;
                        display: block;
                    }
            }
            dd {
                display:box;
                display:-webkit-box;
                display:-webkit-flex; 
                display:-moz-box; 
                display:-ms-flexbox; 
                display:flex;
                margin-top: rem(40);
                margin-left: 0;
                padding: 0 rem(23);
                font-size: rem(28);
                span:first-child {
                        color: #808080;
                        display: block;
                        width: 30%;
                        
                    }
                    span:last-child {
                        color: #333;
                        display: block;
                        width: 60%;
                    }
            }
        }
      
    }   
    }
    

    .canvas {
        width: 100%;
         background: rgba(0,0,0, .1);
        .html_content {
        width: 200%;
        height: 100%;
        overflow: hidden;
        font-size: rem(14);
        padding: rem(13) rem(30);
        zoom: 1;
        -webkit-transform-origin-x: 0;    /*定义元素被置于x轴的何处*/
        -webkit-transform: scale(0.5, 0.8);   /*定义元素被缩放*/
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
                    width: 33%;
                    font-size: rem(8);
                    letter-spacing: rem(1);
                }
            }
        }
        h2 {
            font-size: rem(18);
            padding: rem(20);
            text-align: center;
            letter-spacing: rem(5);
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
                font-size: rem(8);
                li {
                    width: 33%;
                    height: rem(30);
                    line-height: rem(30);
                    letter-spacing: rem(1.5);
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
                font-size: rem(7);
                li {
                    line-height: rem(30);
                    span {
                        margin-left: rem(14);
                    }
                }
            }
            .tshi {
                position: absolute;
                right: rem(30);
                bottom: rem(10);
                font-size: rem(5);
                img {
                    width: rem(100);
                    height: rem(100);
                    border-radius: 50%;
                }
            }
        }
        .msg {
            text-align: center;
            font-size: rem(7);
            line-height: rem(14);
            padding-bottom: rem(30);
        }
        .check {
            margin-top: rem(30);
            width: 100%;
            font-size: rem(8);
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
                    > img {
                        max-width: rem(40);
                        height: rem(25);
                        display: block;
                    }
                }
            }
        }
        
    }
    }
    
    
}

</style>
