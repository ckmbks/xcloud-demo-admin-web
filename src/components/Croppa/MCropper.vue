<template>
  <div :class="{show:showCropper}" class="cropper_wrap">
    <header>
      <a @click="back()" class="cancel">取消</a>
      <a class="add" @click="save()">保存</a>
    </header>
    <vueCropper
      ref="cropper"
      :img="imgUrl"
      :outputSize="example2.size"
      :outputType="example2.outputType"
      :info="example2.info"
      :canScale="example2.canScale"
      :autoCrop="example2.autoCrop"
      :autoCropWidth="example2.autoCropWidth"
      :autoCropHeight="example2.autoCropHeight"
      :fixed="example2.fixed"
      :fixedNumber="example2.fixedNumber"
    ></vueCropper>
  </div>
</template>
<script>
import { VueCropper } from "vue-cropper";
export default {
  props: {
    imgUrl: "",
    showCropper: false
  },
  data() {
    return {
      example2: {
        img: "",
        info: true,
        size: 1,
        outputType: "jpeg",
        outputSize: 1, //图片质量 0.1-1
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 330,
        autoCropHeight: 330,
        // 开启宽度和高度比例
        fixed: false,
        fixedNumber: [3, 3]
      }
    };
  },
  methods: {
    back() {
      this.$emit("cancel");
    },
    save() {
      this.finish("base64");
    },
    finish(type) {
      // 输出
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          this.$emit("save", data);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.$emit("save", data);
        });
      }
      this.showCropper = false;
    }
  },
  components: {
    VueCropper
  }
};
</script>
<style lang="scss" scoped>
.cropper_wrap {
  position: fixed;
  top: 0;
  left: 0;
  display: none;
  right: 0;
  bottom: 0;
  z-index: 101;
}
.cropper_wrap.show {
  display: block;
}
.cropper_wrap header {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  background: white;
}
.cropper_wrap header .cancel {
  color: #ccc;
}
</style>