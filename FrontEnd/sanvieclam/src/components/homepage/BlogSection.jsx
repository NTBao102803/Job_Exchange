import React from "react";

const blogPosts = [
  {
    title: "5 Tips Viết CV Chuẩn Cho Sinh Viên",
    description: "Hướng dẫn tạo CV nổi bật, dễ dàng gây ấn tượng với nhà tuyển dụng.",
    link: "/blog/cv-tips",
    image: "/blog1.png", // Đảm bảo đường dẫn đúng
  },
  {
    title: "Cách Phỏng Vấn Thành Công",
    description: "Bí quyết trả lời câu hỏi phỏng vấn và gây ấn tượng.",
    link: "/blog/interview-success",
    image: "/blog2.png", // Đảm bảo đường dẫn đúng
  },
  {
    title: "Những Ngành Nghề Hot Cho Sinh Viên",
    description: "Khám phá những ngành nghề đang được săn đón nhiều nhất hiện nay.",
    link: "/blog/hot-jobs",
    image: "/blog3.png", // Đảm bảo đường dẫn đúng
  },
];

const BlogSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100" id="blog"> {/* Nền gradient */}
      <div className="container mx-auto px-6 max-w-6xl"> {/* Giới hạn chiều rộng */}
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12 relative">
          <span className="relative z-10">
            Blog Tuyển Dụng
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-pink-500 rounded-full"></span> {/* Đường gạch chân */}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"> {/* Tăng khoảng cách và cột */}
          {blogPosts.map((post, index) => (
            <a
              key={index}
              href={post.link}
              className="bg-white shadow-xl rounded-xl overflow-hidden
                         transform hover:-translate-y-2 hover:shadow-2xl transition duration-500 ease-in-out
                         group flex flex-col" // Thêm flex-col để đảm bảo nội dung đẩy xuống cuối
            >
              <div className="h-52 overflow-hidden"> {/* Đặt chiều cao cố định cho ảnh */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover
                             transform group-hover:scale-110 transition duration-500 ease-in-out" // Hiệu ứng zoom ảnh
                />
              </div>
              <div className="p-6 flex flex-col flex-grow"> {/* flex-grow để đẩy "Đọc thêm" xuống cuối */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-pink-600 transition duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow text-base leading-relaxed"> {/* Điều chỉnh kích thước text */}
                  {post.description}
                </p>
                <span className="text-blue-600 font-semibold flex items-center justify-end
                                 group-hover:text-pink-500 transition duration-300">
                  Đọc thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;