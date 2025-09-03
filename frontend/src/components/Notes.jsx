import React, { useState, useEffect } from "react";
import axios from "axios";

function Notes({ token }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  const fetchNotes = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
  };

  const addNote = async () => {
    if (!text.trim()) return;
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/notes`,
      { content: text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setText("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-purple-300"
          placeholder="Write a note..."
        />
        <button
          onClick={addNote}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {notes.map((n) => (
          <li
            key={n._id}
            className="flex justify-between items-center bg-gray-100 rounded-lg px-3 py-2 shadow-sm"
          >
            <span>{n.content}</span>
            <button
              onClick={() => deleteNote(n._id)}
              className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
