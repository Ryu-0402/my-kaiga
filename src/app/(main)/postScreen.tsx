import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    Image,
} from "react-native";
import { usePostUpload } from "@/src/hooks/usePostUpload";
import { useAccount } from "@/src/providers/AccountProvider";
import { router } from "expo-router";

export default function PostScreen() {
    const [caption, setCaption] = useState("");
    const { createPost, loading } = usePostUpload();
    const { account } = useAccount();

    const onPressPost = async () => {
        const result = await createPost(caption);

        if (!result.ok) {
            Alert.alert("失敗", result.message);
            return;
        }

        Alert.alert("成功", "投稿しました");
        setCaption("");
    };

    return (
        <View className="flex-1 bg-white px-4 py-6">
            <View className="flex-row items-center mb-4">
                {account?.avatar_url ? (
                    <Image
                        source={{ uri: account.avatar_url }}
                        className="w-12 h-12 rounded-full mr-3"
                    />
                ) : (
                    <View className="w-12 h-12 rounded-full bg-gray-300 mr-3" />
                )}

                <View>
                    <Text className="text-base font-semibold">
                        {account?.username ?? "ユーザー"}
                    </Text>
                    <Text className="text-gray-500">新しい投稿</Text>
                </View>
            </View>

            <TextInput
                value={caption}
                onChangeText={setCaption}
                placeholder="キャプションを入力"
                multiline
                className="border border-gray-300 rounded-lg p-4 mb-4 min-h-[120px]"
            />

            <Pressable
                onPress={onPressPost}
                disabled={loading}
                className={`rounded-lg py-4 ${loading ? "bg-gray-400" : "bg-black"}`}
            >
                <Text className="text-white text-center text-lg">
                    {loading ? "投稿中..." : "画像を選んで投稿"}
                </Text>
            </Pressable>

            <Pressable
                onPress={() => router.replace("/")}
                className="flex-1 items-center"
            >
                <Text className="text-black text-xl">
                    back
                </Text>
            </Pressable>

        </View>
    );
}