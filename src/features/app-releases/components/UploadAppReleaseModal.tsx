import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Modal, Progress, Typography, Upload } from 'antd'
import type { UploadFile } from 'antd'
import type { UploadAppReleaseReq } from '../api/dto/req/appReleaseReq'
import { useUploadAppRelease } from '../hooks/useAppReleaseMutations'

type UploadForm = Record<keyof UploadAppReleaseReq, UploadFile[]>

const fields = [
  { name: 'manifest', label: 'Manifest (latest.yml)', accept: '.yml', max: 1 },
  {
    name: 'installer',
    label: 'Bộ cài Windows (.exe)',
    accept: '.exe',
    max: 500,
  },
  {
    name: 'blockmap',
    label: 'Blockmap (.exe.blockmap)',
    accept: '.blockmap',
    max: 500,
  },
] as const

export default function UploadAppReleaseModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [form] = Form.useForm<UploadForm>()
  const upload = useUploadAppRelease()

  const handleSubmit = async (values: UploadForm) => {
    const files = {
      manifest: values.manifest[0].originFileObj!,
      installer: values.installer[0].originFileObj!,
      blockmap: values.blockmap[0].originFileObj!,
    }
    upload.mutate(files, { onSuccess: onClose })
  }

  return (
    <Modal
      title="Tải phiên bản mới lên"
      open={open}
      onCancel={() => {
        if (upload.isPending) upload.cancel()
        else onClose()
      }}
      onOk={() => form.submit()}
      okText="Tải lên"
      cancelText="Hủy"
      confirmLoading={upload.isPending}
      cancelButtonProps={{
        disabled: upload.isPending && upload.progress === 100,
      }}
      closable={!upload.isPending}
      keyboard={!upload.isPending}
      mask={{ closable: false }}
      destroyOnHidden
      afterClose={() => {
        form.resetFields()
        upload.reset()
      }}
    >
      <Typography.Paragraph type="secondary">
        Chọn đủ 3 file từ cùng một bản build. Phiên bản được đọc từ latest.yml.
        Tải lên thành công sẽ tạo bản nháp, chưa phát hành tới người dùng.
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        File được chia thành các phần 5 MiB, tải tối đa 3 phần đồng thời và tự
        thử lại khi kết nối lỗi. Có thể hủy trong khi đang tải.
      </Typography.Paragraph>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={upload.isPending}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            valuePropName="fileList"
            getValueFromEvent={(event: { fileList: UploadFile[] }) =>
              event.fileList
            }
            dependencies={field.name === 'blockmap' ? ['installer'] : undefined}
            extra={`Tối đa ${field.max} MiB${field.name === 'blockmap' ? '; tên phải bằng tên bộ cài + .blockmap' : ''}`}
            rules={[
              { required: true, message: 'Vui lòng chọn file' },
              {
                validator: (_, list?: UploadFile[]) => {
                  const file = list?.[0]
                  if (!file) return Promise.resolve()
                  const validName =
                    file.name.length <= 200 &&
                    /^[a-zA-Z0-9][a-zA-Z0-9 ._()+-]*$/.test(file.name) &&
                    !/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(
                      file.name,
                    )
                  const validExtension =
                    field.name === 'manifest'
                      ? file.name === 'latest.yml'
                      : file.name.endsWith(
                          field.name === 'installer' ? '.exe' : '.exe.blockmap',
                        )
                  if (!validName || !validExtension) {
                    return Promise.reject(
                      new Error(
                        'Tên file không hợp lệ. Dùng tên gốc từ bản build, chỉ chứa ký tự ASCII.',
                      ),
                    )
                  }
                  if (!file.size || file.size > field.max * 1024 * 1024) {
                    return Promise.reject(
                      new Error(
                        `File phải có dữ liệu và không vượt quá ${field.max} MiB`,
                      ),
                    )
                  }
                  const installer = form.getFieldValue('installer')?.[0] as
                    UploadFile | undefined
                  if (
                    field.name === 'blockmap' &&
                    installer &&
                    file.name !== `${installer.name}.blockmap`
                  ) {
                    return Promise.reject(
                      new Error(
                        'Tên blockmap phải bằng tên bộ cài + .blockmap',
                      ),
                    )
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Upload
              accept={field.accept}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        ))}
      </Form>
      {upload.isPending && (
        <>
          <Progress percent={upload.progress} status="active" />
          <Typography.Text type="secondary">
            {upload.progress === 100
              ? 'Máy chủ đang kiểm tra file và tạo bản nháp…'
              : 'Đang tải file lên…'}
          </Typography.Text>
        </>
      )}
    </Modal>
  )
}
