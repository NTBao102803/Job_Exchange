// src/api/messageApi.js
import axiosClient from "./axiosClient";

// Simple in-memory cache (module-level)
const conversationsCache = {
  data: null,
  ts: 0,
};
const messagesCache = new Map(); // key conversationId -> { data, ts }

/** Cache TTL in ms (optional). Increase for production. */
const CACHE_TTL = 20 * 1000; // 20s

export const getConversations = async ({ force = false } = {}) => {
  if (!force && conversationsCache.data && Date.now() - conversationsCache.ts < CACHE_TTL) {
    return conversationsCache.data;
  }
  const res = await axiosClient.get("/messages/conversations");
  conversationsCache.data = res.data;
  conversationsCache.ts = Date.now();
  return res.data;
};

export const getMessagesByConversation = async (conversationId, { force = false } = {}) => {
  const cached = messagesCache.get(conversationId);
  if (!force && cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }
  const res = await axiosClient.get(`/messages/conversations/${conversationId}/messages`);
  messagesCache.set(conversationId, { data: res.data, ts: Date.now() });
  return res.data;
};

export const createConversation = async (jobId) => {
  const res = await axiosClient.post("/messages/conversations", { jobId });
  // Invalidate conversation cache
  conversationsCache.data = null;
  return res.data;
};

export const getUnreadMessageCount = async () => {
  const res = await axiosClient.get("/messages/unread-count");
  return res.data;
};

// Helpers to manage cache from UI
export const clearConversationCache = () => {
  conversationsCache.data = null;
  conversationsCache.ts = 0;
};
export const clearMessagesCacheFor = (conversationId) => {
  messagesCache.delete(conversationId);
};
export const clearAllMessagesCache = () => {
  messagesCache.clear();
};
