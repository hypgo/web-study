<template>
  <!-- 动态写样式  :style="{background: isColor}" -->
  <li :style="{background: bgColor}" @mouseenter="handleEnter(true)" @mouseleave="handleEnter(false)">
    <label>
      <input type="checkbox" v-model="isCompleted"/>
      <span>{{todo.title}}</span>
    </label>
    <!-- 删除之前要提示确认 -->
    <button class="btn btn-danger" v-show="isShow" @click="deleteItem">删除</button>
  </li>
</template>
/* 
1. 绑定事件监听
2. 设计数据
3. 在监听回调中, 更新数据
 */
<script type="text/ecmascript-6">
  export default {
    // 声明属性的属性名和属性值的类型
    props: {
      todo: Object,
      deleteTodo: Function,
      index: Number,
      updateTodo: Function
    },

    data() {
      return {
        bgColor: 'white',
        isShow: false
      }
    },

    computed: {
      isCompleted: {
        get () {
          return this.todo.completed
        },
        set (value) {
          // 自身可以传todo，传index的结果也是为了得到todo
          this.updateTodo(this.todo, value)
        }
      }
    },

    methods: {
      handleEnter (isEnter) {
        if (isEnter) {
          this.bgColor = '#aaaaaa',
          this.isShow = true
        } else {
          // 记住：只要是在组件对象里面，调用数据和函数就要用this
          this.bgColor = 'white',
          this.isShow = false
        }
      },

      deleteItem () {
        if (window.confirm('确定删除吗?')) {
          // 通过标签属性props传过来
          this.deleteTodo(this.index)
        }
      }
    },
  }

</script>

<style scoped>
  li {
    list-style: none;
    height: 36px;
    line-height: 36px;
    padding: 0 5px;
    border-bottom: 1px solid #ddd;
  }

  li label {
    float: left;
    cursor: pointer;
  }

  li label li input {
    vertical-align: middle;
    margin-right: 6px;
    position: relative;
    top: -1px;
  }

  li button {
    float: right;
    margin-top: 3px;
  }

  li:before {
    content: initial;
  }

  li:last-child {
    border-bottom: none;
  }
</style>
