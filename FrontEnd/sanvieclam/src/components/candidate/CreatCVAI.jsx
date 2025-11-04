import React, { useState, useEffect, useRef } from "react";
import { FileDown, Sparkles, Check } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getCandidateProfile } from "../../api/CandidateApi";

const CreatCVAI = () => {
  const [candidate, setCandidate] = useState(null);
  const [template, setTemplate] = useState("trangtrong");
  const [loading, setLoading] = useState(false);
  const [cvHtml, setCvHtml] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const iframeRef = useRef(null);

  // 🧩 Lấy dữ liệu hồ sơ ứng viên từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCandidateProfile();

        // Map giới tính để hiển thị tiếng Việt
        const genderVN =
          data.gender === "Male"
            ? "Nam"
            : data.gender === "Female"
            ? "Nữ"
            : "Khác";

        setCandidate({
          fullName: data.fullName,
          dob: data.dob,
          gender: genderVN,
          email: data.email,
          phone: data.phone,
          address: data.address,
          school: data.school,
          major: data.major,
          gpa: data.gpa,
          graduationYear: data.graduationYear,
          experience: data.experience,
          projects: data.projects,
          skills: data.skills,
          certificates: data.certificates,
          careerGoal: data.careerGoal,
          hobbies: data.hobbies,
          social: data.social,
          avatarUrl: data.avatarUrl,
        });
      } catch (err) {
        console.error("❌ Lỗi khi tải hồ sơ:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🧼 Làm sạch HTML CV
  const sanitizeCVHtml = (rawHtml) => {
    if (!rawHtml) return "<p>❌ Không có nội dung</p>";
    const doctypeIndex = rawHtml.indexOf("<!DOCTYPE html>");
    return doctypeIndex !== -1 ? rawHtml.slice(doctypeIndex) : rawHtml;
  };

  // ⚙️ Gọi API backend để tạo CV AI
  const handleGenerateCV = async () => {
    if (!candidate) {
      alert("⚠️ Vui lòng chờ dữ liệu hồ sơ được tải xong!");
      return;
    }

    setLoading(true);
    setCvHtml("");

    try {
      const response = await fetch("http://localhost:8080/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate, template }),
      });

      if (!response.ok) throw new Error("Server trả lỗi");

      const data = await response.json();
      setCvHtml(sanitizeCVHtml(data.cvHtml));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("❌ Lỗi khi tạo CV AI:", err);
      setCvHtml("<p>❌ Lỗi khi tạo CV AI.</p>");
    } finally {
      setLoading(false);
    }
  };

  // 📥 Xuất ra PDF
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

    const filename = candidate?.fullName
      ? `CV-${candidate.fullName.replace(/\s+/g, "_")}.pdf`
      : "CV.pdf";
    pdf.save(filename);
  };

  // 🔄 Loading hồ sơ
  if (profileLoading) {
    return (
      <div className="pt-32 text-center text-gray-500 text-lg animate-pulse">
        ⏳ Đang tải hồ sơ ứng viên...
      </div>
    );
  }

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
          Công cụ này giúp bạn biến dữ liệu hồ sơ cá nhân thành CV chuyên nghiệp,
          thiết kế đẹp mắt và có thể xuất ra PDF chỉ với vài cú nhấp chuột.
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
          Mỗi phong cách sẽ thay đổi bố cục và màu sắc khác nhau phù hợp từng vị trí ứng tuyển.
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
