<template>
  <div id="vImportData">
    <x-dialog
      :sync-is-show.sync="isShow"
      width="600"
      :strong="true"
      title="导入"
      confirm-text="关闭"
      :alert="true"
      ref="dialog"
      @submit="hide"
    >
      <div class="importWrap" v-if="isShow">
        <div class="importContent">
          <div class="importTemplate">
            <div class="importTemplate-head">说明：</div>
            <div class="importTemplate-tip">
              <p>1.请先下载模板，按照模板内容填充，再进行上传；</p>
              <p>2.若上传数据过多，则速度会较慢，请您耐心等候，谢谢！</p>
            </div>
            <div class="flexbox flexbox-middle importbtnGroup">
              <div class="downTemplate" @click="importTemplate" outlined pressed>模版下载</div>
              <div class="importbtnWrap">
                <v-btn type="button" class="startImport" :loading="loading" outlined pressed>
                  {{importConfig.btnName || '上传文件'}}
                </v-btn>
                <input
                  type="file"
                  id="upload-file"
                  @change="getFile"
                  accept=".xls, .xlsx, .csv"
                  class="upload-template"
                  v-if="clearInputShow"
                />
              </div>
            </div>
            <div class="importTemplate-tip" v-show="importingText">
              <p>{{importingText}}</p>
            </div>
          </div>
          <div class="importFailWrap" v-if="hasErrorFile">
            <div class="importFail-file" @click="downErrorTip">
              <span>发布失败！</span>
            </div>
            <div class="importFail-tip">您提交的内容有以下错误：</div>
            <div class="importFail-list">
              <div class="importFail-item" v-for="(errText, key) in errorImportResult" :key="key">
                <div v-if="errText">
                  <v-icon>mdi-close-circle</v-icon>
                  <span>{{errText}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import {
  importExcel,
  getErrorTipExcel,
} from "@/api/componentsApi/ImportApi";
import XDialog from "@/components/XDialog.vue";
import { download } from "@/utils/FileUtil";
import { isArray } from "util";

@Component({
  components: { XDialog },
})
export default class VImportData extends Vue {
  importConfig?: any;
  params?: any;
  loading = false;
  hasErrorFile = false;
  importing = false;
  importingText = "";
  clearInputShow = true;
  errorTemplateName = ""; //导入失败的提示文件
  errorImportResult = [];
  isShow = false;
  publicPath = process.env.BASE_URL;
  get dialog() {
    let d: any = this.$refs.dialog;
    return d;
  }
  success() {}
  show(config: any) {
    if (typeof config == "object") {
      if (config.config) this.importConfig = config.config;
      if (config.params) this.params = config.params;
      if (config.success && typeof config.success == "function")
        this.success = config.success;
      this.isShow = true;
      this.$nextTick(() => {
        this.dialog.show();
      });
    } else {
      console.warn("配置错误");
    }
  }
  hide() {
    this.hasErrorFile = false;
    this.errorTemplateName = "";
    this.errorImportResult = [];
    this.importingText = "";
    this.loading=false
    this.dialog.hide();
    this.isShow = false;
  }

  //下载模板
  async importTemplate() {
    if (this.importConfig.templateUrl) {
      // const data = await getNondegreeImportTemplate(this.importConfig.templateUrl);
      // let fileName = this.importConfig.templateTemplateName?this.importConfig.templateTemplateName:"模板.xlsx";
      // download(data, fileName);
      // return;
    }

    if (this.importConfig.templateName) {
      window.location.href = this.publicPath + "templateFile/" + this.importConfig.templateName;
    }
  }

  //上传excel，检测数据,通过则导入
  getFile(event: any) {
    // formData是键值对的形式
    let formData = new FormData();
    let fileName:any = "";
    // 获取通过input上传的文件
    fileName = event.target.files[0];
    if(fileName !== undefined){
      let  file_typename = fileName.name.substring(fileName.name.lastIndexOf('.'));
      if (file_typename != '.xlsx' && file_typename != '.xls' && file_typename != '.csv') {
        this.$error("文件不符合要求，请传入正确格式的excel");
        return;
      }
    }else{
      this.$error("文件不符合要求，请传入正确格式的excel");
      return;
    }

    // 向formData中添加数据
    formData.append("file", fileName);
    // input隐藏
    if (this.importConfig.data && typeof this.importConfig.data == "object") {
      let data = this.importConfig.data;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const item = data[key];
          formData.append(key, item);
        }
      }
    }
    this.clearInputShow = false;
    if (fileName) {
      // 如果有文件
      this.importing = true; // 正在导入时，导入按键变灰
      this.importingText = "导入中...";
      this.loading=true
      // 上传文件
      importExcel(this.importConfig.importUrl, formData, this.params)
        .then((res: any) => {
          this.importingText = "";
          this.loading=false
          this.clearInputShow = true;
          this.hasErrorFile = res.hasErrorFile;
          if (res.hasErrorFile) {
            this.errorTemplateName = res.fileName || res.fileName;
            this.errorImportResult = res.message
              .replace(/\n|\r\n/g, "<br/>")
              .split("<br/>");
            return;
          }
          if (isArray(res)) {
            let text: any = "";
            for (const key in res) {
              if (Object.prototype.hasOwnProperty.call(res, key)) {
                const r = res[key];
                if (!r.success) {
                  text += "Sheet" + (Number(key) + 1) + ":" + r.message;
                }
              }
            }
            if (text) {
              this.importingText = text;
              return;
            }
          } else if (!res.success) {
            this.importingText = res.message;
            return;
          }

          this.$info("导入成功!");
          this.success();
        })
        .catch((error) => {
          this.importingText = "";
          this.loading=false
          this.clearInputShow = true;
          this.$error(error.message?error.message:"导入失败");
        });
    }
  }

  //
  downErrorTip() {
    getErrorTipExcel(this.importConfig.errTemplateUrl, {
      fileName: this.errorTemplateName,
    }).then((data) => {
      download(data.data, this.errorTemplateName);
    });
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/global.scss";
.importWrap .importHead {
  width: 100%;
  height: 40px;
  padding-left: 20px;
  box-sizing: border-box;
  background: rgba(187, 28, 44, 1);
  border-radius: 8px 8px 0px 0px;
  font-size: 1rem;
  color: #ffffff;
  line-height: 40px;
  font-weight: 600;
}
.importWrap .importContent {
  padding: 0px 26px;
}
.importTemplate {
  padding: 14px;
  // background: rgba(187, 28, 44, 0.05);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 26px;
}
.importTemplate-head {
  color: #333333;
}
.importTemplate-tip {
  color: #666666;
  white-space: pre-wrap;
  word-break: break-all;
}
.importTemplate-tip > p {
  margin-bottom: 0;
}
.importTemplate-lizi {
  margin-top: 5px;
}
.importTemplate-lizi > span:first-child {
  color: #333333;
}
.importTemplate-lizi > span:last-child {
  color: #666666;
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
.importbtnGroup {
  width: 328px;
  margin: 21px auto 14px;
}
.importbtnGroup .downTemplate {
  width: 100px;
  height: 32px;
  margin: 0 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid $primary;
  font-size: 1rem;
  color: $primary;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
}
.importbtnWrap {
  width: 100px;
  height: 32px;
  margin: 0 32px;
  position: relative;
}
.importbtnWrap .startImport {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid $primary;
  font-size: 1rem;
  color: $primary;
  text-align: center;
  line-height: 32px;
  -webkit-box-shadow: none;
  box-shadow: none;
  outline: none;
}
.importbtnWrap .upload-template {
  width: 136px;
  height: 100%;
  margin-left: -36px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  z-index: 2;
  cursor: pointer;
}
.importFailWrap {
  padding: 18px;
  margin-top: 20px;
  background: rgba(187, 28, 44, 0.05);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}
.importFail-file > span:first-child {
  font-size: 1rem;
  color: #333333;
  font-weight: 600;
}
.importFail-file > span:last-child {
  cursor: pointer;
}
.importFail-tip {
  margin-top: 6px;
  color: #333333;
  font-weight: 500;
}
.importFail-list {
  max-height: 150px;
  overflow-y: scroll;
}
.importFail-item {
  margin-top: 8px;
  color: $primary;
}
.v-icon.v-icon {
  margin-right: 4px;
  color: $primary;
  font-size: 10px;
}
.importFooter {
  border-top: 1px solid #ebebeb;
}
.importCancel {
  width: 80px;
  height: 40px;
  background: #f4f4f6;
  border-radius: 4px;
  font-size: 16px;
  color: #333333;
  text-align: center;
  line-height: 40px;
  margin: 16px 26px -3px 0;
  cursor: pointer;
}
@media screen and (max-width: 601px) {
  .importbtnGroup {
    display: inline-block;
    width: 100%;
  }
  .startImport {
    margin-top: 20px;
  }
}
</style>
