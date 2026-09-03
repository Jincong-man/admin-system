<script setup>
import gsap from 'gsap'
import { ref, watch } from 'vue'
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
const d = ref({
    num: 0

})

function countTo() {
    gsap.to(d.value, {
        duration: 1,
        num: props.value,

    })
}
countTo()
watch(() => props.value, () => countTo())
</script>

<template>
    {{ d.num.toFixed(2) }}
</template>

<style scoped></style>
