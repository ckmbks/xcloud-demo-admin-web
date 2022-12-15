<template>
  <x-page>
    <v-card flat class="ma-6 pa-6" width="1000">
      <v-sheet class="pa-4 primary lighten-2" v-if="showFilter">
        <v-text-field
          v-model="search"
          label="搜索"
          dark
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
      </v-sheet>
      <!-- selectable 可选 rounded 点击后背景圆角 hoverable 悬停会有效果 dense 紧凑 activatable 可点击 -->
      <v-treeview
        :search="search"
        :filter="filter"
        v-model="chooseArr"
        selectable
        hoverable
        dense
        activatable
        :items="items"
        :open="openItems"
        :item-key="itemKey"
        :item-text="itemText"
        :item-children="itemChildren"
      >
        <!-- expand-icon="mdi-arrow-down-drop-circle-outline" -->
        <template #label="{ item }">
          <v-text-field
            v-if="item.edit"
            outlined
            dense
            hide-details
            v-model="item.name"
            @blur="editItem(item)"
            @keyup.enter="editItem(item)"
          ></v-text-field>
          <v-input class="py-2 pl-3" v-else hide-details>{{
            item.name
          }}</v-input>
        </template>
        <template #append="{ item }">
          <v-row>
            <v-spacer></v-spacer>
            <v-col
              v-for="(button, index) in item.btnList"
              :key="index"
              cols="1"
              align="end"
            >
              <v-icon v-if="button === 'edit'" @click="editItem(item)"
                >mdi-square-edit-outline</v-icon
              >
              <v-icon v-if="button === 'del'" @click="deleteItem(item)"
                >mdi-trash-can-outline</v-icon
              >
              <v-icon v-if="button === 'add'" @click="addItem(item)"
                >mdi-plus</v-icon
              >
            <v-col cols="3"></v-col>
          </v-row>
        </template>
      </v-treeview>
    </v-card>
  </x-page>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
export default class XTree extends Vue {
  @Prop({ default: false })
  showFilter?: boolean;
  @Prop({ default: [] })
  chooseArr?: any;
  @Prop({ default: [] })
  items!: any;
  @Prop({ default: [] })
  openItems?: any;
  @Prop({ default: "id" })
  itemKey?: string;
  @Prop({ default: "name" })
  itemText?: string;
  @Prop({ default: "children" })
  itemChildren?: string;

  search = "";
  // items: any = [
  //   {
  //     id: 1,
  //     name: "春天1",
  //     btnList: ["edit", "add", "del", "other"],
  //     edit: false,
  //     children: [
  //       {
  //         id: 2,
  //         edit: false,
  //         name: "111111",
  //         btnList: ["edit", "add", "del", "other"],
  //         children: []
  //       },
  //       {
  //         id: 3,
  //         edit: false,
  //         name: "22222",
  //         btnList: ["edit", "add", "del", "other"],
  //         children: []
  //       },
  //       {
  //         id: 4,
  //         edit: false,
  //         name: "3333",
  //         children: []
  //       }
  //     ]
  //   },
  //   {
  //     id: 10,
  //     edit: false,
  //     name: "大类2",
  //     btnList: ["edit", "add"],
  //     type: true,
  //     children: [
  //       {
  //         id: 11,
  //         edit: false,
  //         name: "44444",
  //         children: []
  //       },
  //       {
  //         id: 12,
  //         edit: false,
  //         name: "55555",
  //         children: []
  //       },
  //       {
  //         id: 13,
  //         edit: false,
  //         name: "66666",
  //         children: []
  //       }
  //     ]
  //   }
  // ];
  get filter() {
    return (item: any, search: any, textKey: any) =>
      item[textKey].indexOf(search) > -1;
  }
  addItem(item: any) {
    this.$emit("add", item);
    // console.log(item);
    // this.addItemRec(this.items, item);
    // this.openItems.push(item.id);
  }
  addItemRec(arr: any[], item: any) {
    console.log(arr);
    if (!item) {
      return arr.push({
        id: `0-${1 + arr[arr.length - 1].id}`, // 临时id, 瞎编的
        edit: true,
        name: "",
        children: []
      });
    }
    arr.map((ele: any) => {
      if (ele.id == item.id) {
        const lastId = item.children.length
          ? item.children[item.children.length - 1].id + 1
          : 1;
        return ele.children.push({
          id: `${item.id}-${lastId}`, // 临时id, 瞎编的
          edit: true,
          name: "",
          children: []
        });
      }
      if (ele.children && ele.children.length) {
        this.addItemRec(ele.children, item);
      }
    });
  }

  editItem(item: any) {
    // console.log(item);
    // item.edit = !item.edit;
    this.$emit("edit", item);
  }

  deleteItem(item: any) {
    this.$confirm({
      content: `你确定要删除该项？`,
      confirm: async () => {
        // this.deleteItemRec(this.items, item);
        this.$emit("del", item);
      }
    });
  }

  deleteItemRec(arr: any[], item: any) {
    arr.map((ele: any, index: number) => {
      if (ele.id == item.id) {
        return arr.splice(index, 1);
      }
      if (ele.children && ele.children.length) {
        this.deleteItemRec(ele.children, item);
      }
    });
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
</style>
