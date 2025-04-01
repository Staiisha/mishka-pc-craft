import { useState, useEffect } from "react";
import '../styles/Clients.scss';
import AddClientForm from "../components/AddClientForm";
import { Plus, Filter, Search, Trash, Edit } from "lucide-react";

const Clients: React.FC = () => {
  const [nameFilter, setNameFilter] = useState(""); // Фильтр по имени клиента
  const [phoneFilter, setPhoneFilter] = useState(""); // Фильтр по номеру телефона
  const [statusFilter, setStatusFilter] = useState(""); // Фильтр по статусу клиента
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [clients, setClients] = useState<any[]>([]);

  // Загружаем данные при загрузке страницы
  useEffect(() => {
    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients) || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных из localStorage:", error);
        setClients([]); // Если данные повреждены, сбрасываем массив
      }
    }
  }, []);

  // Сохраняем данные в localStorage при изменении clients, если он не пуст
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem("clients", JSON.stringify(clients));
    }
  }, [clients]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (nameFilter ? client.name.toLowerCase().includes(nameFilter.toLowerCase()) : true) &&
    (phoneFilter ? client.phone.includes(phoneFilter) : true) &&
    (statusFilter ? client.status === statusFilter : true)
  );

  const handleAddClient = (newClient: any) => {
    if (editingClient) {
      // Обновляем существующего клиента
      const updatedClients = clients.map((client) =>
        client.id === editingClient.id ? { ...client, ...newClient } : client
      );
      setClients(updatedClients);
    } else {
      // Добавляем нового клиента
      const updatedClients = [...clients, { ...newClient, id: clients.length + 1 }];
      setClients(updatedClients);
    }
    setIsAdding(false);
    setEditingClient(null); // Закрываем форму
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Удалить клиента?")) {
      const updatedClients = clients.filter((client) => client.id !== id);
      setClients(updatedClients);
      if (updatedClients.length === 0) {
        localStorage.removeItem("clients"); // Удаляем запись, если список пуст
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
          placeholder="Имя клиента..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        {/* Фильтр по номеру телефона */}
        <input
          type="text"
          className="filter-input"
          placeholder="Номер телефона..."
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
        />

        {/* Фильтр по статусу */}
        <select className="filter-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Статус</option>
          <option value="aАктивен">Активен</option>
          <option value="Неактивен">Неактивен</option>
        </select>
      </div>

      <div className="client-list">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={`client-card ${selectedClient === client.id ? "selected" : ""}`}
            onClick={() => setSelectedClient(client.id)}
          >
            <div className="title">{client.name}</div>
            <div className="details">
              <span>Телефон: {client.number}</span>
              <span>Статус: {client.status}</span>
              <span>Дата регистрации: {client.registrationDate}</span>
              <span>Дата встречи: {client.meetingDate}</span>
              <span><strong>Примечание:</strong> {client.note}</span>
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

      {isAdding && <AddClientForm onAdd={handleAddClient} onClose={() => setIsAdding(false)} componentData={editingClient} />}
    </div>
  );
};

export default Clients;