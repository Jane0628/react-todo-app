import React, { useContext, useState, useRef } from 'react'
import { Button, Container, Grid, TextField, Typography, Link } from "@mui/material";
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import './Join.scss';

// 리다이렉트 사용하기
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../util/AuthContext';
import CustomSnackBar from '../layout/CustomSnackBar';

const Join = () => {

  // useRef로 태그 참조하기
  const $fileTag = useRef();

  // 리다이렉트 사용하기
  const redirection = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  // 이미지 파일 상태 변수
  const [imgFile, setImgFile] = useState(null);

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

  // 이미지 파일을 선택했을 때 썸네일 뿌리기
  const showThumbnailHandler = e => {
    console.log('이미지 파일 변화!');

    //첨부된 파일 정보  : fileList의 첫번째를 받기.
    const file = $fileTag.current.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    //loadend = 로드를 끝내면 동작하는 이벤트
    reader.onloadend = () => {
      setImgFile(reader.result);
    }

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

    // JSON을 Blob 타입으로 변경 후 FormData에 넣기 (json은 formData에 바로 못 들어감)
    const userJsonBlob = new Blob(
      [JSON.stringify(userValue)],
      { type: 'application/json' }
    );

    // FormData 객체를 활용해서 이미지 파일과 회원 정보 JSON을 하나로 묶어야 함
    const userFormData = new FormData();
    userFormData.append('user', userJsonBlob);
    userFormData.append('profileImage', $fileTag.current.files[0]);

    fetch(API_BASE_URL, { method: 'POST', body: userFormData })
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
    <>
      {!isLoggedIn &&
        <Container component="main" maxWidth="xs" style={{ margin: "200px auto" }}>
          <form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5">
                  계정 생성
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <div className="thumbnail-box" onClick={() => $fileTag.current.click()}>
                  <img
                    // imgFile이 null=false면 require로 파일을 가져온다. true라면 imgfile을 그대로
                    // src={imgFile ? imgFile : require("../../assets/img/image-add.png")}
                    src={imgFile || require("../../assets/img/image-add.png")} //더 짧게 바꿈. 앞이 true면 뒤는 실행X
                    alt="profile"
                  />
                </div>
                <label className='signup-img-label' htmlFor='profile-img'>프로필 이미지 추가</label>
                <input
                  id='profile-img'
                  type='file'
                  style={{ display: 'none' }}
                  accept='image/*'
                  ref={$fileTag}
                  onChange={showThumbnailHandler}
                />
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
                  이미 계정이 있습니까? 로그인하세요.
                </Link>
              </Grid>
            </Grid>
          </form>
        </Container >
      }
      <CustomSnackBar open={open} />
    </>
  );
}

export default Join;