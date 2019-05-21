import Vue from 'vue'
import Router from 'vue-router'

const Details = r => require.ensure([], () => r(require('../components/Details')), 'chunkname1');
const SetTime = r => require.ensure([], () => r(require('../components/SetTime')), 'chunkname1');
const Agreement = r => require.ensure([], () => r(require('../components/Agreement')), 'chunkname1');

const ShopDetails = r => require(['../components/h5/details'], r);
const Detail = r => require.ensure([], () => r(require('../components/h5/detail')), 'chunkname2');
const Download = r => require.ensure([], () => r(require('../components/h5/canvas')), 'chunkname2');
const DoctorDetail = r => require.ensure([], () => r(require('../components/h5/doctordetail')), 'chunkname2');
const DoctorDownload = r => require.ensure([], () => r(require('../components/h5/doctorCanvas')), 'chunkname2');

import Activity from '../components/h5/activity';  // 图片

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      //文章详情Details
      path: '/Details/:did/:aid',//did：医生id   aid：文章id
      name: 'Details',
      component: Details
    },
    {
      //时段设置SetTime
      path: '/SetTime/:did',//医生id
      name: 'SetTime',
      component: SetTime
    },
    {
      // 用户协议Agreement
      path: '/Agreement',
      name: 'Agreement',
      component: Agreement
    },
    // 分隔
    {
      path: '/activity',
      title: '活动展示',
      component: Activity
    },
    {
      path: '/shopdetails/:did',
      title: '详情页',
      name: 'details',
      component: ShopDetails
    },
    {
      path: '/detail/:did',
      title: '处方详情页',
      name: 'detail',
      component: Detail
    },
    {
      path: '/download/:did',
      title: '下载处方单',
      name: 'download',
      component: Download
    },
    {
      path: '/doctordetail/:did',
      title: '处方详情页',
      name: 'doctordetail',
      component: DoctorDetail
    },
    {
      path: '/doctordownload/:did',
      title: '下载处方单',
      name: 'doctordownload',
      component: DoctorDownload
    }
  ]
})
