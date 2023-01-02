<script setup lang="ts">
import tools from '../tools/tools'

const title = '教学演示项目'
tools.changeTitle('首页')
</script>

<template>
  <div>
    {{ title }}
  </div>
</template>
