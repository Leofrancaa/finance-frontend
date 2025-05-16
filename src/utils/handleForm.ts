export const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

export const handleSubmit = (
    e: React.FormEvent,
    formData: Record<string, string>,
    onSubmit: (data: Record<string, string>) => void,
    setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
        type: "",
        day: "",
        amount: "",
        paymentMethod: "",
        installments: "",
        note: "",
    });
};
