<template>
  <div v-show="showFlag" class="food" ref="food">
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image">
        <div class="back" @click="back">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}</span>
        </div>
        <div class="price">
          <span class="now">${{food.price}}</span>
          <span v-show="food.oldPrice" class="old">${{food.oldPrice}}</span>
        </div>
        <div class="cartControl">
          <countCart :food="food"></countCart>
        </div>
      </div>
      <split v-show="food.info"></split>
      <div class="info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{food.info}}</p>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <ratingSelect :bus="bus"   :onlyContent="onlyContent" :selectType="selectType" :desc="desc" :ratings="food.ratings"></ratingSelect>
        <div class="rating-wrapper ">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px" v-for="(rating,index) in food.ratings" :key="index">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">
            暂无评价
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
   import BScroll from 'better-scroll'
   import countCart from '../countCart/countCart'
   import split from '../split/split'
   import ratingSelect from '../ratingSelect/ratingSelect'
   import Vue from 'vue'
   import {formatDate} from '../../common/js/date'

   const POSITIVE = 0
   const NEGATIVE = 1
   const ALL = 2
   const bus = new Vue()

   export default {
      props: {
        food: {
          type: Object
        }
      },
      data() {
        return {
          showFlag: false,
          selectType: ALL,
          onlyContent: true,
          bus: bus,
          desc: {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        }
      },
      methods: {
        show() {
          this.showFlag = true
          this.selectType = ALL
          this.onlyContent = true
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.food, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
          this.bus.$on('rating.selectType', (type) => {
            this.selectType = type
            this.$nextTick(() => {
              this.scroll.refresh()
            })
          })
          this.bus.$on('rating.onlyContent', (onlyContent) => {
            this.onlyContent = onlyContent
            this.$nextTick(() => {
              this.scroll.refresh()
            })
          })
        },
        back() {
          this.showFlag = false
        },
        needShow(type, text) {
          if (this.onlyContent && !text){
            return false
          }
          if (this.selectType === ALL) {
            return true
          } else {
              return type === this.selectType
          }
        }
      },
      computed: {
      },
      filters: {
        formatDate(time) {
          let date = new Date(time)
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }
      },
      components: {
        countCart,
        split,
        ratingSelect
      },
     beforeDestroy: function() {
       this.$off('rating.selectType')
       this.$off('rating.onlyContent')
     }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position:fixed
    left:0
    top:0
    bottom:48px
    z-index:9
    width: 100%
    background:#fff
    .image-header
      position:relative
      width: 100%
      height:0
      padding-top: 100%
      img
        position: absolute
        top:0
        left:0
        width: 100%
        height:100%
      .back
        position: absolute
        top:10px
        left:0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size:16px
          color:#fff
    .content
      position:relative
      padding:18px
      .title
        line-height:14px
        margin-bottom:8px
        font-size:14px
        font-weight:700
        color:rgb(7,17,27)
      .detail
        margin-bottom:18px
        line-height:10px
        font-size:0
        height:10px
        .sell-count,.rating
          font-size:10px
          color:rgb(147,153,159)
        .sell-count
          margin-right:12px
      .price
        font-weight:700
        line-height:24px
        display:flex
        .now
          margin-right:8px
          font-size:14px
          color:rgb(240,20,20)
        .old
          text-decoration :line-through
          font-size:10px
          color:rgb(147,153,159)
      .cartControl
        position: absolute
        bottom:12px
        right:12px
    .info
      padding:18px
      .title
        line-height:14px
        margin-bottom:16px
        font-size:14px
        color:rgb(7,17,27)
      .text
        line-height:24px
        padding:0 8px
        font-size:13px
        color:rgb(77,85,93)
    .rating
      padding-top:18px
      .title
        line-height:14px
        margin-left:18px
        font-size:14px
        color:rgb(7,17,27)
      .rating-wrapper
        padding:0 18px
        .rating-item
          position:relative
          padding:16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position: absolute
            right:0
            top: 16px
            font-size:0
            line-height:12px
            .name
              display: inline-block
              vertical-align :top
              font-size: 10px
              color:rgb(147,153,159)
              margin-right:6px
            .avatar
              border-radius:50%
          .time
            margin-bottom:6px
            line-height:12px
            font-size:10px
            color:rgb(147,153,159)
          .text
            line-height:16px
            font-size:12px
            color:rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              line-height:16px
              margin-right:4px
              font-size:12px
            .icon-thumb_up
              color:rgb(0,160,220)
            .icon-thumb_down
              color:rgb(147,153,159)
        .no-rating
          padding: 16px 0
          font-size:12px
          color:rgb(147,153,159)
</style>
