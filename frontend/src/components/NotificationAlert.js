import { Alert } from "react-bootstrap"
import React, { useState, useEffect} from "react";
import {useSelector} from "react-redux";
import './Notifications.css'
function NotificationAlert({variant, notifications}) {
    const [show, setShow] = useState(true);


    return (
       show && notifications.map((notification) => (

               (
                   <Alert className='notification' variant={variant} key={notification.id} onClose={() => !show} dismissible>
                       post: {notification.post} {notification.notification_type} : {notification.sender}
                    </Alert>
               )


       ))

    )


}

export default NotificationAlert