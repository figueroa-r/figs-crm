// form validation
import * as yup from 'yup';

export const contactMeValidationSchema = yup.object({
    fullName: yup
        .string()
        .trim()
        .required()
        .min(5, 'Full Name must be 5 or more characters')
        .max(30, 'Full Name must be less than 30 characters')
        .matches(/^[A-Z][a-z]+(?: [A-Z][a-z]*[.]?)+$/, 'Please enter a valid full name'),
    email: yup
        .string()
        .trim()
        .required()
        .email('Please enter a valid email'),
    phone: yup
        .string()
        .trim()
        .required()
        .matches(/^[+]?[0-9]{0,3}[-\s.]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please enter a valid phone number'),
    contactNote: yup
        .string()
        .trim()
        .required()
        .min(10, 'Contact note must be at least 10 characters')
        .max(255, 'Contact note must be less than 255 characters')
})