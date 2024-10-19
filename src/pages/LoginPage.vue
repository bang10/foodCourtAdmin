<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import ButtonComponent from 'components/ButtonComponent.vue';
import apiResponse from 'src/request/ApiResponse';
import FindAdminId from 'pages/FindAdminId.vue';

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
const findPwDto = reactive({
  userId: '',
  passcode: '',
  passcodeCheck: '',
  userName: '',
  code: '',
  tellNumber: ''
});
const isClickPassword = ref(false);
const isCheckSmsPw = ref(false);
const isSuccessPwCheck = ref(false);

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

const clickResetMemberPasscode = () => {
  isClickPassword.value = true
}

const isDialogCancel = () => {
  if (isSuccessLogin.value) isSuccessLogin.value = false;
  if (isClickFindId.value) isClickFindId.value = false;
  if (isClickPassword.value) isClickPassword.value = false;
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

watchEffect(() => {
  if (!isSuccessLogin.value) {
    code.value = ''
  }

  if (!isClickPassword.value) {
    findPwDto.userId = ''
    findPwDto.passcode = ''
    findPwDto.passcodeCheck = ''
    findPwDto.userName = ''
    findPwDto.code = ''
    findPwDto.tellNumber = ''
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
            @click="clickResetMemberPasscode"
          />
        </div>
      </div>
    </div>
    <!-- 인증 팝업 다이어로그 -->
    <q-dialog v-model="isSuccessLogin">
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

    <!-- 다이어로그 -->
    <FindAdminId
      :isOpen="isClickFindId"
      @close="clickCloseFindIdDialog"
    />

    <!-- TODO PW 초기화 다이어로그 -->
<!--    <q-dialog v-model="isClickPassword">-->
<!--      <q-card style="width: 25%; height: 51%;">-->
<!--        <q-card-section>-->
<!--          관리자 비밀번호 초기화-->
<!--        </q-card-section>-->
<!--        <q-card-section>-->
<!--          <q-input-->
<!--            class="dialog-input col-10 q-mb-sm"-->
<!--            v-model="findPwDto.userId"-->
<!--            type="text"-->
<!--            label="ID"-->
<!--            outlined-->
<!--            autofocus-->
<!--          >-->
<!--          </q-input>-->

<!--          <q-input-->
<!--            class="dialog-input col-10 q-mb-sm"-->
<!--            v-model="findPwDto.userName"-->
<!--            type="text"-->
<!--            label="이름"-->
<!--            outlined-->
<!--            autofocus-->
<!--          >-->
<!--          </q-input>-->

<!--          <q-input-->
<!--            class="dialog-input col-10 q-mb-sm"-->
<!--            v-model="findPwDto.tellNumber"-->
<!--            type="tel"-->
<!--            label="전화번호"-->
<!--            outlined-->
<!--            autofocus-->
<!--          >-->
<!--            <template v-slot:append>-->
<!--              <ButtonComponent-->
<!--                size="md"-->
<!--                text="인증번호 전송"-->
<!--                color="orange"-->
<!--                @click="checkAuthNumber"-->
<!--              />-->
<!--            </template>-->
<!--          </q-input>-->

<!--          <q-input-->
<!--            class="dialog-input col-10"-->
<!--            v-model="findPwDto.code"-->
<!--            type="tel"-->
<!--            label="인증번호"-->
<!--            outlined-->
<!--            autofocus-->
<!--          >-->
<!--            <template v-slot:append>-->
<!--              <ButtonComponent-->
<!--                size="md"-->
<!--                text="인증번호 확인"-->
<!--                color="orange"-->
<!--                @click="checkSms"-->
<!--              />-->
<!--            </template>-->
<!--          </q-input>-->
<!--        </q-card-section>-->
<!--        <div class="row" style="margin-left: 40%;">-->
<!--          <div>-->
<!--            <ButtonComponent-->
<!--              size="md"-->
<!--              text="창닫기"-->
<!--              color="primary"-->
<!--              @click="isDialogCancel"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->

<!--      </q-card>-->
<!--    </q-dialog>-->
    <!-- PW 초기화 다이어로그 -->

    <!-- TODO PW 재설정 -->
    <q-dialog v-if="isCheckSmsPw">

    </q-dialog>
    <!-- PW 재설정 -->
  </div>
</template>
