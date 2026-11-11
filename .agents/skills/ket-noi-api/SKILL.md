---
name: ket-noi-api
description: Kết nối API từ BE sang cho FE
---

# Yêu cầu chung

- Đọc file md mô tả api trong /docs/{ten-api}.md
- Tạo các type req, res tương ứng trong features/{ten-features}/api/dto/req hoặc res
- Tạo api request tương ứng trong features/{ten-features}/api/{featureName}Api.ts
- Nếu là method POST, PUT, PATCH, DELETE thì tạo hook tương ứng trong /features/hooks/use{featureName}.ts
- Nếu là method GET thì tạo hook tương ứng trong /features/queries/use{featureName}.ts
- Thông báo trong các hook bằng `message` của ANTD (App.useApp())

# Lưu ý

- Hãy hỏi bất kỳ những gì thắc mắc không được tự suy.
- Không được tự ý thay đổi thiết kế ban đầu.
- Luôn tuân thủ các quy tắc đã đề ra.
- Đối với các datetime từ FE truyền lên API điều phải convert sang UTC bằng util appDayJs (Flow sẽ là Người dùng chọn trong UI -> convert sang UTC -> gửi lên API -> hiển thị lại cho user bằng appDayJs.formatVN)

