"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import PostForm from "@/components/admin/PostForm";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => { api.get("/posts/admin/all").then((res) => setPost(res.data.find((p) => p._id === id))); }, [id]);
  if (!post) return <p>Đang tải...</p>;
  return (<div><h1 className="text-2xl font-bold mb-8">Sửa bài viết</h1><PostForm initial={post} postId={id} /></div>);
}
