import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faContactCard,
    faPeopleGroup,
    faDashboard,
    faDeleteLeft,
    faRobot,
    faMoon,
    faSun,
    faHome,
    faDatabase,
    IconDefinition

} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
type OptionsAside = {
    name: string,
    path: string,
    icon: IconDefinition,
    callback?: () => void
}
const options: OptionsAside[] = [
    {
        name: 'Home',
        path: '/user',

        icon: faHome,
    },
    {
        name: 'Edit profile',
        path: '/user/profile',
        icon: faEdit
    },

    {
        name: 'Your bots',
        path: '/user/mybots',
        icon: faRobot
    },
    {
        name: 'Create flux',
        path: '/user/createFlux',

        icon: faDatabase,
    },
    {
        name: 'Contact List',
        path: '/user/createFlux',
        icon: faContactCard,
    }
    ,
    {
        name: 'Attendant List',
        path: '/user/attendants',
        icon: faPeopleGroup,
    }
    ,

    {
        name: 'Dashboard',
        path: '/user/dashboard',
        icon: faDashboard,
    },
    {
        callback() {
            Cookies.remove('token')
        },
        name: 'Logout',
        path: '/login',
        icon: faDeleteLeft,
    }

]
export default options