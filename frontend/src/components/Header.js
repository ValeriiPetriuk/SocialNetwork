import { useDispatch, useSelector } from "react-redux";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from "../actions/userActions";

function Header() {
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
  
    const dispatch = useDispatch()

    const logoutHandler = () => {
      dispatch(logout())
    }
    return (
      <header>
            <Navbar bg="dark" data-bs-theme="dark">
            <Container>
            <LinkContainer to="/">
                <Navbar.Brand >MyBlog</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
            <LinkContainer to="/home">
                <Nav.Link>Home</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/notification">
                <Nav.Link>Сповіщення</Nav.Link>
            </LinkContainer>
                {userInfo ? (
                  <NavDropdown title={userInfo.username} id="username">
                    <LinkContainer to='/profile'> 
                      <NavDropdown.Item>Профіль</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/mylistpost'> 
                      <NavDropdown.Item>Мої пости</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/chats'> 
                      <NavDropdown.Item>Чати</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>Вийти</NavDropdown.Item>
                  </NavDropdown>
                ): (
                  <LinkContainer to="/login">
                  <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>  
                </LinkContainer>
                 
                )}
            </Nav>
            </Container>
        </Navbar>
      </header>
    )
  }
  
  export default Header