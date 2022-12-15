<template>
  <div class="wrap croppa-wrap" v-if="show&&!isMobile">
    <div class="croppa-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-9 croppa-parent">
            <croppa
              class="croppa"
              :placeholder="'选  图'"
              :quality="1"
              :placeholder-font-size="48"
              :zoom-speed="3"
              :reverse-scroll-to-zoom="false"
              v-model="croppa"
              ref="croppa"
              :width="width"
              :height="height"
              :accept="acceptType"
              :file-size-limit="fileSizeLimit"
              :show-remove-button="false"
              :disable-click-to-choose="false"
              @new-image-drawn="newImage"
              v-if="show"
            >
              <img slot="initial" :src="imageUrl" />
            </croppa>
            <v-icon class="maticon remove-image" @click="_remove()">mdi-close-circle</v-icon>
          </div>
          <div class="col-sm-3">
            <button class="btn" @click="croppa.rotate()">旋转</button>
            <button class="btn" @click="croppa.flipX()">左右翻转</button>
            <button class="btn" @click="croppa.flipY()">上下翻转</button>
            <button class="btn" @click="croppa.zoomIn()">放大</button>
            <button class="btn" @click="croppa.zoomOut()">缩小</button>
          </div>
        </div>
        <div class="row options">
          <div class="col-sm-12">
            <button class="btn pull-right sure" @click="_endCut">确定</button>
            <button class="btn pull-right cancel" @click="_cancel">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="show">
    <input
      type="file"
      v-if="canNotGetFromAlbum"
      capture="camera"
      id="imgUploads"
      style="display:none;"
      accept="image/*"
      @change="onChangeImg($event, 2)"
    />
    <input
      type="file"
      v-else
      id="imgUploads"
      style="display:none;"
      accept="image/*"
      @change="onChangeImg($event, 2)"
    />
    <MCropper :imgUrl="imageUrl" :showCropper="showCropper" @cancel="_cancel" @save="saveImg"></MCropper>
  </div>
</template>
<script>
import MCropper from "./MCropper.vue";
export default {
  data: function() {
    return {
      croppa: null,
      show: true,
      showCropper: false,
      imageUrl: ""
    };
  },
  computed: {},
  components: {
    MCropper
  },
  methods: {
    _remove: function() {
      this.croppa.remove();
      this.cancel();
    },
    onChangeImg(e, num) {
      //从相册选取文件
      var file = e.target.files[0];
      let str =
        "(.*).(" +
        this.acceptType.replace(/,/g, "|").replace(/image\//g, "") +
        ")$";
      let reg = new RegExp(str);
      console.log(e.target.value)
      if (!e.target.value) {
        this.show = false;
      }
      if (!reg.test(e.target.value)) {
        this.$error(
          "图片类型必须是" +
            this.acceptType.replace(/image\//g, "") +
            "中的一种"
        );
        this.show = false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
        } else if (num === 2) {
          this.imageUrl = data;
          this.showCropper = true;
        }
      };
      reader.onerror = err => {
        alert("加载失败");
      };
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    _getImageUrl: function() {
      if (this.file) {
        var that = this;
        var reader = new FileReader();
        reader.onloadend = function(evt) {
          that.imageUrl = evt.target.result;
        };
        reader.readAsDataURL(this.file);
      }
    },
    saveImg(base64) {
      this.sure(base64);
      this.show = false;
    },
    _endCut: function() {
      var base64 = this.croppa.generateDataUrl(this.outputType, 0.4);
      this.sure(base64);
      this.show = false;
    },
    _cancel: function() {
      this.cancel();
      this.show = false;
    },
    newImage() {
      let imgValid = true;
      if (this.minHeight && this.croppa.naturalHeight < this.minHeight) {
        imgValid = false;
      }
      if (this.minWidth && this.croppa.naturalWidth < this.minWidth) {
        imgValid = false;
      }
      if (!imgValid) {
        let message = `图片大小不符`;
        if (this.minHeight && this.minWidth) {
          message = `图片最小分辨率为：宽${this.minHeight}px 高${this.minWidth}px`;
        } else if (this.minHeight) {
          message = `图片最小高为：${this.minHeight}px`;
        } else if (this.minWidth) {
          message = `图片最小宽为：${this.minWidth}px`;
        }
        this.$error(message);
        this.$nextTick(() => {
          this._remove();
        });
      }
    }
  },
  mounted: function() {
    if (this.scale) {
      if (isNaN(this.scale)) {
        var arr = this.scale.split(":");
        this.height = (this.width * arr[1]) / arr[0];
      } else {
        this.height = this.width / this.scale;
      }
    }
    var maxV = Math.max(this.width, this.height);

    this.$nextTick(() => {
      this.$refs.croppa.canvas.style.width = (this.width * 300) / maxV + "px";
      this.$refs.croppa.canvas.style.height = (this.height * 300) / maxV + "px";
      this._getImageUrl();
      if (this.isMobile) {
        document.getElementById("imgUploads").click();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.wrap.croppa-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 1;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.36);
  -webkit-overflow-scrolling: touch;
}
.wrap.croppa-wrap .croppa-content {
  position: relative;
  max-width: 500px;
  overflow: auto;
  padding: 20px 20px 0;
  margin: 80px auto 0;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
  -webkit-overflow-scrolling: touch;
}
.wrap.croppa-wrap .croppa-content .croppa {
  border-radius: 3px;
  max-width: 100%;
  background: #fafafa;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
  -webkit-overflow-scrolling: touch;
}
.wrap.croppa-wrap .croppa-content .croppa canvas {
  max-width: 300px;
  max-height: 300px;
  -webkit-overflow-scrolling: touch;
}
.wrap.croppa-wrap .croppa-content .croppa-parent {
  text-align: center;
  vertical-align: middle;
  position: relative;
}
.wrap.croppa-wrap .croppa-content .btn {
  padding: 0;
  margin: 10px 8px;
  border: none;
  background: transparent;
  color: #337ab7;
  outline: none;
}
.wrap.croppa-wrap .croppa-content .btn.cancel {
  color: rgba(0, 0, 0, 0.44);
}
.wrap.croppa-wrap .croppa-content .btn:hover {
  color: #80b7e7;
}
.wrap.croppa-wrap .croppa-content .remove-image {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  color: #ff5252;
  background: #fff;
  border-radius: 100%;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;
  user-select: none;
}
.wrap.croppa-wrap .options>div {
  float: left;
}
.pull-right {
  float: right!important;
}
.wrap.croppa-wrap .slots img {
  display: none;
}
</style>
