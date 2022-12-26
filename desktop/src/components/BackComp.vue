<template>
  <div class="backinfo" @click="goBack">
    <i class="iconfont">&#xe80f;</i>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>
<style scoped>
.backinfo {
  position: fixed;
  bottom: 3rem;
  right: 1rem;
  z-index: 9999;
  width: 2.5em;
  height: 2.5em;
  border: 1px solid #dcdcdc;
  border-radius: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
}

.backinfo:hover {
  color: #0000ff;
  cursor: pointer;
}
</style>
