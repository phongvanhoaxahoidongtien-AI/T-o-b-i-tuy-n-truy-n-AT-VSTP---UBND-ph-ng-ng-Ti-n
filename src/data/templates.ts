import { SavedItem } from '../types';

export interface TopicPreset {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  defaultPrompt: string;
  sampleSlogan: string;
}

export const TOPIC_PRESETS: TopicPreset[] = [
  {
    id: 'street_food',
    title: 'Thức ăn đường phố & Quán vỉa hè',
    description: 'Yêu cầu che đậy thực phẩm, găng tay, nước sạch và nguồn gốc rõ ràng.',
    iconName: 'UtensilsCrossed',
    category: 'Vệ sinh hàng quán',
    defaultPrompt: 'Tuyên truyền cho các chủ hộ kinh doanh thức ăn đường phố trên địa bàn phường giữ gìn vệ sinh, che đậy thức ăn tránh ruồi nhặng, dùng găng tay và nguồn nước sạch.',
    sampleSlogan: 'Hàng quán sạch sẽ - Bà con yên tâm - Kinh doanh phát tài!'
  },
  {
    id: 'summer_food_safety',
    title: 'Phòng ngộ độc thực phẩm mùa nắng nóng',
    description: 'Hướng dẫn bảo quản tủ lạnh, ăn chín uống sôi, không ăn thức ăn ôi thiu.',
    iconName: 'Sun',
    category: 'Sức khỏe mùa hè',
    defaultPrompt: 'Hướng dẫn người dân phòng tránh ôi thiu thực phẩm mùa hè, lưu ý nhiệt độ bảo quản, nguyên tắc ăn chín uống sôi và xử lý thực phẩm thừa.',
    sampleSlogan: 'Mùa hè nắng nóng - Ăn chín uống sôi - Bảo vệ gia đình!'
  },
  {
    id: 'school_kitchen',
    title: 'An toàn bếp ăn bán trú & Công ty',
    description: 'Kiểm soát nguồn gốc nguyên liệu, kiểm nghiệm 3 bước và lưu mẫu thức ăn.',
    iconName: 'GraduationCap',
    category: 'Bếp ăn tập thể',
    defaultPrompt: 'Tuyên truyền cho các trường học và bếp ăn tập thể trên địa bàn phường thực hiện nghiêm quy trình kiểm nghiệm thực phẩm 3 bước và lưu mẫu đúng 24h.',
    sampleSlogan: 'Bếp ăn an toàn - Con ngoan khỏe mạnh - Cha mẹ an tâm!'
  },
  {
    id: 'fresh_meat_veg',
    title: 'Mẹo chọn mua thịt, cá, rau củ tươi ngon',
    description: 'Bí quyết phân biệt thịt tươi không hóa chất, rau không tồn dư thuốc BVTV.',
    iconName: 'ShoppingBag',
    category: 'Mẹo đi chợ',
    defaultPrompt: 'Mẹo ngắn gọn giúp các bà, các mẹ đi chợ phường chọn thịt lợn tươi hồng, cá bơi khỏe, rau củ không hóa chất bảo quản.',
    sampleSlogan: 'Chọn thực phẩm tươi - Bữa cơm thêm ngọt - Cả nhà thêm vui!'
  },
  {
    id: 'first_aid_poison',
    title: 'Sơ cứu nhanh khi nghi ngờ ngộ độc',
    description: 'Các bước xử lý ban đầu tại nhà và đường dây nóng y tế phường khẩn cấp.',
    iconName: 'Ambulance',
    category: 'Khẩn cấp & Y tế',
    defaultPrompt: 'Hướng dẫn người dân các bước sơ cứu đơn giản, an toàn khi có dấu hiệu đau bụng, buồn nôn sau khi ăn và thông báo hotline Trạm y tế phường.',
    sampleSlogan: 'Bình tĩnh sơ cứu - Gọi ngay Y tế phường - An toàn là trên hết!'
  },
  {
    id: 'action_month',
    title: 'Tháng hành động vì An toàn thực phẩm',
    description: 'Phát động chiến dịch cao điểm tuyên truyền và kiểm tra chấp hành.',
    iconName: 'Flag',
    category: 'Chiến dịch UBND',
    defaultPrompt: 'Thông báo phát động Tháng hành động vì An toàn thực phẩm của UBND phường, kêu gọi các hộ kinh doanh và người dân đồng lòng hưởng ứng.',
    sampleSlogan: 'Nhiệt liệt hưởng ứng Tháng hành động vì An toàn thực phẩm!'
  }
];

export const SAMPLE_SAVED_POSTS: SavedItem[] = [
  {
    id: 'sample-1',
    title: '📌 3 MẸO NHỎ ĐI CHỢ PHƯỜNG - CHỌN THỰC PHẨM TƯƠI NGON MỖI NGÀY',
    socialContent: `🏢 UBND PHƯỜNG XIN CHÀO BÀ CON! 🌾

Đã bao giờ bà con băn khoăn làm sao chọn được miếng thịt tươi, bó rau sạch cho bữa cơm gia đình? Trạm Y tế Phường xin gửi tới bà con 3 mẹo đơn giản, dễ nhớ:

1️⃣ CHỌN THỊT TƯƠI: Miếng thịt có màu hồng tự nhiên, ấn ngón tay vào có độ đàn hồi tốt, không dính tay và không có mùi lạ.
2️⃣ CHỌN RAU SẠCH: Ưu tiên rau củ quả tươi nguyên, không dập nát, không có màu sắc bất thường hay mùi hóa chất lạ.
3️⃣ CHỌN CÁ TƯƠI: Mắt cá trong suốt, mang màu đỏ tươi, vảy bám chặt vào thân.

👉 LỜI KHUYÊN TỪ UBND PHƯỜNG:
Bà con nên mua sắm tại các chợ truyền thống, cửa hàng thực phẩm uy tín đã đăng ký kiểm định chất lượng trên địa bàn phường.

📞 Hotline Trạm Y tế Phường: 024.3852.XXXX (Hỗ trợ 24/7)`,
    broadcastScript: `Kính chào toàn thể bà con nhân dân trên địa bàn phường!

Để đảm bảo sức khỏe cho từng bữa ăn gia đình, UBND và Trạm Y tế phường xin lưu ý bà con một số mẹo đi chợ an toàn:

Một là, khi chọn thịt: Chọn thịt màu hồng tươi, ấn vào có độ đàn hồi, không chọn thịt có màu tái nhạt hay mùi hôi.
Hai là, khi chọn rau củ: Chọn rau còn tươi nguyên gốc, rửa kỹ dưới dòng nước chảy trước khi chế biến.
Ba là, khi chọn hải sản: Ưu tiên cá còn bơi hoặc mắt cá trong, mang đỏ tươi.

Kính chúc bà con luôn có những bữa cơm ngon, an toàn và tràn đầy sức khỏe! Xin cảm ơn bà con đã lắng nghe!`,
    shortSlogan: 'Thực phẩm sạch - Bữa ăn ngon - Gia đình an khang!',
    rhyme: `Chợ phường nhộn nhịp vui tươi,
Bà con chọn mua thực phẩm tươi.
Thịt hồng, rau sạch, cá bơi,
Nấu chín, ăn nóng, đời đời an vui!`,
    imagePrompt: 'A warm, friendly Vietnamese local wet market scene with a smiling female vendor presenting fresh vegetables and meat under a clean wooden canopy with a red banner reading An Toan Thuc Pham',
    keyPoints: [
      'Ấn vào thịt có độ đàn hồi tốt',
      'Rửa rau dưới dòng nước chảy',
      'Mua hàng tại các điểm kinh doanh có kiểm định'
    ],
    hotline: '024.3852.XXXX',
    hashtags: ['#UBNDPhuong', '#AnToanThucPham', '#SucKhoeGiaDinh', '#ThucPhamTuoiNgon'],
    createdAt: '2026-08-01',
    topic: 'Mẹo chọn mua thịt, cá, rau củ tươi ngon',
    wardName: 'UBND Phường'
  },
  {
    id: 'sample-2',
    title: '☀️ PHÒNG NGỪA NGỘ ĐỘC THỰC PHẨM MÙA NẮNG NÓNG',
    socialContent: `☀️ MÙA HÈ NẮNG NÓNG - ĂN CHÍNH UỐNG SÔI, BẢO VỆ CẢ NHÀ! 🍲

Thời tiết nắng nóng là điều kiện thuận lợi cho vi khuẩn phát triển làm thức ăn nhanh ôi thiu. UBND Phường nhắc nhở bà con 4 nguyên tắc vàng:

✅ 1. Ăn chín, uống sôi, nấu xong ăn ngay.
✅ 2. Thực phẩm đã nấu chín nếu để quá 2 giờ cần bảo quản trong tủ lạnh (dưới 5°C) và đun kỹ lại trước khi ăn.
✅ 3. Che đậy cẩn thận tránh lây nhiễm vi khuẩn từ ruồi, muỗi, gián.
✅ 4. Giữ vệ sinh tay sạch sẻ bằng xà phòng trước khi chế biến và trước khi ăn.

🚫 KHÔNG ăn thức ăn có dấu hiệu thiu, nổi bọt hoặc đổi màu!

🏢 UBND Phường chung tay cùng nhân dân xây dựng cộng đồng an toàn, khỏe mạnh!`,
    broadcastScript: `Alo alo! UBND phường xin thông báo bản tin tuyên truyền an toàn vệ sinh thực phẩm mùa nắng nóng!

Kính thưa bà con! Vào mùa hè, thời tiết oi nóng khiến thức ăn rất dễ bị vi khuẩn xâm nhập và ôi thiu. Để tránh ngộ độc thực phẩm, Trạm Y tế phường khuyến cáo bà con:

Thứ nhất: Thực hiện tuyệt đối "Ăn chín, uống sôi".
Thứ hai: Không để thức ăn đã nấu ở nhiệt độ phòng quá 2 tiếng.
Thứ ba: Luôn rửa tay bằng xà phòng trước khi ăn và sau khi đi vệ sinh.

Nếu có biểu hiện đau bụng, buồn nôn, xin bà con liên hệ ngay Hotline Trạm y tế phường để được hỗ trợ kịp thời. Xin trân trọng cảm ơn!`,
    shortSlogan: 'Ăn chín, uống sôi - Đẩy lùi ngộ độc!',
    rhyme: `Mùa hè nắng tạ oi ngột,
Đồ ăn dễ hỏng, dễ ngộ độc ngay.
Rửa tay xà phòng hôm nay,
Nấu chín, đun sôi, mỗi ngày yên tâm!`,
    imagePrompt: 'A cozy Vietnamese dining table with a steaming hot bowl of soup, clean chopsticks, a bowl of fresh boiled rice, sunny clean kitchen background, bright vector style illustration',
    keyPoints: [
      'Không để thức ăn ở nhiệt độ phòng quá 2 tiếng',
      'Đun kỹ lại thức ăn bảo quản tủ lạnh',
      'Rửa tay xà phòng trước khi ăn'
    ],
    hotline: '024.3852.XXXX',
    hashtags: ['#UBNDPhuong', '#PhongNgoDocThucPham', '#AnChinUongSoi', '#SucKhoeMuaHe'],
    createdAt: '2026-08-02',
    topic: 'Phòng ngộ độc thực phẩm mùa nắng nóng',
    wardName: 'UBND Phường'
  }
];

export const PROPAGANDA_SLOGANS = [
  'Thực phẩm an toàn - Cả nhà an tâm - Sức khỏe tràn đầy.',
  'Nhiệt liệt hưởng ứng Tháng hành động vì An toàn thực phẩm!',
  'Nói không với thực phẩm bẩn, thực phẩm không rõ nguồn gốc!',
  'Sản xuất thực phẩm bằng cái TÂM - Lựa chọn thực phẩm bằng sự THÔNG THÁI.',
  'Bếp ăn sạch - Cơm ngon lành - Con cháu khỏe mạnh!',
  'Kinh doanh thực phẩm an toàn là bảo vệ sức khỏe cộng đồng và uy tín bản thân.'
];
