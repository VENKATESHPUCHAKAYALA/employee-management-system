import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadEmployees = () => {
    fetch("/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const saveEmployee = async (e) => {
    e.preventDefault();

    const response = await fetch(
      editingId ? `/api/employees/${editingId}` : "/api/employees",
      {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, role }),
      },
    );

    if (!response.ok) {
      setError("Unable to save employee.");
      return;
    }

    setName("");
    setRole("");
    setEditingId(null);
    setError("");
    loadEmployees();
  };

  const editEmployee = (employee) => {
    setEditingId(employee.id);
    setName(employee.name);
    setRole(employee.role);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setError("");
  };

  const deleteEmployee = async (employeeId) => {
    if (!window.confirm("Delete this employee?")) return;

    const response = await fetch(`/api/employees/${employeeId}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete employee.");
      return;
    }
    if (editingId === employeeId) cancelEdit();
    loadEmployees();
  };

  return (
    <div>
      <h1>Employee Management</h1>

      <form onSubmit={saveEmployee}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <button type="submit">{editingId ? "Update Employee" : "Add Employee"}</button>
        {editingId && <button type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Employees</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>
                <button type="button" onClick={() => editEmployee(employee)}>Edit</button>
                <button type="button" onClick={() => deleteEmployee(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
