import React, { useState } from 'react'
import { Button, Container, Grid, TextField, Typography, Link } from "@mui/material";
import { API_BASE_URL as BASE, USER } from '../../config/host-config';

// 리다이렉트 사용하기
import { useNavigate } from 'react-router-dom';

const Join = () => {

  // 리다이렉트 사용하기
  const redirection = useNavigate();

  const API_BASE_URL = BASE + USER;

  // 상태 변수로 회원가입 입력값 관리
  const [userValue, setUserValue] = useState({
    userName: '',
    password: '',
    email: ''
  });

  // 검증 메시지에 대한 상태 변수 관리
  const [message, setMessage] = useState({
    userName: '',
    password: '',
    passwordCheck: '',
    email: ''
  });

  // 검증 완료 체크에 대한 상태 변수 관리
  const [correct, setCorrect] = useState({
    userName: false,
    password: false,
    passwordCheck: false,
    email: false
  });

  // 검증 데이터를 상태 변수에 저장하는 함수
  const saveInputState = ({ position, inputValue, flag, msg }) => {

    inputValue !== 'pass' && setUserValue({ ...userValue, [position]: inputValue });

    setMessage({ ...message, [position]: msg });

    setCorrect({ ...correct, [position]: flag });
  }

  // 이름 입력창 체인지 이벤트 핸들러
  const nameHandler = e => {

    const nameRegex = /^[가-힣]{2,5}$/;
    const inputValue = e.target.value;

    // 입력값 검증
    let msg;          // 검증 메시지를 저장할 변수
    let flag = false; // 입력값 검증 체크 변수

    if (!inputValue) {
      msg = '유저 이름은 필수입니다.';
    } else if (!nameRegex.test(inputValue)) {
      msg = '2 ~ 5 글자 사이의 한글만 작성해주세요!';
    } else {
      msg = '사용 가능한 이름입니다. :)'
      flag = true;
    }

    // 객체 프로퍼티에 세팅하는 변수의 이름이 키값과 동일한 경우 콜론 생략 가능
    saveInputState({ position: 'userName', inputValue, msg, flag });
  }

  // 이메일 중복 체크 서버 통신 함수
  const fetchDuplicateCheck = email => {

    let msg = '', flag = false;
    fetch(`${API_BASE_URL}/check?email=${email}`)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json) {
          msg = '이미 사용중인 이메일입니다. :(';
        } else {
          msg = '사용 가능한 이메일입니다! :)';
          flag = true;
        }

        setUserValue({ ...userValue, email: email });
        setMessage({ ...message, email: msg });
        setCorrect({ ...correct, email: flag });
      }).catch(err => {
        console.log('서버 통신이 원활하지 않습니다.');
      });
  }

  // 이메일 입력창 체인지 이벤트 핸들러
  const emailHandler = e => {
    const inputValue = e.target.value;
    const emailRegex = /^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/;

    // 입력값 검증
    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '이메일은 필수입니다!';
    } else if (!emailRegex.test(inputValue)) {
      msg = '이메일의 형식이 아니에요! :(';
    } else {
      // 이메일 중복 체크
      fetchDuplicateCheck(inputValue);
      return;
    }

    saveInputState({ position: 'email', inputValue, msg, flag });
  }

  // 비밀번호 입력창 체인지 이벤트 핸들러
  const passwordHandler = e => {

    // 비번이 바뀌면 패스워드 확인란 비우기
    document.getElementById('password-check').value = '';
    document.getElementById('check-text').textContent = '';

    setMessage({ ...message, passwordCheck: '' });
    setCorrect({ ...correct, passwordCheck: false });

    const inputValue = e.target.value;

    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;

    // 입력값 검증
    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '비밀번호는 필수입니다!';
    } else if (!pwRegex.test(inputValue)) {
      msg = '8글자 이상의 영문, 숫자, 특수문자를 포함해주세요! :(';
    } else {
      msg = '사용 가능한 비밀번호입니다. :)'
      flag = true;
    }

    saveInputState({ position: 'password', inputValue, msg, flag });
  }

  const pwCheckHandler = e => {
    const inputValue = e.target.value;
    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '비밀번호 확인은 필수입니다!';
    } else if (inputValue !== userValue.password) {
      msg = '비밀번호가 일치하지 않습니다! :(';
    } else {
      msg = '비밀번호가 일치합니다. :)'
      flag = true;
    }

    saveInputState({ position: 'passwordCheck', inputValue: 'pass', msg, flag });
  }

  // 4개의 입력칸이 모두 검증에 통과했는지 여부를 검사
  const isValid = () => {
    for (const key in correct) {
      const flag = correct[key];
      if (!flag) return false;
    }

    return true;
  }

  // 회원가입 처리 서버 요청
  const fetchSignUpPost = () => {
    fetch(API_BASE_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(userValue) })
      .then(res => {
        if (res.status === 200) {
          alert('회원가입에 성공하셨습니다! :)');
          // 로그인 페이지로 리다이렉트
          redirection('/login');
        } else {
          alert('서버와의 통신이 원활하지 않습니다. :(');
        }
      });
  }

  const joinButtonClickHandler = e => {
    e.preventDefault();

    // 회원가입 서버 요청
    if (isValid()) {
      fetchSignUpPost();
      return;
    } else {
      alert('입력란을 다시 확인해주세요!');
    }
  }

  return (
    <Container component="main" maxWidth="xs" style={{ margin: "200px auto" }}>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              계정 생성
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="fname"
              name="username"
              variant="outlined"
              required
              fullWidth
              id="username"
              label="유저 이름"
              autoFocus
              onChange={nameHandler}
            />
            <span style={{ color: correct.userName ? 'green' : 'red' }} >{message.userName}</span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="이메일 주소"
              name="email"
              autoComplete="email"
              onChange={emailHandler}
            />
            <span style={{ color: correct.email ? 'green' : 'red' }} >{message.email}</span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="패스워드"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={passwordHandler}
            />
            <span style={{ color: correct.password ? 'green' : 'red' }} >{message.password}</span>
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password-check"
              label="패스워드 확인"
              type="password"
              id="password-check"
              autoComplete="check-password"
              onChange={pwCheckHandler}
            />
            <span id="check-text" style={{ color: correct.passwordCheck ? 'green' : 'red' }} >{message.passwordCheck}</span>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ background: '#38d9a9' }}
              onClick={joinButtonClickHandler}
            >
              계정 생성
            </Button>
          </Grid>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item>
            <Link href="/login" variant="body2">
              이미 계정이 있습니까? 로그인 하세요.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container >
  );
}

export default Join;