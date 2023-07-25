export const AreaDelivery = [
  { label: 'Thành phố Hà Nội', code: 1 },
  { label: 'Tỉnh Hà Giang', code: 2 },
  { label: 'Tỉnh Cao Bằng', code: 4 },
  { label: 'Tỉnh Bắc Kạn', code: 6 },
  { label: 'Tỉnh Tuyên Quang', code: 8 },
  { label: 'Tỉnh Lào Cai', code: 10 },
  { label: 'Tỉnh Điện Biên', code: 11 },
  { label: 'Tỉnh Lai Châu', code: 12 },
  { label: 'Tỉnh Sơn La', code: 14 },
  { label: 'Tỉnh Yên Bái', code: 15 },
  { label: 'Tỉnh Hoà Bình', code: 17 },
  { label: 'Tỉnh Thái Nguyên', code: 19 },
  { label: 'Tỉnh Lạng Sơn', code: 20 },
  { label: 'Tỉnh Quảng Ninh', code: 22 },
  { label: 'Tỉnh Bắc Giang', code: 24 },
  { label: 'Tỉnh Phú Thọ', code: 25 },
  { label: 'Tỉnh Vĩnh Phúc', code: 26 },
  { label: 'Tỉnh Bắc Ninh', code: 27 },
  { label: 'Tỉnh Hải Dương', code: 30 },
  { label: 'Thành phố Hải Phòng', code: 31 },
  { label: 'Tỉnh Hưng Yên', code: 33 },
  { label: 'Tỉnh Thái Bình', code: 34 },
  { label: 'Tỉnh Hà Nam', code: 35 },
  { label: 'Tỉnh Nam Định', code: 36 },
  { label: 'Tỉnh Ninh Bình', code: 37 },
  { label: 'Tỉnh Thanh Hóa', code: 38 },
  { label: 'Tỉnh Nghệ An', code: 40 },
  { label: 'Tỉnh Hà Tĩnh', code: 42 },
  { label: 'Tỉnh Quảng Bình', code: 44 },
  { label: 'Tỉnh Quảng Trị', code: 45 },
  { label: 'Tỉnh Thừa Thiên Huế', code: 46 },
  { label: 'Thành phố Đà Nẵng', code: 48 },
  { label: 'Tỉnh Quảng Nam', code: 49 },
  { label: 'Tỉnh Quảng Ngãi', code: 51 },
  { label: 'Tỉnh Bình Định', code: 52 },
  { label: 'Tỉnh Phú Yên', code: 54 },
  { label: 'Tỉnh Khánh Hòa', code: 56 },
  { label: 'Tỉnh Ninh Thuận', code: 58 },
  { label: 'Tỉnh Bình Thuận', code: 60 },
  { label: 'Tỉnh Kon Tum', code: 62 },
  { label: 'Tỉnh Gia Lai', code: 64 },
  { label: 'Tỉnh Đắk Lắk', code: 66 },
  { label: 'Tỉnh Đắk Nông', code: 67 },
  { label: 'Tỉnh Lâm Đồng', code: 68 },
  { label: 'Tỉnh Bình Phước', code: 70 },
  { label: 'Tỉnh Tây Ninh', code: 72 },
  { label: 'Tỉnh Bình Dương', code: 74 },
  { label: 'Tỉnh Đồng Nai', code: 75 },
  { label: 'Tỉnh Bà Rịa - Vũng Tàu', code: 77 },
  { label: 'Thành phố Hồ Chí Minh', code: 79 },
  { label: 'Tỉnh Long An', code: 80 },
  { label: 'Tỉnh Tiền Giang', code: 82 },
  { label: 'Tỉnh Bến Tre', code: 83 },
  { label: 'Tỉnh Trà Vinh', code: 84 },
  { label: 'Tỉnh Vĩnh Long', code: 86 },
  { label: 'Tỉnh Đồng Tháp', code: 87 },
  { label: 'Tỉnh An Giang', code: 89 },
  { label: 'Tỉnh Kiên Giang', code: 91 },
  { label: 'Thành phố Cần Thơ', code: 92 },
  { label: 'Tỉnh Hậu Giang', code: 93 },
  { label: 'Tỉnh Sóc Trăng', code: 94 },
  { label: 'Tỉnh Bạc Liêu', code: 95 },
  { label: 'Tỉnh Cà Mau', code: 96 }
];

export const DeliveryRoutes = {
  vung1: {
    short_name: "trungDu_mienNuiBacBo",
    full_name: "Trung du & miền núi Bắc bộ",
    codes: [   2,  4, 10,  6, 20,  8,
      15, 19, 25, 24, 12, 11,
      14, 17, 22]
  },
  vung2: {
    short_name: "dongBangBacBo",
    full_name: "Đồng bằng Bắc bộ",
    codes: [
      1, 31, 27, 35, 30,
      33, 36, 34, 26, 37
    ]
  },
  vung3: {
    short_name: "bacTrungBo",
    full_name: "Bắc Trung bộ",
    codes: [ 38, 40, 42, 44, 45, 46 ]
  },
  vung4: {
    short_name: "duyenHaiNamTrungBo",
    full_name: "Duyên hải Nam Trung bộ",
    codes: [
      48, 49, 51, 52,
      54, 56, 60, 58
    ]
  },
  vung5: {
    short_name: "tayNguyen",
    full_name: "Tây Nguyên",
    codes: [ 62, 64, 66, 67, 68]
  },
  vung6: {
    short_name: "dongNamBo",
    full_name: "Đông Nam Bộ",
    codes: [ 79, 77, 74, 70, 75, 72 ]
  },
  vung7: {
    short_name: "dongBangSongCuuLong",
    full_name: "Đồng bằng Sông Cửu Long",
    codes: [
      92, 80, 82, 83, 86, 84,
      93, 94, 87, 89, 91, 95,
      96
    ]
  }
}