import React, { useState, useEffect } from "react";
import "./AddClientForm.scss";

interface AddClientFormProps {
  onAdd: (client: any) => void;
  onClose: () => void;
  clientData?: any;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onAdd, onClose, clientData }) => {
  const [formData, setFormData] = useState<{ 
    first_name: string; 
    last_name: string;
    phone_number: string; 
    email: string;
    birth_date: string,
    date_meeting: string; 
    description: string; 
    is_active: string;
  }>({
    first_name: "",
    is_active: '',
    last_name:'',
    phone_number: "",
    email: '',
    date_meeting: "", 
    birth_date: '',
   description: "",
  });

useEffect(() => {
  if (clientData) {
    setFormData({
      first_name: clientData.first_name || "",
      last_name: clientData.last_name || "",
      phone_number: clientData.phone_number || "",
      email: clientData.email || "",
      birth_date: clientData.birth_date || "",
      date_meeting: clientData.date_meeting
        ? clientData.date_meeting.slice(0, 16)
        : "",
      description: clientData.description || "",
      is_active: String(clientData.is_active),
    });
  }
}, [clientData]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const clientToSend = {
    ...formData,
    is_active: formData.is_active === "true", 
    birth_date: formData.birth_date || null,
    date_meeting: formData.date_meeting || null,
    phone_number: formData.phone_number.trim(),
  };

  onAdd(clientToSend);
};


  return (
    <div className="modal">
      <form className="add-component-form" onSubmit={handleSubmit}>
        <h2>Добавить нового клиента</h2>

        <input 
          name="first_name" 
          placeholder="Имя" 
          value={formData.first_name} 
          onChange={handleChange} 
          required 
        />

            <input 
          name="last_name" 
          placeholder="Фамилия" 
          value={formData.last_name} 
          onChange={handleChange} 

        />

        <label htmlFor="is_active" className="form-label">Выберите статус: </label>
        <select
          id="is_active"
          name="is_active"
          value={formData.is_active}
          onChange={handleChange}
          required
        >
      <option value="true">Активен</option>
      <option value="false">Неактивен</option>
    </select>

 
<div className="date-input-wrapper">
  <input
    name="birth_date"
    type="date"
    value={formData.birth_date}
    onChange={handleChange}
  />
  <label className="placeholder-text">
    {formData.birth_date ? "Дата рождения" : "Дата рождения"}
  </label>
</div>

     <input 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 

        />

        <input 
          name="phone_number" 
          type="text" 
          placeholder="Телефон" 
          value={formData.phone_number} 
          onChange={handleChange} 
          required
    
        />


<div className="date-input-wrapper">
  <input
    name="date_meeting"
    type="datetime-local"
    value={formData.date_meeting}
    onChange={handleChange}
  />
  <label className="placeholder-text">
    {formData.date_meeting ? "Дата встречи" : "Дата встречи"}
  </label>
</div>
        <textarea
          name="description" 
          placeholder="Примечание" 
          value={formData.description} 
          onChange={handleChange} 
        />

        <div className="form-buttons">
          <button type="submit" className="save">Добавить</button>
          <button type="button" className="cancel" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </div>
  );
};

export default AddClientForm;