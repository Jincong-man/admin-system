<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/imageAside.vue'
import ImageMain from '~/components/imageMain.vue'
const dialogVisible = ref(false)


const ImageAsideRef = ref(null)
const handleOpenDrawer = () => ImageAsideRef.value.openDrawer()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => {
    ImageMainRef.value.loadData(image_class_id)
}

const handleOpenUpload = () => {
    ImageMainRef.value.openUploadFile()
}

const props = defineProps({
    modelValue: [String, Array]
})
const emit = defineEmits(['update:modelValue'])
let urls = []
const handleChoose = (image) => {
    urls = image.map(o => o.url)
}
const submit = () => {
    if(urls.length){
        emit('update:modelValue', urls[0])
    }
    dialogVisible.value = false
}
</script>
<template>
    <div v-if="modelValue">
        <el-image :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
    </div>

    <div class="choose-image-btn" @click="dialogVisible = true">
        <el-icon :size="25">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
        <el-container class="bg-white rounded" style="height: 70vh;">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleOpenDrawer">添加图片分类</el-button>
                <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
            </el-header>
            <el-container>
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
                <ImageMain openChoose ref="ImageMainRef" @choose="handleChoose" />
            </el-container>
        </el-container>
        <span></span>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>

</template>
<style scoped>
.choose-image-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border: 1px solid #3c7bda;
    border-radius: 5px;
    cursor: pointer;
}

.choose-image-btn:hover {
    background-color: #10c3f0;
    color: white;
}
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>