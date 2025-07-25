import type {FC, JSX} from "react";
import {Route, Routes} from "react-router-dom";
import {Main} from "../pages/main";
import {Login} from "../pages/login";

export const RouteComponent: FC = (): JSX.Element => {

    return (
        <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="login" element={<Login/>}/>
        </Routes>
    )
}