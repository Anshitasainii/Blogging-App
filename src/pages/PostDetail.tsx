import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, ThumbsUp } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
  likes: number;
  author_id: string;
  profiles: {
    name: string;
    profile_image: string | null;
  } | null;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
     const { data, error } = await supabase
  .from("posts")
  .select("*, profiles(name, profile_image)")

        .eq("id", postId)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-lg font-semibold">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-lg font-semibold">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>

          {/* Article Section */}
          <article>
            {/* Image */}
            {post.image && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title and Meta */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {post.profiles?.profile_image ? (
                    <img
                      src={post.profiles.profile_image}
                      alt={post.profiles.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                  <span>By {post.profiles?.name || "Anonymous"}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                {/* Likes */}
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes} {post.likes === 1 ? "Like" : "Likes"}</span>
                </div>
              </div>
            </header>

            {/* Content */}
            <Card>
              <CardContent className="prose prose-lg max-w-none pt-6 text-foreground">
                <div className="whitespace-pre-wrap">{post.content}</div>
              </CardContent>
            </Card>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
