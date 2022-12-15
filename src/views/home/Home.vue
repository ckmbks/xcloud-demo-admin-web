<template>
  <div>
    <v-card class="my-6 mx-4" flat>
      <div class="home_block1 d-flex align-center align-content-center">
        <div class="box d-flex flex-grow-1">
          <img
            src="@/assets/images/home/avatar.jpg"
            alt=""
            class="home_avatar"
          />
          <div class="box pt-3">
            <div class="xchs_weight fs-20 fw-500">
              {{ welcome }}，{{ userData.name }}
            </div>
            <div class="xchs_normal fs-14 pt-2">
              {{ userData.department }} / {{ userData.position }}
            </div>
          </div>
        </div>
        <div class="box d-flex align-content-center">
          <div>
            <div class="xchs_normal fs-16">
              <i class="icon icon_number fs-24 mr-3"></i>教工号
            </div>
            <div class="xchs_weight fs-18 mt-2">{{ userData.userNo }}</div>
          </div>
          <v-divider vertical class="mx-5"></v-divider>
          <div>
            <div class="xchs_normal fs-16">
              <i class="icon icon_phone fs-24 mr-3"></i>联系方式
            </div>
            <div class="xchs_weight fs-18 mt-2">{{ userData.phone }}</div>
          </div>
        </div>
      </div>
    </v-card>
    <v-row class="mx-4 mx-md-0">
      <v-col class="pa-0" cols="12" sm="4">
        <pie-chart class="mr-lg-3 mx-md-4 mb-6"></pie-chart>
      </v-col>
      <v-col class="pa-0" cols="12" sm="4">
        <bar-chart class="mx-lg-3 mx-md-4 mb-6"></bar-chart>
      </v-col>
      <v-col class="pa-0" cols="12" sm="4">
        <line-chart class="ml-lg-3 mx-md-4 mb-6"></line-chart>
      </v-col>
    </v-row>
    <v-card flat class="mx-4 mb-6">
      <v-card-title class="px-2 pt-4 pb-2 mx-4">
        <h4 class="module-title">瞎逼逼</h4>
      </v-card-title>
      <v-list three-line light>
        <template v-for="(item, index) in items">
          <v-divider
            v-if="item.divider"
            :key="index"
            :inset="item.inset"
          ></v-divider>

          <v-list-item
            v-else
            :key="item.title"
            @click=""
            v-ripple="{ class: 'primary--text' }"
          >
            <v-list-item-avatar class="ml-3">
              <v-img
                :src="
                  item.avatar + '?x-oss-process=image/resize,m_pad,h_100,w_100'
                "
              ></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="item.title"></v-list-item-title>
              <v-list-item-subtitle
                v-html="item.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import PieChart from './components/PieChart.vue'
import * as AccountApi from '@/api/AccountApi'
@Component({
  components: {
    LineChart,
    BarChart,
    PieChart
  }
})
export default class Home extends Vue {
  get welcome() {
    let now = new Date(),
      hour = now.getHours(),
      res
    if (hour < 6) {
      res = '凌晨好'
    } else if (hour < 11) {
      res = '早上好'
    } else if (hour < 14) {
      res = '中午好'
    } else if (hour < 18) {
      res = '下午好'
    } else {
      res = '晚上好'
    }
    return res
  }
  userData: any = {
    name: '',
    phone: null,
    sex: '',
    userNo: ''
  }
  items: any = [
    {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      title: 'Brunch this weekend?',
      subtitle:
        "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
    },
    { divider: true, inset: true },
    {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
      subtitle:
        "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
    },
    { divider: true, inset: true },
    {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
      title: 'Oui oui',
      subtitle:
        "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
    },
    { divider: true, inset: true },
    {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
      title: 'Birthday gift',
      subtitle:
        "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
    },
    { divider: true, inset: true },
    {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
      title: 'Recipe to try',
      subtitle:
        "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
    }
  ]

  async created() {
    this.userData = await AccountApi.getCurrentAccount()
  }
}
</script>
<style lang="scss" scope>
@import '../../assets/styles/global.scss';
.empty_project {
  width: 100%;
  height: 340px;
  // background: rgba(242, 246, 255, 0.6);
  border-radius: 10px;
  text-align: center;
  padding-top: 94px;
  img {
    width: 494px;
    margin-bottom: 17px;
  }
}
.icon_number {
  background-image: url('../../assets/images/home/icon_number.png');
}
.icon_phone {
  background-image: url('../../assets/images/home/icon_phone.png');
}
.home_block1 {
  // background: linear-gradient(83deg, #dfe9ff 0%, #cad9ff 51%, #c1d0ff 100%);
  border-radius: 10px;
  height: 146px;
  padding: 0 30px 0 40px;
  @media screen and (max-width: 960px) {
    flex-wrap: wrap;
    height: 240px;
    padding: 0 24px;
    > .box:nth-child(1) {
      width: 100%;
      margin-bottom: 20px;
    }
  }
  > .box {
    min-width: 25%;
    &:nth-child(1) {
      // padding-right: 10%;
    }
    .icon {
      position: relative;
      top: 5px;
    }
    .home_avatar {
      width: 84px;
      height: 84px;
      // border: 1px solid #ccc;
      border-radius: 50%;
      margin-right: 32px;
      // overflow: hidden;
      background-color: #aaa;
    }
  }
}
</style>
