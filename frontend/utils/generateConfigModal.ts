import Cookies from "js-cookie";

import Swal, { SweetAlertIcon } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


export default function DefaultConfigModal(options: { text: string, title: string, icon: SweetAlertIcon, showButtons?: boolean }) {
    const theme = Cookies.get('theme-dark')
    const { text, title, icon, showButtons } = options
    return MySwal.mixin({
        background: theme ? '#1d1d1d' : '#f0f0f0',
        color: theme ? '#51a8d8' : '#0d5c91',
        iconColor: theme ? '#00e1ff' : '#0d5c91',
        confirmButtonColor: theme ? '#00e1ff' : '#0d5c91',
        text,
        icon,
        title,
        showDenyButton: showButtons,
        showLoaderOnDeny:true,
        showLoaderOnConfirm:true,
    })
}