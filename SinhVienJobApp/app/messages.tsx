// MessengerMobile.tsx
import { useRouter } from "expo-router";
import { ArrowLeft, Search, Send } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Conversation {
  id: number;
  otherName: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

interface Message {
  id: number;
  content: string;
  fromSelf: boolean;
  time: string;
  avatar: string;
}

const dummyConversations: Conversation[] = [
  {
    id: 1,
    otherName: "Nguyen Van A",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Xin chào, bạn khỏe không?",
    lastMessageAt: "2025-11-27T10:30:00",
    unread: 2,
  },
  {
    id: 2,
    otherName: "Tran Thi B",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Cảm ơn nhé!",
    lastMessageAt: "2025-11-27T09:15:00",
    unread: 0,
  },
];

const dummyMessages: Message[] = [
  { id: 1, content: "Xin chào!", fromSelf: false, time: "10:30", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, content: "Chào bạn, mình khỏe!", fromSelf: true, time: "10:31", avatar: "https://i.pravatar.cc/150?img=3" },
];

export default function MessengerMobile() {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const router = useRouter();

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Lọc conversation theo tab + search
  const filteredConversations = dummyConversations
    .filter((c) => (filter === "unread" ? c.unread > 0 : true))
    .filter((c) => c.otherName.toLowerCase().includes(search.toLowerCase()));

  if (!selectedChat) {
    return (
      <View style={{ flex: 1, backgroundColor: "#121212" }}>
        {/* HEADER */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderColor: "#333", backgroundColor: "#1e1e1e" ,paddingTop: Platform.OS === "ios" ? 50 : 16}}>
          <TouchableOpacity onPress={() => router.replace("/candidate/home")}>
      <ArrowLeft size={24} color="#fff" />
    </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>Tin nhắn</Text>
          <Text></Text>
        </View>

        {/* SEARCH BAR */}
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#2a2a2a", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Search size={18} color="#aaa" />
            <TextInput
              placeholder="Tìm kiếm..."
              placeholderTextColor="#aaa"
              style={{ marginLeft: 8, flex: 1, color: "#fff" }}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* TABS ALL / UNREAD */}
        <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#333", backgroundColor: "#1e1e1e" }}>
          {["all", "unread"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab as "all" | "unread")}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: "center",
                borderBottomWidth: filter === tab ? 2 : 0,
                borderBottomColor: "#0b93f6",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: filter === tab ? "bold" : "normal" }}>
                {tab === "all" ? "Tất cả" : "Chưa đọc"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LIST OF CONVERSATIONS */}
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedChat(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#333",
              }}
            >
              <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold", color: "#fff" }}>{item.otherName}</Text>
                <Text style={{ color: "#aaa" }} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              {item.unread > 0 && (
                <View style={{ backgroundColor: "red", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                  <Text style={{ color: "#fff", fontSize: 12 }}>{item.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // CHAT PANEL
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#121212" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* HEADER */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderColor: "#333", backgroundColor: "#1e1e1e" ,paddingTop: Platform.OS === "ios" ? 50 : 16}}>
        <TouchableOpacity onPress={() => setSelectedChat(null)}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: selectedChat.avatar }} style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 12 }} />
        <Text style={{ fontWeight: "bold", color: "#fff", marginLeft: 12, fontSize: 16 }}>{selectedChat.otherName}</Text>
      </View>

      {/* MESSAGES */}
      <ScrollView style={{ flex: 1, padding: 12 }}>
        {dummyMessages.map((m) => (
          <View key={m.id} style={{ flexDirection: m.fromSelf ? "row-reverse" : "row", marginBottom: 8, alignItems: "flex-end" }}>
            <Image source={{ uri: m.avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginHorizontal: 6 }} />
            <View style={{ maxWidth: "70%", backgroundColor: m.fromSelf ? "#0b93f6" : "#2a2a2a", padding: 10, borderRadius: 16 }}>
              <Text style={{ color: m.fromSelf ? "#fff" : "#fff" }}>{m.content}</Text>
              <Text style={{ fontSize: 10, color: "#aaa", textAlign: "right" }}>{m.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* INPUT */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderColor: "#333", backgroundColor: "#1e1e1e" ,paddingBottom: Platform.OS === "ios" ? 30 : 10}}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#555", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, color: "#fff" }}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={() => setMessage("")} style={{ marginLeft: 8, backgroundColor: "#0b93f6", padding: 10, borderRadius: 20 }}>
          <Send size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
