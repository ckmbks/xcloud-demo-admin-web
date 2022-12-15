<template>
  <div class="data_empty">
    <img class="mb-8" src="@/assets/images/pic_empty.png" alt="" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Empty extends Vue {}
</script>
<style lang="scss" scoped>
.data_empty {
  width: 100%;
  height: calc(100vh - 200px);
  flex-direction: column;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  @media screen and (max-width: 600px) {
    > img {
      width: 250px;
    }
  }
}
</style>
