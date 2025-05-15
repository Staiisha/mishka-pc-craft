import { useState, useEffect } from "react";
import '../styles/Clients.scss';
import AddClientForm from "../components/AddClientForm";
import { Plus, Filter, Search, Trash, Edit } from "lucide-react";
import { fetchWithAuth } from "../api";


const typeMapping: { [key: string]: string } = {
  is_active: "Статус",
}

const statusMapping: { [key: string]: string } = {
  true: 'Активен',
  false: "Неактивен",
}

const Clients: React.FC = () => {
  const [first_nameFilter, setFirst_nameFilter] = useState(""); 
  const [phone_numberFilter, setPhone_numberFilter] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const [is_active, setIs_activeFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [clients, setClients] = useState<any[]>([]);

  // Загружаем данные при загрузке страницы
  useEffect(() => {
    
    const fetchClients = async () => {
      try {
        const response = await fetchWithAuth('/api/customers/');
        if (!response.ok) throw new Error('Ошибка загрузки клиентов');
        
       const data = await response.json();
       setClients(data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
  
    fetchClients();
  }, []);


  const filteredClients = clients.filter((client) =>
    client.first_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (first_nameFilter ? client.first_name.toLowerCase().includes(first_nameFilter.toLowerCase()) : true) &&
    (phone_numberFilter ? client.phone_number.includes(phone_numberFilter) : true) &&
   (is_active ? client.is_active.toString().includes(is_active) : true)
);


 const handleAddClient = async (newClient: any) => {
  try {
    let response;

    // Если редактируем существующего клиента
    if (editingClient) {
      response = await fetchWithAuth(`/api/customers/${editingClient.id}/`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        throw new Error("Ошибка при редактировании клиента");
      }

      const updatedClient = await response.json();
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        )
      );
    } else {
      // Если добавляем нового клиента
      response = await fetchWithAuth(`/api/customers/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении клиента");
      }

      const createdClient = await response.json();
      setClients((prevClients) => [...prevClients, createdClient]);
    }

    // Сброс состояния формы
    setEditingClient(null);
    setIsAdding(false);
  } catch (error) {
    console.error("Ошибка при добавлении/редактировании клиента:", error);
  }
};

 const handleDelete = async (id: number) => {
  if (window.confirm('Удалить клиента?')) {
    try {
      const response = await fetchWithAuth(`/api/customers/${id}/`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении');
      }

      // Удаление из состояния
      setClients((prevClients) => prevClients.filter((client) => client.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении клиента:", error);
    }
  }
};


  const handleEdit = (client: any) => {
    setEditingClient(client);
    setIsAdding(true); // Открыть форму редактирования
  };

  return (
    <div className="clients-page">
      <h1>Клиенты</h1>
      <div className="top-bar">
        <div className="search-container">
          <Search className="icon" />
          <input
            className="poisk"
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>



        <button className="add-btn" onClick={() => setIsAdding(true)}>
          <Plus size={18} /> Добавить
        </button>
      </div>
    

      <div className="filter-container">
        <Filter className="icon" />
        {/* Фильтр по имени */}
        <input
          type="text"
          className="filter-input"
          placeholder="Имя клиента"
          value={first_nameFilter}
          onChange={(e) => setFirst_nameFilter(e.target.value)}
        />

        {/* Фильтр по номеру телефона */}
        <input
          type="text"
          className="filter-input"
          placeholder="Номер телефона..."
          value={phone_numberFilter}
          onChange={(e) => setPhone_numberFilter(e.target.value)}
        />

        <input
          type="text"
          className="filter-input"
          placeholder="Статус"
          value={is_active}
          onChange={(e) => setIs_activeFilter(e.target.value)}
        />
        </div>
        


      <div className="client-list">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={`client-card ${selectedClient === client.id ? "selected" : ""}`}
            onClick={() => setSelectedClient(client.id)}
          >
            <div className="title">{client.first_name} {client.last_name}</div>
            <div className="details">
              <span>Телефон: {client.phone_number}</span>
              <span>Дата рождения: {client.birth_date}</span>
              <span>Email: {client.email}</span>
              <span>Статус: {statusMapping[String(client.is_active)]}</span>
              <span>Дата встречи: {client.date_meeting}</span>
              <span>Примечание: {client.description}</span>
            </div>
            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(client)}>
                <Edit size={16} />
              </button>
              <button className="delete-btn" onClick={() => handleDelete(client.id)}>
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

       {isAdding && (
        <AddClientForm 
          onAdd={handleAddClient} 
          onClose={() => setIsAdding(false)} 
          clientData={editingClient} 
        />
      )}
    </div>
  );
};

export default Clients;