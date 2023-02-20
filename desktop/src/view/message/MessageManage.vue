<script setup lang="ts">
import { NButton, NDataTable, NForm, NFormItem, NInput, NSpace, NTag, NModal, NList, NListItem, NAvatar, NThing, NGradientText } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { reactive, h, computed } from 'vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import { MessageDetail, MessageReply, ExamineInfo } from '../../entity/MessageDetailResult'
import PageComp from '../../component/PageComp.vue'
import dialog from '../../tools/dialog'
import server from '../../tools/server'
import tools from '../../tools/tools'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import store from '../../store'
const router = useRouter()
const route = useRoute()
const toolsData = reactive({
  modelVisible: {
    examineInfo: false,
    del: false,
  },
})
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)

const MessageMode = computed(() => {
  return route.query.mode + ''
})
const changeRouteInfo = (info: string) => {
  if (info == route.query.mode) {
    return
  }
  router.push({
    path: '/message/manage',
    query: {
      mode: info,
    },
  })
}

const commentColumns: DataTableColumns<MessageReply> = [
  {
    title: '用户名',
    key: 'username',
    titleColSpan: 1,
    render(row: MessageReply) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => row.user.username }
        ),
      ]
    },
  },
  {
    title: '昵称',
    key: 'nickname',
    titleColSpan: 1,
    render(row: MessageReply) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => row.user.nickname }
        ),
      ]
    },
  },
  { title: '评论信息', key: 'info' },
  {
    title: '是否屏蔽',
    key: 'disable',
    titleColSpan: 1,
    render(row: MessageReply) {
      return [
        h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: row.disable == 'y' ? 'warning' : 'info',
            bordered: false,
          },
          {
            default: () => (row.disable == 'y' ? '被屏蔽' : '正常'),
          }
        ),
      ]
    },
  },
  {
    title: '是否被举报',
    key: 'examine',
    titleColSpan: 1,
    render(row: MessageReply) {
      return [
        h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: row.examine == 'y' ? 'warning' : 'info',
            bordered: false,
          },
          { default: () => (row.examine == 'y' ? '被举报' : '正常') }
        ),
      ]
    },
  },
  {
    title: '点赞总数',
    key: 'praiseCount',
    sorter: (row1: MessageReply, row2: MessageReply) => row1.praiseCount - row2.praiseCount,
  },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: MessageReply) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => tools.formatDate(row.lastupdate) }
        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'operation',
    titleColSpan: 2,
    render(row: MessageReply) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'warning',
            onClick: () => {
              toolsData.modelVisible.del = true
              delData.commentInfo = row
            },
          },
          { default: () => '删除' }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'success',
            style: `display:${row.examine == 'y' ? 'inline-block' : 'none'}`,
            onClick: () => {
              toolsData.modelVisible.examineInfo = true
              queryExamineInfoData.commentInfo = row
              queryCommentExamineInfo()
            },
          },
          { default: () => '查看举报原因' }
        ),
      ]
    },
  },
]
const messageColumns: DataTableColumns<MessageDetail> = [
  {
    title: '用户名',
    key: 'username',
    titleColSpan: 1,
    render(row: MessageDetail) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => row.user.username }
        ),
      ]
    },
  },
  {
    title: '昵称',
    key: 'nickname',
    titleColSpan: 1,
    render(row: MessageDetail) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => row.user.nickname }
        ),
      ]
    },
  },
  { title: '标题', key: 'title' },
  {
    title: '是否屏蔽',
    key: 'disable',
    titleColSpan: 1,
    render(row: MessageDetail) {
      return [
        h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: row.disable == 'y' ? 'warning' : 'info',
            bordered: false,
          },
          {
            default: () => (row.disable == 'y' ? '被屏蔽' : '正常'),
          }
        ),
      ]
    },
  },
  {
    title: '是否被举报',
    key: 'examine',
    titleColSpan: 1,
    render(row: MessageDetail) {
      return [
        h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: row.examine == 'y' ? 'warning' : 'info',
            bordered: false,
          },
          { default: () => (row.examine == 'y' ? '被举报' : '正常') }
        ),
      ]
    },
  },
  {
    title: '点击量',
    key: 'hits',
    sorter: (row1: MessageDetail, row2: MessageDetail) => row1.hits - row2.hits,
  },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: MessageDetail) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => tools.formatDate(row.lastupdate) }
        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'operation',
    titleColSpan: 2,
    render(row: MessageDetail) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'warning',
            onClick: () => {
              toolsData.modelVisible.del = true
              delData.messageInfo = row
            },
          },
          { default: () => '删除' }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'success',
            style: `display:${row.examine == 'y' ? 'inline-block' : 'none'}`,
            onClick: () => {
              queryExamineInfoData.messageInfo = row
              toolsData.modelVisible.examineInfo = true
              queryMessageExamineInfo()
            },
          },

          { default: () => '查看举报原因' }
        ),
      ]
    },
  },
]
const queryExamineInfoData = reactive({
  messageInfo: new MessageDetail(),
  commentInfo: new MessageReply(),
  list: [] as ExamineInfo[],
  page: new PageInfo(),
})
const queryMessageExamineInfo = () => {
  server.post('/message/manage/queryExamineInfo', { umid: queryExamineInfoData.messageInfo.umid }, (data: BaseListResult<ExamineInfo>) => {
    if (data.success) {
      queryExamineInfoData.list = data.list
      queryExamineInfoData.page = data.page
    }
  })
}
const queryCommentExamineInfo = () => {
  server.post('/message/manage/queryExamineInfoReply', { umrid: queryExamineInfoData.commentInfo.umrid }, (data: BaseListResult<ExamineInfo>) => {
    if (data.success) {
      queryExamineInfoData.list = data.list
      queryExamineInfoData.page = data.page
    }
  })
}
const messageData = reactive({
  queryInfo: {
    info: '',
  },
  page: new PageInfo(),
  list: [] as MessageDetail[],
  loading: false,
})
const queryMessageAll = () => {
  messageData.loading = true
  server.post('/message/manage/queryAdminAll', tools.concatJson(messageData.queryInfo, messageData.page), (data: BaseListResult<MessageDetail>) => {
    messageData.loading = false
    messageData.page = data.page
    messageData.list = data.list
  })
}

const delData = reactive({
  messageInfo: new MessageDetail(),
  commentInfo: new MessageReply(),
  disableReason: '',
})
const delMessage = () => {
  if (delData.disableReason == '') {
    dialog.messageWarning('删除必须填写原因')
    return
  }
  messageData.loading = true
  server.post('/message/manage/deletMessage', { disableReason: delData.disableReason, umid: delData.messageInfo.umid }, (data: BaseResult) => {
    messageData.loading = false
    if (data.success) {
      queryMessageAll()
      dialog.messageInfo(data.message)
      toolsData.modelVisible.del = false
      delData.disableReason = ''
    }
  })
}
const reset = () => {
  messageData.queryInfo.info = ''
  messageData.page.pageNumber = 1
  queryMessageAll()
}
const commentData = reactive({
  page: new PageInfo(),
  list: [] as MessageReply[],
  loading: false,
})
const queryCommentAll = () => {
  commentData.loading = true
  server.post('/message/manage/queryAdminAllReply', commentData.page, (data: BaseListResult<MessageReply>) => {
    commentData.loading = false
    commentData.page = data.page
    commentData.list = data.list
  })
}
queryMessageAll()
queryCommentAll()

const delComment = () => {
  if (delData.disableReason == '') {
    dialog.messageWarning('删除必须填写原因')
    return
  }
  commentData.loading = true
  server.post('/message/manage/deletMessageReply', { disableReason: delData.disableReason, umrid: delData.commentInfo.umrid }, (data: BaseResult) => {
    commentData.loading = false
    if (data.success) {
      queryCommentAll()
      dialog.messageInfo(data.message)
      toolsData.modelVisible.del = false
      delData.disableReason = ''
    }
  })
}
const queryAllByInfo = () => {
  messageData.page.pageNumber = 1
  queryMessageAll()
}
</script>
<template>
  <div v-if="MessageMode != 'comment'">
    <header class="tc">
      <h1>管理查询留言板信息</h1>
    </header>
    <main>
      <n-form inline :model="messageData.queryInfo" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-input v-model:value="messageData.queryInfo.info" placeholder="用户名，标题、内容模糊查询" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryAllByInfo"> 查询 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="reset"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="changeRouteInfo('comment')"> 切换评论管理 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="router.back"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table default-expand-all :columns="messageColumns" :data="messageData.list" :loading="messageData.loading" />
      <div>
        <PageComp :page="messageData.page" :show-size-picker="true" @number-change="queryMessageAll" @size-change="queryMessageAll" @page-change="queryMessageAll"></PageComp>
      </div>
    </main>
  </div>
  <div v-else>
    <header class="tc">
      <h1>管理查询评论信息</h1>
    </header>
    <main>
      <n-form inline size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-button attr-type="button" @click="changeRouteInfo('message')"> 切换留言管理 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="router.push('/')"> 返回主站 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table default-expand-all :columns="commentColumns" :data="commentData.list" :loading="messageData.loading" />
      <div>
        <PageComp :page="commentData.page" :show-size-picker="true" @number-change="queryCommentAll" @size-change="queryCommentAll" @page-change="queryCommentAll"></PageComp>
      </div>
    </main>
  </div>
  <n-modal v-model:show="toolsData.modelVisible.examineInfo" preset="dialog">
    <template #header>
      <div v-if="MessageMode == 'message'">查看{{ queryExamineInfoData.messageInfo.user.nickname }}举报原因</div>
      <div v-else>查看{{ queryExamineInfoData.commentInfo.user.nickname }}举报原因</div>
    </template>
    <n-list>
      <n-list-item v-for="e in queryExamineInfoData.list" :key="e.username">
        <n-space align="center" justify="space-between">
          <n-space align="center">
            <n-avatar round size="large" :src="e.img ? e.img : 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'"></n-avatar>
            <n-thing :title="`用户名：${e.username}`" :description="`昵称：${e.nickname}`"> </n-thing>
          </n-space>
          <div>举报原因：{{ e.info }}</div>
        </n-space>
      </n-list-item>
      <div v-if="queryExamineInfoData.page.pageCount > 1 && MessageMode == 'message'">
        <PageComp :page="queryExamineInfoData.page" :show-size-picker="true" @number-change="queryMessageExamineInfo" @size-change="queryMessageExamineInfo" @page-change="queryMessageExamineInfo"></PageComp>
      </div>
      <div v-if="queryExamineInfoData.page.pageCount > 1 && MessageMode == 'comment'">
        <PageComp :page="queryExamineInfoData.page" :show-size-picker="true" @number-change="queryMessageExamineInfo" @size-change="queryMessageExamineInfo" @page-change="queryMessageExamineInfo"></PageComp>
      </div>
    </n-list>
    <template #action>
      <div>
        <n-button type="error" size="small" @click="toolsData.modelVisible.examineInfo = false">关闭</n-button>
      </div>
    </template>
  </n-modal>
  <n-modal v-model:show="toolsData.modelVisible.del" preset="dialog">
    <template #header>
      <div v-if="MessageMode == 'message'">删除标题为'{{ delData.messageInfo.title }}'留言</div>
      <div v-if="MessageMode == 'comment'">删除评论信息为'{{ delData.commentInfo.info }}'评论</div>
    </template>
    <n-form-item>
      <n-input v-model:value="delData.disableReason" placeholder="请输入删除原因" />
    </n-form-item>
    <n-space justify="end" align="center">
      <n-gradient-text type="error" size="12"> 删除之后不可撤回，谨慎操作 </n-gradient-text>
      <n-button type="error" size="small" v-if="MessageMode == 'message'" @click="delMessage()" v-loading="messageData.loading">删除</n-button>
      <n-button type="error" size="small" v-if="MessageMode == 'comment'" @click="delComment()" v-loading="commentData.loading">删除</n-button>
      <n-button type="info" size="small" @click="toolsData.modelVisible.del = false">关闭</n-button>
      <br />
    </n-space>
  </n-modal>
</template>

<style scoped>
:deep() .n-data-table-th {
  text-align: center;
}
:deep() .n-data-table-td {
  text-align: center;
}
</style>
