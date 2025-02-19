<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-show="searchParams.categoryName">
              <!-- 分类的面包屑 -->
              {{searchParams.categoryName}}<i @click="removeCategoryName"> x</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-show="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyword"> x</i></li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{searchParams.trademark.split(':')[1]}}<i @click="removeTradeMark"> x</i></li>
            <!-- 产品参数的面包屑 -->
            <li class="with-x" v-for="(item,index) in searchParams.props" :key='index'>{{item.split(':')[1]}}<i @click="removeProp(item)"> x</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @handleTradeMark='getTradeMarkInfo' @attrInfo='attrInfo' />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{'active': isOne } " @click="changeOrder(1)">
                  <a>
                    综合 <span v-show="isOne" class="iconfont" :class="{'icon-jiantou_xiangshang':isAsc,'icon-jiantou_xiangxia':!isAsc}"></span>
                  </a>
                </li>
                <li :class="{'active':!isOne }" @click="changeOrder(2)">
                  <a>
                    价格 <span v-show="!isOne" class="iconfont " :class="{'icon-jiantou_xiangshang':isAsc,'icon-jiantou_xiangxia':!isAsc}"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品数据 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key='good.id'>
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>&nbsp;
                      <i>{{good.price}}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" :title="good.title">
                      {{good.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <router-link :to="`/detail/${good.id}`" class="sui-btn btn-bordered btn-danger">加入购物车 </router-link>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 没有商品数据的时候提示内容 -->
          <div v-show="goodsList.length===0" class="noDataShowMsg">
            <h1>因为数据不足,所以该商品类无法展示,您可以跳转回首页,点击前三列导航进行后序操作</h1>
          </div>
          <!-- 分页器 -->
          <Pagination :total='total' :pageSize='searchParams.pageSize' :pageNo='searchParams.pageNo' :continues='5' @getPageNo='getPageNo' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Search',
  data() {
    return {
      searchParams: {
        "category1Id": "",
        "category2Id": "",
        "category3Id": "",
        "categoryName": "",
        "keyword": "",
        "order": "1:desc", // 默认为: 综合降序
        "pageNo": 1,
        "pageSize": 3,
        "props": [],
        "trademark": ""
      }
    }
  },
  components: {
    SearchSelector
  },
  computed: {
    ...mapGetters(['attrsList', 'goodsList', 'trademarkList']),
    isAsc() {
      return this.searchParams.order.indexOf('asc') != -1
    },
    isOne() {
      return this.searchParams.order.indexOf('1') != -1
    },
    ...mapState({
      total: state => state.search.searchInfo.total
    })
  },
  beforeMount() {
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },
  mounted() {
    this.getSearchData()
  },
  methods: {
    getSearchData() {
      this.$store.dispatch('getSearchInfo', this.searchParams)
    },
    removeCategoryName() {
      // 设置为undefined可以减少携带参数的体积。
      this.searchParams.categoryName = undefined
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      this.getSearchData()
      // 进行路由跳转
      // 如果路径存在params参数不需要删除params
      if (this.$router.params) {
        this.$router.push({ name: 'search', params: this.$router.params })
      }
    },
    // 移除分类面包屑
    removeKeyword() {
      // 设置为undefined可以减少携带参数的体积。
      this.searchParams.keyword = undefined
      this.getSearchData()
      // 置空搜索内容
      this.$bus.$emit('removeKeyword')
      // 重置搜索栏内容
      if (this.$router.query) {
        this.$router.push({ name: 'search', query: this.$router.query })
      }
    },
    // 移除品牌面包屑
    removeTradeMark() {
      this.searchParams.trademark = undefined
      this.getSearchData()
    },
    // 根据分类展示数据
    getTradeMarkInfo(tradeMark) {
      this.searchParams.trademark = `${tradeMark.tmId}:${tradeMark.tmName}`
      this.getSearchData()
    },
    //收集商品数据
    attrInfo(attr, attrValue) {
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`
      // 重复添加参数处理
      if (this.searchParams.props.indexOf(prop) == -1) this.searchParams.props.push(prop)
      this.getSearchData()
    },
    // 移除商品数据面包屑
    removeProp(item) {
      this.searchParams.props = this.searchParams.props.filter(x => x != item)
      this.getSearchData()
    },
    // 修改排序方式
    changeOrder(flag) {
      let index = this.searchParams.order.split(':')[0]
      let sc = this.searchParams.order.split(':')[1]
      if (flag == index) {
        sc = sc == 'desc' ? 'asc' : 'desc'
      } else {
        sc = 'desc'
      }
      this.searchParams.order = `${flag}:${sc}`
      this.getSearchData()
    },
    //修改当前所在页码
    getPageNo(pageNo) {
      this.searchParams.pageNo = pageNo
      this.getSearchData()
    }
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        // 每次请求完之前将上一次请求id置空,下一次请求不会产生id错误
        this.searchParams.category1Id = undefined
        this.searchParams.category2Id = undefined
        this.searchParams.category3Id = undefined
        Object.assign(this.searchParams, this.$route.query, this.$route.params)
        this.getSearchData()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  .noDataShowMsg {
    text-align: center;
    margin: 20px;
    color: #28a3ef;
  }
  margin: 10px 0;
  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>