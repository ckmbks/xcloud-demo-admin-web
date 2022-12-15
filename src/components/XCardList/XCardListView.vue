<template>
  <div class="v_table_view_box">
    <div v-if="!(tableData.searchResults && tableData.searchResults.length)" class="data_empty">
      <img class="mb-8" src="../../assets/images/pic_empty.png" alt="" />
      <div class="fs-16">暂时没有数据哦！</div>
    </div>
    <template v-else>
      <v-row dense>
        <v-col v-for="card in tableData.searchResults" :key="card.id" :cols="12" :lg="lgFlex" :md="6" :sm="12">
          <template v-if="$scopedSlots.cardItem">
            <slot name="cardItem" :item="card" />
          </template>
        </v-col>
      </v-row>
    </template>
    <div class="scroll_foot fs-16" v-if="scrollMode">
      <div class="scroll_foot_item cursor_pointer" v-if="!scrollAutoLoad && !scrollEnd && !loading" @click="getData">
        加载更多
      </div>
      <div class="scroll_foot_item cursor_pointer" v-if="loading">
        加载中... <v-icon class="loading-ico">mdi-loading</v-icon>
      </div>
      <div class="scroll_foot_item cursor_default xchs_light" v-if="scrollEnd">
        已经到底啦，共{{ tableData.searchResults.length }}条
      </div>
    </div>
    <v-row v-if="!scrollMode" align="center" v-show="!isPageHide">
      <v-col class="d-none d-md-block pr-0 pl-0" style="flex: 0 0 44px">前往</v-col>
      <v-col class="d-none d-md-block pl-0" style="flex: 0 0 80px">
        <v-text-field class="pagination-form samll-form-item" v-model="stringPageIndex" type="number" dense hide-details
          solo flat @change="gotoPageIndex" />
      </v-col>
      <v-col class="d-none d-md-block px-0" style="flex: 0 0 20px">页</v-col>
      <v-col>
        <v-pagination v-model="pageParams.pageIndex" :length="tableData.totalPages" :page="pageParams.pageIndex"
          @next="refresh" @previous="refresh" @input="refresh" class="tablePagnination" total-visible="7" />
      </v-col>
      <v-col class="d-none d-md-block px-0" style="flex: 0 0 80px; text-align: right">共{{ tableData.totalElements
      }}条</v-col>
      <v-col class="d-none d-md-block pr-0" style="flex: 0 0 138px">
        <v-select dense hide-details :items="pageSizes" v-model="pageParams.pageSize" @change="search" solo flat
          class="pagination-form samll-form-item"></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue, } from "vue-property-decorator";
import IPageData from "@/components/table/IPageData";
import IPageParams from "@/components/table/IPageParams";
import { deepClone } from "@/utils/ClassUtil";
import { isArray } from "@/utils/validate";

@Component({
  // components: { DataFilter },
})
export default class XCardListView extends Vue {
  mounted() {
    this.search();
    this.pageSizes = [];
    let curPageSize = 12;
    for (let i = 0; i < 4; i++) {
      curPageSize = this.pageParams.pageSize * (i + 1);
      this.pageSizes[i] = {
        text: `${curPageSize}条/页`, value: curPageSize
      }
    }
  }

  @Prop({ default: 3 })
  lgFlex?: any; //可选值：1,2,3,4,6,12 适配lg的时候，相应的一行展示的flex的值,不是一行个数！！！
  @Prop({ default: false })
  scrollMode?: boolean; //默认按钮分页，不是滚动分页
  @Prop({ default: true })
  scrollAutoLoad?: boolean;

  @Prop({ default: false })
  isPageHide?: boolean;

  @Prop()
  pageData!: IPageData;

  @Watch("pageData", { deep: true })
  pageDataChange() {
    this.tableData = deepClone(this.pageData);
  }
  tableData: IPageData = {
    totalPages: 1,
    searchResults: [],
    totalElements: 0,
  };
  dataChanegLock: any = false;
  @Watch("tableData", { deep: true })
  tableDataChange() {
    if (this.dataChanegLock) return;
    this.$emit("input", this.tableData);
    this.$emit("update:pageData", this.tableData);
    this.dataChanegLock = true;
    setTimeout(() => {
      this.dataChanegLock = false;
    }, 50);
  }
  @Prop()
  doSearch?: (query?: any) => void;

  @Prop({})
  pageParams!: IPageParams;

  loading = false;

  pageSizes = [
    { text: "5条/页", value: 5 },
    { text: "10条/页", value: 10 },
    { text: "20条/页", value: 20 },
    { text: "50条/页", value: 50 },
  ];

  public search() {
    this.pageParams.pageIndex = 1;
    this.stringPageIndex = "1";
    this.scrollEnd = false;
    if (this.scrollMode) {
      this.tableData.searchResults = [];
    }
    this.getData();
  }
  dataLoaded = false;
  public async refresh() {
    if (!this.scrollMode) {
      this.getData();
    }
  }
  async getData() {
    if (undefined != this.doSearch) {
      if (this.scrollMode) {
        await this.loadScollPage();
      } else {
        if (
          this.pageParams.pageIndex < 1 ||
          this.pageParams.pageIndex > this.tableData.totalPages
        ) {
          this.pageParams.pageIndex = 1;
          this.stringPageIndex = "1";
        }
        try {
          this.loading = true;
          this.tableData.searchResults = [];
          let data: any = await this.doSearch(deepClone(this.pageParams));
          this.tableData = data;
          this.dataLoaded = true;
        } catch (e) {
          throw e;
        } finally {
          this.loading = false;
        }
        this.$vuetify.goTo(0);
      }
    }
  }

  stringPageIndex = "1";
  @Watch("pageParams.pageIndex")
  watchPageIndex(value: number) {
    this.stringPageIndex = String(value);
  }

  gotoPageIndex() {
    this.pageParams.pageIndex = Number(this.stringPageIndex);
    this.getData();
  }

  _scrolllock = false;
  _scrolltimmer: any = null;
  scrollEnd = false;
  _onscroll: any = null;
  created() {
    if (this.scrollMode) {
      this._onscroll = (e: any) => {
        let top = document.documentElement.scrollTop;
        let th = document.documentElement.scrollHeight;
        let sh = document.documentElement.clientHeight;
        let btm = th - top - sh;
        if (btm <= 80 && !this.scrollEnd) {
          this.getData();
        }
      };
      if (this.scrollAutoLoad) {
        document.addEventListener("scroll", this._onscroll);
      }
    }
  }
  destroyed() {
    if (this.scrollMode) {
      document.removeEventListener("scroll", this._onscroll);
    }
  }
  async loadScollPage() {
    if (undefined != this.doSearch && !this.loading) {
      try {
        this.loading = true;
        let pageParams = deepClone(this.pageParams);
        let tableData: any = deepClone(this.tableData);
        if (
          tableData &&
          isArray(tableData.content) &&
          tableData.content.length
        ) {
          pageParams.pageIndex += 1;
          let data: any = await this.doSearch(pageParams);
          if (data && data.content) {
            if (data.content.length) {
              tableData.content.push(...data.content);
              tableData.totalElements = data.totalElements;
              this.pageParams.pageIndex = data.pageIndex;
              if (data.totalElements == tableData.content.length) {
                this.scrollEnd = true;
              }
            } else {
              this.scrollEnd = true;
            }
          }
        } else {
          tableData = await this.doSearch(pageParams);
          if (tableData.totalElements == tableData.content.length) {
            this.scrollEnd = true;
          }
        }
        this.tableData = tableData;
        setTimeout(() => {
          let top = document.documentElement.scrollTop;
          let th = document.documentElement.scrollHeight;
          let sh = document.documentElement.clientHeight;
          if (top == 0 && th == sh && !this.scrollEnd) {
            this.getData();
          }
        }, 100);
        this.dataLoaded = true;
      } catch (e) {
        throw e;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination-form {
  border: 1px solid #dcdfe6;
  font-size: 1rem;
  height: 32px;
  line-height: 32px;
  overflow-y: hidden;
  position: relative;
  padding-top: 2.1px; //line-height 不起作用 粗暴处理
}
</style>
<style lang="scss">
.pagination-form.v-text-field.v-text-field--solo.v-input--dense>.v-input__control {
  min-height: 0px;
}

.pagination-form.v-text-field.v-text-field--solo .v-input__control input {

  //去掉箭头
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  // -moz-appearance: textfield;
}

.tablePagnination .v-pagination__navigation,
.tablePagnination .v-pagination__item {
  box-shadow: none;
  border: 1px solid #dcdfe6;
}
</style>
<style lang="scss" scoped>
.filter_box {
  display: flex;
  justify-content: space-between;

  >.left_box {
    display: flex;
  }
}

.seach_btn {
  height: 40px !important;
  line-height: 40px;
}

.pagination-form {
  border: 1px solid #dcdfe6;
  font-size: 1rem;
  height: 32px;
  line-height: 32px;
  overflow-y: hidden;
  position: relative;
  padding-top: 2.1px; //line-height 不起作用 粗暴处理
}

.data_empty {
  width: 100%;
  height: calc(100vh - 200px);
  flex-direction: column;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;

  @media screen and (max-width: 600px) {
    >img {
      width: 250px;
    }
  }
}
</style>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
//scroll_view
// .scroll_box.is_scoll {
//   max-height: calc(100vh - 250px);
//   // overflow: auto;
//   > .scroll_content {
//     width: 100%;
//     overflow-x: hidden;
//     display: flex;
//   }
// }
.loading-ico {
  animation: r365 2s linear forwards;
}

@keyframes r365 {
  to {
    transform: rotate(365deg);
  }
}

.scroll_foot {
  >.scroll_foot_item {
    text-align: center;
    width: 100%;
    height: 80px;
    line-height: 80px;
  }
}
</style>
