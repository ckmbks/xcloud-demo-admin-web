<template>
  <v-menu bottom left offset-y origin="top right" transition="scale-transition">
    <template v-slot:activator="{ attrs, on }">
      <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
        <v-badge overlap bordered class="badge" color="red">
          <template v-slot:badge>
            <span>{{ noticeNum }}</span>
          </template>

          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-card :tile="false" nav width="350">
      <v-card-title class="text-left py-3 px-4">
        <h5 class="fs-16">消息中心</h5>
        <v-row class="pl-4 d-flex justify-end">
          <v-btn outlined color="primary" @click.stop="readAll()"
            >全部标记为已读
          </v-btn>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="py-0">
        <v-list>
          <v-list-item-group v-model="model" multiple height="200px">
            <template v-for="(item, i) in notifications">
              <v-list-item
                :key="`item-${i}`"
                :value="item"
                active-class="deep-grey--text text--accent-4"
                class="pa-0"
                v-if="!item.read"
              >
                <template>
                  <v-list-item-content class="d-flex msg-item pt-0 pb-0">
                    <v-row align="center" :class="item.read ? '' : 'read'">
                      <span class="title elipsis" :title="item.title">{{
                        item.title
                      }}</span>
                      <span class="time">{{
                        item.receiveTime.substr(0, 10)
                      }}</span>
                    </v-row>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
    <!-- 查看消息详情 -->
    <head-message-detail
      v-if="isShowMessageDetail"
      :is-show-message-detail.sync="isShowMessageDetail"
      :id="curDetailId"
    ></head-message-detail>
  </v-menu>
</template>

<script lang="ts">
// Components
import { Component, Vue, Watch } from 'vue-property-decorator'
import HeadMessageDetail from '@/views/message/HeadMessageDetail.vue'

@Component({
  components: {
    HeadMessageDetail
  }
})
export default class HeadMessage extends Vue {
  curDetailId = 0
  notifications: any[] = []
  noticeNum: number = 0
  isShowMessageDetail = false
  model: any[] = []

  created() {
    this._initMessage()
  }

  async _initMessage() {
    this.noticeNum = 0
    this.notifications = []
  }

  @Watch('isShowMessageDetail')
  changeStatu(val: any) {
    if (!val) {
      this._initMessage()
    }
  }

  async readAll() {
    // await readAllMyMessage();
    this._initMessage()
  }
}
</script>
<style lang="scss" scoped>
.msg-item {
  width: 300px;
  // padding-left: 20px;
}

.msg-item .title {
  flex: 1;
  font-size: 14px !important;
}

.msg-item .time {
  padding-right: 20px;
}

.elipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.read::before {
  content: '·';
  color: blue;
  font-size: 40px;
}

.v-list-item-group {
  height: 200px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.v-list-item-group::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
