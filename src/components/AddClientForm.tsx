import React, { useState } from "react";
import "./AddClientForm.scss";

interface AddClientFormProps {
  onAdd: (component: any) => void;
  onClose: () => void;
  componentData?: any; //
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState<{ 
    name: string; 
    number: string; 
    registrationDate: string; 
    meetingDate: string; 
    note: string; 
    status: string 
  }>({
    name: "",
    number: "",
    registrationDate: "", 
    meetingDate: "", 
    note: "",
    status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData });
  };

  return (
    <div className="modal">
      <form className="add-component-form" onSubmit={handleSubmit}>
        <h2>Добавить нового клиента</h2>

        <input 
          name="name" 
          placeholder="Имя" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />

        <select name="status" value={formData.status} onChange={handleChange} required>
          <option className="stat" value="" disabled>Статус</option>
          <option value="Активен">Активен</option>
          <option value="Неактивен">Неактивен</option>
        </select>

        <input 
          name="number" 
          type="number" 
          placeholder="Телефон" 
          value={formData.number} 
          onChange={handleChange} 
          required 
        />

<div className="date-input-wrapper">
  <input
    name="registrationDate"
    type="date"
    required
    value={formData.registrationDate}
    onChange={handleChange}
  />
  <label className="placeholder-text">
    {formData.registrationDate ? "Дата регистрации" : "дата регистрации"}
  </label>
</div>

<div className="date-input-wrapper">
  <input
    name="meetingDate"
    type="date"
    required
    value={formData.meetingDate}
    onChange={handleChange}
  />
  <label className="placeholder-text">
    {formData.meetingDate ? "Дата встречи" : "дата встречи"}
  </label>
</div>
        <input 
          name="note" 
          placeholder="Примечание" 
          value={formData.note} 
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