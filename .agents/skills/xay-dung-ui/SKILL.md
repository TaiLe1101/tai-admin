---
name: xay-dung-ui
description: Xây dựng UI, component, sử dụng ANTD và React
---

# Yêu cầu chung

- Sử dụng ANTD cho UI, Layout, Page, Component
- Khi chia grid sử dụng ANTD Grid (Row và Column), không sử dụng div với grid CSS thông thường.
- Không sử dụng Tailwind CSS để style cho các component của ANTD mà hãy sử dụng thuộc tính styles của component
- Nếu có Border Radius luôn luôn theo theme hiện tại
- Các khoản cách trên dưới, trái phải thì mặc định là 8px
- Hạn chế lạm dụng styles, style của antd component thường đã được tùy chỉnh sẳn rồi
- Đối với các thể div hoặc các thể html thì phải sử dụng tailwind css không được style inline
- Đối với các section filter trong trang quản lý hãy sử dụng kỹ thuật đưa lên url query để không bị mất filter khi reload lại trang website
- Đối với các Tab thì hãy tách component theo từng tab bỏ vào thư mục components của feature đó
- Đối với những text sử dụng tooltip nếu là nội dung ngắn còn dài thì sử dụng Popover
- Nếu có ICON sửa dụng của ANTD hoặc Lucide


# Lưu ý
- Không bao giờ sử dụng `display: flex` khi chia grid, thay vào đó hãy sử dụng `Row` và `Col` của ANTD.
- Không bao giờ được custom size của các control như Input, Select, ... mà hãy sử dụng size có sẳn của ANTD (small, medium, large).
- Không bao giờ được tự vẽ thêm gì ngoài yêu cầu, nếu có hãy lên plan
- Tuyệt đối không bao giờ được sử dụng emoji
- Không bao giờ sử dụng component Alert của ANTD trừ khi được yêu cầu

# Lưu ý khi kiểm tra
- Chỉ cần chạy npm run build nếu có lỗi thì sửa lỗi nếu không có lỗi thì xem như đã xong
- Không bật Browser kiểm tra UI trên trình duyệt