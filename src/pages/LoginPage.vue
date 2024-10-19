<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import ButtonComponent from 'components/ButtonComponent.vue';
import apiResponse from 'components/util/request/ApiResponse';
import FindAdminId from 'pages/find/admin/info/FindAdminIdPage.vue';
import { confirmMessage } from 'components/util/Common';
import ResettingPasscodeAuthPage from 'pages/find/admin/info/ResettingPasscodeAuthPage.vue';

// 로그인
const loginInfo = reactive({
  userId: '',
  passcode: ''
});
const code = ref(''); // 로그인 관리자 인증
const isSuccessLogin = ref(false);

// ID찾기
const isClickFindId = ref(false);
const clickOpenFindIdDialog = () => {
  isClickFindId.value = true;
}
const clickCloseFindIdDialog = () => {
  isClickFindId.value = false;
}

// PW 찾기
const isClickPassword = ref(false);
const clickOpenFindPwDialog = () => {
  isClickPassword.value = true
}
const clickCloseFindPwDialog = () => {
  isClickPassword.value = false
}

const clickLogin = async () => {
  try {
    const param = { ...loginInfo }
    const header = {'Content-Type': 'application/json'}

    const response = await apiResponse<boolean>(
      'POST'
      ,'/admin/api-1/login'
      , param
      , header
    );

    isSuccessLogin.value = response.result.valueOf();
    window.alert(response.message);
    return;

  } catch (error) {
    console.log("error: " + error);
  }
}

const checkAuthNumber = async () => {
  try {
    const param = {
      userId: loginInfo.userId,
      code: code.value
    }

    const header = {'Content-Type': 'application/json'}

    const response = await apiResponse<string>(
      'POST'
      ,'/admin/api-1/check/code/div'
      , param
      , header
    );

    window.alert(response.message);
    const responseInfo = response.result.valueOf();
    if (responseInfo) {
      isSuccessLogin.value = !!responseInfo
      // TODO 값 전역변수
    }

  } catch (e) {
    console.error(e)
  }
}

const isDialogCancel = () => {
  if (confirm(confirmMessage)) {
    if (isSuccessLogin.value) isSuccessLogin.value = false;
  }
}

watchEffect(() => {
  if (!isSuccessLogin.value) {
    code.value = ''
  }
})

</script>


<template>
  <div class="">
    <div style="margin-left: 30%; margin-right: 30%; margin-top: 15%;">
      관리자 ERP
      <q-input
        class="col-md-10"
        label="ID"
        v-model="loginInfo.userId"
        type="text"
        outlined
        autofocus
      >
        <template v-slot:prepend>
          <span>ID</span>
        </template>
      </q-input>

      <div style="margin-top: 1vh;">
        <q-input
          class="col-12"
          label="비밀번호"
          v-model="loginInfo.passcode"
          type="password"
          outlined
          autofocus
        >
          <template v-slot:prepend>
            <span>PW</span>
          </template>
        </q-input>
      </div>

      <div class="flex justify-evenly q-ma-sm">
        <div>
          <ButtonComponent
            size="md"
            text="로그인"
            color="orange"
            @click="clickLogin"
          />
        </div>

        <div class="flex">
          <div class="q-mr-sm">
            <ButtonComponent
              size="md"
              text="ID 찾기"
              color="primary"
              @click="clickOpenFindIdDialog"
            />
          </div>

          <ButtonComponent
            size="md"
            text="비밀번호 재설정"
            color="primary"
            @click="clickOpenFindPwDialog"
          />
        </div>
      </div>
    </div>
    <!-- 인증 팝업 다이어로그 -->
    <q-dialog v-model="isSuccessLogin" persistent>
      <q-card style="width: 20%; height: 25%;">
        <q-card-section>
          관리자 인증
        </q-card-section>
        <q-input
          class="dialog-input"
          label="인증번호"
          type="text"
          v-model="code"
        >
          <template v-slot:append>
            <ButtonComponent
              size="md"
              text="인증하기"
              color="orange"
              @click="checkAuthNumber"
            />
          </template>
        </q-input>
        <div style="margin-left: 15vh;">
          <ButtonComponent
            size="md"
            text="취소"
            color="primary"
            @click="isDialogCancel"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- ID 찾기 다이어로그 -->
    <FindAdminId
      :isOpen="isClickFindId"
      @close="clickCloseFindIdDialog"
    />

    <!-- TODO PW 초기화 다이어로그 -->
    <ResettingPasscodeAuthPage
      :isOpen="isClickPassword"
      @close="clickCloseFindPwDialog"
    />
  </div>
</template>
