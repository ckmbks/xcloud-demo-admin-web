<template functional>
  <div class="pl-2 pr-2">
    <v-row align="center" no-gutters class="mt-2 mb-2">
      <div class="line"></div>
      <v-row align="center" no-gutters class="ml-2">
        <span class="require-star" v-if="props.required">*</span>
        <div class="fs-14 fw-500">
          {{ props.title }}
        </div>
      </v-row>
    </v-row>
    <slot></slot>
  </div>
</template>
<style scoped lang="scss">
@import '/src/assets/styles/variables.scss';
.line {
  background: $primary;
  width: 4px;
  height: 12px;
}
</style>
<script>
export default {
  props: {
    title: String,
    required: Boolean
  }
}
</script>
