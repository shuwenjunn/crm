import React, {useState, useImperativeHandle, forwardRef, useEffect, useRef} from 'react'
import {Button, Drawer, Form, Input, Select, Table} from 'antd'
import {apiRouter} from 'common/api'
import SubTitle from 'containers/components/subTitle';
import DescribeList from 'containers/components/describeList';
import AddCateDrawer from './addCateDrawer'

const FormItem = Form.Item
const Option = Select.Option

interface DrawerProps {

}

const App: React.FC<DrawerProps> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any[]>([])
    const [form] = Form.useForm()
    const addCateRef = useRef()
    const [record, setRecord] = useState<any>({})
    const [optType, setOptType] = useState('')
    const [attributeList, setAttributeList] = useState<any[]>([])
    const [brandData, setBrandData] = useState<any[]>([])
    const [cateId, setCateId] = useState(0)

    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setOptType(optType)
        setRecord(record)
        fetchBrancData()
        if (optType === 'edit') {
            console.log('record------->>>', record)
            let newCateId = cateId
            for (let i in record.attribute_list) {
                newCateId++
                record.attribute_list[i].key = newCateId
            }
            setCateId(newCateId)
            console.log('record.attribute_list', record.attribute_list)
            setAttributeList(record.attribute_list)
        }
    }
    const onClose = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))


    const fetchBrancData = async () => {
        try {
            const result = await apiRouter.router('crm-pc', 'production.brand.searchall').request({})
            setBrandData(result.data_list)
        } catch (error) {
            console.log('error------->>', error)
        } finally {

        }
    }

    const layout = {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
    }

    const onAdd = (obj: any) => {
        setAttributeList([...attributeList, obj])
    }

    const onDelete = (key: string) => {
        const list = [...attributeList]
        const index = list.findIndex(item => item.key === key)
        list.splice(index, 1)
        setAttributeList(list)
    }

    const onEdit = (obj: any) => {
        const list = [...attributeList]
        const index = list.findIndex(item => item.key === obj.key)
        list[index] = obj
        setAttributeList(list)
    }

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            const apiName = optType === 'add' ? 'production.brand.add' : 'production.brand.update'
            const params: any = {brand_info: JSON.stringify(values)}

            await apiRouter.router('crm-pc', apiName).request({
                brand_info: JSON.stringify(values),
                brand_id: record.id
            })
            onClose()
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log('attributeList------>>', attributeList)
    }, [attributeList])

    const openAddCateDrawer = () => {
        const newCateId = cateId + 1
        setCateId(newCateId);
        (addCateRef as any).current.showDrawer({key: newCateId}, 'add')
    }

    return (
        <Drawer
            title={'详情'}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={669}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={onClose} style={{marginRight: 8}}>
                        取消
                    </Button>
                    <Button onClick={form.submit} type="primary" loading={loading}>
                        确认
                    </Button>
                </div>
            }
        >
            <SubTitle
                title='产品信息'
            />
            <Form form={form} name="brand" onFinish={onFinish} {...layout} initialValues={record}>
                <FormItem
                    label="产品名称"
                    name="description"
                >
                    <Input placeholder="品牌描述"/>
                </FormItem>

                <FormItem
                    label="品牌名称"
                    name="name"
                    rules={[{required: true, message: '请输入品牌名称!'}]}
                >
                    <Select
                        placeholder="品牌名称"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input.trim()) >= 0}
                        allowClear
                    >
                        {brandData.map(d => (
                            <Option value={d.id} key={d.id}>{d.name}</Option>
                        ))}
                    </Select>
                </FormItem>
            </Form>
            <SubTitle
                title='属性信息'
                rightCon={(
                    <div>
                        <a
                            style={{fontSize: 14}}
                            onClick={openAddCateDrawer}
                        >
                            添加分类
                        </a>
                    </div>
                )}
            />
            <Table
                columns={[
                    {
                        title: '分类名称',
                        dataIndex: 'category',
                    },
                    {
                        title: '属性',
                        dataIndex: 'attribute_list',
                        render: (text: any, record) => {
                            console.log('text', record)
                            return record.attribute_list.map((it: any, index: number) => {
                                return <span key={it.name}>{it.name}{index < text.length - 1 ? '、' : ''}</span>
                            })
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: 'option',
                        render: (text: any, record: any) => {
                            return (
                                <span>
                                    <a onClick={() => addCateRef.current.showDrawer(record, 'edit')}>编辑</a>
                                    &nbsp;
                                    <a onClick={() => onDelete(record.key)}>删除</a>
                                </span>
                            )
                        }
                    },
                ]}
                dataSource={attributeList}
                size={'small'}
                style={{marginTop: 16}}
                pagination={false}
            />

            <AddCateDrawer
                ref={addCateRef}
                onAdd={onAdd}
                onEdit={onEdit}
            />
        </Drawer>
    )
}

export default forwardRef(App as any)