# Quy Trình Git Đơn Giản & Hiệu Quả Cho Nhóm (GitHub Flow)

Đây là quy trình làm việc tinh gọn được thiết kế để nhóm có thể phát triển song song nhiều tính năng một cách nhanh chóng, dễ hiểu mà vẫn đảm bảo chất lượng code thông qua review.

## Nguyên Tắc Cốt Lõi

1.  Bất cứ thứ gì trong nhánh **`main`** đều phải **ổn định** và **sẵn sàng để chạy**.
2.  Mọi công việc (tính năng mới, sửa lỗi) đều được thực hiện trên một **nhánh riêng** (branch) được tạo từ `main`.
3.  Sử dụng **Pull Request (PR)** để thảo luận và review code trước khi hợp nhất (merge) vào `main`.

## Quy Trình Làm Việc 5 Bước

Mỗi thành viên khi phát triển một tính năng sẽ thực hiện 5 bước đơn giản sau:

### Bước 1: Tạo Nhánh Mới từ `main`

Luôn bắt đầu công việc từ phiên bản code mới nhất và ổn định nhất.

- **Quy ước đặt tên nhánh:** `feature/<ten-tinh-nang>` hoặc `fix/<ten-loi-can-sua>`. Ví dụ: `feature/user-login`, `fix/header-style`.

- **Lệnh thực hiện:**
  ```bash
  # 1. Chuyển về nhánh main
  git checkout main

  # 2. Lấy code mới nhất về
  git pull origin main

  # 3. Tạo và chuyển sang nhánh mới của bạn
  git checkout -b <ten-nhanh-cua-ban>
  ```

### Bước 2: Phát Triển & Commit

- Viết code và commit các thay đổi của bạn trên nhánh này.
- Commit thường xuyên với các thông điệp rõ ràng.
  ```bash
  git add .
  git commit -m "feat: Add password input to login form"
  ```

### Bước 3: Mở Pull Request (PR)

Khi bạn cảm thấy tính năng đã sẵn sàng hoặc cần thảo luận với nhóm, hãy mở một **Pull Request**.

- Đẩy nhánh của bạn lên server: `git push -u origin <ten-nhanh-cua-ban>`
- Vào giao diện GitHub, tạo một Pull Request từ nhánh của bạn nhắm vào nhánh `main`.
- Viết mô tả rõ ràng cho PR: bạn đã làm gì, mục đích là gì, có cần lưu ý gì khi review không.

### Bước 4: Thảo Luận & Code Review

- Các thành viên khác sẽ vào PR để xem code, để lại bình luận và góp ý.
- Nếu cần thay đổi, bạn chỉ cần tiếp tục commit và đẩy code lên nhánh của mình, PR sẽ tự động được cập nhật.
- Đây là bước quan trọng nhất để chia sẻ kiến thức và nâng cao chất lượng code chung.

### Bước 5: Hợp Nhất (Merge) & Dọn Dẹp

- Khi PR đã được mọi người đồng ý (`Approved`), người tạo PR sẽ hợp nhất nó vào `main`.
- Sau khi hợp nhất, nhánh `main` đã chứa tính năng mới và vẫn đảm bảo ổn định.
- Xóa nhánh đã làm việc đi để kho code luôn gọn gàng.
  ```bash
  # Có thể xóa nhánh trên giao diện GitHub sau khi merge
  # Hoặc xóa thủ công ở local
  git checkout main
  git branch -d <ten-nhanh-da-xong>
  ```
