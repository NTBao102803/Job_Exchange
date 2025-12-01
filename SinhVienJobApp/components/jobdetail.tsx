import * as DocumentPicker from "expo-document-picker";
import { ArrowLeft, Building2, CalendarDays, Clock, DollarSign, Mail, MapPin, Phone, User, X } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { applyJob } from "../api/ApplicationApi"; // <-- import API applyJob

export default function JobDetail({ job, employer, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [cvFile, setCvFile] = useState<any>(null);

  // Chọn file CV
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/doc",
        "application/docx",
      ],
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
    setCvFile(result.assets[0]); // <-- lấy file đầu tiên
  }
  };

  // Gọi API nộp CV
  const handleApply = async () => {
    if (!cvFile) {
      return Alert.alert("⚠️ Vui lòng chọn file CV trước khi ứng tuyển!");
    }

    try {
      await applyJob(job.id, cvFile); // <-- gọi API từ ApplicationApi
      Alert.alert("✅ Ứng tuyển thành công! Chúng tôi sẽ liên hệ bạn sớm.");
      setShowModal(false);
    } catch (err: any) {
      console.error("❌ Lỗi khi ứng tuyển:", err);
      Alert.alert("❌ " + (err.message || "Có lỗi xảy ra"));
    }
  };

  const displayValue = (val: string | undefined) => (val ? val : "Chưa có thông tin");
  const formatDate = (str: string | undefined) => (str ? new Date(str).toLocaleDateString("vi-VN") : "Chưa có thông tin");

  return (
    <ScrollView className="flex-1 bg-gray-100 pt-1 px-1 pb-20">
      <View className="bg-white rounded-2xl p-6 shadow-lg">

        {/* Nút quay lại */}
        <TouchableOpacity onPress={onClose} className="flex-row items-center gap-2 mb-3">
          <ArrowLeft size={20} color="#4b5563" />
          <Text className="text-gray-600 text-base">Quay lại</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-2xl font-bold text-indigo-700">{displayValue(job.title)}</Text>

        {/* Công ty */}
        <View className="mt-1 flex-row items-center gap-2">
          <Building2 size={20} color="#6366f1" />
          <Text className="text-lg text-gray-600">{displayValue(job.companyName)}</Text>
        </View>

        {/* Thông tin nhanh */}
        <View className="mt-4 space-y-3 flex-row justify-between">
          <View className="flex-row gap-3 items-center">
            <MapPin size={20} color="red" />
            <Text>{displayValue(job.location)}</Text>
          </View>
          <View className="flex-row gap-3 items-center">
            <Clock size={20} color="blue" />
            <Text>{displayValue(job.jobType)}</Text>
          </View>
          <View className="flex-row gap-3 items-center">
            <DollarSign size={20} color="green" />
            <Text className="font-semibold text-green-600">{displayValue(job.salary)}</Text>
          </View>
        </View>

        {/* Ngày tuyển dụng */}
        <View className="mt-4 space-y-3 flex-row justify-between">
          <View className="flex-row gap-2 items-center">
            <CalendarDays size={20} color="purple" />
            <Text>Bắt đầu: {formatDate(job.startDate)}</Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <CalendarDays size={20} color="orange" />
            <Text>Kết thúc: {formatDate(job.endDate)}</Text>
          </View>
        </View>

        {/* Nội dung */}
        <View className="mt-6">
          <Text className="text-xl font-semibold text-indigo-600">📝 Mô tả công việc</Text>
          <Text className="mt-2 text-gray-700">{displayValue(job.description)}</Text>

          <Text className="text-xl font-semibold text-indigo-600 mt-6">✅ Yêu cầu ứng viên</Text>
          <Text className="mt-2 text-gray-700">{displayValue(job.requirements?.descriptionRequirements)}</Text>

          {(job.requirements?.skills || job.requirements?.experience || job.requirements?.certificates) && (
            <View className="mt-4">
              <Text className="text-lg font-semibold text-red-600">⚠️ Yêu cầu bắt buộc</Text>
              <View className="mt-2 space-y-2">
                {job.requirements?.skills && <Text><Text className="font-medium">Kỹ năng: </Text>{displayValue(job.requirements.skills)}</Text>}
                {job.requirements?.experience && <Text><Text className="font-medium">Kinh nghiệm: </Text>{displayValue(job.requirements.experience)}</Text>}
                {job.requirements?.certificates && <Text><Text className="font-medium">Trình độ: </Text>{displayValue(job.requirements.certificates)}</Text>}
              </View>
            </View>
          )}

          <Text className="text-xl font-semibold text-indigo-600 mt-6">🎁 Quyền lợi</Text>
          <Text className="mt-2 text-gray-700">{displayValue(job.benefits)}</Text>
        </View>

        {/* Liên hệ */}
        <View className="mt-8 border-t pt-4">
          <Text className="text-xl font-semibold text-indigo-600">📞 Thông tin liên hệ</Text>
          <View className="mt-3 space-y-2">
            <Text className="flex-row items-center"><User size={20} color="pink" /> Người liên hệ: {displayValue(employer?.fullName)}</Text>
            <Text className="flex-row items-center"><Mail size={20} color="pink" /> Email: {displayValue(employer?.email)}</Text>
            <Text className="flex-row items-center"><Phone size={20} color="green" /> SĐT: {displayValue(employer?.phone)}</Text>
          </View>
        </View>

        {/* Nút ứng tuyển */}
        <TouchableOpacity onPress={() => setShowModal(true)} className="mt-10 bg-indigo-600 py-3 rounded-xl">
          <Text className="text-white text-center font-semibold text-lg">Ứng tuyển ngay</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL UPLOAD CV */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <TouchableOpacity onPress={() => setShowModal(false)} className="absolute right-3 top-3">
              <X size={22} color="gray" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-indigo-600 mb-4">📄 Nộp CV ứng tuyển</Text>

            <TouchableOpacity onPress={pickDocument} className="border border-gray-400 py-3 rounded-lg mb-4">
              <Text className="text-center">{cvFile ? cvFile.name : "Chọn file CV (.pdf, .doc, .docx)"}</Text>
            </TouchableOpacity>

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity onPress={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleApply} className="px-4 py-2 bg-indigo-600 rounded-lg">
                <Text className="text-white">Ứng tuyển</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
