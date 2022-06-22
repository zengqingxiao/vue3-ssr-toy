<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const pageNo = computed(() => store.state.pageNo)
const pageSize = computed(() => store.state.pageSize)
const total = computed(() => store.state.total)
/* eslint-disable */
const emit = defineEmits<{
  (e: 'changePage', pageNo: number): void
}>()

function changePage(pageNo: number) {
  console.log('子组件', pageNo)
  emit('changePage', pageNo)
}
</script>

<template>
  <el-pagination
    :current-page="pageNo"
    :page-size="pageSize"
    :total="total"
    background
    layout="prev,pager,next"
    @current-change="changePage"
  ></el-pagination>
</template>

<style scoped>
</style>