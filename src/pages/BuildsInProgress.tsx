import { useState, useEffect } from "react";
import '../styles/BuildsInProgress.scss';
import AddBuildsInProgress from "../components/AddBuildsInProgress"; 
import { Plus, Filter, Search, Trash, Edit } from "lucide-react";

const Build: React.FC = () => {
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sellingpriceFilter, setSellingpriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuild, setSelectedBuild] = useState<number | null>(null);
  const [editingBuild, setEditingBuild] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [builds, setBuilds] = useState<any[]>([]);
  const [components, setComponents] = useState<any[]>([]); // Храним список компонентов

  // Загружаем сборки из localStorage
  useEffect(() => {
    const savedBuilds = localStorage.getItem("inProgressBuilds");
    if (savedBuilds) {
      try {
        setBuilds(JSON.parse(savedBuilds) || []);
      } catch (error) {
        console.error("Ошибка при загрузке inProgressBuilds:", error);
        setBuilds([]);
      }
    }
  }, []);

  // Загружаем список компонентов из localStorage
  useEffect(() => {
    const savedComponents = localStorage.getItem("components");
    if (savedComponents) {
      try {
        setComponents(JSON.parse(savedComponents) || []);
      } catch (error) {
        console.error("Ошибка при загрузке компонентов:", error);
        setComponents([]);
      }
    }
  }, []);

  // Сохраняем сборки в localStorage
  useEffect(() => {
    localStorage.setItem("inProgressBuilds", JSON.stringify(builds));
  }, [builds]);

  const filteredBuilds = builds.filter((build) =>
    (build.name || "").toLowerCase().includes(searchQuery.toLowerCase()) &&
    (sellingpriceFilter ? build.sellingprice <= Number(sellingpriceFilter) : true)
  );

  const handleAddBuild = (newBuild: any) => {
    let updatedBuilds;
    if (editingBuild) {
      updatedBuilds = builds.map((build) =>
        build.id === editingBuild.id ? { ...build, ...newBuild } : build
      );
    } else {
      updatedBuilds = [...builds, { ...newBuild, id: Date.now() }];
    }
    setBuilds(updatedBuilds);
    setIsAdding(false);
    setEditingBuild(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Удалить сборку?")) {
      const updatedBuilds = builds.filter((build) => build.id !== id);
      setBuilds(updatedBuilds);
    }
  };

  const handleEdit = (build: any) => {
    setEditingBuild(build);
    setIsAdding(true);
  };

  return (
    <div className="build-page">
      <h1>Сборки в процессе</h1>
      <div className="top-bar">
        <div className="search-container">
          <Search className="icon" />
          <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button className="add-btn" onClick={() => setIsAdding(true)}>
          <Plus size={18} /> Добавить
        </button>
      </div>
      <div className="filter-container">
        <Filter className="icon" />
        <input type="number" className="filter-input" placeholder="Цена продажи" value={sellingpriceFilter} onChange={(e) => setSellingpriceFilter(e.target.value)} />
      </div>
      <div className="build-list">
        {filteredBuilds.map((build) => (
          <div key={build.id} className={`build-card ${selectedBuild === build.id ? "selected" : ""}`} onClick={() => setSelectedBuild(build.id)}>
            <div className="name"><strong>{build.name || ""}</strong></div>
            <div className="details">
              <span>Цена продажи: {build.sellingprice} руб.</span>
              <span>Себестоимость: {build.costprice} руб.</span>
              <span>Компоненты: {build.components} </span>
              <span>Описание:  {build.description}</span>

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
          buildData={editingBuild}
          components={components} // Передаем список компонентов
        />
      )}
    </div>
  );
};

export default Build;
