<template>
  <v-dialog v-model="isShow" scrollable width="500">
    <v-skeleton-loader :loading="loading" type="article, actions">
      <v-card>
        <v-card-title class="pb-0 d-flex">消息详情</v-card-title>
        <v-divider />

        <v-card-text>
          <v-row class="pl-5 pr-5">
            <v-col cols="12" sm="2">标题:</v-col>
            <v-col cols="12" sm="10">{{ model.title }}</v-col>
          </v-row>
          <v-row class="pl-5 pr-5">
            <v-col cols="12" sm="2">内容:</v-col>
            <v-col cols="12" sm="10" v-html="model.content"></v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" outlined @click.stop="isShow=false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-skeleton-loader>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
// import * as MessageApi from "@/api/componentsApi/MessageApi";

@Component({
  components: { }
})
export default class MessageDetail extends Vue {

  model: any = {
    title: "",
    content: ""
  };

  loading: boolean = true;
  curMessageDetail:any;

  async created() {
    // this.curMessageDetail = await MessageApi.getMessageDetail({
    //   id: this.id
    // });
    // await MessageApi.readMyMessage(this.id);
    // this.model.title = this.curMessageDetail.title;
    // this.model.content = this.curMessageDetail.content;
    this.loading = false;
  }

  @PropSync("isShowMessageDetail")
  public isShow!: boolean;

  @Prop()
  id!: number;

}
</script>
