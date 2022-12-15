<template>
  <v-sheet>
    <v-textarea
      v-bind="$attrs"
      v-on="$listeners"
      readonly
      outlined
      dense
      :rules="getRules"
      v-model="model"
      :label="label"
      height="65"
      no-resize
      @click="isShow = true"
      :hide-details="!isRequired"
      append-icon="mdi-map-marker"
    >
      <template v-slot:prepend-inner>
        <span v-if="isRequired" class="require-star lh-30">*</span>
        <slot name="prepend-inner" />
      </template>
    </v-textarea>
    <v-dialog v-model="isShow" scrollable max-width="600">
      <v-card>
        <v-card-text class="px-3 py-0" style="">
          <iframe
            id="mapPage"
            style="width: 100%; height:calc(90vh - 150px)"
            frameborder="0"
            :src="
              `https://apis.map.qq.com/tools/locpicker?type=1&key=${key}&referer=uiinee`
            "
          >
          </iframe>
          <x-textarea
            v-model="address"
            :maxlength="maxlength"
            :counter="maxlength"
            label="请选择定位地址"
          ></x-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" outlined @click="cancel"
            >取消
          </v-btn>
          <v-btn depressed color="primary" @click="submit">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { ValidateRules } from "@/utils/ValidateRules";

@Component({
  components: {}
})
export default class XMapSelector extends Vue {
  @Prop({ default: "请先选择地图地点获取到定位" })
  label?: string;

  modelValue = null;

  get model() {
    return this.modelValue == null ? undefined : this.modelValue;
  }

  set model(value: any) {
    this.modelValue = value;
    this.$emit("input", value);
  }

  @PropSync("syncLat", { default: null })
  lat: any;

  @PropSync("syncLng", { default: null })
  lng: any;

  @Prop({ default: 200 })
  maxlength!: number;

  @Prop({ default: "calc(90vh - 94px)" })
  maxHeight!: string;

  @Prop({ default: false })
  required!: boolean | string;

  @Prop()
  value?: any;

  get isRequired() {
    return this.required === "" || this.required;
  }

  @Prop({ default: () => [] }) rules?: any;

  key = "5IZBZ-DRAKD-QVB4K-HERAU-AVYKQ-YPFLL";

  isShow = false;

  address: string | null = "";
  latlng: any = {};

  mounted() {
    this.modelValue = this.value;
    this.address = this.modelValue;
    this.latlng.lat = this.lat;
    this.latlng.lng = this.lng;
    window.addEventListener("message", this.thisMapEvent, false);
  }

  destroyed() {
    window.removeEventListener("message", this.thisMapEvent, false);
  }

  thisMapEvent = this.mapEvent.bind(this);

  mapEvent(event: any) {
    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
    const loc = event.data;
    if (loc && loc.module == "locationPicker") {
      //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
      this.address = loc.poiaddress + loc.poiname;
      this.latlng = loc.latlng;
    }
  }

  cancel() {
    this.isShow = false;
  }

  async submit() {
    if (this.latlng.lat === null)
      return this.$warn("未能获取到定位，请先选择地图位置再修改地址详情");

    window.removeEventListener("message", this.thisMapEvent, false);
    this.model = this.address;
    //需要加await，否则有可能this.lat赋值不生效
    await (this.lat = this.latlng.lat);
    await (this.lng = this.latlng.lng);
    this.isShow = false;
  }

  validateRules: any = ValidateRules;

  get getRules() {
    return this.isRequired
      ? [this.validateRules.required, ...this.rules]
      : this.rules;
  }
}
</script>
