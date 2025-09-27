import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FileDown, Sparkles } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CreatCVAI = () => {
  // Dữ liệu ứng viên (cứng)
  const candidate = {
    fullName: "Trần Văn Lợi",
    dob: "1998-05-12",
    gender: "Nam",
    email: "tranvanloi@example.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    school: "Đại học Công nghệ Thông tin",
    major: "Khoa học Máy tính",
    gpa: "3.6/4.0",
    graduationYear: "2020",
    experience:
      "Backend Developer tại Công ty XYZ (2020 - nay). Kinh nghiệm phát triển API, tối ưu hệ thống.",
    projects:
      "Hệ thống đặt tour du lịch WebTourDuLich, Payment Service microservice.",
    skills: "Java, Spring Boot, ReactJS, MySQL, Docker, Kubernetes.",
    certificates: "AWS Cloud Practitioner, TOEIC 850.",
    careerGoal: "Trở thành Senior Backend Engineer trong 3 năm tới.",
    hobbies: "Đọc sách công nghệ, chơi cờ vua, du lịch.",
    social: "https://linkedin.com/in/tranvanloi",
  };

  // Template CV
  const [template, setTemplate] = useState("trangtrong");

  // Editor Tiptap
  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <h2 class="text-xl font-bold text-gray-800">Thông tin ứng viên</h2>
      <p><b>Họ tên:</b> ${candidate.fullName}</p>
      <p><b>Ngày sinh:</b> ${candidate.dob}</p>
      <p><b>Email:</b> ${candidate.email}</p>
      <p><b>Kinh nghiệm:</b> ${candidate.experience}</p>
      <p><b>Dự án:</b> ${candidate.projects}</p>
      <p><b>Kỹ năng:</b> ${candidate.skills}</p>
      <p><b>Chứng chỉ:</b> ${candidate.certificates}</p>
      <p><b>Mục tiêu nghề nghiệp:</b> ${candidate.careerGoal}</p>
    `,
  });

  // Gọi API backend để tạo CV (AI sinh HTML)
  const handleGenerateCV = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate, template }),
      });

      const data = await response.json();

      if (editor) {
        editor.commands.setContent(data.cvHtml); // Backend trả HTML CV
      }
    } catch (error) {
      console.error("Lỗi khi tạo CV AI:", error);
    }
  };

  // Xuất PDF về máy
  const handleExportPDF = async () => {
    const element = document.querySelector("#cv-container");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`CV_${candidate.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
          ✨ Trình tạo CV AI
        </h1>
        <p className="text-gray-600 mt-2">
          Tạo CV hiện đại, chuyên nghiệp và nổi bật từ dữ liệu của bạn chỉ với 1
          cú click!
        </p>
      </div>

      {/* Chọn template */}
      <div className="mb-8 text-center">
        <label className="block mb-3 font-semibold text-gray-700">
          🎨 Chọn phong cách CV
        </label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="px-4 py-2 rounded-xl border-2 border-indigo-300 bg-white/60 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-indigo-500"
        >
          <option value="trangtrong">Trang trọng</option>
          <option value="hien-dai">Hiện đại</option>
          <option value="chuyen-nghiep">Chuyên nghiệp</option>
          <option value="don-gian">Đơn giản</option>
          <option value="an-tuong">Ấn tượng</option>
        </select>
        <p className="text-sm text-gray-500 mt-2">
          Lựa chọn phong cách phù hợp với ngành nghề và tính cách của bạn.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6 mb-10">
        <button
          onClick={handleGenerateCV}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <Sparkles size={20} /> Tạo CV AI
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <FileDown size={20} /> Xuất PDF
        </button>
      </div>

      {/* CV Preview */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-tr from-indigo-300 to-purple-300 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-tr from-pink-300 to-purple-200 rounded-full blur-2xl opacity-30"></div>

        <div
          id="cv-container"
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200 min-h-[500px]"
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default CreatCVAI;
