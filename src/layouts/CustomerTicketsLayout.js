import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";

export default function CustomerTicketsLayout() {

    const [categories, priorities, contacts] = useLoaderData();
    const { customerData: { _links : { self }}} = useOutletContext();

    const createMapKeyIsId = ( inputArray ) => new Map(inputArray.map(input => [input.id, input]))

    const ticketContext = {
        categoriesMap: createMapKeyIsId(categories.data._embedded.categories),
        prioritiesMap: createMapKeyIsId(priorities.data._embedded.priorities),
        contactsMap: createMapKeyIsId(contacts.data._embedded.contacts),
        customerURI: self.href
    }

    // console.log(ticketContext)
    
    return(
        <Outlet context={ticketContext} /> 
    )
}