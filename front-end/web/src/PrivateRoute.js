import {Route, Navigate} from "react-router-dom";

function PrivateRoute({children}) {
    const userId = sessionStorage.getItem("userId");
    if(userId) {
        return children
    } else {
        return <Navigate to='/login'/>;
    }

}

export default PrivateRoute;