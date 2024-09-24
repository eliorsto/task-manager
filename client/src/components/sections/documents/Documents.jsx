import { useSelector } from 'react-redux';
import NotLogged from '../NotLogged/NotLogged';


const Documents = () => {
    const { token } = useSelector((state) => state.user);




    return <>
        {token ? <>

        </> : <>
            <NotLogged />
        </>

        }</>
}
export default Documents;  