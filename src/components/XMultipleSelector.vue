<template>
  <div class="mul_async_selector">
    <v-autocomplete
      v-model="searchVal"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      :clearable="clearable"
      :item-text="itemText"
      :item-value="itemValue"
      :label="label"
      :outlined="outlined"
      :small-chips="smallChips"
      :solo="solo"
      :rules="rules"
      :filter="xFilter"
      dense
      :hide-details="hideDetails"
      hide-selected
    >
      <!-- <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>搜索到0条结果</v-list-item-title>
        </v-list-item>
      </template>-->
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item[showText]"></v-list-item-title>
        </v-list-item-content>
        <!-- <v-list-item-action>
          <v-icon @click.stop="_delete(option[itemValue])">mdi-close-circle</v-icon>
        </v-list-item-action> -->
      </template>
    </v-autocomplete>
    <ul class="dropdown-menu" v-if="newUsers.length>0" :style="`maxHeight:${maxHeight}px`">
      <li class="res-item" v-for="(option, oindex) in newUsers" :key="oindex">
        <div class="option-content">
          <p class="flexbox flexbox-middle">
            <span class="flexchild font-color333">
              {{option[itemText]}}
              <span v-if="option[itemNo]">({{option[itemNo]}})</span>
            </span>
            <v-icon v-if="isDeleteUser" @click.stop="_delete(option[itemValue])">mdi-close-circle</v-icon>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import { isArray } from "util";

@Component({
  components: {},
})
export default class MulAsyncSelector extends Vue {
  @Prop({ default: "" })
  label?: string;
  @Prop({ default: false })
  dense?: boolean;
  @Prop({ default: false })
  disabled?: boolean;
  @Prop({ default: false })
  clearable?: boolean;
  @Prop({ default: true })
  outlined?: boolean;
  @Prop({ default: false })
  smallChips?: boolean;
  @Prop({ default: false })
  solo?: boolean;
  @Prop({ default: true})
  hideDetails?: boolean;//输入框提示的内容
  @Prop({ default: true })
  detectAble?: any;
  @Prop({ default: "name" })
  showText?: string;//搜索出来的列表展示的字段userNoAddNames
  @Prop({ default: true })
  isDeleteUser?:boolean; //用户列表是否有删除按钮
  @Prop()
  itemText: any = "name";
  @Prop({ default: "id"})
  itemValue: any;
  @Prop({ default: "userNo"})
  itemNo: any;
  @Prop({ default: ()=>[] }) rules?: any;
  @Prop()
  list!: Function;
  pageParams = {
    pageIndex: 1,
    pageSize: 99999999,
    userNoOrName: "",
  };
  @Prop()
  preLoadList: any;
  @Prop({ default: "auto" })
  maxHeight?: string;//ul滚动高度
  @Prop({ default: false })
  getItemValue?: boolean;//返回的值是item，不止value值

  timer: any;
  searchVal: string = "";
  public $parent: any;
  items: any[] = [];

  search: any = null;
  isLoading: boolean = false;
  tab: any = null;
  newUsers: any[] = [];
  @Prop({ default: "" })
  filterKey?: any;
  xFilter(item: any, queryText: any, itemText: any) {
    if (this.filterKey) {
      let filter = [];
      if (typeof this.filterKey == "string") filter = this.filterKey.split(",");
      if (isArray(this.filterKey)) filter = this.filterKey;
      for (let idx = 0; idx < filter.length; idx++) {
        const f = filter[idx];
        if (String(item[f]).indexOf(queryText) != -1)
          return true;
      }
      return false;
    } else {
      return itemText.indexOf(queryText) != -1;
    }
    // console.log(item, queryText, itemText);
    return true;
  }
  @Watch("search")
  _search() {
    this.isLoading = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this._getOptions();
    }, 600);
  }

  @Watch("searchVal")
  addOptions() {
    this.items.map((item: any, index: any) => {
      if (this.showText=="userNoAddNames") {
        if (item[this.itemValue] === this.searchVal || item.name === this.searchVal) {
          let exist: any = this.newUsers.find(
            (o: any) => o[this.itemValue]=== item[this.itemValue]
          );
          if (exist) return;
          this.newUsers.push(item);
        }
      } else {
        if (item[this.itemValue] === this.searchVal) {
          let exist: any = this.newUsers.find(
            (o: any) => o[this.itemValue] === item[this.itemValue]
          );
          if (exist) return;
          this.newUsers.push(item);
        }
      }
    });
  }

  created() {
    if (isArray(this.preLoadList)) {
      for (const key in this.preLoadList) {
        if (Object.prototype.hasOwnProperty.call(this.preLoadList, key)) {
          const item: any = this.preLoadList[key];
          item[this.itemNo] = item[this.itemNo] ? item[this.itemNo]:"";
          Object.assign(item, {
            userNoAddNames:
              item[this.itemText] + "(" + item[this.itemNo] + ")",
          });
          this.items.push(item);
          this.newUsers.push(item);
        }
      }
    }
    if (isArray(this.detectAble)) {
      this.newUsers = [...this.detectAble];
    }
  }

  async _getOptions() {
    if (!this.search) {
      this.isLoading = false;
      return;
    }
    if (this.isLoading) {
      var key = this.search;
      this.items = await this.list(key);
      const optionsUser: any = await this.list(key);
      let data = optionsUser.content || optionsUser;
      if (data.length > 0) {
        data.map((item: any, index: any) => {
          item[this.itemNo] = item[this.itemNo] ? item[this.itemNo]:"";
          Object.assign(item, {
            userNoAddNames:
              item[this.itemText] + "(" + item[this.itemNo] + ")",
          });
        });
        this.items = data;
      }
      this.isLoading = false;
    }
  }

  _delete(id: any) {
    this.newUsers.map((item: any, index: any) => {
      if (item[this.itemValue] === id) {
        this.newUsers.splice(index, 1);
      }
    });
  }
  @Watch("newUsers", { deep: true })
  change() {
    let res = [];
    if (this.getItemValue) {
      res = this.newUsers;
    } else {
      for (const key in this.newUsers) {
        if (Object.prototype.hasOwnProperty.call(this.newUsers, key)) {
          const item = this.newUsers[key];
          res.push(item[this.itemValue]);
        }
      }
    }
    this.$emit("input", res);
  }
}
</script>
<style lang="scss" scoped>
.v-dialog > .v-card > .v-card__text {
  padding: 0 24px;
}
.v-application ul,
.v-application ol {
  padding-left: 0;
}
.dropdown-menu {
  margin: 20px 10px 10px 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
.flexbox {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
}
.flexbox-middle {
  -webkit-flex-align: center;
  -moz-flex-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.flexchild {
  display: block;
  width: 20%;
  flex: 1;
  word-wrap: break-word;
}
.dropdown-menu li {
  list-style: none;
}
.font-color333 {
  font-size: #333;
}
// .v-autocomplete__content.v-menu__content .v-select-list {
//   display: none;
// }
</style>
