
<template>
  <v-menu :open-on-hover="hover" bottom offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        dark
        :small="small"
        :depressed="depressed"
        v-bind="attrs"
        v-on="on"
        :outlined="outlined"
        :color="color"
      >
        操作
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        @click="item.click(item)"
      >
        <v-list-item-title class="fs-14">{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class XMenuBtn extends Vue {
  @Prop({ default: () => [] }) items!: any;
  @Prop({ default: false }) small?: boolean;
  @Prop({ default: true }) depressed?: boolean;
  @Prop({ default: false }) outlined?: boolean;
  @Prop({ default: false }) hover?: boolean;
  @Prop({ default: null }) color?: string;
}
</script>
<style lang="scss" scope>
</style>


          