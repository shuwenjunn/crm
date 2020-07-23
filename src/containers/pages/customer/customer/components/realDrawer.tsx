import React, {useState, useImperativeHandle, forwardRef} from 'react'
import {Badge, Drawer} from 'antd'
import DescribeList from 'containers/components/describeList';
import ImgPreview from 'containers/components/imgPreview';

interface DrawerProps {

}

const App: React.FC<DrawerProps> = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [record, setRecord] = useState<any>({})

    const showDrawer = (record: any) => {
        setVisible(true)
        setRecord(record)
    }
    const onClose = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        showDrawer
    }))

    return (
        <Drawer
            title={'实名信息'}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={669}
        >
            <DescribeList
                width={100}
                data={[
                    {
                        label: '姓名',
                        value: record.name,
                    },
                    {
                        label: '身份证号',
                        value: record.identification,
                    },
                    {
                        label: '身份证正面',
                        value: record.id_front && <ImgPreview title={'身份证正面'} url={record.id_front} customerStyle={{
                            width: 400,
                            height: 200,
                            cursor: 'pointer'
                        }}/>,
                    },
                    {
                        label: '身份证反面',
                        value: record.id_back && <ImgPreview title={'身份证正面'} url={record.id_back} customerStyle={{
                            width: 400,
                            height: 200,
                            cursor: 'pointer'
                        }}/>,
                    },
                    {
                        label: '手持身份证',
                        value: record.id_in_band && <ImgPreview title={'身份证正面'} url={record.id_in_band} customerStyle={{
                            width: 400,
                            height: 200,
                            cursor: 'pointer'
                        }}/>,
                    },
                ]}
            />
        </Drawer>
    )
}

export default forwardRef(App as any)