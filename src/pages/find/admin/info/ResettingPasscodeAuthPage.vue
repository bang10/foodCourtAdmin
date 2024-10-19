<script setup lang="ts">
import ButtonComponent from 'components/ButtonComponent.vue';
import { reactive, ref, watch, watchEffect } from 'vue';
import { confirmMessage } from 'components/util/Common';
import apiResponse from 'components/util/request/ApiResponse';

const props = defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits(['close']);

const isOpenDialog = ref(props.isOpen.valueOf());

const defaultFindPw = {
  userId: '',
  passcode: '',
  passcodeCheck: '',
  userName: '',
  code: '',
  tellNumber: ''
};
const findPwDto = reactive({ ...defaultFindPw });

const validation = {
  pw: [val => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,20}$/.test(val) || '비밀번호는 대소문자, 숫자, 특수문자 조합으로 12~20자입니다.']
  , pwCheck: [val => val == findPwDto.passcode || '비밀번호가 일치하지 않습니다.']
};

const isSendSmsResetPw = ref(false);
const isCheckSmsPw = ref(false);
const isSuccessPwCheck = ref(false);

const isDialogCancel = () => {
  if (window.confirm(confirmMessage)) {
    emit('close');
  }
};

const sendSms = async () => {
  const header = { 'Content-Type': 'application/json' };
  const response = await apiResponse<boolean>(
    'POST'
    , '/api-1/auth/send/sms'
    , { tellNumber: findPwDto.tellNumber }
    , header
  );

  window.alert(response.message);
  isSendSmsResetPw.value = response.result;
};

const checkSms = async () => {
  const param = {
    code: findPwDto.code
    , tellNumber: findPwDto.tellNumber
    , userId: findPwDto.userId
    , userName: findPwDto.userName
  };
  const header = { 'Content-Type': 'application/json' };
  const response = await apiResponse<boolean>(
    'POST'
    , '/admin/api-1/check/code/reset/find'
    , param
    , header
  );

  isSuccessPwCheck.value = response.result.valueOf();
  window.alert(response.message);
};

const resetPasscode = async () => {
  if (!isSendSmsResetPw.value) {
    alert('비정상적인 접근입니다.');
    return;
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,20}$/.test(findPwDto.passcode)) {
    window.alert('비밀번호 형식에 맞춰주세요.');
    return;
  }

  if (findPwDto.passcode != findPwDto.passcodeCheck) {
    window.alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  const param = {
    userId: findPwDto.userId,
    userName: findPwDto.userName,
    tellNumber: findPwDto.tellNumber,
    passcode: findPwDto.passcode,
    passcodeCheck: findPwDto.passcodeCheck
  };
  const header = { 'Content-Type': 'application/json' };
  const response = await apiResponse<boolean>(
    'POST'
    , '/admin/api-1/reset/code'
    , param
    , header
  );

  window.alert(response.message);
  const result = response.result.valueOf();
  if (result) {
    emit('close');
    return;
  }
};

watch(() => props.isOpen, (newValue) => {
  isOpenDialog.value = newValue;
  if (!isOpenDialog.value) {
    Object.assign(findPwDto, defaultFindPw);

    isCheckSmsPw.value = false;
    isSuccessPwCheck.value = false;
    isSendSmsResetPw.value = false;
  }
});

watchEffect(() => {
  if (!isSuccessPwCheck.value) {
    Object.assign(findPwDto, defaultFindPw);
    isSendSmsResetPw.value = false;
    isCheckSmsPw.value = false;
    isSuccessPwCheck.value = false;
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

  <q-dialog v-model="isOpenDialog" v-if="isSuccessPwCheck" persistent>
    <q-card style="width: 25%; height: 40%;">
      <q-card-section>
        관리자 비밀번호 초기화
      </q-card-section>
      <q-card-section>
        <q-input
          class="dialog-input col-10 q-mb-sm"
          v-model="findPwDto.passcode"
          type="password"
          label="비밀번호"
          :rules="validation.pw"
          outlined
          autofocus
        />

        <q-input
          class="dialog-input col-10 q-mb-sm"
          v-model="findPwDto.passcodeCheck"
          type="password"
          label="비밀번호 재입력"
          :rules="validation.pwCheck"
          outlined
          autofocus
        />
      </q-card-section>
      <div class="row flex justify-evenly">
        <ButtonComponent
          size="md"
          text="재설정"
          color="orange"
          @click="resetPasscode"
        />
        <ButtonComponent
          size="md"
          text="창닫기"
          color="primary"
          @click="isDialogCancel"
        />
      </div>

    </q-card>
  </q-dialog>
</template>

