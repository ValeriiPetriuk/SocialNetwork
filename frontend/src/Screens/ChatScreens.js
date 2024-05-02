import React, { useEffect,  useRef, useState} from 'react'
import {  Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessage } from '../actions/chatActions';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { createChat, deleteChat, listChat } from '../actions/chatActions';
import {Form, Button} from 'react-bootstrap';
import {v4 as uuid} from 'uuid';
import Message from '../components/Message';
import {
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBCard,
	MDBCardBody,
	MDBIcon,
	MDBTypography,
	MDBCardHeader,
	MDBBtn,
	MDBModal,
	MDBModalDialog,
	MDBModalContent,
	MDBModalHeader,
	MDBModalTitle,
	MDBModalBody,
	
  } from "mdb-react-ui-kit";


function ChatScreens() {
	const dispatch = useDispatch();
	const {chatUuid} = useParams();
	
	const navigate = useNavigate()

	const messageList = useSelector(state => state.messageList)
    const {loading, error, messages} = messageList 
	
	const chatList = useSelector(state => state.chatList)
    const {loading: loadingChatList, error: errorChatListError, chats} = chatList   

	const chatCreate = useSelector(state => state.chatCreate)
    const {loading: loadingChatCreate, error: errorChatCreate, chat, success: successCreateChat} = chatCreate  

	const chatDelete = useSelector(state => state.chatDelete)
    const {loading: loadingChatDelete, error:errorChatDelete, success: successChatDelete} = chatDelete

	const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

	const ws = useRef(null);

	const [newMsg, setNewMsg] = useState('');
	const [username, setUsername] = useState('');
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {

		if (!userInfo) {
			navigate("/login")
		} else {
			
			dispatch(listChat())
			if (chatUuid !== undefined) {
				ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${chatUuid}/?token=${userInfo.token}`);
			
				ws.current.onopen = e => console.log('Chat socket opened');
				ws.current.onerror = e => console.log('Chat socket error');
				
				ws.current.onmessage = e => {
				
					const msg = JSON.parse(e.data);
			
					if (msg.type === "chat_message") {
						setNewMsg('')				
						dispatch(addMessage(msg));
					}
				}
				dispatch(fetchMessage(chatUuid));
			}
			
			};
			
			

		return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
	}, [dispatch, chatUuid, userInfo, navigate, successChatDelete,   errorChatCreate, successCreateChat]);



	const sendNewMsg = e => {
		e.preventDefault();

		// check if newMsg is valid
		if (newMsg && newMsg.replace(/\s+/g, '') !== '') {
			const messageData = {uuid: uuid(), message: newMsg};
			ws.current.send(JSON.stringify(messageData));
			setNewMsg('');
		}

	};

	// submit form when enter pressed in text area
	const onKeyDown = e => {
		if (e.keyCode === 13 && e.shiftKey === false && newMsg) sendNewMsg(e);
	};

	const toggleModal = () => setModalOpen(!modalOpen);

	const submitCreateChat = e => {
		e.preventDefault();
        dispatch(createChat(username));
		
	}

	
	
	return (
		
		<MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
		<MDBRow>
		  <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
			<h5 className="font-weight-bold mb-3 text-center text-lg-start">
			  Ваші розмови
			</h5>
  
			<MDBCard>
			  <MDBCardBody>
				<MDBTypography listUnStyled className="mb-0">
					{loadingChatList ? <Loader animation="grow" /> : errorChatListError ? 
					<Message variant="danger">{errorChatListError}</Message> :
					loadingChatDelete ? <Loader animation="grow" /> : errorChatDelete ? <Message variant="danger">{errorChatDelete}</Message> :
					chats.map(({  user, uuid, last_message }) => (
					
						<li
							key={uuid}
							className="p-2 border-bottom"
							style={{ backgroundColor: "#eee" }}
					 	>
						<Link to={`${uuid}`} className="d-flex justify-content-between">
						  <div className="d-flex flex-row">
							<img
							  src={`http://127.0.0.1:8000${user.avatar}`}
							  alt="avatar"
							  className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
							  width="60"
							/>
							
							<div className="pt-1">
							  <p className="fw-bold mb-0">{user.username}</p>
							  <p className="small text-muted">
								{last_message}
							  </p>
							  
							</div>
							 
						  </div>	 
						  </Link>
						  <div className="pt-1">
							
							<p className="small text-muted mb-1">Just now</p>
							
							<Button variant="danger" onClick={() => dispatch(deleteChat(uuid))}>
							<i className='fas fa-trash'></i>
								</Button>
							<span className="badge bg-danger float-end">1</span>
						  </div>
						 
					  </li>		
					))}
					
				 
				</MDBTypography>
			  </MDBCardBody>
			</MDBCard>
		  </MDBCol>
		 
  
		  <MDBCol md="6" lg="7" xl="8">
			<MDBTypography listUnStyled>
				
			{loading ? <Loader animation="grow" /> : error ? <Message variant="danger">{error}</Message> :
			chatUuid === undefined ? (
			
			<div style={{textAlign: "center"}}>
					<i className="fas fa-sms" style={{fontSize: "500%"}}></i> <br />
					<b style={{ fontSize: '24px' }}>Ваші розмови</b>
            		<p style={{ fontSize: '16px' }}>Створюйте чат і розпочинайте спілкування</p>
					<Button onClick={toggleModal} >Створити чат</Button>
					{modalOpen && (	
						loadingChatCreate ? <Loader animation="grow" />  :
							<MDBModal show={modalOpen} setShow={setModalOpen} tabIndex='-1' >
							<MDBModalDialog>
							<MDBModalContent>
							<MDBModalHeader>
									<MDBModalTitle>Modal title</MDBModalTitle>
									<MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
							</MDBModalHeader>
							
							<MDBModalBody>
							{errorChatCreate ? <Message variant="danger">{errorChatCreate}</Message>:
							successCreateChat && toggleModal() 
							}
							<Form  onSubmit={submitCreateChat}>
									<Form.Control
										className="mb-2 mr-sm-2"
										placeholder="username..."
										list="usernames"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required={true}
									/>

									<Button
										type="submit"
										className="mb-2"
										
										disabled={!username && username.replace(/\s+/g, '') === ''}>
										Chat
									</Button>
								
								</Form>
									</MDBModalBody> 
								
							</MDBModalContent>
							</MDBModalDialog>
						</MDBModal>
					
					)}
			</div>
				
			) : 
		
			messages.map(({ uuid, date_sent, message, sender }) => (
					<li key={uuid} className={sender.id === userInfo.id ? "d-flex justify-content-between mb-4" :
					 "d-flex justify-content-between p-3"}>
						<div className="d-flex align-items-start">
						<img
							src={sender.avatar}
							alt="avatar"
							className="rounded-circle me-3 shadow-1-strong"
							width="60"
						/>
						<MDBCard>
							<MDBCardHeader className="d-flex justify-content-between p-3">
							<p className="fw-bold mb-0">{sender.username}</p>
							<p className="text-muted small mb-0">
								<MDBIcon far icon="clock" /> {date_sent.substring(0, 10)}
							</p>
							</MDBCardHeader>
							<MDBCardBody>
							<p className="mb-0">
								{message}
							</p>
							</MDBCardBody>
						</MDBCard>
						</div>
					</li>
			))}

			{chatUuid !== undefined && (
				<Form onSubmit={sendNewMsg}>
					<Form.Group>
							<Form.Control
								as="textarea"
								placeholder='Повідомлення'
								rows="3"
								style={{resize: 'none'}}
								value={newMsg}
								onKeyDown={onKeyDown}
								onChange={e => setNewMsg(e.target.value)}
							/>
					</Form.Group>		
					<Button type="submit" disabled={!newMsg || newMsg.replace(/\s+/g, '') === ''}>
							Send
					</Button>
				</Form>
			)}
			
				
			</MDBTypography>
		  </MDBCol>	
		</MDBRow>
	  </MDBContainer>
	
	);
}


export default ChatScreens



