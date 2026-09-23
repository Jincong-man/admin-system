<script setup>

</script>

<template>
 <router-view></router-view>
</template>

<style>
body {
    @apply bg-gray-100;
}
#nprogress .bar {
    background: #7133bd !important;
    height: 3px !important;
}
::-webkit-scrollbar {
    width: 4px;
    height: 6px;
}
::-webkit-scrollbar-corner {
    display: block;
}
::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 8px;
}
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
    border-right-color: transparent;
    border-left-color: transparent;
}
</style>
