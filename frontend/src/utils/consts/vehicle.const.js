import { VehicleStatus, VehicleType, VehicleTypeLabel } from "utils/enums/vehicle.enum";

export const VehicleTypes = [
  {
    label: VehicleTypeLabel.INNER,
    value: VehicleType.INNER
  },
  {
    label: VehicleTypeLabel.INTER,
    value: VehicleType.INTER
  }
];

export const VehicleStatuses = [
  {
    label: 'Đang chờ xác nhận',
    value: VehicleStatus.WAITING,
  },
  {
    label: 'Sẵn Sàng',
    value: VehicleStatus.AVAILABLE,
  },
  {
    label: 'Đang vận chuyển',
    value: VehicleStatus.IN_PROGRESS,
  }
]
