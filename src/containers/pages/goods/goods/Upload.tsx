import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react'
import {apiRouter} from 'common/api'
import {Upload, Modal, message} from "antd";
import {PlusOutlined} from '@ant-design/icons'
import './upload.less'
import {serverConfig} from 'schema/server'

const imgUrlPrefix = serverConfig.filter(it => it.flag === 'file')[0].url.replace('/interface/', '')

function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

interface Iprops {
    fileType: string
    limit: number
    onChange: any
}

const App: React.FC<Iprops> = (props, ref) => {

    const [previewVisible, setPreviewVisible] = useState<boolean>(false)
    const [previewImage, setPreviewImage] = useState<string>('')
    const [fileList, setFileList] = useState<any[]>([])

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        if (props.fileType === 'image') {
            setPreviewImage(file.url)
            setPreviewVisible(true)
        }

        if (props.fileType === 'video') {
            window.open(file.url)
        }
    }


    useImperativeHandle(ref, () => ({
        fileList
    }))

    const customRequest = async (e: any) => {
        const file = e.file
        let fileName = file.name

        const fileData = {
            fileObj: file,
            fileName,
        }
        const extraParams = {
            store_type: 'goods',
            role: 'goods',
            upload_file: fileName
        }

        if (props.fileType === 'image') {
            if (!(file.type == 'image/jpeg' || file.type == 'image/png')) {
                message.error('图片仅支持png、jpg格式！')
                return false
            }
        }
        if (props.fileType === 'video') {
            if (!(file.type == 'video/mp4')) {
                message.error('请上传视频！')
                return false
            }
        }

        try {
            const result = await apiRouter.router('file', 'file.upload').upload(fileData, extraParams)
            const list = [...fileList, {
                uid: makeid(),
                name: fileName,
                status: 'done',
                url: `${imgUrlPrefix}${result.file_paths[0]}`,
            },]
            setFileList(list)
            props.onChange([...fileList, {
                uid: makeid(),
                name: fileName,
                status: 'done',
                url: result.file_paths[0],
            },])
        } catch (e) {
            setFileList([...fileList, {
                uid: makeid(),
                name: fileName,
                status: 'error',
            },])
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div className="ant-upload-text">上传</div>
        </div>
    )

    const onRemove = (file: any) => {
        const list = [...fileList]
        const index = list.findIndex(item => item.uid === file.uid)
        list.splice(index, 1)
        setFileList(list)
        props.onChange(list)
    }


    return (
        <div>
            {props.fileType === 'image' ? (
                <div className="clearfix">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onRemove={onRemove}
                        customRequest={customRequest}
                    >
                        {fileList.length >= props.limit ? null : uploadButton}
                    </Upload>
                    <Modal
                        visible={previewVisible}
                        title={'预览'}
                        footer={null}
                        onCancel={handleCancel}
                    >
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </div>
            ) : null}
            {props.fileType === 'video' ? (
                <div className="clearfix">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onRemove={onRemove}
                        customRequest={customRequest}
                    >
                        {fileList.length >= props.limit ? null : uploadButton}
                    </Upload>
                    <Modal
                        visible={previewVisible}
                        title={'预览'}
                        footer={null}
                        onCancel={handleCancel}
                    >

                        <video style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </div>
            ) : null}
        </div>
    )
}

export default forwardRef(App as any)