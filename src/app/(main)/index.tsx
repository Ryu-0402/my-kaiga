import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { useMemo, useState } from "react";
import { usePosts } from "@/src/hooks/usePosts";
import { useReportPost } from "@/src/hooks/useReportPost";
import Footer from "@/src/components/Footer";
import { Genre } from "@/src/constants/genre";

const genres: ("すべて" | Genre)[] = [
  "すべて",
  "動物",
  "人物",
  "キャラクター",
  "ホラー",
  "自然",
  "食べ物",
  "物体",
  "その他",
];

export default function GalleryScreen() {
  const { posts, loading, refresh } = usePosts();
  const { reportPost, loading: reportLoading } = useReportPost();

  const [selectedGenre, setSelectedGenre] =
    useState<"すべて" | Genre>("すべて");

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<(typeof posts)[number] | null>(
    null
  );

  const filteredPosts = useMemo(() => {
    if (selectedGenre === "すべて") return posts;
    return posts.filter((item) => item.genre === selectedGenre);
  }, [posts, selectedGenre]);

  const openViewer = (post: (typeof posts)[number]) => {
    setSelectedPost(post);
    setViewerVisible(true);
  };

  const closeViewer = () => {
    setViewerVisible(false);
    setSelectedPost(null);
  };

  const onPressReport = (postId: string) => {
    Alert.alert("通報", "この投稿を通報しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "通報する",
        style: "destructive",
        onPress: async () => {
          const result = await reportPost(postId);

          if (!result.ok) {
            Alert.alert("失敗", result.message);
            return;
          }

          Alert.alert("完了", result.message);
        },
      },
    ]);
  };

  const onPressMenu = () => {
    if (!selectedPost || reportLoading) return;

    Alert.alert("メニュー", "", [
      {
        text: "通報",
        style: "destructive",
        onPress: () => onPressReport(selectedPost.id),
      },
      {
        text: "キャンセル",
        style: "cancel",
      },
    ]);
  };

  return (
    <View className="flex-1 bg-black">
      {/* ジャンル横スクロール */}
      <View className="pt-12 pb-5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {genres.map((genre) => {
            const active = selectedGenre === genre;

            return (
              <Pressable
                key={genre}
                onPress={() => setSelectedGenre(genre)}
                className={`mr-2 px-4 py-2 rounded-full ${
                  active ? "bg-white" : "bg-neutral-800"
                }`}
              >
                <Text className={active ? "text-black font-bold" : "text-white"}>
                  {genre}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 画像一覧 */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={
          filteredPosts.length === 0 ? { flexGrow: 1 } : { paddingBottom: 24 }
        }
        renderItem={({ item }) => (
          <Pressable
            className="w-1/3 p-[1px]"
            onPress={() => openViewer(item)}
          >
            <Image
              source={{ uri: item.image_url }}
              className="w-full aspect-square bg-gray-700"
              resizeMode="cover"
            />
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400">
                {selectedGenre === "すべて"
                  ? "まだ投稿がありません"
                  : `${selectedGenre} の投稿はまだありません`}
              </Text>
            </View>
          ) : null
        }
      />

      {/* 拡大表示モーダル */}
      <Modal
        visible={viewerVisible}
        animationType="fade"
        transparent
        onRequestClose={closeViewer}
      >
        <View className="flex-1 bg-black/95">
          {/* 右上三点メニュー */}
          <View className="absolute top-14 right-4 z-50">
            <Pressable
              onPress={onPressMenu}
              disabled={reportLoading}
              className="px-3 py-2"
            >
              <Text className="text-white text-2xl font-bold">
                {reportLoading ? "…" : "⋯"}
              </Text>
            </Pressable>
          </View>

          {/* 閉じる */}
          <Pressable onPress={closeViewer} className="pt-14 px-4 pb-4">
            <Text className="text-white text-lg">閉じる</Text>
          </Pressable>

          {/* 画像 */}
          <View className="flex-1 items-center justify-center px-4">
            {selectedPost && (
              <Image
                source={{ uri: selectedPost.image_url }}
                className="w-full h-[70%] bg-neutral-900 rounded-xl"
                resizeMode="contain"
              />
            )}
          </View>

          {/* 下情報 */}
          {selectedPost && (
            <View className="px-4 pb-8 pt-4 border-t border-neutral-800">
              <Text className="text-white text-sm">
                {selectedPost.caption?.trim()
                  ? selectedPost.caption
                  : "キャプションはありません"}
              </Text>
            </View>
          )}
        </View>
      </Modal>

      <Footer />
    </View>
  );
}