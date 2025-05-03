import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const initialFiles = [
  {
    _id: "1",
    name: "First Amendment.pdf",
    type: "PDF",
    category: "Amendments",
  },
  {
    _id: "2",
    name: "Constitution of 1787.docx",
    type: "DOCX",
    category: "Constitutions",
  },
  {
    _id: "3",
    name: "Legal Brief 2023.txt",
    type: "TXT",
    category: "Legal",
  },
];

const UploadedFilesPage = () => {
  const [files, setFiles] = useState(initialFiles);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (confirmed) {
      setFiles((prev) => prev.filter((file) => file._id !== id));
    }
  };

  const handleEdit = (id) => {
    alert("Edit file with ID: " + id);
    // Future: open modal or navigate to edit page
  };

  return (
    <main className="p-6">
      <header>
        <h1 className="text-2xl font-semibold mb-6">Uploaded Files</h1>
      </header>

      {files.length === 0 ? (
        <p className="text-gray-600">No files uploaded yet.</p>
      ) : (
        <section className="grid gap-4">
          {files.map((file) => (
            <article
              key={file._id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
            >
              <section>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-600">Type: {file.type}</p>
                <p className="text-sm text-gray-500">Category: {file.category}</p>
              </section>
              <nav className="flex gap-4">
                <Pencil
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => handleEdit(file._id)}
                  aria-label="Edit"
                />
                <Trash2
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(file._id)}
                  aria-label="Delete"
                />
              </nav>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default UploadedFilesPage;
