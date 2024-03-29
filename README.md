
# 리액트 프로젝트 시작하기

1. node.js 설치 (LTS 버전으로)

2. create-react-app 설치 (최초 1번)
  ```
  $ npm install -g create-react-app
  ```

3. react 프로젝트 생성
  ```
  $ npx create-react-app (프로젝트 이름)
  ```

4. react 프로젝트 실행
  ```
  $ cd (프로젝트 폴더)
  $ npm start
  ```

- http://localhost:3000 에서 프론트엔드 서버 실행.>

# git clone 시 주의사항
---
```
$ npm install
```
명령을 터미널에서 실행하여 라이브러리 설치

5. 추가 라이브러리 (띄어쓰기를 사용하면 여러 개를 한 번에 다운 가능하다.)
```
$ npm install react-icons  // 아이콘
$ npm install classnames   // 클래스 add/remove 편리한 거
$ npm install sass         // scss 문법 사용
$ npm install reactstrap bootstrap
$ npm install @mui/material @emotion/react @emotion/styled
$ npm install @mui/icons-material
$ npm install react-router-dom
```
요약본
```
$ npm i react-icons classnames sass reactstrap react-bootstrap bootstrap @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom
```

## 리액트 라우터 설정
- index.js에 BrowserRouter 컴포넌트로 App 감싸기
```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```
