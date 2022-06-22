<script setup lang="ts">

import { useI18n } from 'vue-i18n'
//暴露属性hooks
import useFormProperties from '@/composables/login/useFormProperties'
//暴露方法hooks
import useFormOperates from '@/composables/login/useFormOperates'



const { t } = useI18n()
const { ruleForm,loginText,ruleFormRef,activeName, rules }  = useFormProperties(t)

const  {userSign , userLogin} = useFormOperates(ruleForm)

function handleClick(e:any) {
  console.log( e.props.name)
  const {name} = e.props
  if(name === 'login') {
      loginText.value = t('login.loginBtn')
  }
  else if(name === 'sign') {
      loginText.value = t('login.signBtn')
  }
}

function submitForm() {
  ruleFormRef.value.validate((valid: any) => {
    if (valid) {
      if(activeName.value === 'sign') {   
        userSign(ruleForm)
      }
      if(activeName.value === 'login') {
        userLogin(ruleForm)
      }
    } else {
      return false
    }
  })
}



</script>

<template>
  <div class="login-page">
    <div class="left-part"></div>
    <div class="right-part">
      <div class="login-panel">
        <!-- tabs -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="t('login.loginTab')" name="login"></el-tab-pane>
          <el-tab-pane :label="t('login.signTab')" name="sign"></el-tab-pane>
        </el-tabs>
        <!-- 表单组件 -->
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
          <el-form-item prop="mobile">
            <el-input :placeholder="t('login.placeMobile')" v-model="ruleForm.mobile"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :placeholder="t('login.placePass')" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="submitForm">{{ loginText }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/login/index.scss";
</style>