import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
// import MyCustomFont from './Montserrat-VariableFont_wght.ttf';
import MyCustomFont from './SourceSerif4-VariableFont_opsz,wght.ttf';

// Register Font
Font.register({
    family: "Source Serif 4",
    src: MyCustomFont
})

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#fff',
    // position: 'relative',
    fontFamily: 'Source Serif 4',
    fontSize: '14px'
  },
  pageNum: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    // fontFamily: "AntonFamily",
  },
  logoImg: {
    display: 'block',
    width: '150px',
    textAlign: 'center'
  },
  header: {
    textAlign: "center",
    fontSize: '12px',
    marginBottom: '30px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    textAlign: "center",
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  table: { 
    display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol: { 
    width: "33.33%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 14 
  },
  tableHeader: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 14,
    fontWeight: 600
  }
});

function PDFFile({type, formId, stockerInfo, driverInfo, orders, createdAt, stock}) {
    console.log('orders', orders)
  return (
    <Document>
        <Page size="A4" style={styles.page} wrap>
            <Text 
                style={styles.pageNum} 
                render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} 
            />
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Image src={require('assests/images/Logo.png')} style={styles.logoImg} />
            </View>
            <View style={styles.header}>
                <Text style={styles.title}>{type === 'import' ? 'PHIẾU NHẬP KHO' : 'PHIẾU XUẤT KHO'}</Text>
                <Text>Ngày {new Date(createdAt).getDate()} tháng {new Date(createdAt).getMonth()} năm {new Date(createdAt).getFullYear()}</Text>
                <Text>Số phiếu: {formId}</Text>
            </View>
            <View style={{marginBottom: '20px'}}>
                <Text>Thủ kho: {stockerInfo?.fullname}, {stockerInfo?.phone}, {stockerInfo?.email} </Text>
                <Text>{type === 'import' ? 'Nhập' : 'Xuất'} tại kho: {stock?.address}</Text>
            </View>
            <View style={{marginBottom: '20px'}}>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableHeader}>Mã đơn hàng</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableHeader}>Hàng hóa</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableHeader}>Khối lượng</Text>
                        </View>
                    </View>
                    {
                        orders.map((order) => {
                            return order.items.map((item) =>
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{order._id}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{item.name}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{item.weight}kg</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                    {/* <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>8687584214</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Máy tính</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200kg</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>8687584214</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Máy tính</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200kg</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>8687584214</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Máy tính</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200kg</Text>
                        </View>
                    </View> */}
                </View>
            </View>
            <View style={styles.footer}>
                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{fontWeight: 400}}>{type === 'import' ? 'Người giao hàng' : 'Người nhận hàng'}</Text>
                    <Text>(ký, họ tên)</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{fontWeight: 400}}>Thủ kho</Text>
                    <Text>(ký, họ tên)</Text>
                </View>
            </View>
        </Page>
    </Document>
  )
}

export default PDFFile