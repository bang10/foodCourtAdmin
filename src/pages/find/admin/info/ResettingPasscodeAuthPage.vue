<script setup lang="ts">
import ButtonComponent from 'components/ButtonComponent.vue';
import { reactive, ref, watch, watchEffect } from 'vue';
import { confirmMessage } from 'components/util/Common';
import apiResponse from 'components/util/request/ApiResponse';

const props = defineProps<{
  isOpen: boolean;
}>()
const emit = defineEmits(['close']);

const isOpenDialog = ref(props.isOpen.valueOf());

const defaultFindPw = {
  userId: '',
  passcode: '',
  passcodeCheck: '',
  userName: '',
  code: '',
  tellNumber: ''
}
const findPwDto = reactive({ ...defaultFindPw });

const isSendSmsResetPw = ref(false);
const isCheckSmsPw = ref(false);
const isSuccessPwCheck = ref(true);

const isDialogCancel = () => {
  if (window.confirm(confirmMessage)) {
    emit('close')
  }
}

const sendSms = async () => {
  const header = {'Content-Type': 'application/json'}
  const response = await apiResponse<boolean>(
    'POST'
    , '/api-1/auth/send/sms'
    , { tellNumber: findPwDto.tellNumber }
    , header
  );

  window.alert(response.message);
  isSendSmsResetPw.value = response.result
}

const checkSms = async () => {
  const param = {
    code: findPwDto.code
    , tellNumber: findPwDto.tellNumber
    , userId: findPwDto.userId
    , userName: findPwDto.userName
  };
  const header = {'Content-Type': 'application/json'}
  const response = await apiResponse<boolean>(
    'POST'
    , '/admin/api-1/check/code/reset/find'
    , param
    , header
  );

  isSuccessPwCheck.value = response.result.valueOf();
  window.alert(response.message);
}

watch(() => props.isOpen, (newValue) => {
  isOpenDialog.value = newValue;
  if (!isOpenDialog.value) {
    Object.assign(findPwDto, defaultFindPw)

    isCheckSmsPw.value = false
    isSuccessPwCheck.value = false
  }
});

</script>

<template>
  <q-dialog v-model="isOpenDialog" v-if="!isSuccessPwCheck" persistent>
    <q-card style="width: 25%; height: 51%;">
      <q-card-section>
        관리자 비밀번호 초기화
      </q-card-section>
      <q-card-section>
        <q-input
          class="dialog-input col-10 q-mb-sm"
          v-model="findPwDto.userId"
          type="text"
          label="ID"
          outlined
          autofocus
        >
        </q-input>

        <q-input
          class="dialog-input col-10 q-mb-sm"
          v-model="findPwDto.userName"
          type="text"
          label="이름"
          outlined
          autofocus
        >
        </q-input>

        <q-input
          class="dialog-input col-10 q-mb-sm"
          v-model="findPwDto.tellNumber"
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
          class="dialog-input col-10"
          v-model="findPwDto.code"
          v-if="isSendSmsResetPw"
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
      <div class="row" style="margin-left: 40%;">
        <div>
          <ButtonComponent
            size="md"
            text="창닫기"
            color="primary"
            @click="isDialogCancel"
          />
        </div>
      </div>

    </q-card>
  </q-dialog>

</template>

