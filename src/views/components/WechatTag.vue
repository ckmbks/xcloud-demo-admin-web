<template>
  <v-avatar :size="16" class="ml-1" color="green">
    <v-icon :size="iconSize" color="white">mdi-wechat</v-icon>
  </v-avatar>
</template>
<script>
export default {
  name: 'WechatTag',
  props: {
    size: { type: Number, default: 16 }
  },
  computed: {
    iconSize() {
      return this.size * 0.75
    }
  }
}
</script>
