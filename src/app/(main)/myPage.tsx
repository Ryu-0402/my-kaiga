import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  Image,
  Modal,
  Alert,
} from "react-native";
import { useState, useMemo } from "react";
import ImageViewing from "react-native-image-viewing";
import Footer from "@/src/components/Footer";
import { useAccount } from "@/src/providers/AccountProvider";
import { router } from "expo-router";
import { useMyPosts } from "@/src/hooks/useMyPosts";
import { useDeletePost } from "@/src/hooks/useDeletePost";

export default function HomeScreen() {
  const { account, loading } = useAccount();
  const { posts, loading: postsLoading, refresh } = useMyPosts();
  const { deletePost, loading: deleting } = useDeletePost();

  const [zoomAvatar, setZoomAvatar] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const avatarUrl = account?.avatar_url ?? undefined;

  const images = useMemo(
    () => posts.map((item) => ({ uri: item.image_url })),
    [posts]
  );

  const openViewer = (index: number) => {
    setSelectedIndex(index);
    setViewerVisible(true);
  };

  const openAvatar = () => {
    if (!avatarUrl) return;
    setZoomAvatar(true);
  };

  const onDeletePost = (postId: string, imagePath: string) => {
    Alert.alert("投稿を削除", "この投稿を削除しますか？", [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          const result = await deletePost(postId, imagePath);

          if (!result.ok) {
            Alert.alert("削除失敗", result.message);
            return;
          }

          Alert.alert("削除完了", "投稿を削除しました");
          refresh();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black ">
        <Text className="text-white">loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="px-4 pt-10 pb-12 border-b border-gray-50">
        <Pressable
          onPress={() => router.replace("/setting")}
          className="absolute top-12 right-4 z-10"
        >
          <Text className="text-white text-4xl">⚙</Text>
        </Pressable>

        <View className="mt-4 flex-row items-center">
          {avatarUrl ? (
            <Pressable onPress={openAvatar}>
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            </Pressable>
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-500" />
          )}

          <Modal visible={zoomAvatar} transparent animationType="fade">
            <Pressable
              onPress={() => setZoomAvatar(false)}
              className="flex-1 items-center justify-center bg-black"
            >
              {avatarUrl && (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{
                    width: "90%",
                    height: "60%",
                    resizeMode: "contain",
                  }}
                />
              )}
            </Pressable>
          </Modal>

          <View className="ml-4 flex-1">
            <Text className="text-white text-[20px]">
              {account?.username ?? "no name"}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              投稿を長押しで削除
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-black">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          numColumns={3}
          refreshControl={
            <RefreshControl
              refreshing={postsLoading || deleting}
              onRefresh={refresh}
            />
          }
          contentContainerStyle={
            posts.length === 0 ? { flexGrow: 1 } : { paddingBottom: 24 }
          }
          renderItem={({ item, index }) => (
            <Pressable
              className="w-1/3 p-[1px]"
              onPress={() => openViewer(index)}
              onLongPress={() => onDeletePost(item.id, item.image_path)}
              delayLongPress={250}
            >
              <Image
                source={{ uri: item.image_url }}
                className="w-full aspect-square bg-gray-600"
                resizeMode="cover"
                onError={(e) => console.log("image error:", e.nativeEvent)}
              />
            </Pressable>
          )}
          ListEmptyComponent={
            !postsLoading ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">
                  まだ自分の投稿がありません
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      <Footer />

      <ImageViewing
        images={images}
        imageIndex={selectedIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </View>
  );
}