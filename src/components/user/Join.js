import React, { useContext, useEffect, useState, useRef } from 'react'
import {
	Button, Container, Grid,
	TextField, Typography, Link
} from "@mui/material";

import { useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import AuthContext from '../../util/AuthContext';
import CustomSnackBar from '../layout/CustomSnackBar';

import './Join.scss';

const Join = () => {

	//useRef로 태그 참조하기
	const $fileTag = useRef();

	//리다이렉트 사용하기
	const redirection = useNavigate();
	const { isLoggedIn } = useContext(AuthContext);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (isLoggedIn) {
			setOpen(true);
			setTimeout(() => {
				redirection('/');
			}, 3000);
		}
	}, [isLoggedIn, redirection]);

	const API_BASE_URL = BASE + USER;

	//상태변수로 회원가입 입력값 관리
	const [userValue, setUserValue] = useState({
		userName: '',
		password: '',
		email: ''
	});

	//검증 메세지에 대한 상태변수 관리
	const [message, setMessage] = useState({
		userName: '',
		password: '',
		passwordCheck: '',
		email: ''
	});

	//검증 완료 체크에 대한 상태변수 관리
	const [correct, setCorrect] = useState({
		userName: false,
		password: false,
		passwordCheck: false,
		email: false
	});

	//검증 데이터를 상태변수에 저장하는 함수
	const saveInputState = ({ key, inputVal, flag, msg }) => {

		inputVal !== 'pass' && setUserValue({
			...userValue,
			[key]: inputVal
		});

		setMessage({
			...message,
			[key]: msg
		});

		setCorrect({
			...correct,
			[key]: flag
		});

	}



	//이름 입력창 체인지 이벤트 핸들러
	const nameHandler = e => {

		const nameRegex = /^[가-힣]{2,5}$/;

		const inputVal = e.target.value;
		//입력값 검증
		let msg; //검증 메세지를 저장할 변수
		let flag = false; //입력값 검증 체크 변수

		if (!inputVal) {
			msg = '유저 이름은 필수입니다.';
		} else if (!nameRegex.test(inputVal)) {
			msg = '2~5글자 사이의 한글로 작성하세요!';
		} else {
			msg = '사용 가능한 이름입니다.';
			flag = true;
		}

		//객체 프로퍼티에 세팅하는 변수의 이름이 키값과 동일한 경우
		//콜론 생략이 가능.
		saveInputState({
			key: 'userName',
			inputVal,
			msg,
			flag
		});

	};

	// 이메일 중복체크 서버 통신 함수
	const fetchDuplicateCheck = email => {

		let msg = '', flag = false;
		fetch(`${API_BASE_URL}/check?email=${email}`)
			.then(res => {
				if (res.status === 200) {
					return res.json();
				}
			})
			.then(json => {
				console.log(json);
				if (json) {
					msg = '이메일이 중복되었습니다!';
				} else {
					msg = '사용 가능한 이메일 입니다.';
					flag = true;
				}

				setUserValue({ ...userValue, email: email });
				setMessage({ ...message, email: msg });
				setCorrect({ ...correct, email: flag });
			})
			.catch(err => {
				console.log('서버 통신이 원활하지 않습니다.');
			});
	};



	//이메일 입력창 체인지 이벤트 핸들러
	const emailHandler = e => {

		const inputVal = e.target.value;

		const emailRegex = /^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/;

		let msg, flag = false;
		if (!inputVal) {
			msg = '이메일은 필수값입니다.';
		} else if (!emailRegex.test(inputVal)) {
			msg = '이메일 형식이 아닙니다.';
		} else {
			//이메일 중복 체크
			fetchDuplicateCheck(inputVal);
			return;
		}

		saveInputState({
			key: 'email',
			inputVal,
			msg,
			flag
		});

	};

	//패스워드 입력창 체인지 이벤트 핸들러
	const passwordHandler = e => {

		//패스워드가 변동되면 패스워드 확인란을 비우기
		document.getElementById('password-check').value = '';
		document.getElementById('check-span').textContent = '';

		setMessage({ ...message, passwordCheck: '' });
		setCorrect({ ...correct, passwordCheck: false });


		const inputVal = e.target.value;

		const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;

		//검증 시작
		let msg, flag = false;
		if (!inputVal) { //패스워드 안적음.
			msg = '비밀번호는 필수입니다.';
		} else if (!pwRegex.test(inputVal)) {
			msg = '8글자 이상의 영문, 숫자, 특수문자를 포함해 주세요.';
		} else {
			msg = '사용 가능한 비밀번호입니다.';
			flag = true;
		}

		saveInputState({
			key: 'password',
			inputVal,
			msg,
			flag
		});
	};

	const pwCheckHandler = e => {
		//검증 시작
		let msg, flag = false;
		if (!e.target.value) {
			msg = '비밀번호 확인란은 필수입니다.';
		} else if (userValue.password !== e.target.value) {
			msg = '패스워드가 일치하지 않습니다.';
		} else {
			msg = '패스워드가 일치합니다.';
			flag = true;
		}

		saveInputState({
			key: 'passwordCheck',
			inputVal: 'pass',
			msg,
			flag
		});

	};

	// 이미지 파일 상태변수
	const [imgFile, setImgFile] = useState(null);

	// 이미지파일을 선택했을 때 썸네일 뿌리기
	const showThumbnailHandler = e => {
		//첨부된 파일 정보
		const file = $fileTag.current.files[0];

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = () => {
			setImgFile(reader.result);
		}

	};


	// 4개의 입력칸이 모두 검증에 통과했는지 여부를 검사
	const isValid = () => {

		for (const key in correct) {
			const flag = correct[key];
			if (!flag) return false;
		}
		return true;
	};

	//회원 가입 처리 서버 요청
	const fetchSignUpPost = () => {

		// JSON을 Blob타입으로 변경 후 FormData에 넣기
		const userJsonBlob = new Blob(
			[JSON.stringify(userValue)],
			{ type: 'application/json' }
		);

		// 이미지파일과 회원정보 JSON을 하나로 묶어야 함
		// FormData 객체를 활용해서.
		const userFormData = new FormData();
		userFormData.append('user', userJsonBlob);
		userFormData.append('profileImage', $fileTag.current.files[0]);

		fetch(API_BASE_URL, {
			method: 'POST',
			body: userFormData
		})
			.then(res => {
				if (res.status === 200) {
					alert('회원가입에 성공했습니다!');
					//로그인 페이지로 리다이렉트
					// window.location.href = '/login';
					redirection('/login');
				} else {
					alert('서버와의 통신이 원활하지 않습니다.');
				}
			})
	}


	// 회원가입 버튼 클릭 이벤트 핸들러
	const joinButtonClickHandler = e => {

		e.preventDefault();

		//회원 가입 서버 요청
		if (isValid()) {
			fetchSignUpPost();
		} else {
			alert('입력란을 다시 확인해 주세요!');
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
										// src={require("../../assets/img/image-add.png")}
										src={imgFile || require("../../assets/img/image-add.png")}
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
								<span style={
									correct.userName
										? { color: 'green' }
										: { color: 'red' }
								}>{message.userName}</span>
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
								<span style={
									correct.email
										? { color: 'green' }
										: { color: 'red' }
								}>{message.email}</span>
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
								<span style={
									correct.password
										? { color: 'green' }
										: { color: 'red' }
								}>{message.password}</span>
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
								<span id='check-span' style={
									correct.passwordCheck
										? { color: 'green' }
										: { color: 'red' }
								}>{message.passwordCheck}</span>
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
				</Container>
			}
			<CustomSnackBar
				open={open}
			/>
		</>
	);

}

export default Join