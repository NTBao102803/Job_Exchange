#!/bin/sh
echo "Configuring MinIO client..."

# Đảm bảo alias luôn được tạo lại (đề phòng cũ bị lỗi)
mc alias set local http://localhost:9000 minioadmin minioadmin >/dev/null 2>&1 || true

echo "Creating bucket storage-files..."
mc mb local/storage-files || true

# Nếu bạn muốn người dùng không đăng nhập vẫn tải file được (public download)
echo "Setting bucket policy to allow public download..."
mc anonymous set download local/storage-files || true

echo "Bucket 'storage-files' is ready and public!"