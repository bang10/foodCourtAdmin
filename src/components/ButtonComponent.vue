<script setup lang="ts">
const props = defineProps<{
  text: string;
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  color: 'orange' | 'primary'
}>();

const emit = defineEmits(['click']);

const buttonStyle = () => {
  if (!props.color || props.color == 'orange') {
    return {
      backgroundColor: '#FFA500', // 연한 오렌지색
      color: '#FFFFFF' // 텍스트 색상은 흰색
    }
  }

  return {
    backgroundColor: '#0252ec', // 연한 오렌지색
    color: '#FFFFFF' // 텍스트 색상은 흰색
  }

};

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <q-btn
    class="round"
    :label="text"
    :size="size"
    :style="buttonStyle()"
    @click="handleClick"
    unelevated
  />
</template>
