<script setup>
const iconNavs = [
    {
        icon: 'user',
        color: 'text-purple-500',
        title: '用户',
        path: '/user/list',
    },
    {
        icon: 'Goods',
        color: 'text-yellow-500',
        title: '商品',
        path: '/goods/list',
    },
    {
        icon: 'Document',
        color: 'text-green-500',
        title: '订单',
        path: '/order/list',
    },//评价
    {
        icon: 'Comment',
        color: 'text-blue-500',
        title: '评价',
        path: '/comment/list',
    },//图库
    {
        icon: 'Picture',
        color: 'text-pink-500',
        title: '图库',
        path: '/image/list',
    },//公告
    {
        icon: 'Notification',
        color: 'text-red-500',
        title: '公告',
        path: '/notice/list',
    },//配置
    {
        icon: 'Setting',
        color: 'text-gray-500',
        title: '配置',  
        path: '/setting/base',
    },//优惠卷
    {
        icon: 'Ticket',
        color: 'text-indigo-500',
        title: '优惠卷',
        path: '/coupon/list',
    }
]
</script>
<template>
    <el-row :gutter="20" class="mt-5">
        <el-col :span="3" :offset="0" v-for="(item, index) in iconNavs" :key="index">
            <el-card shadow="hover" @click="$router.push(item.path)">
                <div class="flex flex-col items-center justify-center cursor-pointer">
                    <el-icon :size="20" :class="item.color">
                        <component :is="item.icon" />
                    </el-icon>
                    <span class="text-sm mt-2">{{ item.title }}</span>

                </div>
                <!-- card body -->
            </el-card>

        </el-col>
    </el-row>

</template>



<style scoped></style>
