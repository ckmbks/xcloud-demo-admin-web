<template>
  <v-footer id="footer">
    <v-container fluid>
      <v-row align="center" no-gutters>
          <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
            &copy; 2021
            <a href="http://www.bisinuolan.com">碧斯诺兰</a>
          </div>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Footer extends Vue {

}
</script>

