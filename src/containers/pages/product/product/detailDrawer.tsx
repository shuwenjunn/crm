import React, {useState, useImperativeHandle, forwardRef, useEffect, useRef} from 'react'
import {Drawer, Form, Input, Table} from 'antd'
import {apiRouter} from 'common/api'
import SubTitle from 'containers/components/subTitle';
import DescribeList from 'containers/components/describeList';
import AddCateDrawer from './addCateDrawer'

const FormItem = Form.Item

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


    const showDrawer = (record: any, optType: string) => {
        setVisible(true)
        setOptType(optType)
        setRecord(record)
        // fetchTableData(record)
    }
    const onClose = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))


    const fetchTableData = async (record: any) => {
        setLoading(true)
        try {
            const result = await apiRouter.router('crm-pc', 'customer.address.search').request({
                customer_id: record.id
            })
            setData(result.data_list)
        } catch (error) {
            console.log('error------->>', error)
        } finally {
            setLoading(false)
        }
    }

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            const apiName = optType === 'add' ? 'production.brand.add' : 'production.brand.update'
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

    const layout = {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
    }

    const onAdd = (obj: any) => {
        setAttributeList([...attributeList, obj])
    }

    useEffect(() => {
        console.log('dfadfsasdfasdf', attributeList)
    })

    return (
        <Drawer
            title={'详情'}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={669}
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
                    <Input placeholder="品牌名称"/>
                </FormItem>
            </Form>
            <SubTitle
                title='属性信息'
                rightCon={(
                    <div>
                        <a style={{fontSize: 14}} onClick={() => addCateRef.current.showDrawer({}, 'add')}>添加分类</a>
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
                                return <span key={it}>{it.name}{index < text.length - 1 ? '、' : ''}</span>
                            })
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
            />
        </Drawer>
    )
}

export default forwardRef(App as any)