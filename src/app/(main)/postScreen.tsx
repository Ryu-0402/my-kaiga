import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { usePostUpload } from "@/src/hooks/usePostUpload";
import { router } from "expo-router";
import { Genre, GENRES } from "@/src/constants/genre";
import  Footer from "@/src/components/Footer";

export default function PostScreen() {
  const [caption, setCaption] = useState("");
  const [genre, setGenre] = useState<Genre>("その他");

  const { createPost, loading } = usePostUpload();

  const onPressPost = async () => {
    const result = await createPost(genre, caption);

   

   
    setCaption("");
    setGenre("その他");
    router.replace("/(main)");
  };

  return (
    <View className="flex-1 bg-black">
    <ScrollView className="flex-1 bg-black px-4 py-6">
      <Text className="text-white mb-2 mt-3">①ジャンル</Text>
      <View className="flex-row flex-wrap mb-4">
        {GENRES.map((item) => {
          const selected = genre === item;

          return (
            <Pressable
              key={item}
              onPress={() => setGenre(item)}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                selected ? "bg-yellow-500" : "bg-zinc-800"
              }`}
            >
              <Text className={selected ? "text-black" : "text-white"}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="text-white mb-2">②キャプション</Text>
      <TextInput
        value={caption}
        onChangeText={setCaption}
        placeholder="キャプションを入力"
        placeholderTextColor="#888"
        multiline
        textAlignVertical="top"
        className="border border-gray-300 rounded-lg p-4 mb-4 min-h-[120px] text-white"
      />

      <Pressable
        onPress={onPressPost}
        disabled={loading}
        className={`rounded-lg py-4 mb-4 ${
          loading ? "bg-gray-400" : "bg-yellow-500"
        }`}
      >
        <Text className="text-white text-center text-lg">
          {loading ? "投稿中..." : "画像を選んで投稿"}
        </Text>
      </Pressable>
     
    </ScrollView>
    <Footer />
  </View>
  );
}