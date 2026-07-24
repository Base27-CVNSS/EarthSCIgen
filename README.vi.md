# 🇻🇳 EarthSCIgen — Hướng dẫn tiếng Việt

[Trang chính](./README.md) · [English](./README.en.md) ·
[Chạy trực tuyến](https://base27-cvnss.github.io/EarthSCIgen/)

## Giới thiệu

**EarthSCIgen v0.1.0** là ứng dụng tĩnh tạo khung bản thảo preprint Khoa học
Trái đất theo bố cục IEEE hai cột. Toàn bộ quá trình chạy trong trình duyệt:
không tài khoản, không API, không máy chủ ứng dụng, không analytics và không
biến môi trường.

> **Cảnh báo:** Nội dung được tạo là synthetic, chưa phản biện và không phải
> bằng chứng khoa học. Công cụ phục vụ giảng dạy, thử nghiệm phần mềm, kiểm tra
> bố cục và lập dàn ý—không phục vụ đánh lừa quy trình phản biện.

## Sáu chuyên ngành

| Module | Phạm vi minh họa |
| --- | --- |
| 🛰️ Remote Sensing | Ảnh đa phổ, phân loại bề mặt, kiểm định không gian |
| 🪨 Geology | Thạch học, địa tầng và tiếp xúc địa chất |
| 💧 Hydrology | Lưu vực, mưa–dòng chảy và mạng lưới sông |
| 🌡️ Climate Science | Chỉ số khí hậu, chuỗi thời gian và bất định |
| ⛰️ Geomorphology | Địa hình, địa mạo và phân loại dạng đất |
| 🌐 Geophysics | Trường thế, profile và diễn giải dưới bề mặt |

## Quy trình sử dụng

1. Chọn chuyên ngành.
2. Nhập tiêu đề, tác giả, email và đơn vị.
3. Chọn 6–8 trang A4 và nhập seed tái lập.
4. Quan sát outline IEEE cập nhật trực tiếp.
5. Bấm **Tạo bản nháp có kiểm soát** và đọc progress log.
6. Xuất HTML, LaTeX, manifest JSON hoặc dùng **In / PDF**.

## Integrity checks

Ứng dụng kiểm tra metadata, email, seed, giới hạn trang, cảnh báo synthetic,
nguồn tham khảo và trạng thái privacy. Cảnh báo an toàn được giữ trong:

- giao diện và từng trang preview;
- tệp HTML độc lập và metadata `earthscigen-synthetic`;
- tiêu đề và phần cuối tệp LaTeX;
- trường `integrity.synthetic` của manifest JSON;
- mọi trang khi in hoặc lưu PDF.

## Chạy cục bộ

Mở trực tiếp `index.html` bằng trình duyệt hiện đại. Không cần chạy lệnh.

Để kiểm thử mã nguồn bằng Node.js:

```bash
npm run check
npm test
```

Không cần `npm install` vì bộ kiểm thử chỉ dùng thư viện chuẩn của Node.js.

## GitHub Pages

Workflow `.github/workflows/pages.yml` chạy kiểm thử trước khi triển khai mỗi
lần nhánh `main` thay đổi. Trong **Settings → Pages**, nguồn xuất bản cần được
đặt thành **GitHub Actions**.

## Giấy phép

Mã nguồn phát hành theo [MIT License](./LICENSE), phát triển bởi **Long Ngo**.
