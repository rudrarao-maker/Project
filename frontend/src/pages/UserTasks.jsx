import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Search } from "lucide-react";

export default function UserTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tasks", {
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

  const markComplete = async (id) => {
    if (!window.confirm("Mark this task as complete?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: "completed" })
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-2">Complete these pending actions requested by the administration.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={task.id} 
              className={`bg-white rounded-xl shadow-sm border-l-4 p-5 flex flex-col md:flex-row gap-6 items-start md:items-center ${task.status === 'completed' ? 'border-green-500 opacity-70' : 'border-primary'}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-xl text-gray-900">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-gray-600">{task.description}</p>
                <div className="text-sm text-gray-400 mt-2">
                  Assigned on: {new Date(task.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[150px]">
                {task.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg justify-center border border-green-100">
                    <CheckCircle size={20} /> Completed
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-yellow-600 font-bold bg-yellow-50 px-4 py-2 rounded-lg justify-center border border-yellow-100 mb-2">
                      <Clock size={20} /> Pending
                    </div>
                    <button 
                      onClick={() => markComplete(task.id)}
                      className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition w-full text-center"
                    >
                      Mark as Done
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {tasks.length === 0 && (
            <div className="py-20 text-center text-gray-500 bg-white rounded-xl border border-dashed text-lg font-medium">
              No tasks assigned to you right now. 
              <br/><span className="text-sm font-normal">You're all caught up!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
