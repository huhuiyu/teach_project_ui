<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseResult, { BaseDataResult, BaseListResult, PageInfo } from '../entity/BaseResult'
import { FileInfo } from '../entity/FileInfo'
import { TbBucket, OssSign, TbOssInfo, UploadInfo } from '../entity/OssInfo'
import server from '../tools/server'
import { FormInst, FormRules, NButton, NForm, NFormItem, NInput, NProgress, NSelect } from 'naive-ui'

// import plupload from 'plupload'
import logger from '../tools/logger'
import tools from '../tools/tools'

import { OssUploader, UploadOssInfo, OssUploadConfig } from '../tools/OssUploader'

const viewInfo = reactive({
  page: new PageInfo(),
  list: new Array<TbBucket>(),
  bucket: new TbBucket(),
  filinfos: new Array<FileInfo>(),
  loading: false,
  uploadInfo: new Array<UploadInfo>(),
  uploadCount: 0,
  fileinfo: '',
})
let ossSign = new OssSign()

const selectViewInfo = reactive({
  list: [{ label: '请选择bucket', value: -1 }],
})
// 查询bucket信息
const queryBucket = () => {
  server.post('/oss/bucket/queryAll', viewInfo.page, (data: BaseListResult<TbBucket>) => {
    if (data.success) {
      viewInfo.list = data.list
      data.list.forEach((item) => {
        selectViewInfo.list.push({
          label: item.bucketBaseName,
          value: item.obid,
        })
      })
    }
  })
}

// 浏览文件
const browseFile = () => {
  clearFiles()
  viewInfo.uploadInfo.length = 0
  tools.openFile((files: Array<FileInfo>) => {
    viewInfo.filinfos = files
    for (let index = 0; index < viewInfo.filinfos.length; index++) {
      const fileinfo = viewInfo.filinfos[index]
      let uploadInfo = new UploadInfo()
      uploadInfo.info = '文件名：' + fileinfo.name
      uploadInfo.percent = 0
      viewInfo.uploadInfo.push(uploadInfo)
    }
  })
  // , 'image/*'
}
const emit = defineEmits(['addossinfo-laoing'])
const uploadFile = () => {
  refs.value?.validate((error) => {
    if (!error) {
      viewInfo.loading = true
      // 获取签名
      server.post('/oss/bucket/sign', { obid: viewInfo.bucket.obid }, (data: BaseDataResult<OssSign>) => {
        if (!data.success) {
          viewInfo.loading = false
          clearFiles()
          viewInfo.uploadInfo.length = 0
          return
        }
        ossSign = data.data
        logger.debug('签名信息：', ossSign, '===文件信息：')
        viewInfo.uploadCount = viewInfo.filinfos.length
        // 组织上传信息
        for (let index = 0; index < viewInfo.filinfos.length; index++) {
          const fileinfo = viewInfo.filinfos[index]
          let indexInfo = index == 0 ? '' : '-' + index
          const objectName = ossSign.objectName + indexInfo + fileinfo.suffix
          let ossuplader = new OssUploader(new OssUploadConfig(), new UploadOssInfo(ossSign.host, objectName, ossSign.policyBase64, ossSign.accessid, ossSign.signature), fileinfo)

          ossuplader.uploader.bind('Init', () => {
            logger.debug('upload初始化')
          })

          ossuplader.uploader.bind('FilesAdded', (uploader: plupload.Uploader, file: File) => {
            logger.debug('upload添加文件', file)
          })

          ossuplader.uploader.bind('PostInit', () => {
            logger.debug('upload初始化完成')
          })

          ossuplader.uploader.bind('Error', (uploader: plupload.Uploader, err: any) => {
            logger.error('upload发生错误：', err)
            viewInfo.uploadCount--
            let uploadInfo = viewInfo.uploadInfo[index]
            uploadInfo.info = '上传' + fileinfo.name + '发生错误'
            uploadInfo.success = false
            uploadInfo.errorInfo = err
          })

          ossuplader.uploader.bind('BeforeUpload', (uploader: plupload.Uploader, file: File) => {
            logger.debug('开始上传:', file)
            let uploadInfo = viewInfo.uploadInfo[index]
            uploadInfo.info = '开始上传：' + file.name
            uploadInfo.percent = 0
          })

          ossuplader.uploader.bind('UploadProgress', (uploader: any, file: any) => {
            let uploadInfo = viewInfo.uploadInfo[index]
            uploadInfo.percent = file.percent
            logger.debug('上传:', file)
          })

          ossuplader.uploader.bind('FileUploaded', (uploader: plupload.Uploader, file: File) => {
            logger.debug('上传完成：', file)
            let uploadInfo = viewInfo.uploadInfo[index]
            uploadInfo.percent = 100
            uploadInfo.info = file.name + '上传完毕'
          })
          ossuplader.uploader.bind('UploadComplete', () => {
            let uploadInfo = viewInfo.uploadInfo[index]
            if (uploadInfo.success) {
              // 保存到数据库
              let info = new TbOssInfo()
              info.obid = viewInfo.bucket.obid
              info.objectName = ossuplader.ossinfo.key
              info.filename = ossuplader.fileinfo.name
              info.filesize = ossuplader.fileinfo.size
              info.fileinfo = viewInfo.fileinfo
              info.contentType = ossuplader.fileinfo.fulltype
              saveOssInfo(info, index)
            }
            if (viewInfo.uploadCount <= 0) {
              viewInfo.loading = false
              clearFiles()
            }
          })
          ossuplader.start()
        }
      })
    }
  })
}
const saveOssInfo = (info: TbOssInfo, index: number) => {
  server.post('/oss/ossinfo/add', info, (data: BaseResult) => {
    let uploadInfo = viewInfo.uploadInfo[index]
    uploadInfo.percent = 100
    uploadInfo.info = '保存上传文件信息' + info.filename + '完毕'
    viewInfo.uploadCount--
    if (viewInfo.uploadCount <= 0) {
      viewInfo.loading = false
      clearFiles()
      emit('addossinfo-laoing', false)
      // viewInfo.uploadInfo.push('所有文件上传完毕')
    }
  })
}

const clearFiles = () => {
  logger.debug('清除文件')
  viewInfo.filinfos.length = 0
}
const refs = ref<FormInst | null>(null)
queryBucket()
const Rules: FormRules = {
  fileInfo: [
    {
      required: true,
      message: '文件描述信息不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  obid: [
    {
      required: true,
      message: 'bucket信息不能为空',
      trigger: ['input', 'blur'],
    },
  ],
}
</script>

<template>
  <div>
    <!-- <div v-if="viewInfo.filinfos.length > 0">
      <span v-for="d in viewInfo.filinfos" :key="d.name">{{ d.name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </div> -->
    <!-- <div v-else> 请选择上传的文件 </div> -->
    <NForm ref="refs" :rules="Rules" :model="viewInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
      <NFormItem label="文件描述信息" path="fileinfo">
        <NInput v-model:value="viewInfo.fileinfo" placeholder="文件描述信息"></NInput>
      </NFormItem>
      <NFormItem label="bucket信息" path="bucket.obid">
        <NSelect v-model:value="viewInfo.bucket.obid" :options="selectViewInfo.list"> </NSelect>
      </NFormItem>
      <NFormItem>
        <NButton class="mr05" id="ossupload_selectfiles" type="primary" size="medium" :disabled="viewInfo.loading" @click="browseFile">浏览文件...</NButton>
        <NButton class="mr05" :disabled="viewInfo.filinfos.length == 0 || viewInfo.bucket.obid == -1 || viewInfo.loading" type="primary" size="medium" @click="uploadFile">上传</NButton>
      </NFormItem>
    </NForm>
    <div>
      <div class="pd10" v-for="d in viewInfo.uploadInfo">
        <div>{{ d.info }}</div>
        <div v-if="d.success">
          <n-progress type="line" status="default" :indicator-placement="'inside'" :percentage="d.percent" />
        </div>
        <div v-else> 上传发生错误: {{ d.errorInfo.message }} </div>
      </div>
    </div>
  </div>
</template>
