<script setup>
'use strict'
</script>

<template>
  <div> 
    <el-col :sm="12" :lg="6" :xl="4">
      <el-result
        icon="warning"
        title="404提示"
        sub-title="页面不存在，请检查路径"
      >
        <template #extra>
          <el-button type="primary"@click="$router.push('/')">返回首页</el-button>
        </template>
      </el-result>
    </el-col>
    </div>
</template>

<style scoped>

</style>