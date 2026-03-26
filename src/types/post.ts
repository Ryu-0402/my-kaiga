import { Genre } from "@/src/constants/genre";

export type Post = {
  id: string;
  user_id: string;
  image_url: string;
  image_path: string;
  genre: Genre;
  caption: string | null;
  created_at: string;
};