// form validation
import * as yup from 'yup';

export const customerValidationSchema = yup.object({
    avatarUrl: yup
        .string('Enter url link for Customer avatar')
        .trim()
        .url('invalid url link'),
    name: yup
        .string('Enter customer name')
        .trim()
        .required('Customer Name is required')
        .min(3, 'Customer name must be 3 characters or more')
        .max(50, 'Customer name must be less than 50 characters')
        .matches(/([a-zA-Z0-9]|[- @,.#&!'])*/, 'Name must be alphanumeric characters and the following special characters: "- , . # & ! \'"'),
    alias: yup
        .string('Enter customer alias')
        .trim()
        .notRequired(),
    companyType: yup
        .string()
        .trim()
        .required('Company type is required')
        .min(3, 'Company type must be 3 or more characters')
        .max(50, 'Company type must be less than 50 characters'),
    isActive: yup
        .boolean()
        .default(() => true),
    isVerified: yup
        .boolean()
        .default(() => false),
    address1: yup
        .string()
        .trim()
        .required('Address is required')
        .min(5, 'Address must be at least 5 characters long'),
    address2: yup
        .string()
        .trim()
        .optional(),
    city: yup
        .string()
        .trim()
        .required('City name is required')
        .min(3, 'City must be 3 or more characters')
        .max(50, 'City cannot be more than 50 characters'),
    state: yup
        .string()
        .trim()
        .required('State is requried')
        .min(2, 'State must be at least 2 characters')
        .max(20, 'State must be less than 20 characters'),
    zip: yup
        .string()
        .trim()
        .required('Zip is required')
        .matches(/^(?!0{5})(\d{5})(?!-?0{4})(-?\d{4})?$/, 'Please enter a valid 5 or 9 digit zip code')

})