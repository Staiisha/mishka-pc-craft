import { useState, useEffect } from "react";
import "../styles/BuildsInProgress.scss";
import AddBuildsInProgress from "../components/AddBuildsInProgress";
import { Plus, Filter, Search, Trash, Edit } from "lucide-react";
import { fetchWithAuth } from "../api";

export interface Component {
  id: string;
  name: string;
  type: string;
  details: string;
  quantity: number;
  status?: string; // если допускается отсутствие
}

interface Build {
  id: string;
  name: string;
  description: string;
  in_progress_price: string;
  components: {
    component: string;
    quantity: number;
    component_data?: {
      id: string;
      details: string;
    };
  }[];
}

const BuildsInProgress: React.FC = () => {
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [inProgressPriceFilter, setInProgressPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);
  const [editingBuild, setEditingBuild] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [builds, setBuilds] = useState<any[]>([]);
  const [componentsFull, setComponentsFull] = useState<Component[]>([]);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const response = await fetchWithAuth("/api/in_progress_builds/");
        const data = await response.json();
        setBuilds(data);
      } catch (error) {
        console.error("Ошибка при загрузке сборок:", error);
      }
    };
    fetchBuilds();
  }, []);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetchWithAuth("/api/components");
        if (!response.ok) throw new Error("Ошибка загрузки компонентов");
        const data = await response.json();
        setComponentsFull(data);
      } catch (error) {
        console.error("Ошибка загрузки компонентов:", error);
      }
    };
    fetchComponents();
  }, []);

  const filteredBuilds = builds.filter((build) =>
    (build.name || "").toLowerCase().includes(searchQuery.toLowerCase()) &&
    (inProgressPriceFilter ? build.in_progress_price <= Number(inProgressPriceFilter) : true)
  );

  const handleAddBuild = async (newBuild: any) => {
    const isEditing = Boolean(editingBuild?.id);
    const url = isEditing
      ? `/api/in_progress_builds/${editingBuild.id}/`
      : `/api/in_progress_builds/`;
  
    const method = isEditing ? "PUT" : "POST";
  
    try {
      const payload = {
        name: newBuild.name, // ← обязательно должно быть
        in_progress_price: newBuild.in_progress_price || "0.00",
        planned_sell_price: newBuild.planned_sell_price || null,
        description: newBuild.description || "",
        components: newBuild.components.map((c: any) => ({
          quantity: c.quantity,
          component: typeof c.component === "string" ? c.component : c.component.id,
        })),
      };
  
      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const updated = await fetchWithAuth("/api/in_progress_builds/");
        const fullData = await updated.json();
        setBuilds(fullData);
        setIsAdding(false);
      } else {
        console.error("Ответ сервера:", data);
        throw new Error(data.message || "Ошибка сервера");
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить сборку?")) return;
    try {
      await fetchWithAuth(`/api/in_progress_builds/${id}/`, { method: "DELETE" });
      setBuilds((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении сборки:", error);
    }
  };

  const handleEdit = async (build: any) => {
    try {
      const response = await fetchWithAuth(`/api/in_progress_builds/${build.id}/`);
      const data = await response.json();
      setEditingBuild(data);
      setIsAdding(true);
    } catch (error) {
      console.error("Ошибка при загрузке сборки для редактирования:", error);
    }
  };

  return (
    <div className="build-page">
      <h1>Сборки в работе</h1>
      <div className="top-bar">
        <div className="search-container">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={() => { setIsAdding(true); setEditingBuild(null); }}>
          <Plus size={18} /> Добавить
        </button>
      </div>

      <div className="filter-container">
        <Filter className="icon" />
        <input
          type="number"
          className="filter-input"
          placeholder="Себестоимость"
          value={inProgressPriceFilter}
          onChange={(e) => setInProgressPriceFilter(e.target.value)}
        />
      </div>

      <div className="build-list">
        {filteredBuilds.map((build) => (
          <div
            key={build.id}
            className={`build-card ${selectedBuild === build.id ? "selected" : ""}`}
            onClick={() => setSelectedBuild(build.id)}
          >
            <div className="name">
              <strong>{build.name || ""}</strong>
            </div>
            <div className="details">
              <span><strong>Текущая себестоимость: </strong>{build.in_progress_price} руб.</span>
  <span><strong>Компоненты: </strong>
{Array.isArray(build.components) && build.components.length > 0 ? (
  build.components.map((component: any, index: number) => {
    const name = component.component_data?.details || `ID: ${component.component_data?.id || "неизвестен"}`;
    const quantity = component.in_build_quantity || 1;

    return (
      <span key={index}>
        {name} ({quantity})
      </span>
    );
  })
) : (
  "Нет данных"
)}

</span>


              <span><strong>Описание: </strong>{build.description}</span>
            </div>
            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(build)}>
                <Edit size={16} />
              </button>
              <button className="delete-btn" onClick={() => handleDelete(build.id)}>
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <AddBuildsInProgress
          onAdd={handleAddBuild}
          onClose={() => setIsAdding(false)}
          editingBuild={editingBuild} 
          buildData={editingBuild}
          components={componentsFull}
        />
      )}
    </div>
  );
};

export default BuildsInProgress;
