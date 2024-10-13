import React, { useEffect, useState } from "react";
import axios from "axios";

type UserResponse = {
  id: string;
  query: string;
  result_text: string;
  summary: string;
  result_table_path: string;
  result_visualization_path: string;
};

type User = {
  uid: string;
  name: string;
  email: string;
  responses: UserResponse[];
};

type AdminPanelProps = {
  onClose: () => void;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://tg-postgres.onrender.com/api/getUsers"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black w-[70vw] h-[70vh] p-6 relative rounded-lg shadow-lg overflow-auto">
        <button
          className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <div className="content">
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => (
              <div key={user.uid} className="mb-20">
                <h3 className="text-xl">
                  {user.name} ({user.email})
                </h3>
                <h4 className="font-bold">Responses:</h4>
                <ul>
                  {user.responses.length === 0 ? (
                    <li>No responses found.</li>
                  ) : (
                    user.responses.map((response) => (
                      <li key={response.id} className="ml-4">
                        <strong>Query:</strong> {response.query} <br />
                        <strong>Result:</strong> {response.result_text} <br />
                        <strong>Summary:</strong> {response.summary} <br />
                        <a
                          href={response.result_table_path}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Table
                        </a>{" "}
                        <br />
                        <a
                          href={response.result_visualization_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mb-6"
                        >
                          View Visualization
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
