<template>
    <div class="detail_box">
    <div class="detail" v-if='flag'>
        <div class="bg_f lunbo">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for='(val,i) in pics' :key='i'>
                        <img :src="$https.baseURL+val.img" alt="">
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <div class="title bg_f">
            <span class="price" >￥<span style='font-size: .28rem;'>{{ datalist.price }}</span></span>
            <h4>{{ datalist.name }}</h4>
            <p><span>{{ datalist.sales_volume }}</span>人购买</p>
        </div>
        <div class="detail_con bg_f" v-if='datalist.type == 1? true:false'>        <!--  1 药品 2 保健品 3 医疗器械 -->
            <ul>
                <li><span>商品类型：</span><span>{{ datalist.recipe }}</span></li>
                <li><span>商品剂型：</span><span>{{ datalist.type2 }}</span></li>
                <li><span>商品用法：</span><span>{{ datalist.usetype }}</span></li>
            </ul>
            <ul>
                <li><span>规格：</span><span>{{ datalist.specification }}</span></li>
                <li><span>成分：</span><span>{{ datalist.type2 }}</span></li>
                <li><span>性状：</span><span>{{ datalist.usetype }}</span></li>
                <li><span>功能主治：</span><span>{{ datalist.attending_functions }}</span></li>
                <li><span>用法用量：</span><span>{{ datalist.dose }}</span></li>
                <li><span>生产厂家：</span><span>{{ datalist.enterprise }}</span></li>
                <li><span>有效期：</span><span>{{ datalist.uselife }}</span></li>
                <li><span>批准文号：</span><span>{{ datalist.code }}</span></li>
                <li><span>注意事项：</span><span>{{ datalist.cautions }}</span></li>
            </ul>
        </div>
        <div class="detail_con bg_f" v-if='datalist.type == 2?true:false'>
            <ul>
                <li><span>保健功能：</span><span>{{ datalist.health }}</span></li>
                <li><span>商品剂型：</span><span>{{ datalist.type2 }}</span></li>
                <li><span>商品用法：</span><span>{{ datalist.usetype }}</span></li>
            </ul>
            <ul>
                <li><span>规格：</span><span>{{ datalist.specification }}</span></li>
                <li><span>成分：</span><span>{{ datalist.type2 }}</span></li>
                <li><span>性状：</span><span>{{ datalist.usetype }}</span></li>
                <li><span>适宜人群：</span><span>{{ datalist.appropriate }}</span></li>
                <li><span>用法用量：</span><span>{{ datalist.dose }}</span></li>
                <li><span>生产厂家：</span><span>{{ datalist.enterprise }}</span></li>
                <li><span>有效期：</span><span>{{ datalist.uselife }}</span></li>
                <li><span>批准文号：</span><span>{{ datalist.code }}</span></li>
                <li><span>注意事项：</span><span>{{ datalist.cautions }}</span></li>
            </ul>
        </div>
        <div class="detail_con bg_f" v-if='datalist.type == 3?true:false'>
            <ul>
            </ul>
            <ul>
                <li><span>型号：</span><span>{{ datalist.model }}</span></li>
                <li><span>生产企业：</span><span>{{ datalist.enterprise }}</span></li>
                <li><span>适宜人群：</span><span>{{ datalist.appropriate }}</span></li>
                <li><span>使用方法：</span><span>{{ datalist.utype }}</span></li>
                <li><span>注意事项：</span><span>{{ datalist.cautions }}</span></li>
            </ul>
        </div>
        <div class="cont_img">
            <ul>
                <li v-for='(val,i) in imgs' :key='i' ><img :src="$https.baseURL+val.img" alt=""></li>
            </ul>
        </div>
        <!-- <div class="cont_img">
            <ul>
                <li v-for='(val,i) in pics' :key='i' ><img :src="$https.baseURL+val.img" alt=""></li>
            </ul>
        </div> -->
    </div>
    <div class="empty_2" v-if='!flag'>
        <img src="../../common/img/icon/default.png" alt="">
        <p class="Ft-S28">您查看的商品已被删除，请查看其他商品。</p>
    </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            flag: true,
            datalist:{
                attending_functions: "",
                cautions: "",
                code: "",
                dose: "",
                enterprise: "",
                gid: 4,
                name: "",
                pic: "",
                price: "",
                recipe: 1,
                sales_volume: 0,
                specification: "",
                state: 1,
                type: '',
                type2: "",
                uselife: "",
                usetype: 1
            },
            imgs: [],
            pics: [],
        }
    },
    mounted () {
        var _this = this;
        this.$https.post('/mobile/doch5/doc_goods_detail', {'id': this.$route.params.did }, function (res) {
            var datas = res.data
             console.log(datas)
            if (datas.code == 1) {
                _this.flag = true;
                _this.$nextTick(() => {
                    _this.datalist = datas.data
                    _this.datalist.usetype = datas.data.usetype == 1? '内服': '外用'
                    _this.datalist.recipe = datas.data.recipe == 0? '非处方':'处方'
                    _this.imgs = datas.img
                    _this.pics = datas.pic
                    _this.$nextTick(() => {
                        if (_this.pics.length > 1) {
                            var swipers = new Swiper ('.swiper-container', {
                                loop: true,
                                // autoplay: true,
                                pagination: {
                                    el: '.swiper-pagination',
                                },
                            }) 
                        }
                    })
                })
            } else {
                _this.flag = false
            }
        })
             
    }
}
</script>
<style lang='scss' scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
$color: #333;


.bg_f {
    background-color: #fff;
}
.detail {
    width: 100%;
    color: $color;
    background-color: #f4f4f4;
    padding-bottom: .3rem;
    font-size: rem(14);
    .lunbo {
        width:100%;
        .swiper-pagination {
            bottom: rem(20);
            color: #fff;
            left: 50%;
            transform: translate(-50%, 0);
            -ms-transform: translate(-50%, 0);
            -moz-transform: translate(-50%, 0);
            -webkit-transform: translate(-50%, 0);
            -o-transform: translate(-50%, 0);
            z-index: 999;
        }

    }
    .title {
        font-size: 0.28rem;
        padding: 0.21rem;
         .price {
            font-size: 0.22rem;
            color: #E9541F;
            font-weight: 550;
        }
        h4 {
            font-weight:500;
            color:#333;
            line-height:0.33rem;
            margin-top: 0.19rem;
        }
        p {
            margin-top: 0.38rem;
            color:#A9A9A9;
            font-size: 0.22rem;
            span {
                color: #A9A9A9;
            }
        }
    }
    .detail_con {
        font-size: 0.28rem;
        margin-top: 0.2rem;
        padding: 0 0.20rem;
        overflow: hidden;
        ul {
            font-weight: 400;
            li {
                width: 100%;
                margin: 0.4rem 0;
                -webkit-display: flex;
                display: flex;

                span:first-child {
                    color: #808080;
                    display: block;
                    width: 30%;
                }
                span:last-child {
                    color: #333;
                }
            }
        }
        ul:first-child {
            border-bottom: 1px solid rgba(224,224,224,1);
        }
    }
    .cont_img {
        width: 100%;
        font-size: 0.28rem;
        overflow: hidden;
        ul {
            width: 100%;
            li {
                width: 100%;
                img {
                    display: block;
                    width: 100%;

                }
            }
        }
    }
}
.empty_2 {
    width: 100%;
    text-align: center;
    margin-top: 30%;
    >img {
        width: 50%;
        margin: 0 auto;
    }
    > p {
        font-size: rem(14);
        color: #666;
    }
}
</style>
