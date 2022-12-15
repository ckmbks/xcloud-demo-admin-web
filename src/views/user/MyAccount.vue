<template>
  <v-card class="mx-auto" height="100%">
    <v-toolbar color="primary" dark>
      <v-toolbar-title>{{UserModule.name}}</v-toolbar-title>
    </v-toolbar>
    <v-spacer></v-spacer>
    <v-list>
      <v-list-item-group>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title @click="logout">注销</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-divider></v-divider>
    </v-list>
  </v-card>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { UserModule } from "@/store/modules/user";

  @Component({
    components: {}
  })
  export default class MyAccount extends Vue {

    async created() {
    }

    get UserModule() {
      return UserModule
    }

    async logout() {
      await UserModule.LogOut();
    }
  }
</script>

