import { AppBar, Toolbar, Grid, Typography } from "@mui/material";
import React, { useContext } from 'react'
import './header.css';
import { Link } from "react-router-dom";
import AuthContext from "../../util/AuthContext";

const Header = () => {

  // AuthContext에서 로그인 상태와 onLogout 함수를 가져옵니다.
  const { isLoggedIn, onLogout, userName } = useContext(AuthContext);

  // AuthContext의 onLogout 함수를 호출하여 로그인 상태를 업데이트합니다.
  onLogout();

  return (
    <AppBar position="fixed" style={{
      background: '#38d9a9',
      width: '100%'
    }}>
      <Toolbar>
        <Grid justify="space-between" container>
          <Grid item flex={9}>
            <div style={
              {
                display: 'flex',
                alignItems: 'center'
              }
            }>
              <Typography variant="h4">
                {isLoggedIn ? userName + '님' : '오늘'}의 할 일
              </Typography>
            </div>
          </Grid>

          <Grid item>
            <div className="btn-group">
              {isLoggedIn ?
                (<button className="logout-btn" onClick={onLogout()}>로그아웃</button>)
                :
                (<>
                  <Link to={'/login'}>로그인</Link>
                  <Link to={'/join'}>회원가입</Link>
                </>)
              }
            </div>
          </Grid>

        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header