<template>
  <div class='login'>
    <!-- elementUI card卡片组件-->
    <el-card class='login-card'>
      <!-- 卡片内容 -->
      <div class='title'>
        <img src="../../assets/img/logo_index.png" alt="">
      </div>
      <!-- 表单   表单数据对象      验证规则对象  给一个ref属性-->
      <el-form ref="formObj" :model="loginForm" :rules="loginRules" style="margin-top:30px">
        <!-- 一个表单域就是一个form-item -->
        <el-form-item prop="mobile">
          <!-- 放置表单组件  -->
          <!-- 手机号 -->
          <el-input v-model="loginForm.mobile" placeholder="请输入手机哈"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- 验证码 和发送验证码 -->
          <el-input v-model="loginForm.code" placeholder="请输入验证码" style='width:280px'></el-input>
          <el-button style="float:right" plain>发送验证码</el-button>
        </el-form-item>
         <el-form-item prop="checked">
           <!-- 勾选同意框 -->
           <el-checkbox v-model="loginForm.checked">我已阅读并同意用户协议及条款</el-checkbox>
         </el-form-item>
         <el-form-item>
           <el-button style="width:100%" type='primary' @click="login">登录</el-button>
         </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        // 要校验的整个的表单数据
        // 手机号
        mobile: '',
        // 验证码
        code: '',
        // 是否选中
        checked: false
      },
      //   校验规则对象
      loginRules: {
        //   键值对  键 要检验的字段名  val 数组,可以使一条或者多条
        mobile: [
          { required: true, message: '请输入您的手机号' },
          { patter: /^1[3456789]\d{9}$/, message: '请输入真确的手机号' }
        ],
        code: [
          { required: true, message: '请输入您验证码' },
          { patter: /^\d{6}$/, message: '请输入六位数字' }
        ],
        checked: [
          // 自定义校验函数   rule当前规则 value当前的值(checked) callback回调函数
          { validator: function (rule, value, callback) {
            if (value) {
              // 如果是true就是选中了,直接通过
              callback() // 直接执行callback
            } else {
              // 没有选中就不通过,给一个错误信息
              callback(new Error('不点√你看你妈呦')) // 也直接执行callback
            }
          } }
        ]
      }
    }
  },
  methods: {
    login () {
      // 获取实例对象
      //  el-form 组件有个方法叫 validate，用于手动触发校验
      //  如何调用到这个组件的 validate 方法？
      //  我们可以通过 ref 来获取这个组件本身，然后就可以调用它的这个 validate 方法了
      this.$refs.formObj.validate((isOK) => {
        if (isOK) {
        // 如果为true就去数据库校验数据
          this.$axios({
            url: '/authorizations',
            data: this.loginForm,
            method: 'post'
          }).then(result => {
            window.localStorage.setItem('user-token', result.data.data.token)
            this.$router.push('./home')
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: '手机号或者验证码错误'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
    .login {
    background-image: url('../../assets/img/login_bg.jpg');
    background-size: cover;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-card {
      width: 440px;
      height:360px;
      .title {
        text-align: center;
        img {
          height: 45px;
        }
      }
    }
  }
</style>
