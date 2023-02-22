import Table from 'components/Table'
import React from 'react'

const data = {
    columns: [
        {
            label: 'Name',
            field: 'name',
            sort: 'asc',
            width: 150
        },
        {
        label: 'Position',
        field: 'position',
        sort: 'asc',
        width: 270
        },
    ]
}

function DriverHistory() {
  return (
    <div>
        <Table />
    </div>
  )
}

export default DriverHistory