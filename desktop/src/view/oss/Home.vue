<script setup lang="ts">
import OssUploadComp from '../../component/OssUploadComp.vue'
import UserInfoComp from '../../component/UserInfoComp.vue';

const title = '教学演示项目-oss'
</script>

<template>
  <div>
    {{ title }}
    <UserInfoComp></UserInfoComp>
  </div>
  <div>
    <OssUploadComp></OssUploadComp>
  </div>
</template>
