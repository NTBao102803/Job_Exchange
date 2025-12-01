import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ExampleModal() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold mb-4">Example Modal</Text>
      <TouchableOpacity
        onPress={() => router.back()}
        className="p-3 bg-indigo-500 rounded-xl"
      >
        <Text className="text-white font-bold">Close Modal</Text>
      </TouchableOpacity>
    </View>
  );
}
