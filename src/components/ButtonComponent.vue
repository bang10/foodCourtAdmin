<script setup lang="ts">
const props = defineProps<{
  text: string;
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
}>();

const emit = defineEmits(['click']);

const buttonStyle = {
  backgroundColor: '#FFA500', // 연한 오렌지색
  color: '#FFFFFF' // 텍스트 색상은 흰색
};

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <q-btn
    :label="text"
    :size="size"
    :style="buttonStyle"
    @click="handleClick"
    unelevated
  />
</template>
