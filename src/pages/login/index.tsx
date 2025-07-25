import type {FC, JSX} from "react";
import { useState} from "react";
import {ACCESS_TOKEN, API_URL, USER_DATA} from "../../config/constants.ts";
import {useAuthStore} from "../../store/authStore.ts";
import {useNavigate} from "react-router-dom";
import {BiHide, BiShow} from "react-icons/bi";

export const Login: FC = (): JSX.Element => {
    const navigate=useNavigate();
    const {setUserAndAuth, setLoading} = useAuthStore()
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onSubmit = async (e:any) => {
        e.preventDefault();
        try {
            setLoading(true)
            let response = await fetch(`${API_URL}/hr/user/sign-in?include=token&username=${username}&password=${password}`, {
                method: "post"
            });
            let data = await response?.json();
            const {token, ...user}: any = data;
            localStorage.setItem(ACCESS_TOKEN, token?.token);
            localStorage.setItem(USER_DATA, JSON.stringify(user));
            setUserAndAuth({
                isAuth: true,
                user: user
            })
            setLoading(false);
            navigate("/")
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }


    return (
        <div className="container">
            <div className="login-box">
                <h1 className="login-title">Login</h1>
                <form className="input-field" onSubmit={onSubmit}>
                    <div className="input-box">
                        <label htmlFor="username" className="label-text">User name <span
                            className="star">&lowast;</span></label>
                        <input type="text" name="username" required className="input-text"
                               onChange={(e) => setUsername(e.target.value)} value={username}/>
                    </div>
                    <div className="input-box">
                        <label htmlFor="password" className="label-text">Password <span className="star">&lowast;</span></label>
                        <input type={showPassword ? "text" : "password"} name="password" required className="input-text"
                               onChange={(e) => setPassword(e.target.value)} value={password}/>
                        <div className="show-icon" onClick={() => setShowPassword(r => !r)}>
                            {showPassword ? <BiHide /> : <BiShow/>}
                        </div>
                    </div>
                    <button className="btn" type="submit">Log in</button>
                </form>
            </div>
        </div>
    )
}