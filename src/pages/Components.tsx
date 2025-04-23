import { useState, useEffect } from "react";
import '../styles/Components.scss';
import AddComponentForm from "../components/AddComponentForm"; 
import { Plus, Filter, Search, Trash, Edit } from "lucide-react";
import { fetchWithAuth } from "../api";

const Components: React.FC = () => {
  const [status, setStatus] = useState("");

  const [priceFilter, setPriceFilter] = useState(""); // Фильтр по цене
  const [nameFilter, setNameFilter] = useState(""); // Фильтр по названию
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const [editingComponent, setEditingComponent] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetchWithAuth('/api/components/'); // Дожидаемся выполнения запроса
        if (!response.ok) throw new Error('Ошибка загрузки компонентов');
  
        const data = await response.json(); // Дожидаемся обработки JSON
        setComponents(data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
  
    fetchComponents();
  }, []);
  

  const filteredComponents = components.filter((comp) =>
    (comp.details?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) &&
    (filter ? comp.type === filter : true) &&
    (status ? (Array.isArray(comp.status) ? comp.status.includes(status) : comp.status === status) : true) &&

    (priceFilter ? parseFloat(comp.purchase_price) <= Number(priceFilter) : true) &&
    (nameFilter ? (comp.details?.toLowerCase() ?? "").includes(nameFilter.toLowerCase()) : true)
  );
  

 const handleAddComponent = async (newComponent: any) => {
  try {
    let response;
    if (editingComponent) {
      // Редактирование существующего компонента
      response = await fetchWithAuth(`/api/components/${editingComponent.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newComponent,
          details: newComponent.name, // Преобразуем name в details
          purchase_price: newComponent.price, // Преобразуем price в purchase_price
          quantity: newComponent.quantity, // Преобразуем quantity в quantity
        }),
      });
    } else {
      // Добавление нового компонента
      response = await fetchWithAuth("/api/components/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newComponent,
          details: newComponent.name, // Преобразуем name в details
          purchase_price: newComponent.price, // Преобразуем price в purchase_price
      
          quantity: newComponent.quantity, // Преобразуем quantity в quantity
        }),
      });
    }

    if (!response.ok) {
      throw new Error("Ошибка при сохранении компонента");
    }

    const updatedComponent = await response.json();

    // Обновляем состояние
    setComponents((prev) =>
      editingComponent
        ? prev.map((comp) => (comp.id === editingComponent.id ? updatedComponent : comp))
        : [...prev, updatedComponent]
    );

    setIsAdding(false);
    setEditingComponent(null);
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
  }
};
  

const handleDelete = async (id: number) => {
  if (window.confirm("Удалить компонент?")) {
    try {
      const response = await fetchWithAuth(`/api/components/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении компонента");
      }

      // Удаляем компонент из состояния
      setComponents((prev) => prev.filter((comp) => comp.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении компонента:", error);
    }
  }
};


  const handleEdit = (comp: any) => {
    setEditingComponent(comp);
    setIsAdding(true); // Открыть форму редактирования
  };
  const getStatusText = (status?: string | string[]) => {
    if (!status) return "Нет данных"; // Если `null` или `undefined`
  
    const statusMap: Record<string, string> = {
      in_stock: "В наличии",
      ordered: "Заказано",
      planned: "Запланировано",
    };
  
    // Если статус — массив, берем первый подходящий
    if (Array.isArray(status)) {
      return status.map((s) => statusMap[s] || `Неизвестно (${s})`).join(", ");
    }
  
    return statusMap[status] || `Неизвестно (${status})`; 
  };
  
  
  

  return (
    <div className="components-page">
      <h1>Комплектующие</h1>
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
        <select className="filter-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Все</option>
          <option value="cpu">Процессор</option> 
          <option value="vd">Видеокарта</option> 
          <option value="tower">Башня</option> 
          <option value="ram">Оперативная память </option> 
          <option value="case">Корпус</option> 
          <option value="psu">Блок питания</option> 
          <option value="hdd">HDD накопитель</option> 
          <option value="ssd">SSD накопитель</option> 
          <option value="motherboard">Материнская плата</option> 
          <option value="cooler">Кулер</option> 
          <option value="controller">Контроллер</option> 
          <option value="watercooler">СВО</option>
        </select>

        {/* Фильтр по наличию */}
        <select className="filter-input" value={status} onChange={(e) => setStatus(e.target.value)}>

          <option value="in_stock">В наличии</option>
          <option value="ordered">Заказано</option>
          <option value="planned">Запланировано</option>
        </select>

        {/* Фильтр по цене */}
        <input 
          type="number"
          className="filter-input"
          placeholder="Себестоимость"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        />

        {/* Фильтр по названию */}
        <input
          type="text"
          className="filter-input"
          placeholder="Название"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      <div className="component-list">
        {filteredComponents.map((comp) => (
          <div
            key={comp.id}
            className={`component-card ${selectedComponent === comp.id ? "selected" : ""}`}
            onClick={() => setSelectedComponent(comp.id)}
          >
            <div className="title">{comp.details}</div>
            <div className="details">
              <span>Себестоимость: {comp.purchase_price} руб.</span>
              <span>Наличие:  {getStatusText(comp.status)}</span> {/* Применяем getStatusText */}

              <span>Количество: {comp.quantity}</span>
              <span>Тип: {comp.type}</span>
              <span className="notes">Описание: {comp.notes?.toString()}</span>

            </div>
            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(comp)}>
                <Edit size={16} />
              </button>
              <button className="delete-btn" onClick={() => handleDelete(comp.id)}>
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && <AddComponentForm onAdd={handleAddComponent} onClose={() => setIsAdding(false)} componentData={editingComponent} />}
    </div>
  );
};

export default Components;
