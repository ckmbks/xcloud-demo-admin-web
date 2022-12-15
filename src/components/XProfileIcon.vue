<template>
  <v-list-item-avatar :size="size">
    <v-img
      v-if="sex === 0"
      src="@/assets/images/profile/unknown-sex.png"
    ></v-img>
    <v-img
      v-else-if="sex === 1 && age < 18 && age > 0"
      src="../assets/images/profile/male-child.png"
    ></v-img>
    <v-img
      v-else-if="sex === 1 && age > 60"
      src="../assets/images/profile/male-aged.png"
    ></v-img>
    <v-img
      v-else-if="sex === 1"
      src="../assets/images/profile/male-adult.png"
    ></v-img>
    <v-img
      v-else-if="sex === 2 && age < 18 && age > 0"
      src="../assets/images/profile/female-child.png"
    ></v-img>
    <v-img
      v-else-if="sex === 2 && age > 60"
      src="../assets/images/profile/female-aged.png"
    ></v-img>
    <v-img
      v-else-if="sex === 2"
      src="../assets/images/profile/female-adult.png"
    ></v-img>
  </v-list-item-avatar>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class XProfileIcon extends Vue {
  @Prop({ default: true }) sex!: number
  @Prop({ default: false }) age!: number
  @Prop({ default: 32 }) size?: number
}
</script>
