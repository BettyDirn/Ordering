<template>
  <div class="countCart">
    <div class="cuntCount icon-remove_circle_outline"  v-show="food.count>0" @click.stop.prevent="cuntCount" transition="move">
    </div>
    <span class="countNum" v-show="food.count>0">{{food.count}}</span>
    <div class="addCount icon-add_circle" @click.stop.prevent="addCount">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    import vue from 'vue'
    export default {
      props: {
        food: {
          type: Object
        }
      },
      methods: {
        addCount() {
          if (!this.food.count) {
            vue.set(this.food, 'count', 1)
          } else {
            this.food.count++
          }
        },
        cuntCount() {
          this.food.count--
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cuntCount, .countNum, .addCount
    display: inline-block
    line-height:24px
  .cuntCount
    font-size :24px
    padding:6px
    color:rgb(0,160,220)
  .countNum
    font-size :12px
    padding-top:6px
    color:rgb(147,153,159)
    vertical-align:top
  .addCount
    font-size :24px
    padding:6px
    color:rgb(0,160,220)
</style>
