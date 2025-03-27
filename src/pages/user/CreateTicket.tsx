import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const uniqueFiles = newFiles.filter(
        (file) => !attachments.some((existing) => existing.name === file.name)
      );
      setAttachments([...attachments, ...uniqueFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const response = await fetch("http://localhost:3000/api/tickets/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess("Ticket created successfully!");
      setTitle("");
      setDescription("");
      setAttachments([]);
    } catch (error) {
      setError("Failed to create ticket. Please try again.");
      console.error("Error creating ticket:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-blue-300 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Create a Ticket
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-lg font-semibold">Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border focus:ring-2 text-lg"
            />
          </div>

          <div>
            <Label className="text-lg font-semibold">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full h-40 px-4 py-3 rounded-md border focus:ring-2 text-lg"
            />
          </div>

          <div>
            <Label className="text-lg font-semibold">Attachments</Label>
            <Input type="file" multiple onChange={handleFileChange} className="w-full text-lg" />
            {attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-600 font-medium">Selected Files:</p>
                <ul className="list-disc ml-5 text-gray-700">
                  {attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="w-1/3 bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-medium py-3 rounded-md text-lg">
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;
