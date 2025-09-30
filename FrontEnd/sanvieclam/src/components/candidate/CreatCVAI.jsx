import React, { useState, useRef } from "react";
import { FileDown, Sparkles, Check } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CreatCVAI = () => {
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
    experience: "Backend Developer tại Công ty XYZ (2020 - nay). Kinh nghiệm phát triển API, tối ưu hệ thống.", 
    projects: "Hệ thống đặt tour du lịch WebTourDuLich, Payment Service microservice.", 
    skills: "Java, Spring Boot, ReactJS, MySQL, Docker, Kubernetes.", 
    certificates: "AWS Cloud Practitioner, TOEIC 850.", 
    careerGoal: "Trở thành Senior Backend Engineer trong 3 năm tới.", 
    hobbies: "Đọc sách công nghệ, chơi cờ vua, du lịch.", 
    social: "https://linkedin.com/in/tranvanloi",
  };

  const [template, setTemplate] = useState("trangtrong");
  const [loading, setLoading] = useState(false);
  const [cvHtml, setCvHtml] = useState("");
  const [showToast, setShowToast] = useState(false);

  const iframeRef = useRef(null);

  const sanitizeCVHtml = (rawHtml) => {
    if (!rawHtml) return "<p>❌ Không có nội dung</p>";
    const doctypeIndex = rawHtml.indexOf("<!DOCTYPE html>");
    return doctypeIndex !== -1 ? rawHtml.slice(doctypeIndex) : rawHtml;
  };

  const handleGenerateCV = async () => {
    setLoading(true);
    setCvHtml("");
    try {
      const response = await fetch("http://localhost:8080/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate, template }),
      });
      const data = await response.json();
      setCvHtml(sanitizeCVHtml(data.cvHtml));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      setCvHtml("<p>❌ Lỗi khi tạo CV AI.</p>");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xuất PDF bằng html2canvas + jsPDF
  const handleExportPDF = async () => {
    if (!iframeRef.current) return;
    const iframeDoc =
      iframeRef.current.contentDocument ||
      iframeRef.current.contentWindow.document;

    const cvElement = iframeDoc.body.querySelector(".cv-container") || iframeDoc.body;

    const canvas = await html2canvas(cvElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("CV-TranVanLoi.pdf");
  };

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto pb-20 relative">
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <Check size={20} /> 🎉 CV đã sẵn sàng – hãy xem thử nhé!
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
          ✨ Trình tạo CV AI thông minh
        </h1>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
          Công cụ này sẽ giúp bạn biến dữ liệu cá nhân thành một CV chuyên nghiệp, 
          được thiết kế đẹp mắt, bố cục rõ ràng và dễ dàng xuất ra PDF.  
          Chỉ cần vài cú nhấp chuột, bạn sẽ có ngay một bản CV hoàn chỉnh để ứng tuyển.
        </p>
      </div>

      {/* Template selector */}
      <div className="mb-10 text-center">
        <label className="block mb-3 font-semibold text-gray-700">
          🎨 Chọn phong cách trình bày CV
        </label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="px-5 py-3 rounded-xl border-2 border-indigo-300 bg-white/70 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-indigo-500"
        >
          <option value="trangtrong">🌐 Trang trọng</option>
          <option value="hien-dai">🚀 Hiện đại</option>
          <option value="chuyen-nghiep">💼 Chuyên nghiệp</option>
          <option value="don-gian">📄 Đơn giản</option>
          <option value="an-tuong">🔥 Ấn tượng</option>
        </select>
        <p className="mt-2 text-sm text-gray-500">
          Mỗi phong cách sẽ thay đổi thứ tự section và màu sắc khác nhau để phù hợp với từng tình huống ứng tuyển.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-6 mb-12">
        <button
          onClick={handleGenerateCV}
          disabled={loading}
          className={`flex items-center gap-2 px-7 py-3 rounded-xl shadow-lg text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
          }`}
        >
          <Sparkles size={20} />
          {loading ? "⏳ Đang tạo CV..." : "✨ Tạo CV bằng AI"}
        </button>

        <button
          onClick={handleExportPDF}
          disabled={!cvHtml}
          className={`flex items-center gap-2 px-7 py-3 rounded-xl shadow-lg text-white font-medium transition ${
            cvHtml
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FileDown size={20} /> 📥 Xuất ra PDF
        </button>
      </div>

      {/* Preview iframe */}
      <div className="bg-white shadow-2xl rounded-xl overflow-auto min-h-[600px] max-w-4xl mx-auto border border-gray-200">
        {cvHtml ? (
          <iframe
            ref={iframeRef}
            title="CV Preview"
            srcDoc={cvHtml}
            style={{ width: "100%", height: "0px", border: "none" }}
            onLoad={() => {
              if (iframeRef.current) {
                const doc =
                  iframeRef.current.contentDocument ||
                  iframeRef.current.contentWindow.document;

                iframeRef.current.style.height = doc.body.scrollHeight + "px";
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[600px] text-gray-400 italic">
            <p className="mb-3">📄 Chưa có CV nào được tạo.</p>
            <p>
              Hãy click vào <strong>"Tạo CV bằng AI"</strong> để bắt đầu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatCVAI;
