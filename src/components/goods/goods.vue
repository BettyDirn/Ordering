<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="food-list food-list-hook" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,index) in item.foods" class="food-item" :key="index" @click="selectedFood(food)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">${{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">${{food.oldPrice}}</span>
                </div>
                <div class="countwrapper">
                  <v-countCart :food="food"></v-countCart>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></v-shopcart>
    <food :food="fooded" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
    import shopcart from '../shopcart/shopcart'
    import BScroll from 'better-scroll'
    import countCart from '../countCart/countCart'
    import food from '../food/food'

    const ERR_OK = 0
    export default {
      props: {
        seller: {
          type: Object
        }
      },
      data(){
        return {
          goods: [],
          listHeight: [],
          scrollY: 0,
          fooded: {}
        }
      },
      computed: {
        currentIndex() {
          for (let i = 0; i < this.listHeight.length; i++) {
              let height = this.listHeight[i]
              let height2 = this.listHeight[i + 1]
              if (!height2 || (this.scrollY >= height && this.scrollY < height2)){
                return i
              }
          }
          return 0
        },
        selectFoods() {
          let selectFoods = []
          this.goods.forEach((item) => {
            item.foods.forEach((food) => {
              if (food.count > 0){
                selectFoods.push(food)
              }
            })
          })
          return selectFoods
        }
      },
      created(){
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
        this.$http.get('/api/goods').then((response) => {
          response = response.body
          if (response.errno === ERR_OK){
            this.goods = response.data
            this.$nextTick(() => {
              this._initScroll()
              this._calculateHeight()
            })
          }
        })
      },
      methods: {
        _initScroll() {
          this.meunScroll = new BScroll(this.$refs.menuWrapper, {
            click: true
          })
          this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
             probeType: 3,
             click: true
          })

          this.foodsScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y))
          })
        },
        _calculateHeight() {
          let foodlist = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
          let height = 0
          this.listHeight.push(height)
          for (let i = 0; i < foodlist.length; i++){
            let item = foodlist[i]
            height += item.clientHeight
            this.listHeight.push(height)
          }
        },
        selectMenu(index, event){
            let y = this.listHeight[index]
            this.foodsScroll.scrollTo(0, -y)
            this.scrollY = y
        },
        selectedFood(food) {
          this.fooded = food
          this.$refs.food.show()
        }
      },
      components: {
        'v-shopcart': shopcart,
        'v-countCart': countCart,
        food
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .goods
    position:absolute
    width: 100%
    top:174px
    bottom:46px
    display:flex
    overflow:hidden
    .menu-wrapper
      flex:0 0 80px
      width:80px
      background:#f3f5f7
      .menu-item
        display:table
        height:54px
        width:56px
        line-height:14px
        padding:0 12px
        &.current
          position:relative
          margin-top: -1px
          z-index :10
          font-weight 700
          background: #fff
          .text
            border-none()
        .icon
          display :inline-block
          vertical-align:top
          width :12px
          height:12px
          margin-right:4px
          background-repeat:no-repeat
          background-size:12px 12px
          &.decrease
            bg-image('../images/decrease_3')
          &.discount
            bg-image('../images/discount_3')
          &.guarantee
            bg-image('../images/guarantee_3')
          &.invoice
            bg-image('../images/invoice_3')
          &.special
            bg-image('../images/special_3')
        .text
          font-size:12px
          display:table-cell
          vertical-align:middle
          width:56px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
            margin-bottom:0
    .foods-wrapper
      flex:1
      .title
        padding-left:14px
        height:26px
        line-height:26px
        border-left:2px solid #d9dde1
        font-size:12px
        color:rgb(147,153,159)
        background:#f3f5f7
      .food-item
        display:flex
        margin:18px
        border-1px(rgba(7,17,27,0.1))
        padding-bottom:18px
        &:last-child
          border-none()
          margin-bottom:0
      .icon
        flex:0 0 57px
        margin-right:10px
      .content
        flex:1
        .name
          margin:2px 0 8px 0
          height:14px
          line-height:14px
          font-size:14px
          color:rgb(7,17, 27)
        .desc, .extra
          font-size:10px
          color:rgb(147,153,159)
        .desc
          line-height:13px
          margin-bottom:8px
        .extra
          line-height:10px
          .count
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
        .countwrapper
          position: absolute
          right:0
          bottom:12px
</style>
