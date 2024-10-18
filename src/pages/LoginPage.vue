<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import ButtonComponent from 'components/ButtonComponent.vue';
import { dom } from 'quasar';
import apiResponse from 'src/request/ApiResponse';

const userInfo = reactive({
  userId: '',
  passcode: ''
});

const code = ref('')

const isSuccessLogin = ref(false)

const clickLogin = async () => {
  try {
    const param = { ...userInfo }
    const header = {'Content-Type': 'application/json'}

    const response = await apiResponse<Boolean>(
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

const clickFindMemberId = () => {
  console.log("clickFindMemberId")
}

const clickResetMemberPasscode = () => {
  console.log("clickResetMemberPasscode")
}

const checkAuthNumber = async () => {
  try {
    const param = {
      userId: userInfo.userId,
      code: code.value
    }

    const header = {'Content-Type': 'application/json'}

    const response = await apiResponse<String>(
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
  console.log({ ...userInfo })
})

</script>


<template>
  <div class="">
    <div style="margin-left: 30%; margin-right: 30%; margin-top: 15%;">
      <q-input
        class="col-md-10"
        label="ID"
        v-model="userInfo.userId"
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
          v-model="userInfo.passcode"
          type="password"
          outlined
          autofocus
        >
          <template v-slot:prepend>
            <span>PW</span>
          </template>
        </q-input>
      </div>
      <div class="button-container" style="margin-top: 1vh;">
        <ButtonComponent
          size="md"
          text="로그인"
          @click="clickLogin"
        />
        <div class="inner-button">
          <ButtonComponent
            size="md"
            text="ID 찾기"
            @click="clickFindMemberId"
          />

          <ButtonComponent
            size="md"
            text="비밀번호 재설정"
            @click="clickResetMemberPasscode"
          />
        </div>
      </div>
    </div>
    <!-- 팝업 다이어로그 -->
    <q-dialog v-model="isSuccessLogin">
      <q-card style="width: 20%; height: 20%;">
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
              @click="checkAuthNumber"
            />
          </template>
        </q-input>
      </q-card>
    </q-dialog>
    <!-- 다이어로그 -->
  </div>
</template>
