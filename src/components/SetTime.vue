<!--SetTime 时段设置-->
<template>
  <div id="SetTime">
    <div class="tips_msg"
         v-html="TipsMsg"
    ></div>
    <div class="select_table">
      <div class="select_box">
        <table border="0" cellpadding="0" cellspacing="0">
          <thead>
          <tr>
            <th></th>
            <th
              v-for="(item,$index) in Time"
              v-bind:id="item.id"
            >
              {{item.week}}
              {{item.date}}
            </th>
          </tr>
          </thead>
          <tbody id="App">
          <tr id="am">
            <td>上午</td>
            <td
              v-for="(item,$index) in Time"
              @click="SetActive($event, item.date)"
              :data-time="item.time"
              data-type="1"
              :data-week="item.week"
              :data-date="item.date"
            ></td>
          </tr>
          <tr id="pm">
            <td>下午</td>
            <td
              v-for="(item,$index) in Time"
              @click="SetActive($event, item.date)"
              :data-time="item.time"
              data-type="2"
              :data-week="item.week"
              :data-date="item.date"
            ></td>
          </tr>
          <tr id="ng">
            <td>夜间</td>
            <td
              v-for="(item,$index) in Time"
              @click="SetActive($event, item.date)"
              :data-time="item.time"
              data-type="3"
              :data-week="item.week"
              :data-date="item.date"
            ></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="spacing"></div>
    <div class="form_box">
      <div class="my_group">
        <p class="group_title">门诊类型</p>
        <div class="radio_box">
          <p>
            <label
              for="type1"
              :class="{active:ActiveClass}"
            >普通</label>
            <input type="radio" name="type" value="1" id="type1" v-model="Type">
          </p>
          <p>
            <label
              for="type2"
              :class="{active:!ActiveClass}"
            >专家</label>
            <input type="radio" name="type" value="2" id="type2" v-model="Type">
          </p>
        </div>
      </div>
      <div class="my_group">
        <p class="group_title">门诊地点</p>
        <div
          class="Ft-S28 Color_gray"
        >{{ Address }}</div>
      </div>
      <div class="my_group">
        <p class="group_title">挂号费用</p>
        <input
          type="number" id='money'
          placeholder="请设置门诊费用"
          v-model="Money"
        >
      </div>
      <div class="my_group">
        <p class="group_title">预约人数</p>
        <input
          type="number"
          placeholder="请输入可预约人数（人）" id='num_rem'
          v-model="PeopleCount" @keyup="ren_num"
        >
      </div>
    </div>
    <div class="sub_btn"
         @click="SubBtn"
    >保存设置
    </div>
  </div>
</template>

<script>
import { Toast, Indicator,  MessageBox} from 'mint-ui';
  export default {
    name: "SetTime",
    data() {
      return {
        TipsMsg: '提示：可多选批量设定，每周日开启下一时间段预约',
        Time: [],
        TimeInterval: ['上午', '下午', '晚上'],
        Type: 1,//门诊类型 1：普通 2：专家
        Address: '',//门诊地点
        Money: "",//挂号费用
        PeopleCount: "",//预约人数
        ActiveClass: true,//普通和专家切换使用的class
        ResData: null,//请求接口返回的数据
        Number: 1,//状态切换数字
        pastdue: null, // 盛放过去的时间
        RequestData:[], // 盛放点击预约的时间
        Time_all: []    // 临时存放
      }
    },
    mounted: function () {
      this.GetList();
      var _this = this;
      // $("#money").blur(function () {
      //    _this.Money =  _this.Money.replace(/^\d$/g, '');
      // })
      $("#money").on("input propertychange",function(event) {     // 输入的时候进行验证
          // this.value = this.value.replace(/^([1-9]\d*(\.[\d]{0,2})?|0(\.[\d.]{0,2})?)[\d]*/g, '$1');
          this.value = this.value.replace(/[^\d\.]/g, '');
           var m = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
          var money2 = _this.Money.match(/^\d*(\.?\d{0,2})/g)[0]; // 保留小数点后面两位小数
          _this.Money = money2;
          if (m.test(this.value)) {
              _this.Money = this.value
          }
          // this.value = this.value.replace(".","$#$").replace(/\./g,"").replace("$#$","");
          // this.value = this.value.replace(/\.{1,}/g,"$2$3");
      })
      $("#num_rem").on("input propertychange",function(event) {     // 输入的时候进行验证
          this.value = this.value.replace(/[^\.]/g, '');
      })
    },
    updated: function () {
      var that = this;
      var Time = that.ResData.data.time;
      var TimeClose = that.ResData.time_close;
      //已设定
      $.each(Time, function (i, v) {
        var d = new Date(v.days * 1000);
        var tMonth = d.getMonth();
        var tDate = d.getDate();
        tMonth = DoHandleMonth(tMonth + 1);
        tDate = DoHandleMonth(tDate);
        var id = tMonth + "-" + tDate;
        var index = $("#" + id).index();
        if (v.reg_time1) {
          //上午
          $("#am>td").eq(index).addClass("ysz");
        } else if (v.reg_time2) {
          //下午
          $("#pm>td").eq(index).addClass("ysz");
        } else {
          //晚上
          $("#ng>td").eq(index).addClass("ysz");
        }
      });
      //已停诊
      $.each(TimeClose, function (i, v) {
        var d = new Date(v.close_days * 1000);
        var tMonth = d.getMonth();
        var tDate = d.getDate();
        tMonth = DoHandleMonth(tMonth + 1);
        tDate = DoHandleMonth(tDate);
        var id = tMonth + "-" + tDate;
        var index = $("#" + id).index();
        if (v.close_reg_time1) {
          //上午
          $("#am>td").eq(index).addClass("ytz");
        } else if (v.close_reg_time2) {
          //下午
          $("#pm>td").eq(index).addClass("ytz");
        } else {
          //晚上
          $("#ng>td").eq(index).addClass("ytz");
        }
      })
      
    },
    methods: {
      ren_num() {
        var n = new RegExp("^[0-9]*[1-9][0-9]*$");
        if(!n.test(this.PeopleCount)) {
          this.PeopleCount = ''
        } 
        
      },
     
      ClicksaveComplete: function () { // 和 ios 和 android 交互
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isAndroid) {
            android.saveComplete()
        }
        if (isiOS) {
            window.webkit.messageHandlers.saveComplete.postMessage(null);
        }
      },
      isTimer: function (d) { // 获取当前之前过去的时间
        var today = new Date();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = DoHandleMonth(tMonth + 1);
        tDate = DoHandleMonth(tDate);
        var data = tMonth + '.' + tDate;
        var s = d
        var a;
        s.map((val, i) => {
            if (data == val.date) {
                a = i
            }
        })
        
        if (s.length > a) {
            s.length = a
        }
        this.pastdue = s;
        
      },
      GetList:function(){ // 获取数据
        var that = this;
        var SelectDate = [], arr = [];
        var AllDays = 0;
        this.$http.post("mobile/doch5/get_time", {'did': this.$route.params.did})
          .then(function (res) {
            console.log(res.data)
            if (res.status >= 200 && res.status < 300) {
              if (res.data.code == 1) {
                that.ResData = res.data;
                that.Address=res.data.data.address;
                // AllDays = res.data.alldays;
                
                //获取日期
                AllDays = 15;
                var num = (new Date().getDay()) + 1;
                for (var i = num; i < AllDays; i++) {
                  (function (n) {
                    SelectDate.push(setDate(new Date(), n))
                    arr.push(setDate(new Date(), n))
                    // SelectDate.push(GetDateTime(n))
                  })(i)
                }
               
                that.Time = SelectDate    
                var t = setTimeout(function () {
                  that.isTimer(arr)  
                  clearTimeout(t)
                }, 100)
              } else  {

              }
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //提交表单
      SubBtn: function () {
        var that=this;
        var isNum = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/;
        var isPrice = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        var n = new RegExp("^[0-9]*[1-9][0-9]*$");
        that.RequestData = []
        $.each($("#App td.active"), function (i, v) {
          var $this = $(v);
          var dataObj = {};
          var dataType = $this.attr("data-type");
          var dataTime = $this.attr("data-time");
          dataObj.time = dataTime;
          dataObj.time_type = dataType;
          that.RequestData.push(dataObj);
        });
        var obj = {
          did: this.$route.params.did,
          type: this.Type,
          money: this.Money,
          num: this.PeopleCount,
          data: this.RequestData,
        }
        if (this.RequestData.length == 0) {
          Toast({
            message: '请选择时段！',
            position: 'middle',
            duration: 2000
          });
          return false
        }  else if (this.Money == '') {
          Toast({
            message: '请设置门诊费用！',
            position: 'middle',
            duration: 2000
          });
        } else if (!isPrice.test(this.Money)) {
          Toast({
            message: '请输入整数或者保留两位小数',
            position: 'middle',
            duration: 2000
          });
          return false
        } else if (!n.test(this.PeopleCount)) {
          Toast({
            message: '请设定可预约人数！',
            position: 'middle',
            duration: 2000
          });
          return false
        } else {
          
         MessageBox.confirm('<p style="color:#333;">保存后患者可在你的主页上预约门诊<br/>是否确认保存设定？</p>', {title:'服务提示'}).then(action => {
           console.log(obj)
            this.$http.post("mobile/doch5/set_time", obj)
              .then(function (res) {
                if (res.status >= 200 && res.status < 300) {
                  if (res.data.code == 1) {
                    Toast({
                      message: res.data.msg,
                      iconClass: 'mintui mintui-success',
                      duration: 2000
                    });
                    setTimeout(function(){
                      that.GetList();
                      that.Money='';
                      that.PeopleCount='';
                      that.RequestData = [];
                      $.each($("#App td.active"), function (i, v) {
                        var $this = $(v);
                        if ($this.hasClass("active")) {
                            $this.removeClass("active");
                        }
                      });
                      that.ClicksaveComplete();
                    }, 2000)
                  } else {
                    Toast({
                      message: res.data.msg,
                      duration: 2000
                    });
                  }
                }
              })
              .catch(function (err) {
                console.log(err)
              })
            }).catch(cancel => {

            });
        }
      },
      //点击获取数据
      SetActive: function (event, i) {
        var flag = true
        this.pastdue.map(function (val) {
          if (i == val.date) {
            flag = false
          }
        })
        
        var $this = $(event.target);
        var that = this;
        if (flag) {
            if ($this.hasClass("ysz") || $this.hasClass("ytz")) {
              return false
            } else if ($this.hasClass("active")) {
              $this.removeClass("active");
            } else {
              $this.addClass("active");
            }
        }
      }
    },
    watch: {
      Type: function (val, oldVal) {
        if (val == 2) {
          this.ActiveClass = false;
        } else {
          this.ActiveClass = true;
        }
      },
    },
  }

  //    时间不足2位用0填充
  function DoHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  }



// 现在获取两周时间排列
  var formatDate = function(date) {    
        var year = date.getFullYear() 
        var month = DoHandleMonth(date.getMonth()+1);
        var day = DoHandleMonth(date.getDate());
        var targetday_milliseconds = date.getTime();
        var week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()]; 
        return {
            date: month+'.'+day,
            id: month+'-'+day,
            time: parseInt(targetday_milliseconds / 1000),
            week: week,
        }
      };
    var addDate= function(date,n) {    
      date.setDate(date.getDate()+n);    
      return date;
    };
    var setDate = function(date, n) {       
      var week = date.getDay()-1;
      date = addDate(date,week*-1);
        for(var i = 0;i<n;i++) {         
          //  var timer = formatDate(i==0 ? date : addDate(date,1));    // 星期一开始
           var timer = formatDate(i==0 ? addDate(date,-1) : addDate(date,1));//星期日开始
        } 
        return timer   
    };

//////////////////////////////////////////

  // //    获取时间今后的或者之前的
  // function GetDateTime(day) {   // 之前的获取方式，一天天往前走
  //   var today = new Date();
  //   var weekDate = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  //   var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  //   today.setTime(targetday_milliseconds); //注意，这行是关键代码
  //   var tYear = today.getFullYear();
  //   var tMonth = today.getMonth();
  //   var tDate = today.getDate();
  //   tMonth = DoHandleMonth(tMonth + 1);
  //   tDate = DoHandleMonth(tDate);
    
  //   return {
  //     date: tMonth + "." + tDate,
  //     id: tMonth + "-" + tDate,
  //     time: parseInt(targetday_milliseconds / 1000),
  //     week: weekDate[today.getDay()],
      
  //   }
  // }



</script>

<style scoped lang="less">
  #SetTime {
    height: 100%;
    //警示语
    .tips_msg {
      height: .72rem;
      background: rgba(255, 246, 218, 1);
      line-height: .72rem;
      padding: 0 .3rem;
      font-size: .24rem;
      font-weight: 400;
      color: rgba(225, 166, 40, 1);
    }
    //选择表格
    .select_table {
      padding: .3rem;
      height: 3.5rem;
      font-size: .22rem;
      color: #202020;
      background-color: #fff;
      .select_box {
        overflow-x:scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        table {
          border-top: 1px solid #ebebeb;
          width: 100%;
          tr {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
          th,
          td {
            min-width: .88rem;
            max-width: .88rem;
            height: .72rem;
            border-right: 1px solid #EBEBEB;
            border-bottom: 1px solid #EBEBEB;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          th:first-child,
          td:first-child {
            position: absolute;
            left: 0.3rem;
            background: #fff;
            border-left: 1px solid #ebebeb;

          }
          td:nth-child(2),
          th:nth-child(2) {
            margin-left: .88rem;
          }
          td.active {
            background: url("../common/img/icon/icon_active.png") no-repeat;
            background-size: contain;
          }
          td.ysz {
            background: url("../common/img/icon/icon_ysz.png") no-repeat;
            background-size: contain;
          }
          td.ytz {
            background: url("../common/img/icon/icon_ytz.png") no-repeat;
            background-size: contain;
          }
        }
        
      }
      .select_box::-webkit-scrollbar {
            display: none;
        }
    }
    //表单
    .form_box {
      padding: 0 .3rem;
      .my_group {
        height: .9rem;
        border-bottom: 1px solid #efefef;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .radio_box {
          display: flex;
          align-items: center;
          label {
            width: 1.28rem;
            height: .46rem;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            border: 1px solid #efefef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: .28rem;
            font-weight: 500;
            margin-right: .2rem;
          }
          label.active {
            background: #5189F6;
            color: #FFFFFF;
            border-color: #FFFFFF;
          }
          input {
            display: none;
          }
        }
        & > p {
          font-size: .3rem;
          color: #202020;
          margin-right: .32rem;
        }
        input {
          font-size: .28rem;
          color: #202020;
          width: 60%;
        }
      }
    }
    //提交按钮
    .sub_btn {
      width: 4.12rem;
      height: .8rem;
      background: #5189F6;
      color: #fff;
      font-size: .28rem;
      -webkit-border-radius: .8rem;
      -moz-border-radius: .8rem;
      border-radius: .8rem;
      margin: 0 auto;
      margin-top: 2.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      letter-spacing: 2px;
    }
  }
</style>
