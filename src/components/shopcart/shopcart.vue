<template>
  <div class="shopcart">
    <div class="content" >
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="number" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highBli:totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click="pay">
        <div class="pay"  :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="cartList" v-show="fold">
      <div class="listHead">
        <h1 class="cart">购物车</h1>
        <div class="empty" @click="clearAll">清空</div>
      </div>
      <div class="listContent" ref="listWrapper">
        <ul>
          <li class="listItem"  v-for="(food,index) in selectFoods" :key="index">
            <div class="listName">{{food.name}}</div>
            <div class="price">
              <span>￥{{food.price * food.count}}</span>
            </div>
            <div class="listCount">
              <v-countCart  :food="food"></v-countCart>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="listMask" v-show="fold" @click="toggleList"></div>
  </div>
</template>

<script type="text/ecmascript-6">
    import countCart from '../countCart/countCart'
    import BScroll from 'better-scroll'
    export default {
      props: {
        selectFoods: {
          type: Array,
          default() {
            return [
            ]
          }
        },
        deliveryPrice: {
          type: Number,
          default: 0
        },
        minPrice: {
          type: Number,
          default: 0
        }
      },
      data() {
        return {
          fold: false
        }
      },
      components: {
        'v-countCart': countCart
      },
      computed: {
        totalPrice() {
          let total = 0
          this.selectFoods.forEach((food) => {
            total += food.price * food.count
          })
          return total
        },
        totalCount() {
          let count = 0
          this.selectFoods.forEach((food) => {
            count += food.count
          })
          return count
        },
        payDesc() {
          if (this.totalPrice === 0) {
            return `￥${this.minPrice}元起送`
          } else if (this.totalPrice < this.minPrice){
            let diff = this.minPrice - this.totalPrice
            return `还差￥${diff}起送`
          } else {
            return '去结算'
          }
        },
        payClass() {
          if (this.totalPrice < this.minPrice){
            return 'not-enough'
          } else {
            return 'enough'
          }
        }
      },
      watch: {
        fold: function(val) {
          if (val){
            this.$nextTick(() => {
              if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.listWrapper, {
                  click: true
                })
              } else {
                this.scroll.refresh()
              }
            })
          }
        },
        totalCount: function(totalCount){
            if (!totalCount) {
              this.fold = false
              return false
            }
          }
      },
      methods: {
        toggleList: function(){
          if (!this.totalCount) {
            this.fold = false
            return
          }
          this.fold = !this.fold
        },
        clearAll: function() {
          this.selectFoods.forEach((food) => {
            food.count = 0
          })
        },
        pay() {
          if (this.totalPrice < this.minPrice){
            return
          }
          window.alert('支付' + this.totalPrice)
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position:fixed
    left:0
    bottom:0
    width :100%
    height:48px
    z-index:10
    .content
      display: flex
      background:#141d27
      font-size:0
      z-index :1
      color:rgba(255,255,255,0.4)
      .content-left
        flex:1
        .logo-wrapper
          display: inline-block
          position:relative
          top:-10px
          margin:0 12px
          padding:6px
          width:56px
          height :56px
          box-sizing:border-box
          vertical-align :top
          border-radius :50%
          background:#141d27
          .logo
            width: 100%
            height: 100%
            background: #2b343c
            border-radius 50%
            text-align:center
            &.highlight
              background:rgb(0,160,220)
            .icon-shopping_cart
              font-size:24px
              color: #80858a
              line-height:44px
              &.highlight
                color:#fff
          .number
            position:absolute
            top:0
            right:0
            width:24px
            height:16px
            line-height:16px
            text-align:center
            border-radius:16px
            font-size:9px
            font-weight:700
            color: #ffffff
            background:rgb(240,20,20)
            box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align:top
          margin-top:12px
          line-height:24px
          box-sizing:border-box
          padding-right:12px
          border-right:1px solid rgba(255,255,255,0.1)
          font-size:16px
          font-weight:700
          &.highBli
            color:#fff
        .desc
          display: inline-block
          vertical-align :top
          line-height:24px
          margin:12px 0 0 12px
          font-size:10px
      .content-right
        flex :0 0 105px
        width:105px
        .pay
          height:48px
          line-height:48px
          text-align:center
          font-size:12px
          font-weight:700
          background:#2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color:#fff
    .cartList
      position:absolute
      left:0
      bottom:48px
      width: 100%
      z-index: -1
      .listHead
        height:40px
        line-height:40px
        padding:0 18px
        background: #f3f5f7
        border-bottom:1px solid rgba(7,17,27,0.1)
        .cart
          float:left
          font-size:14px
          color:rgb(7,17,27)
        .empty
          float:right
          font-size:12px
          color:rgb(0,160,220)
      .listContent
        padding:0 18px
        max-height:217px
        background:#fff
        overflow:hidden
        .listItem
          position:relative
          padding:12px 0
          border-1px(rgba(7,17,27,0.1))
          .listName
            line-height:24px
            font-size:14px
            color:rgb(7,17,27)
          .price
            position: absolute
            right:90px
            bottom:12px
            line-height:24px
            color:rgb(240,20,20)
            font-size:14px
            font-weight:700
          .listCount
            position:absolute
            right:0
            bottom:6px
    .listMask
      position :fixed
      top:0
      left:0
      width: 100%
      height: 100%
      z-index: -2
      background:rgba(7,17,27,0.6)
      filter:blur(10px)
</style>
