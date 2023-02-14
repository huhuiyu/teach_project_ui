<script setup lang="ts">
import { NAvatar } from 'naive-ui'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps(['list'])
const lazyUrl = 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'
</script>
<template>
  <main>
    <div>
      <a class="conter_menu" v-for="d in props.list" :key="d.path" href="javascript:void(0)" @click="router.push(`${d.path}`)">
        <div>
          <n-avatar
            class="conter_img"
            size="small"
            :src="d.img ? d.img : lazyUrl"
            lazy
            :intersection-observer-options="{
              root: '#image-scroll-container',
            }"
          />
        </div>
        <div>
          <div class="conter_title">
            {{ d.title }}
          </div>
          <p>{{ d.info }}</p>
        </div>
      </a>
    </div>
  </main>
</template>

<style scoped>
p {
  margin: 0;
}

main {
  margin: 0 auto;
}
main > div {
  padding: 10% 10%;
  display: grid;
  grid-template-columns: repeat(4, 20%);
  grid-gap: 4rem;
}
.conter_menu {
  display: inline-block;
  border-radius: 10px;
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.15);
  transition: all 0.8s;
  text-decoration: none;
  color: #000;
  height: 110%;
}
.conter_menu:hover {
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.3);
}
.conter_menu:hover .conter_img {
  transform: scale(1.3);
}
.conter_menu > div:first-child {
  width: 100%;
  height: 50%;
  overflow: hidden;
}
.conter_menu > div:last-child {
  padding: 1rem;
  margin-bottom: 15%;
}
.conter_title {
  font-size: 1.5em;
  font-weight: 700;
  margin: 0.2rem 0;
}
.conter_menu p {
  color: #757575;
}
.conter_img {
  transition: transform 0.8s;
  transform-origin: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.conter_menu :deep() img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
