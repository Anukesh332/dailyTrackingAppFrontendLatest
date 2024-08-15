import { CheckCircle, XCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";

const Alert = (type, message) =>{
    switch (type) {
        case 'warning':
            return toast.warning(message,)
        case 'error':
            return toast.error(message, { icon: <XCircle></XCircle> });
        case 'success':
            return toast.success(message,{icon:<CheckCircle></CheckCircle>});
        case 'info':
            return toast.info(message)
        case 'dark':
            return toast.dark(message)
        default:
            return toast(message)
    }
}

export default Alert;