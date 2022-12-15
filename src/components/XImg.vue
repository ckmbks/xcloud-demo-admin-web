<template>
  <v-img
    v-on="$listeners"
    v-bind="$attrs"
    class="pa-2 ma-2"
    :aspect-ratio="16 / 16"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :src="imgData + '?x-oss-process=image/resize,m_pad,h_100,w_100'"
  ></v-img>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({})
export default class XImg extends Vue {
  @Prop({ default: '' })
  imgData?: any

  @Prop({ default: '' })
  maxHeight?: any

  @Prop({ default: '' })
  maxWidth?: any

  created() {}
}
</script>
