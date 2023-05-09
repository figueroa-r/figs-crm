import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";

export default function CustomerTicketsLayout() {

    const { data: { categories, priorities, contacts }} = useLoaderData();
    const { customerData: { id: customerId }} = useOutletContext();

    const createMapKeyIsId = ( inputArray ) => new Map(inputArray.map(input => [input.id, input]))

    const ticketContext = {
        categoriesMap: createMapKeyIsId(categories),
        prioritiesMap: createMapKeyIsId(priorities),
        contactsMap: createMapKeyIsId(contacts)
    }

    // console.log(ticketContext)
    
    return(
        <Outlet context={{ ...ticketContext, customerId }} /> 
    )
}