import React from 'react';
import Chart from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FaMoneyBillAlt, FaShoppingBag, FaUserPlus } from 'react-icons/fa';
import './index.scss'

const areaChartData = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  datasets: [
    {
      label: "Số đơn hàng",
      data: [33, 53, 85, 41, 44, 65, 62, 48, 36, 40, 42, 44],
      fill: true,
      backgroundColor: "rgba(79,152,195,0.8)",
      borderColor: "rgba(79,152,195,1)"
    },
  ]
};

const lineChartData = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  datasets: [
    {
      label: "Số taì khoản",
      data: [33, 53, 85, 41, 44, 65, 62, 48, 36, 40, 42, 44],
      fill: false,
      backgroundColor: "rgba(79,152,195,0.8)",
      borderColor: "rgba(166,206,227,1)"
    },
  ]
};

const doughnutChartData = {
  labels: [
    'Thực phẩm',
    'Dược phẩm',
    'Quần áo',
    'Sách',
    'Linh kiện điện tử'
  ],
  datasets: [{
    label: 'Số đơn hàng',
    data: [300, 50, 100, 200, 400],
    backgroundColor: [
      'rgb(0, 192, 239)',
      'rgb(84, 110, 238)',
      'rgb(0, 166, 90)',
      'rgb(245, 105, 84)',
      'rgb(243, 156, 18)',
    ],
    hoverOffset: 4
  }]
};

const barChartData = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  datasets: [
  {
    label: 'Tháng trước',
    data: [45000, 65000, 30000, 90000, 60000, 20000, 70000, 32000, 39000, 64000, 25000, 30000],
    backgroundColor: "rgb(24, 156, 129)",
    borderWidth: 1
  },
  {
    label: 'Tháng hiện tại',
    data: [65000, 59000, 80000, 81000, 56000, 55000, 40000, 32000, 100000, 70000, 25000, 30000],
    backgroundColor: "rgb(51, 208, 80)",
    borderWidth: 1
  },
]
};

function AdminHome() {
  return (
    <div className='admin-dashboard'>
      <h2 className='pb-3 fs-3 d-none d-sm-block'>Thống kê</h2>
      <div className='widget'>
        <div className='widget-item blue-color'>
          <p className='title'>Tài khoản mới</p>
          <div className='d-flex justify-content-between align-items-center'>
            <p className='num'>100</p>
            <FaUserPlus className='icon' />
          </div>
        </div>
        <div className='widget-item cyan-color'>
          <p className='title'>Tổng đơn hàng</p>
          <div className='d-flex justify-content-between align-items-center'>
            <p className='num'>250</p>
            <FaShoppingBag className='icon' />
          </div>
        </div>
        <div className='widget-item orange-color'>
          <p className='title'>Tổng doanh thu</p>
          <div className='d-flex justify-content-between align-items-center'>
            <p className='num'>1,45M</p>
            <FaMoneyBillAlt className='icon' />
          </div>
        </div>
        <div className='widget-item green-color'>
          <p className='title'>Nhân viên mới</p>
          <div className='d-flex justify-content-between align-items-center'>
            <p className='num'>100</p>
            <FaUserPlus className='icon' />
          </div>
        </div>
      </div>
      <div className='charts'>
        <div className='chart-container'>
          <h3 className='title blue-color'>Số đơn hàng</h3>
          <div className='chart'>
            <Line data={areaChartData} />
          </div>
        </div>
        <div className='chart-container'>
          <h3 className='title cyan-color'>Số lượng tài khoản đăng ký</h3>
          <div className='chart'>
            <Line data={lineChartData} />
          </div>
        </div>
        <div className='chart-container'>
          <h3 className='title red-color'>Phần trăm đơn hàng theo loại</h3>
          <div className='chart doughnut'>
            <Doughnut data={doughnutChartData} />
          </div>
        </div>
        <div className='chart-container'>
          <h3 className='title green-color'>Doanh thu</h3>
          <div className='chart'>
            <Bar data={barChartData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome