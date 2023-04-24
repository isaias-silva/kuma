import Cookies from "js-cookie";
import { SweetAlertIcon } from "sweetalert2";



export default function DefaultConfigModal(options: { text: string, title: string, icon:SweetAlertIcon }) {
    const theme = Cookies.get('theme-dark')
    const { text, title, icon } = options
    return {
        background: theme ? '#040404' : '#fff',
        color: theme ? '#fff' : '#151414',
        iconColor: '#51a8d8',
        confirmButtonColor:'#51a8d8',
        text,
        title,
        icon,
    }
}