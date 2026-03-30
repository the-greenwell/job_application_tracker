import { useState } from 'react';

const useForm = (initialValues, onSubmit) => {
    const [formValues, setFormValues] = useState(initialValues);
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((otherValues) => ({
            ...otherValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await onSubmit(formValues);
            reset();
        } catch (error) {
            setError(error.message || 'Error submitting form')
        } finally {
            setSubmitting(false);
        }
    };

    const reset = () => {
        setFormValues(initialValues);
    };

    return { formValues, isSubmitting, error, handleChange, handleSubmit, reset }
};

export default useForm;