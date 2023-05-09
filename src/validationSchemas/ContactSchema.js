// form validation
import * as yup from 'yup';

export const contactValidationSchema = yup.object({

    firstName: yup
        .string()
        .trim()
        .required()
        .matches(/^[A-Z][a-z]*([-' ]?[A-Z][a-z]*)*$/, 'Only alpha characters and " ,\',-" are allowed. Please capitalize each word.')
        .min(2, 'First Name must be 2 or more characters')
        .max(20, 'First Name cannot be greater than 20 characters'),
    lastName: yup
        .string()
        .trim()
        .required()
        .matches(/^[A-Z][a-z]*([-' ]?[A-Z][a-z]*)*$/, 'Only alpha characters and " ,\',-" are allowed. Please capitalize each word.')
        .min(2, 'Last Name must be 2 or more characters')
        .max(20, 'Last Name cannot be greater than 20 characters'),
    title: yup
        .string()
        .trim()
        .required()
        .matches(/^[A-Z][a-z]*([-' ]?[A-Z][a-z]*)*$/, 'Only alpha characters and " ,\',-" are allowed. Please capitalize each word.')
        .min(3, 'Please enter a title with a minimum of 3 characters')
        .max(50, 'Please enter a title that is less than 50 characters'),
    department: yup
        .string()
        .trim()
        .required()
        .matches(/^[A-Z][a-z]*([-' .]?[A-Z][a-z]*)*$/, 'Only alpha characters and " ,\',-,." are allowed. Please capitalize each word.')
        .min(2, 'Please enter a department with 2 or more characters')
        .max(50, 'Please enter a department with less than 50 characters'),
    isActive: yup
        .boolean()
        .default(true)
        .required(),
    avatarId: yup
        .number()
        .integer()
        .min(1, 'Please enter a number between 1 and 24')
        .max(24, 'Please enter a number between 1 and 24'),
    contactsList: yup.array().of(yup.object({
        contactType: yup
            .string()
            .trim()
            .oneOf(["Phone", "Email"], "Contact Type can only be Phone or Email")
            .required("Contact Type must be defined"),
        contactDetail: yup
            .string()
            .trim()
            .required("Contact detail is required")
            .when(
                'contactType', {
                    is: (val) => val === "Phone",
                    then: (schema) => 
                        schema.matches(
                            /^[+]?[0-9]{0,3}[-\s.]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                            "Please enter a valid phone number"),
                    otherwise: (schema) => 
                        schema.email("Please enter a valid email")
                }
            )
    })
    )
})