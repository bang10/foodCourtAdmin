<script setup lang="ts">
import ButtonComponent from 'components/ButtonComponent.vue';
import { reactive, ref, watch, watchEffect } from 'vue';
import apiResponse from 'src/request/ApiResponse';

const props = defineProps<{
  isOpen: boolean;
}>()
const emit = defineEmits(['close']);

const isOpenDialog = ref(props.isOpen.valueOf());

const findIdDto = reactive({
  userName: '',
  tellNumber: '',
  code: ''
});

const isSendSmsFindId = ref(false); // ID 찾기의 인증번호 전송 여부
const isCheckSmsId = ref(false);
const isSuccessFindId = ref(false);
const foundMemberId = ref('')

const sendSms = async () => {
  const header = {'Content-Type': 'application/json'}
  const response = await apiResponse<boolean>(
    'POST'
    , '/api-1/auth/send/sms'
    , {tellNumber: findIdDto.tellNumber}
    , header
  );

  window.alert(response.message);
  isSendSmsFindId.value = response.result.valueOf()
}

const checkSms = async () => {
  let param = {
    code: findIdDto.code
    , requestRedisType: 'manage'
    , sendTo: findIdDto.tellNumber
  }

  const header = {'Content-Type': 'application/json'}
  const response = await apiResponse<boolean>(
    'POST'
    , '/api-1/auth/check/sms'
    , param
    , header
  );

  window.alert(response.message);
  isCheckSmsId.value = response.result.valueOf()
}

const requestFindId = async () => {
  let param = { ...findIdDto }
  const header = {'Content-Type': 'application/json'}
  const response = await apiResponse<string>(
    'POST'
    , '/admin/api-1/check/code/manage'
    , param
    , header
  );

  const result = response.result.valueOf();
  window.alert(response.message);
  if (result) {
    isSuccessFindId.value = true
    foundMemberId.value = result
  }
}

const isDialogCancel = () => {
  emit('close')
}

watch(() => props.isOpen, (newValue) => {
  isOpenDialog.value = newValue;
})

</script>

<template>
  <q-dialog v-model="isOpenDialog" persistent>
    <q-card>
      <q-card-section>
        관리자 ID 찾기
      </q-card-section>
      <q-card-section>
        <q-input
          class="dialog-input col-10 q-mb-sm"
          v-model="findIdDto.userName"
          type="text"
          label="이름"
          outlined
          autofocus
        >
        </q-input>

        <q-input
          class="dialog-input col-10 q-mb-sm"
          v-model="findIdDto.tellNumber"
          type="tel"
          label="전화번호"
          outlined
          autofocus
        >
          <template v-slot:append>
            <ButtonComponent
              size="md"
              text="인증번호 전송"
              color="orange"
              @click="sendSms"
            />
          </template>
        </q-input>

        <q-input
          v-if="isSendSmsFindId"
          class="dialog-input col-10"
          v-model="findIdDto.code"
          type="tel"
          label="인증번호"
          outlined
          autofocus
        >
          <template v-slot:append>
            <ButtonComponent
              size="md"
              text="인증번호 확인"
              color="orange"
              @click="checkSms"
            />
          </template>
        </q-input>
      </q-card-section>
      <div class="row" style="margin-left: 25%;">
        <div style="margin-right: 10%;">
          <ButtonComponent
            size="md"
            text="ID 찾기"
            color="orange"
            @click="requestFindId"
          />
        </div>

        <div>
          <ButtonComponent
            size="md"
            text="창닫기"
            color="primary"
            @click="isDialogCancel"
          />
        </div>
      </div>

      <q-card-section v-if="isSuccessFindId">
        <div style="margin-left: 32%;" class="flex">
          ID는
          <div style="color: red;">
            {{ foundMemberId }}
          </div>
          입니다.
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
