import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Input,
  Popconfirm,
  Result,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import type { TableProps } from 'antd'
import type { AppReleaseQuery } from '../api/dto/req/appReleaseReq'
import type { AppRelease } from '../api/dto/res/appReleaseRes'
import AppReleaseDetailDrawer, {
  formatFileSize,
} from '../components/AppReleaseDetailDrawer'
import UploadAppReleaseModal from '../components/UploadAppReleaseModal'
import { useDeleteAppRelease } from '../hooks/useAppReleaseMutations'
import { useAppReleases } from '../queries/useAppReleases'
import { appDayJs } from '#/shared/utils/appDayjs'

const routeApi = getRouteApi('/_main-layout/applications/releases/')

export default function AppReleasesPage() {
  const params = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [search, setSearch] = useState(params.q ?? '')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)
  const query = useAppReleases(params)
  const deletion = useDeleteAppRelease()

  useEffect(() => {
    setSearch(params.q ?? '')
  }, [params.q])

  const updateSearch = (changes: Partial<AppReleaseQuery>) => {
    void navigate({ search: (previous) => ({ ...previous, ...changes }) })
  }

  useEffect(() => {
    if (!query.data || query.isFetching) return
    const lastPage = Math.max(1, query.data.pagination.totalPage)
    if (params.page > lastPage) {
      void navigate({
        search: (previous) => ({ ...previous, page: lastPage }),
        replace: true,
      })
    }
  }, [query.data, query.isFetching, params.page, navigate])

  const columns: TableProps<AppRelease>['columns'] = [
    {
      title: 'Phiên bản',
      dataIndex: 'version',
      width: 150,
      render: (version, release) => (
        <Button type="link" onClick={() => setDetailId(release.id)}>
          {version}
        </Button>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 200,
      render: (_, release) => (
        <Space size={8} wrap>
          <Tag color={release.status === 'draft' ? 'default' : 'green'}>
            {release.status === 'draft' ? 'Bản nháp' : 'Đã phát hành'}
          </Tag>
          {release.isCurrent && <Tag color="blue">Stable hiện tại</Tag>}
        </Space>
      ),
    },
    { title: 'Bộ cài', dataIndex: 'installerName', ellipsis: true },
    {
      title: 'Dung lượng',
      dataIndex: 'installerSize',
      width: 130,
      render: formatFileSize,
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'createdAt',
      width: 180,
      render: (value: string) => appDayJs.formatVN(value),
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'publishedAt',
      width: 180,
      render: (value: string | null) => appDayJs.formatVN(value),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 110,
      fixed: 'right',
      render: (_, release) => (
        <Space size={8}>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              aria-label={`Xem phiên bản ${release.version}`}
              onClick={() => setDetailId(release.id)}
            />
          </Tooltip>
          <Popconfirm
            title={`Xóa phiên bản ${release.version}?`}
            description="Bản nháp và cả 3 file sẽ bị xóa."
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            disabled={release.status !== 'draft' || deletion.isPending}
            onConfirm={() =>
              new Promise<void>((resolve, reject) => {
                deletion.mutate(release.id, {
                  onSuccess: () => resolve(),
                  onError: reject,
                })
              })
            }
          >
            <Tooltip
              title={
                release.status === 'draft'
                  ? 'Xóa bản nháp'
                  : 'Không thể xóa phiên bản đã phát hành'
              }
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                aria-label={`Xóa phiên bản ${release.version}`}
                disabled={release.status !== 'draft' || deletion.isPending}
                loading={
                  deletion.isPending && deletion.variables === release.id
                }
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Row
        gutter={[8, 8]}
        align="middle"
        justify="space-between"
        style={{ marginBottom: 8 }}
      >
        <Col>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Danh sách phiên bản
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setUploadOpen(true)}
          >
            Tải phiên bản mới lên
          </Button>
        </Col>
      </Row>
      <Card>
        <Row gutter={[8, 8]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={8}>
            <Input.Search
              placeholder="Tìm theo phiên bản"
              aria-label="Tìm theo phiên bản"
              allowClear
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onSearch={(value) =>
                updateSearch({ q: value.trim() || undefined, page: 1 })
              }
            />
          </Col>
          <Col xs={24} md={5}>
            <Select
              aria-label="Trạng thái"
              placeholder="Tất cả trạng thái"
              allowClear
              value={params.status}
              style={{ width: '100%' }}
              onChange={(status) => updateSearch({ status, page: 1 })}
              options={[
                { value: 'draft', label: 'Bản nháp' },
                { value: 'published', label: 'Đã phát hành' },
              ]}
            />
          </Col>
          <Col xs={16} md={5}>
            <Select
              aria-label="Sắp xếp theo"
              value={params.sortBy}
              style={{ width: '100%' }}
              onChange={(sortBy) => updateSearch({ sortBy, page: 1 })}
              options={[
                { value: 'createdAt', label: 'Ngày tải lên' },
                { value: 'publishedAt', label: 'Ngày phát hành' },
                { value: 'version', label: 'Phiên bản' },
                { value: 'id', label: 'ID' },
              ]}
            />
          </Col>
          <Col xs={8} md={4}>
            <Select
              aria-label="Thứ tự sắp xếp"
              value={params.sortOrder}
              style={{ width: '100%' }}
              onChange={(sortOrder) => updateSearch({ sortOrder, page: 1 })}
              options={[
                { value: 'desc', label: 'Giảm dần' },
                { value: 'asc', label: 'Tăng dần' },
              ]}
            />
          </Col>
          <Col xs={24} md={2}>
            <Tooltip title="Tải lại">
              <Button
                block
                icon={<ReloadOutlined />}
                aria-label="Tải lại danh sách"
                loading={query.isFetching}
                onClick={() => void query.refetch()}
              />
            </Tooltip>
          </Col>
        </Row>
        {query.isError ? (
          <Result
            status="error"
            title="Không tải được danh sách phiên bản"
            subTitle={query.error.message}
            extra={
              <Button onClick={() => void query.refetch()}>Thử lại</Button>
            }
          />
        ) : (
          <Table<AppRelease>
            rowKey="id"
            columns={columns}
            dataSource={query.data?.data ?? []}
            loading={query.isFetching}
            scroll={{ x: 1200 }}
            locale={{ emptyText: 'Không có phiên bản nào' }}
            pagination={{
              current: params.page,
              pageSize: params.limit,
              total: query.data?.pagination.totalItems ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total) => `Tổng ${total} phiên bản`,
              onChange: (page, limit) =>
                updateSearch({
                  page: limit !== params.limit ? 1 : page,
                  limit,
                }),
            }}
          />
        )}
      </Card>
      <AppReleaseDetailDrawer id={detailId} onClose={() => setDetailId(null)} />
      <UploadAppReleaseModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </>
  )
}
