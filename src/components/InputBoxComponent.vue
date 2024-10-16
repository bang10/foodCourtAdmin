<script setup lang="ts">
import { ref, computed } from 'vue';
import { QInput, QSelect, QDialog, QDate, QIcon } from 'quasar';

interface DropdownOption {
  key: string | number;
  value: string;
}

const props = defineProps<{
  label: string;
  prependText: string;
  isDropdown: boolean;
  dropdownOptions?: DropdownOption[];
  size: string;
  isDisabled: boolean;
  isDate: boolean;
}>();

const inputValue = ref<string | number | null>(null);
const selectedKey = ref<string | number | null>(null);
const showCalendar = ref(false);

const formattedDate = computed(() => {
  if (typeof inputValue.value === 'string' || typeof inputValue.value === 'number') {
    const date = new Date(inputValue.value);
    return date.toLocaleDateString();
  }
  return '';
});

const inputStyle = {
  borderColor: '#d3d3d3',
  borderWidth: '1px'
};

const onDateSelect = (date: string) => {
  inputValue.value = date;
  showCalendar.value = false;
};
</script>

<template>
  <q-input
    v-if="!isDropdown && !isDate"
    v-model="inputValue"
    :label="label"
    :disable="isDisabled"
    :style="inputStyle"
    :size="size"
    outlined
    autofocus>
    <template v-slot:prepend>
      <span>{{ prependText }}</span>
    </template>
  </q-input>

  <q-select
    v-if="isDropdown"
    v-model="selectedKey"
    :options="dropdownOptions"
    :disable="isDisabled"
    :label="label"
    :size="size"
    outlined
  >
    <template v-slot:prepend>
      <span>{{ prependText }}</span>
    </template>
  </q-select>

  <q-input
    v-if="isDate"
    v-model="formattedDate"
    :label="label"
    :disable="true"
    :style="inputStyle"
    :size="size"
    outlined
    autofocus>
    <template v-slot:prepend>
      <span>{{ prependText }}</span>
    </template>
    <template v-slot:append>
      <q-icon name="event" @click="showCalendar = true" />
    </template>
  </q-input>

  <q-dialog v-model="showCalendar">
    <q-date v-model="inputValue" @update:model-value="onDateSelect"  bordered/>
  </q-dialog>
</template>
