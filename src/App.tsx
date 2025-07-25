import './App.css'
import {RouteComponent} from "./routes";
import {useEffect} from "react";
import {USER_DATA} from "./config/constants.ts";
import {useAuthStore} from "./store/authStore.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {PageLoader} from "./components/page_loader";

function App() {
    const {setUserAndAuth, isAuth, loading} = useAuthStore();
    const navigate = useNavigate();
    let {pathname, search} = useLocation()

    useEffect(() => {
        let userData = localStorage.getItem(USER_DATA);
        if (userData) {
            let json = JSON.parse(userData);
            if (json?.status === 10) {
                setUserAndAuth({
                    isAuth: true,
                    user: json
                })
            }
        }
    }, []);

    useEffect(() => {
        if (!isAuth) {
            navigate("/login")
        } else {
            if (pathname?.endsWith("login")) {
                navigate("/")
            }
        }
    }, [pathname, isAuth]);


    return (
        loading ? <PageLoader/> : <RouteComponent/>
    )
}

export default App
