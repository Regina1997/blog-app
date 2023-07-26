import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";

export const Header = React.memo(() => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const [anchorElUser, setAnchorElUser] = useState(null);

  console.log("header");
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Box>
            <Link style={{ textDecoration: "none", color: "black" }} to={"/"}>
              <BakeryDiningIcon color="primary" fontSize="large" />
            </Link>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: { xs: "none", md: "flex" },
                width: "100%",
              }}
            >
              Frondend Dev
            </Typography>
          </Box>

          <div className={styles.buttons}>
            {isAuth ? (
              <Box sx={{ display: "flex", flexGrow: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: "0.5rem",
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {userData.fullName}
                  </Typography>
                </Box>

                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={userData.imageUrl} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem key={Math.random()} onClick={handleCloseUserMenu}>
                    <Link style={{ textDecoration: "none",}} to="/add-post">
                      <Typography
                        component="h6"
                        sx={{
                          textAlign: "center",
                          color: "black",
                        }}
                      >
                        Add post
                      </Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem key={Math.random()} onClick={onClickLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
});
