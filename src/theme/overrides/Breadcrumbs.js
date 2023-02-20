// ----------------------------------------------------------------------

export default function Breadcrumbs() {
    return {
        // name of component
        MuiBreadcrumbs: {
            styleOverrides: {
                // Name of the slot
                separator: {
                    marginLeft: '16px',
                    marginRight: '16px'
                },
                li: {
                    margin: '2px 0px'
                }
            }
        }
    }
}