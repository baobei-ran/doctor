<!--Details——文章详情-->
<template>
  <div id="Details">
    <div v-if="Default">
      <div class="Ft-S42 Color_black Mg-B40">{{Title}}</div>
      <div
        class="Details_info Ft-S26 Color_gray Mg-B50">
        <p><span>{{ msg }}</span>{{Editer}}</p>
        <p>{{Time | formatDate}}</p>
      </div>
      <div
        class="Details_content"
        id="Details_content"
        v-html="Content"
      >
      </div>
    </div>
    <div
      v-if='!Default'
      class="default_box"
    >
      <img src="../common/img/icon/default.png" alt="">
      <p class="Ft-S28">您查阅的文章已被删除，请查阅其他文章。</p>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui';
  export default {
    name: "Details",
    data() {
      return {
        Title: '',
        Time: '',
        Editer: '',
        Content: '',
        Default: true,
        msg: ''
      }
    },
    beforeCreate () {
      console.log('aaa')
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      });
    },
    mounted: function () {
      var ResDate = this.$route.params;
      var that = this;
      this.$http.post("mobile/doch5/articledata", ResDate)
        .then(function (response) {
          Indicator.close();
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            //请求成功，response为成功信息参数
            if (response.data.code == 1) {
              that.Default=true;
              that.Title = response.data.data.title;
              that.Time = response.data.data.created_at;
              that.Editer = response.data.data.editer;
              that.Content = response.data.data.content;
              that.msg = '来源：'
            } else if (response.data.code == 2) {
              that.Default=false;
              that.$toast({
                message: response.data.msg,
                position: 'bottom',
                duration: 5000
              });
            }
          }
        })
        .catch(function (response) {
          console.log(response)
        })
    },
    filters: {
      formatDate: function (value) {
        if (!value) {
          return;
        }
        var time = value;
        if (value.toString().length == 10) {
          time = time * 1000;
        }
        var date = new Date(time);
        var y = date.getFullYear();
        var MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        var s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '/' + MM + '/' + d + ' ' + h + ':' + m + ':' + s;
      }
    }
  }
</script>
<style>
  p {
    max-width: 100% !important;
  }
</style>
<style scoped lang="less">
  #Details {
    background: #fff;
    padding: .3rem;
    .Details_info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .Details_content {
      font-size: .3rem;
      font-weight: 400;
      color: rgba(34, 34, 34, 1);
      line-height: 2;
      overflow: hidden;
    }
    .default_box{
      position: absolute;
      top: 40%;
      left:50%;
      transform: translate(-50%,-50%);
      width: 100%;
      img{
        width: 4rem;
        height: 4rem;
        margin: 0 auto;
      }
      p{
        text-align: center;
        color: #666;
      }
    }
  }

</style>
