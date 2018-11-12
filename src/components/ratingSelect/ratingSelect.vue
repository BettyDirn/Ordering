<template>
  <div class="ratingSelect">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active':selecttype===2}" @click="changeType(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active':selecttype===0}" @click="changeType(0,$event)">{{desc.positive}}<span class="count">{{positive.length}}</span>
      </span>
      <span class="block negative" :class="{'active':selecttype===1}" @click="changeType(1,$event)">{{desc.negative}}<span class="count">{{negative.length}}</span>
      </span>
    </div>
    <div class="switch" :class="{'on':onlycontent}" @click="onlyCheck">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    const POSITIVE = 0
    const NEGATIVE = 1
    const ALL = 2

    export default {
      props: {
        ratings: {
          type: Array,
          default() {
            return []
          }
        },
        bus: {
          type: Object,
          default() {
            return {}
          }
        },
        onlyContent: {
          type: Boolean,
          default: false
        },
        selectType: {
          type: Number,
          default: ALL
        },
        desc: {
          type: Object,
          default() {
            return {
              all: '全部',
              positive: '满意',
              negative: '不满意'
            }
          }
        }
      },
      data() {
        return {
          onlycontent: this.onlyContent,
          selecttype: this.selectType
        }
      },
      computed: {
        positive() {
          return this.ratings.filter(() => {
            return this.ratings.rateType === POSITIVE
          })
        },
        negative() {
          return this.ratings.filter(() => {
            return this.ratings.rateType === NEGATIVE
          })
        }
      },
      methods: {
        changeType(type, event) {
          if (!event._constructed){
            return
          }
          this.selecttype = type
          this.bus.$emit('rating.selectType', type)
        },
        onlyCheck() {
            this.onlycontent = !this.onlycontent
            this.bus.$emit('rating.onlyContent', this.onlycontent)
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingSelect
    .rating-type
      padding:18px 0
      margin: 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size:0
      .block
        display:inline-block
        padding:8px 12px
        margin-right:8px
        border-radius:1px
        color:rgb(77,85,93)
        font-size:12px
        &.active
          color:#fff
        .count
          font-size:8px
          margin-left:2px
          line-height:16px
        &.positive
          background:rgba(0,160,220,0.2)
          &.active
            background:rgb(0,160,220)
        &.negative
          background:rgba(77,85,93,0.2)
          &.active
            background:rgb(77,85,93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7,17,27,0.1)
      color:rgb(147,153,159)
      font-size:0
      &.on
        .icon-check_circle
          color:#00c850
      .icon-check_circle
        display:inline-block
        vertical-align :top
        font-size:24px
        margin-right: 4px
      .text
        display:inline-block
        vertical-align :top
        font-size:12px
</style>
