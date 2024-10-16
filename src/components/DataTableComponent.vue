<script setup lang="ts">
import { ref, computed } from 'vue';
import { QTable, QTd, QBtn, QTooltip, QPagination } from 'quasar';

interface TableColumn {
  name: string;
  label: string;
  field: string | ((row: any) => any);
}

interface TableRow {
  [key: string]: any;
}

const props = defineProps<{
  columns: TableColumn[];
  data: TableRow[];
  cellSize: string;
}>();

const emit = defineEmits(['buttonClick']);

const tableColumns = ref(props.columns);

// 페이지네이션 관련 상태
const pagination = ref({
  page: 1,
  rowsPerPage: 20
});

// 전체 데이터 개수
const totalDataCount = computed(() => {
  return props.data.length > 50 ? 50 : props.data.length; // 최대 50개로 제한
});

// 페이지당 데이터 목록
const paginatedData = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
  return processedData.value.slice(start, start + pagination.value.rowsPerPage);
});

// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(totalDataCount.value / pagination.value.rowsPerPage);
});

const processedData = computed(() => {
  return props.data.map(row => {
    const newRow: TableRow = {};
    for (const key in row) {
      if (row[key] === null || row[key] === undefined) {
        newRow[key] = typeof row[key] === 'number' ? 0 : '';
      } else {
        newRow[key] = row[key];
      }
    }
    return newRow;
  }).slice(0, 50); // 50개로 제한
});

const cellStyle = computed(() => ({
  width: props.cellSize,
  height: props.cellSize,
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));

const tooltip = ref({
  visible: false,
  text: ''
});

const showTooltip = (text: string) => {
  tooltip.value.text = text;
  tooltip.value.visible = true;
};

const hideTooltip = () => {
  tooltip.value.visible = false;
};

const isButton = (col: TableColumn) => {
  return typeof col.field === 'string' && col.field.includes('button');
};

const handleButtonClick = (row: TableRow) => {
  emit('buttonClick', row);
};

const formatData = (data: any) => {
  if (data === null || data === undefined) {
    return typeof data === 'number' ? 0 : '';
  }
  return data;
};

// 페이지 업데이트 핸들러
const updatePage = (page: number) => {
  pagination.value.page = page;
};
</script>

<template>
  <div>
    <q-table
      :rows="paginatedData"
      :columns="tableColumns"
      row-key="id"
      flat
      :pagination="pagination"
      :style="{ maxHeight: '400px', overflowY: 'auto' }"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props" :style="cellStyle" @mouseover="showTooltip(props.row[props.col.field])" @mouseleave="hideTooltip">
          <div v-if="isButton(props.col)">
            <q-btn
              :label="props.row[props.col.field]"
              size="sm"
              @click="() => handleButtonClick(props.row)"
            />
          </div>
          <div v-else>
            {{ formatData(props.row[props.col.field]) }}
          </div>
        </q-td>
      </template>

      <q-tooltip v-model="tooltip.visible" :offset="[10, 10]">{{ tooltip.text }}</q-tooltip>
    </q-table>

    <q-pagination
      v-model="pagination.page"
      :max="totalPages"
      :rows-per-page-options="[20]"
      @update:page="updatePage"
      color="primary"
      class="q-mt-md"
    />
  </div>
</template>
