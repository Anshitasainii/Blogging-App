import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ThumbsUp } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
  likes: number | null;
}

interface Like {
  post_id: string;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<{ [key: string]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userResult = await supabase.auth.getUser();
      const user_id = userResult.data?.user?.id;
      setUserId(user_id);

      const [postsRes, likesRes] = await Promise.all([
        supabase.from("posts").select("*").order("created_at", { ascending: false }),
        user_id
          ? supabase.from("likes").select("post_id").eq("user_id", user_id)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (postsRes.error) {
        console.error("Error fetching posts:", postsRes.error);
      } else if (postsRes.data) {
        setPosts(postsRes.data);
        const initialLikes: { [key: string]: number } = {};
        postsRes.data.forEach((post) => {
          initialLikes[post.id] = post.likes;
        });
        setLikeCounts(initialLikes);
      }

      if (likesRes.data) {
        const liked = likesRes.data.map((like: Like) => like.post_id);
        setLikedPosts(liked);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLikeToggle = async (postId: string) => {
    if (!userId) return;

    const alreadyLiked = likedPosts.includes(postId);

    if (alreadyLiked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);

      if (!error) {
        await supabase
          .from("posts")
          .update({ likes: (likeCounts[postId] ?? 0) + 1 })
          .eq("id", postId);

        setLikedPosts((prev) => prev.filter((id) => id !== postId));
        setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 1) - 1 }));
      } else {
        console.error("Error unliking post:", error);
      }
    } else {
      const { error } = await supabase.from("likes").insert([
        {
          user_id: userId,
          post_id: postId,
        },
      ]);

      if (!error) {
        await supabase
          .from("posts")
          .update({ likes: (likeCounts[postId] || 0) + 1 })
          .eq("id", postId);

        setLikedPosts((prev) => [...prev, postId]);
        setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      } else {
        console.error("Error liking post:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading all posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h1>

        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground">No blog posts available.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const isExpanded = expandedPosts[post.id] || false;
              const likeCount = likeCounts[post.id] ?? 0;
              const isLiked = likedPosts.includes(post.id);

              return (
                <Card key={post.id} className="flex flex-col">
                  {post.image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isExpanded
                        ? post.content
                        : post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>

                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/post/${post.id}`)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Full Post
                    </Button>
                    <Button
                      variant={isLiked ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleLikeToggle(post.id)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
