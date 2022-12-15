<template>
  <v-menu :close-on-content-click="closeOnContentClick" :value="false" v-model="isShowMenu" offset-y
    :nudge-bottom="!isHideDetails ? -24 : 4" max-width="95vw" :offset-x="$vuetify.breakpoint.xs"
    :left="$vuetify.breakpoint.xs" :disabled="isReadonly">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field readonly :hide-details="hideDetails" outlined dense v-model="model" :label="label"
        append-icon="arrow_drop_down" @focus="initItems" :loading="loading" v-bind="attrs" v-on="on"
        @click:append="isShowMenu = true" :rules="isRequired ? [validateRules.required] : []"
        :clearable="isClearable && !isReadonly">
        <template v-slot:prepend-inner>
          <span v-if="isRequired" class="require-star lh-30">*</span>
          <slot name="prepend-inner" />
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-card-text class="pa-0 d-flex">
        <v-list dense class="py-0 area-list">
          <v-list-item-group :mandatory="selectedFirstItemIndex !== null" v-model="selectedFirstItemIndex"
            color="primary">
            <v-list-item @click="selectFirstItem(index)" v-for="(item, index) in getFirstLevelItems()" :key="index">
              <v-list-item-title v-text="item[itemText]"></v-list-item-title>
              <v-list-item-icon v-if="item.isParent">
                <v-icon>mdi-chevron-right</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-list v-if="selectedFirstItem && selectedFirstItem.isParent" dense class="py-0 area-list">
          <v-list-item-group :mandatory="selectedSecondItemIndex !== null" v-model="selectedSecondItemIndex"
            color="primary">
            <v-list-item @click="selectSecondItem(index)"
              v-for="(item, index) in getSubItems(selectedFirstItem[itemValue])" :key="index">
              <v-list-item-title v-text="item[itemText]"></v-list-item-title>
              <v-list-item-icon v-if="item.isParent === true">
                <v-icon>mdi-chevron-right</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-list v-if="selectedSecondItem !== null && selectedSecondItem.isParent" dense class="py-0 area-list">
          <v-list-item-group :mandatory="selectedThirdItemIndex !== null" v-model="selectedThirdItemIndex"
            color="primary">
            <v-list-item @click="selectThirdItem(index)"
              v-for="(item, index) in getSubItems(selectedSecondItem[itemValue])" :key="index">
              <v-list-item-title v-text="item[itemText]"></v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-card-actions v-if="items.length > 0 && isActions">
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" outlined @click="cancel">取消</v-btn>
        <v-btn depressed color="primary" @click="submit"> 确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import { ValidateRules } from '@/utils/ValidateRules'

@Component({})
export default class XCascade extends Vue {
  @Prop({ default: '' })
  label?: string

  @PropSync('syncFirstText')
  firstText!: string

  @PropSync('syncFirstValue')
  firstValue!: any

  @PropSync('syncSecondText')
  secondText!: string

  @PropSync('syncSecondValue')
  secondValue!: any

  @PropSync('syncThirdText')
  thirdText!: string

  @PropSync('syncThirdValue')
  thirdValue!: any

  @Prop({ default: 'title' })
  itemText!: string

  @Prop({ default: 'id' })
  itemValue!: string

  @Prop({ default: 'parentId' })
  itemParentValue!: string

  @Prop({ default: 'auto' }) hideDetails?: boolean | string
  @Prop()
  protected getItems!: () => []

  @Prop({ default: false })
  actions?: boolean | string

  get isActions() {
    return this.actions === '' || this.actions
  }

  @Prop({ default: false })
  readonly?: boolean | string

  get isReadonly() {
    return this.readonly === '' || this.readonly
  }

  @Prop({ default: false })
  clearable?: boolean | string

  get isClearable() {
    return this.clearable === '' || this.clearable
  }

  @Prop({ default: false })
  required?: boolean | string

  get isRequired() {
    return this.required === '' || this.required
  }

  change(val: any) {
    return this.$emit('change', val)
  }

  isShowMenu = false
  get isHideDetails() {
    if (this.hideDetails === false) {
      return false
    } else {
      return true
    }
  }

  get model() {
    const array = []
    if (
      this.firstText !== undefined &&
      this.firstText !== '' &&
      this.firstText !== null
    )
      array.push(this.firstText)
    if (
      this.secondText !== undefined &&
      this.secondText !== '' &&
      this.secondText !== null
    )
      array.push(this.secondText)
    if (
      this.thirdText !== undefined &&
      this.thirdText !== '' &&
      this.thirdText !== null
    )
      array.push(this.thirdText)
    return array.join(' / ')
  }

  set model(value) {
    if (value === null) {
      this.selectedFirstItemIndex = null
      this.selectedSecondItemIndex = null
      this.selectedThirdItemIndex = null
      this.setResult()
      this.closeOnContentClick = false
    }
  }

  validateRules: any = ValidateRules

  setResult() {
    const firstItem = this.selectedFirstItem
    this.firstText = firstItem == null ? null : firstItem[this.itemText]
    this.firstValue = firstItem == null ? null : firstItem[this.itemValue]
    const secondItem = this.selectedSecondItem
    this.secondText = secondItem == null ? null : secondItem[this.itemText]
    this.secondValue = secondItem == null ? null : secondItem[this.itemValue]
    const thirdItem = this.selectedThirdItem
    this.thirdText = thirdItem == null ? null : thirdItem[this.itemText]
    this.thirdValue = thirdItem == null ? null : thirdItem[this.itemValue]
    this.closeOnContentClick = true
    this.$emit('change')
  }

  items: any[] = []

  async initItems() {
    this.closeOnContentClick = false
    if (this.items.length > 0) return

    this.loading = true

    this.items = await this.getItems()

    const itemMap = new Map()
    for (const item of this.items) {
      itemMap.set(item[this.itemValue], item)
    }

    for (const item of this.items) {
      const parentValue = item[this.itemParentValue]
      if (parentValue) {
        itemMap.get(parentValue).isParent = true
      }
    }
    if (this.firstValue) {
      this.selectedFirstItemIndex = this.getFirstLevelItems().findIndex(
        (item) => item[this.itemValue] === this.firstValue
      )
    }
    if (this.secondValue) {
      this.selectedSecondItemIndex = this.getSubItems(
        this.firstValue
      ).findIndex((item) => item[this.itemValue] === this.secondValue)
    }
    if (this.thirdValue) {
      this.selectedThirdItemIndex = this.getSubItems(
        this.secondValue
      ).findIndex((item) => item[this.itemValue] === this.secondValue)
    }

    this.loading = false
  }

  loading = false
  closeOnContentClick = false

  selectedFirstItemIndex: any = null
  selectedSecondItemIndex: any = null
  selectedThirdItemIndex: any = null

  get selectedFirstItem() {
    if (this.selectedFirstItemIndex == null) return null
    return this.getFirstLevelItems()[this.selectedFirstItemIndex]
  }

  get selectedSecondItem() {
    if (this.selectedSecondItemIndex == null) return null
    return this.getSubItems(this.selectedFirstItem[this.itemValue])[
      this.selectedSecondItemIndex
    ]
  }

  get selectedThirdItem() {
    if (
      this.selectedThirdItemIndex == null ||
      this.selectedSecondItemIndex == null
    )
      return null
    return this.getSubItems(this.selectedSecondItem[this.itemValue])[
      this.selectedThirdItemIndex
    ]
  }

  selectFirstItem(index: any) {
    if (index === this.selectedFirstItemIndex) {
      return
    }
    this.selectedFirstItemIndex = index
    this.selectedSecondItemIndex = null
    if (!this.selectedFirstItem.isParent) this.setResult()
  }

  selectSecondItem(index: any) {
    if (index === this.selectedSecondItemIndex) {
      return
    }
    this.selectedSecondItemIndex = index
    this.selectedThirdItemIndex = null

    if (!this.selectedSecondItem.isParent) this.setResult()
  }

  selectThirdItem(index: any) {
    if (index === this.selectedThirdItemIndex) {
      return
    }
    this.selectedThirdItemIndex = index
    this.setResult()
  }

  getFirstLevelItems() {
    return this.items.filter(
      (item) =>
        item[this.itemParentValue] === 0 || item[this.itemParentValue] === ''
    )
  }

  getSubItems(parentId: any) {
    return this.items.filter((item) => item[this.itemParentValue] === parentId)
  }

  cancel() {
    this.closeOnContentClick = true
  }

  submit() {
    this.setResult()
    this.closeOnContentClick = true
  }
}
</script>
<style lang="scss">
.area-list {
  overflow-y: auto;
  max-height: 320px;
  min-width: 120px;
}
</style>
