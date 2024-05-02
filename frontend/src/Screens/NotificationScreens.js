import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listNotifications } from '../actions/notificationAction'
import Loader from "../components/Loader";
import Message from "../components/Message";

function NotificationScreens() {
        const dispatch = useDispatch()
        const notificationList = useSelector(state => state.notificationList)
        const {error, loading, notifications} = notificationList

        useEffect(() => {
            dispatch(listNotifications())

        }, [dispatch])

        return (

            <div>
            <h1>Сповіщення</h1>
            {loading ? (
                <Loader/>
                ) : error ? (
                    <Message variant='danger'> {error} </Message>
                ) :
                  notifications.map((notification) => (
                      <div key={notification.id}>
                          post: {notification.post} {notification.notification_type} : {notification.sender.username}
                      </div>
            ))}
          </div>
        )
}

export default NotificationScreens