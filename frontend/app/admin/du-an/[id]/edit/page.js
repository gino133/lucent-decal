"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import ProjectForm from "@/components/admin/ProjectForm";

export default function EditProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  useEffect(() => { api.get("/projects/admin/all").then((res) => setProject(res.data.find((p) => p._id === id))); }, [id]);
  if (!project) return <p>Đang tải...</p>;
  return (<div><h1 className="text-2xl font-bold mb-8">Sửa dự án</h1><ProjectForm initial={project} projectId={id} /></div>);
}
