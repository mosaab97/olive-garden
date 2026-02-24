import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email:    Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

export const registerSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name:  Yup.string().required('Last name is required'),
  email:      Yup.string().email('Invalid email').required('Email is required'),
  password:   Yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  phone: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit phone number').nullable(),
});

export const addressSchema = Yup.object({
  label:  Yup.string(),
  street: Yup.string().required('Street is required'),
  city:   Yup.string().required('City is required'),
  state:  Yup.string().length(2, 'Use 2-letter state code').required('State is required'),
  zip:    Yup.string().matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').required('ZIP is required'),
});

export const checkoutSchema = Yup.object({
  shipping_name:   Yup.string().required('Full name is required'),
  shipping_street: Yup.string().required('Street address is required'),
  shipping_city:   Yup.string().required('City is required'),
  shipping_state:  Yup.string().length(2, 'Use 2-letter state code').required('State is required'),
  shipping_zip:    Yup.string().matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').required('ZIP is required'),
});

export const productSchema = Yup.object({
  name:        Yup.string().required('Product name is required'),
  slug:        Yup.string().required('Slug is required'),
  description: Yup.string().required('Description is required'),
  ingredients: Yup.string(),
  category_id: Yup.number().nullable(),
});

export const variantSchema = Yup.object({
  sku:       Yup.string().required('SKU is required'),
  filling:   Yup.string().required('Filling is required'),
  size_oz:   Yup.number().positive('Must be positive').required('Size is required'),
  label:     Yup.string().required('Label is required'),
  price:     Yup.number().positive('Must be positive').required('Price is required'),
  stock_qty: Yup.number().min(0).required('Stock quantity is required'),
  weight_lbs: Yup.number().positive('Must be positive').nullable(),
});
