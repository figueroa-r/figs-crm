import { Outlet, useOutletContext } from "react-router-dom";

export default function CustomerContactsLayout() {

    
    const { customerData: { _links : { self }}} = useOutletContext();
    
    return (
        <Outlet context={{ customerURI: self.href }}/>
    )
}