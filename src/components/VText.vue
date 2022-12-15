<template>
  <v-tooltip bottom max-width="500" :disabled="!showHover">
    <template v-slot:activator="{ on, attrs }">
      <div
        ref="text"
        :style="textStyle"
        v-bind="attrs"
        v-on="on"
        style="display: inline-flex"
      >
        {{ value }}
      </div>

    </template>
    <span>{{ value }}</span>
  </v-tooltip>
</template>

<script>
export default {
  // 显示文字组件，可以设置最多显示几行，超过后会隐藏并且鼠标hover显示全部信息（需要给组件设置宽度）
  name: 'VText',
  props: {
    value: {
      type: String,
      default: ''
    },
    row: {
      // 最多显示几行，超过后会...隐藏 为0时不隐藏
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    text() {
      return this.$refs.text
    },
    hoverStyle() {
      const width = this.hoverWidth || 'auto'
      return {width}
    }
  },
  data() {
    return {
      showHover: false,
      textStyle: {},
      div: null
    }
  },
  watch: {
    row: function (val) {
      this.generateStyle()
    },
    value: function () {
      this.showHover = false
      this.textStyle = {
        cursor: 'text'
      }
      this.generateStyle()
    }
  },
  mounted() {
    this.generateStyle()
  },
  methods: {
    generateStyle() {
      this.$nextTick(() => {
        this.getStyle(this.row - 0)
      })
    },
    getStyle(val) {
      const lineHeight =
        getComputedStyle(this.text).lineHeight.replace('px', '') - 0 || 20
      const height = getComputedStyle(this.text).height.replace('px', '') - 0

      if (height > lineHeight * val) {
        this.showHover = true
        this.textStyle = {
          height: `${lineHeight * val}px`,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          webkitLineClamp: val,
          webkitBoxOrient: 'vertical',
          cursor: 'pointer'
        }
      } else {
        this.showHover = false
        this.textStyle = {
          cursor: 'text'
        }
      }
    }
  }
}
</script>
<style scoped>
</style>
