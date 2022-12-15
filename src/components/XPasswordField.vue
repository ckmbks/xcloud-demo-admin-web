<template>
  <v-text-field
    v-model="val"
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :dense="dense"
    :outlined="outlined"
    :clearable="clearable && !disabled && !readonly"
    :hide-details="hideDetails"
    :color="readonly ? 'grey' : ''"
    :counter="counter"
    :maxlength="maxlength"
    :type="!hidePwd ? 'text' : 'password'"
    :append-icon="hidePwd ? 'mdi-eye-off' : 'mdi-eye'"
    :rules="getRules"
    @blur="onChange"
    @keydown="keydown"
    @keyup="keyup"
    @click:clear="clearTap"
    @click:append="hidePwd = !hidePwd"
  >
    <template v-slot:prepend-inner>
      <span v-if="!disabled&&!readonly&&required" class="require-star lh-30">*</span>
      <slot name="prepend-inner"/>
    </template>
  </v-text-field>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ValidateRules } from "@/utils/ValidateRules";

@Component({})
export default class XPasswordField extends Vue {
  @Prop({ default: "" }) label?: string;
  @Prop({ default: "" }) placeholder?: string;
  @Prop({ default: true }) dense?: boolean;
  @Prop({ default: true }) outlined?: boolean;
  @Prop({ default: false }) disabled?: boolean;
  @Prop({ default: false }) readonly?: boolean;
  @Prop({ default: true }) clearable?: boolean;
  @Prop({ default: false }) hideDetails?: boolean;
  @Prop({ default: false }) required?: boolean;
  @Prop() counter?: number;
  @Prop() maxlength?: number;
  @Prop({ default: "" }) value!: any;
  @Prop({ default: () => [] }) rules?: any;
  @Prop({ default: () => ({ bottom: true, offsetY: true }) }) menuProps: string | any | Object

  validateRules: any = ValidateRules;
  clear = false;
  val: any = null;
  tempVal: any = null
  hidePwd: boolean = true

  created() {
    this.val = this.value
    this.tempVal = this.val
  }

  @Watch("value")
  valueChange(val: any) {
    this.val = this.value
    this.tempVal = this.val
  }

  clearTap() {
    this.val = null;
  }

  keydown(e: any) {
    if (e.keyCode == 13) {
      this.onChange()
    }
  }

  keyup(e: any) {
    this.$emit("keyup", e);
  }

  onChange() {
    if (this.val == this.tempVal) return
    this.tempVal = this.val
    this.$emit("input", this.val);
    this.$emit("change", this.val);
    this.$emit("blur", this.val);
  }

  get getRules() {
    return this.required ? [this.validateRules.required, ...this.rules] : this.rules
  }

}
</script>
