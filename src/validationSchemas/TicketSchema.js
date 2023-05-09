import * as yup from 'yup';

export const ticketValidationSchema = yup.object({

    isOpen: yup
        .boolean()
        .required(),
    categoryId: yup
        .number()
        .positive()
        .integer()
        .required('Category is required'),
    priorityId: yup
        .number()
        .positive()
        .integer()
        .required('Priority is required'),
    primaryContactId: yup
        .number()
        .positive()
        .integer()
        .required('Primary contact is required'),
    customerId: yup
        .number()
        .positive()
        .integer()
        .optional(),
    ticketNotes: yup
        .string()
        .trim()
        .required('Ticket note is required.')
        .min(10, 'Ticket notes must be 10 or more characters')
        .max(500, 'Ticket notes mus tbe less than 500 characters')
})


export const ticketInteractionSchema = yup.object({

    interactionDetails: yup
        .string()
        .trim()
        .required('Interaction Details must not be blank')
        .min(10, 'Interaction must be 10 to 255 characters')
        .max(255, 'Interaction must be less than 255 characters')
        
})