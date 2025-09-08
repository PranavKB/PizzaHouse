import React, { useState } from 'react';
import styles from './Login.module.scss';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import showNotification from '../Notification/showNotification';
import type { RegisterPayload } from '../../types/authTypes';

type FormData = {
  fullName: string;
  userName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  email: string;
  password: string;
};

type FormErrors = {
  fullName?: string;
  userName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  email?: string;
  password?: string;
};

type FormField = {
  label: string;
  name: Extract<keyof FormData, keyof FormErrors>;   // <-- name must be a key of FormData
  type: string;
  autoComplete?: string;
};

const RegisterUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    userName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const formFields: FormField[] = [
    { label: "Full Name", name: "fullName", type: "text" },
    { label: "User Name", name: "userName", type: "text" },
    { label: "Phone Number", name: "phone", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "City", name: "city", type: "text" },
    { label: "State", name: "state", type: "text" },
    { label: "Pin Code", name: "pinCode", type: "text" },
    { label: "Email ID", name: "email", type: "email", autoComplete: "off" },
    { label: "Password", name: "password", type: "password", autoComplete: "off" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormData;  
    const value = e.target.value;

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required.";
    }
    if (!formData.userName.trim()) {
      newErrors.userName = "User Name is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "Pin Code is required.";
    }else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Pin Code must be 6 digits.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/.test(formData.password)) {
        newErrors.password = "Password should be at least 8 characters, include one digit, one lowercase letter, one uppercase letter, and one special character.";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const convertFormDataToRegisterPayload = (formData: FormData): RegisterPayload => {
    return {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      mobileNum: formData.phone,
      pincode: formData.pinCode,
      userName: formData.userName,
      city: formData.city,
      state: formData.state,
      userTypeId: 3, 
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError(null);
    setLoading(true);

    if (validate()) {
      try {
        const response = await registerUser(convertFormDataToRegisterPayload(formData));
        navigate('/login');
        showNotification.success('User added successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed');
        showNotification.error(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
        <h2>Register to login</h2>

        {error && <p className={styles.error}>{error}</p>}

        {formFields.map(({ label, name, type, autoComplete = "on" }) => (
          <div key={name}>
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              autoComplete={autoComplete}
            />
            {errors[name] && <span style={{ color: "red" }}>{errors[name]}</span>}
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering ...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
