<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 未n登录 -->
          <p v-if='!userName'>
            <span>请</span>
            <router-link to='/login' href="###">登录</router-link>
            <router-link to='/register' class="register">免费注册</router-link>
          </p>
          <p v-else>
            <a class="title">{{userName}}</a>
            <a to='/login' class="register" @click="logout" style="cursor:pointer">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to='/home'>
          <img src="./images/logo.png" alt="">
        </router-link>
      </h1>
      <div class="account">
        <h3>测试管理员账号： 13700000000</h3>
        <h3>测试管理员密码： 111111</h3>
        <h3>因为数据的原因,三级导航栏只有 <span>前三列</span> 有数据</h3>
      </div>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyword" />
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">搜索</button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      keyword: ""
    }
  },
  created() {
    this.$store.dispatch('getUserInfo')
  },
  computed: {
    userName() {
      return this.$store.state.user.userInfo.name;
    }
  },
  methods: {
    goSearch() {
      if (!this.keyword) return alert('搜索内容不能为空')
      // 如果当前路由存在query参数则进行合并
      let location = {
        name: 'search',
        // 解决params传递参数为空的情况
        params: { keyword: this.keyword || 'undefined' },
      }
      if (this.$route.query) {
        location.query = this.$route.query
      }
      this.$router.push(location)
    },
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/home')
    }
  },
  mounted() {
    this.$bus.$on('removeKeyword', () => {
      this.keyword = ''
    })
  },
  watch: {
    $route(newValue) {
      if (newValue.name != 'search') {
        this.keyword = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  .account {
    padding: 10px;
    color: rgb(219, 79, 79);
    span {
      font-size: 20px;
      font-weight: 600;
      color: red;
    }
  }
  .title {
    color: #116363;
    font-size: 18px;
    margin-right: 5px;
  }
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>