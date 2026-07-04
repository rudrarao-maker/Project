import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, Clock, Plus, Trash2, User as UserIcon, Shield, Search
} from "lucide-react";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  
  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assigneeType, setAssigneeType] = useState("admin"); // 'admin' or 'user'
  const [assigneeId, setAssigneeId] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = filter === "all" ? "/api/tasks" : `/api/tasks?type=${filter}`;
      const res = await fetch(`http://localhost:5000${url}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title,
        description,
        priority,
      };
      
      if (assigneeType === "admin") {
        payload.assignedToId = assigneeId;
      } else {
        payload.userId = assigneeId;
      }

      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowModal(false);
        setTitle("");
        setDescription("");
        setAssigneeId("");
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 h-full bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
          <p className="text-gray-500 text-sm">Assign and track tasks across the portal.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 border'}`}
          onClick={() => setFilter("all")}
        >
          All Tasks
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'assigned_to_me' ? 'bg-primary text-white' : 'bg-white text-gray-600 border'}`}
          onClick={() => setFilter("assigned_to_me")}
        >
          Assigned to Me
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'assigned_to_users' ? 'bg-primary text-white' : 'bg-white text-gray-600 border'}`}
          onClick={() => setFilter("assigned_to_users")}
        >
          Citizen Tasks
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={task.id} 
              className="bg-white rounded-xl shadow-sm border p-5 flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-1">{task.title}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-3">{task.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                {task.userId ? (
                  <><UserIcon size={16} className="text-blue-500"/> Citizen: {task.user?.name || `ID: ${task.userId}`}</>
                ) : (
                  <><Shield size={16} className="text-purple-500"/> Admin: {task.assignedTo?.name || `ID: ${task.assignedToId}`}</>
                )}
              </div>

              <div className="flex justify-between items-center mt-auto border-t pt-4">
                <span className={`text-sm font-medium flex items-center gap-1 ${task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {task.status === 'completed' ? <CheckCircle size={16}/> : <Clock size={16}/>}
                  {task.status.replace("_", " ")}
                </span>
                
                {task.status !== 'completed' && (
                  <button 
                    onClick={() => updateStatus(task.id, "completed")}
                    className="text-xs bg-gray-100 hover:bg-green-100 hover:text-green-700 px-3 py-1.5 rounded transition font-medium"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {tasks.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-xl border border-dashed">
              No tasks found. Click "New Task" to create one.
            </div>
          )}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded-lg p-2 h-24" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select className="w-full border rounded-lg p-2" value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Assign To</label>
                  <select className="w-full border rounded-lg p-2" value={assigneeType} onChange={e => setAssigneeType(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="user">Citizen (User)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{assigneeType === 'admin' ? 'Admin ID' : 'User ID'}</label>
                <input required type="number" className="w-full border rounded-lg p-2" value={assigneeId} onChange={e => setAssigneeId(e.target.value)} placeholder={`Enter ${assigneeType} numeric ID`} />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
