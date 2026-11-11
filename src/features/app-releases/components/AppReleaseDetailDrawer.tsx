import {
  Button,
  Descriptions,
  Drawer,
  Result,
  Skeleton,
  Tag,
  Typography,
} from 'antd'
import { appDayJs } from '#/shared/utils/appDayjs'
import { useAppRelease } from '../queries/useAppReleases'

export const formatFileSize = (bytes: number) =>
  `${(bytes / 1024 / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} MiB`

export default function AppReleaseDetailDrawer({
  id,
  onClose,
}: {
  id: number | null
  onClose: () => void
}) {
  const { data, isPending, isError, error, refetch } = useAppRelease(id)

  return (
    <Drawer
      title="Chi tiết phiên bản"
      open={id !== null}
      onClose={onClose}
      size={640}
      destroyOnHidden
    >
      {isPending ? (
        <Skeleton active />
      ) : isError ? (
        <Result
          status="error"
          title="Không tải được chi tiết phiên bản"
          subTitle={error.message}
          extra={<Button onClick={() => void refetch()}>Thử lại</Button>}
        />
      ) : (
        data && (
          <Descriptions
            bordered
            column={1}
            size="small"
            items={[
              { key: 'id', label: 'ID', children: data.id },
              { key: 'version', label: 'Phiên bản', children: data.version },
              {
                key: 'status',
                label: 'Trạng thái',
                children: (
                  <Tag color={data.status === 'draft' ? 'default' : 'green'}>
                    {data.status === 'draft' ? 'Bản nháp' : 'Đã phát hành'}
                  </Tag>
                ),
              },
              {
                key: 'current',
                label: 'Stable hiện tại',
                children: data.isCurrent ? 'Có' : 'Không',
              },
              {
                key: 'created',
                label: 'Ngày tải lên',
                children: appDayJs.formatVN(data.createdAt),
              },
              {
                key: 'updated',
                label: 'Ngày cập nhật',
                children: appDayJs.formatVN(data.updatedAt),
              },
              {
                key: 'published',
                label: 'Ngày phát hành',
                children: appDayJs.formatVN(data.publishedAt),
              },
              {
                key: 'installer',
                label: 'Bộ cài',
                children: (
                  <Typography.Text style={{ wordBreak: 'break-all' }}>
                    {data.installerName}
                  </Typography.Text>
                ),
              },
              {
                key: 'installerSize',
                label: 'Dung lượng bộ cài',
                children: formatFileSize(data.installerSize),
              },
              {
                key: 'installerHash',
                label: 'SHA-512 bộ cài',
                children: (
                  <Typography.Text copyable style={{ wordBreak: 'break-all' }}>
                    {data.installerSha512}
                  </Typography.Text>
                ),
              },
              {
                key: 'blockmap',
                label: 'Blockmap',
                children: (
                  <Typography.Text style={{ wordBreak: 'break-all' }}>
                    {data.installerName}.blockmap
                  </Typography.Text>
                ),
              },
              {
                key: 'blockmapSize',
                label: 'Dung lượng blockmap',
                children: formatFileSize(data.blockmapSize),
              },
              {
                key: 'blockmapHash',
                label: 'SHA-512 blockmap',
                children: (
                  <Typography.Text copyable style={{ wordBreak: 'break-all' }}>
                    {data.blockmapSha512}
                  </Typography.Text>
                ),
              },
              { key: 'manifest', label: 'Manifest', children: 'latest.yml' },
            ]}
          />
        )
      )}
    </Drawer>
  )
}
