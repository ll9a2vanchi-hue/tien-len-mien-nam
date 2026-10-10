# Tiến Lên Miền Nam (offline)

Game đánh bài Tiến Lên Miền Nam chạy hoàn toàn offline trong trình duyệt: bạn đấu với 3 máy.

- Mở `index.html` là chơi được (không cần mạng).
- Luật: đánh rác, đôi, sám cô, sảnh, đôi thông; chặt 2 bằng 3 đôi thông / tứ quý / 4 đôi thông; tới trắng (sảnh rồng, tứ quý 2, 6 đôi, 5 đôi thông).
- Có gợi ý, xếp bài, bảng điểm lưu trong trình duyệt.

- Xu & mức cược, quà điểm danh 7 ngày, nhiệm vụ mỗi ngày, 15 huy hiệu thành tích, cấp độ/XP và danh hiệu.

- Giao diện bàn nỉ xanh, avatar, hiệu ứng bay bài/chặt/thắng, âm thanh Web Audio (có nút tắt), lịch sử vòng đánh.

Build: `./build.sh` (ghép src/ + rules.js + progress.js thành index.html).

Kiểm thử: `node test.js`, `node test-progress.js`, `node test-cloud.js`, `node test-xp.js`, `node sim.js`.

## PWA (cài như ứng dụng)
`manifest.webmanifest` + `sw.js` (cache toàn bộ, chơi offline). Trên Android/Chrome bấm nút Cài đặt; iPhone: Chia sẻ → "Thêm vào Màn hình chính".

## Sao lưu đám mây (tùy chọn, Supabase)
1. Đang dùng chung project Supabase "todo-game" (bảng riêng `public.tlmn_saves`, xem `supabase/schema.sql`).
2. Điền URL + publishable/anon key vào `cloud-config.js` (KHÔNG dùng service_role).
3. Chạy `./build.sh` rồi deploy. Không cấu hình thì game chạy chế độ khách offline.
