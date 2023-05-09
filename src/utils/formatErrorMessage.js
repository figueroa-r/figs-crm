

// ----------------------------------------------------------------------

export const formatErrorSnackbar = (error, contextMessage) => {
    console.log(error)

    // default format for errors from backend should include a status code and message of the issue
    const errorMessage = error.response?.data ? error.response.data.message : error.message
    const message = `Status: ${error.response?.status || error?.code }\n${contextMessage}\n${errorMessage}`

    return [
        message,
        {
            variant: 'error',
            style: { whiteSpace: 'pre-line' }
        }
    ]
}