<script setup lang="ts">
import { commonDark, NButton, NDataTable, NForm, NFormItem, NInput, NPopover, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { reactive, h } from 'vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import { MessageDetail, MessageReply } from '../../entity/MessageDetailResult'
import PageComp from '../../component/PageComp.vue'
import dialog from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'
const toolsData = reactive({
  MessageMode: true,
})
const commentColumns: DataTableColumns<MessageReply> = [
  /*  {
    type: 'expand',
    expandable: (rowData: MessageReply) => rowData.examine != 'n',
    renderExpand: (rowData: MessageReply) => {
      return `${rowData.user.username} is a good guy.`
    },
    // key: 'uid',
  }, */
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
            default: () => (row.disable == 'y' ? `被屏蔽-屏蔽原因:${row.disableReason}` : '正常'),
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
              let result = prompt(`你确定删除${row.user.username}的${row.info}条评论`, '删除的评论的原因')
              if (result != null) {
                delComment(result, row.umrid)
              }
            },
          },
          { default: () => '删除' }
        ),
        h(
          NPopover,
          {
            trigger: 'click',
          },
          {
            default: () => (row.disableReason == '' ? '空' : row.disableReason),
            trigger: () =>
              h(
                NButton,
                {
                  strong: true,
                  tertiary: true,
                  size: 'small',
                  type: 'success',
                  style: `display:${row.examine == 'y' ? 'inline-block' : 'none'}`,
                },
                { default: () => '查看举报原因' }
              ),
          }
        ),
      ]
    },
  },
]
const messageColumns: DataTableColumns<MessageDetail> = [
  {
    type: 'expand',
    expandable: (rowData: MessageDetail) => rowData.examine != 'n',
    renderExpand: (rowData: MessageDetail) => {
      return `${rowData.user.username} 被举报的原因：${rowData.disableReason}`
    },
    // key: 'uid',
  },
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
            default: () => (row.disable == 'y' ? `被屏蔽-屏蔽原因:${row.disableReason}` : '正常'),
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
              let result = prompt(`你确定删除${row.user.username}的${row.title}条留言`, '删除的评论的原因')
              if (result != null) {
                delMessage(result, row.umid)
              }
            },
          },
          { default: () => '删除' }
        ),
        h(
          NPopover,
          {
            trigger: 'click',
          },
          {
            default: () => (row.disableReason == '' ? '空' : row.disableReason),
            trigger: () =>
              h(
                NButton,
                {
                  strong: true,
                  tertiary: true,
                  size: 'small',
                  type: 'success',
                  style: `display:${row.examine == 'y' ? 'inline-block' : 'none'}`,
                },
                { default: () => '查看举报原因' }
              ),
          }
        ),
      ]
    },
  },
]
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
queryMessageAll()
const delMessage = (disableReason: string, umid: string | number) => {
  messageData.loading = true
  server.post('/message/manage/deletMessage', { disableReason, umid }, (data: BaseResult) => {
    messageData.loading = false
    if (data.success) {
      dialog.messageInfo(data.message)
    }
  })
}
const onLoad = (row: Record<string, unknown>) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      alert(row)
      row.children = [{ key: row.title + '-1', example: row.title + '-1' }]
      resolve()
    }, 1000)
  })
}

const reset = () => {
  messageData.queryInfo.info = ''
  messageData.page.pageNumber = 1
  queryMessageAll()
}
const test = (rowData: MessageDetail) => {
  return rowData.uid
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
queryCommentAll()
const delComment = (disableReason: string, umrid: string | number) => {
  commentData.loading = true
  server.post('/message/manage/deletMessageReply', { disableReason, umrid }, (data: BaseResult) => {
    commentData.loading = false
    if (data.success) {
      dialog.messageInfo(data.message)
    }
  })
}
</script>
<template>
  <div v-if="toolsData.MessageMode">
    <header class="tc">
      <h1>管理查询留言板信息</h1>
    </header>
    <main>
      <n-form inline :label-width="80" :model="messageData.queryInfo" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item label="查询信息">
          <n-input v-model:value="messageData.queryInfo.info" placeholder="用户名，标题、内容模糊查询" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryMessageAll"> 查询 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="reset"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="toolsData.MessageMode = !toolsData.MessageMode"> 切换评论管理 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table default-expand-all :columns="messageColumns" :data="messageData.list" :loading="commentData.loading" />
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
      <n-form inline :label-width="80" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-button attr-type="button" @click="toolsData.MessageMode = !toolsData.MessageMode"> 切换留言管理 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table default-expand-all :columns="commentColumns" :data="commentData.list" :loading="messageData.loading" />
      <div>
        <PageComp :page="commentData.page" :show-size-picker="true" @number-change="queryCommentAll" @size-change="queryCommentAll" @page-change="queryCommentAll"></PageComp>
      </div>
    </main>
  </div>
</template>

<style scoped>
:deep() .n-data-table-th {
  text-align: center;
}
:deep() .n-data-table-td {
  text-align: center;
}
</style>
