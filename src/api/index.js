import request from "./request";
import mockRequest from './mockAjax'
// 请求分类据列表
export const requestCategoryList = () => request({ url: '/product/getBaseCategoryList', methods: 'get' })
// 请求banner数据
export const requestBannerList = () => mockRequest({ url: '/banner', method: 'get' })
// 请求floor数据
export const requestFloorList = () => mockRequest({ url: '/floor', method: 'get' })
// 请求search数据
export const requestSearchList = params => request({
  url: '/list',
  method: 'post',
  data: params
})
// 请求detail数据
export const requestDetailList = skuId => request({ url: `item/${skuId}`, method: "get" })
// 将商品添加到购物车/对已有数据进行修改 /api/cart/addToCart/{ skuId }/{ skuNum }   方式: post
export const requestAddToShopCar = (skuId, skuNum) =>
  request({ url: `cart/addToCart/${skuId}/${skuNum}`, method: 'post' })
// 请求购物车数据
export const requestCartList = () => request({ url: 'cart/cartList', method: 'get' })
// 删除购物车中的某一个数据 /api/cart/deleteCart/{skuId} 请求方式delete
export const requestDeleteGoods = skuId => request({ url: `cart/deleteCart/${skuId}`, method: 'DELETE' })
// 切换商品选中状态  /api/cart/checkCart/{skuID}/{isChecked}   get
export const requestSwitchChecked = (skuId, isChecked) => request({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: "get" })
// 获取手机验证码  /api/user/passport/sendCode/{phone}phone => request({ url: `/user/passport/sendCode/${phone}`, method: 'get' })
export const requestPhoneCode = (phone) => request({ url: `/user/passport/sendCode/${phone}`, method: 'get' });
// 用户登录 /api/user/passport/register 请求方式 post
export const requestUserRegister = (data) => request({ url: '/user/passport/register', data, method: 'post' });
