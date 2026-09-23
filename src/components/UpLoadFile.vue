<script setup>
import { ref } from 'vue'
import { upLoadImageAction } from '~/api/image'
import { getToken } from '~/composables/auth'
import { toast } from '~/composables/util'
const token = getToken()

const emit = defineEmits(['success'])
const upLoadSuccess = (response, uploadFile, uploadFiles) => {
    console.log(response)
    emit('success', {
        response, uploadFile, uploadFiles
    })
}
const upLoadError = (error, uploadFile, uploadFiles) => {
    let msg = JSON.parse(error.message).msg || '上传失败'
    toast(msg, 'error')
}
defineProps({
    data: Object,
})
</script>

<template>
    <el-upload drag :action="upLoadImageAction" multiple :headers="{ token }" name="img" :data="data"
        :on-success="upLoadSuccess" :on-error="upLoadError">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
            </div>
        </template>
    </el-upload>
</template>
