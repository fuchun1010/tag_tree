const dataSetResponse = (dataSet) => {
	if(!dataSet) {
		return {}
	}
  const {_id, name, creator, createDate, source_table, data_set_name, fields} = dataSet
  const response = { id: _id, name, creator, source_table, data_set_name }
  response.columns = [
    {
			title: "id",
		  dataIndex: "id",
		  key:"id"	
		},
		{
			title: "字段别名",
			dataIndex: "alias",
			key: "alias"
		},
		{
			title: "原始字段",
			dataIndex: "field",
			key: "field"
		},
		{
			title: "子段类型",
			dataIndex: "dataType",
			key: "dataType"
		}
  ]
  response.dataSource = []
  fields.forEach(field => {
		let item = {
			id: field.id,
			alias: field.desc,
			field: field.name,
			dataType: field.type
		}
    response.dataSource.push(item)
  })
  return response
}

module.exports = {
  dataSetResponse
}