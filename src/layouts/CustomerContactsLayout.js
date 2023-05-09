import { Outlet, useOutletContext } from "react-router-dom";

export default function CustomerContactsLayout() {

    
    const { customerData } = useOutletContext();
    
    return (
        <Outlet context={{ customerData }}/>
    )
}