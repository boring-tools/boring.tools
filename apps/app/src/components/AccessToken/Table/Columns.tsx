import type { AccessTokenOutput } from '@boring.tools/schema'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import type { z } from 'zod'
import { AccessTokenDelete } from '../Delete'

export const AccessTokenColumns: ColumnDef<
  z.infer<typeof AccessTokenOutput>
>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'lastUsedOn',
    header: 'Last seen',
    accessorFn: (row) => {
      if (!row.lastUsedOn) {
        return 'Never'
      }
      return format(new Date(row.lastUsedOn), 'HH:mm dd.MM.yyyy')
    },
  },
  {
    accessorKey: 'token',
    header: 'Token',
    accessorFn: (row) => `${row.token}...`,
  },
  {
    accessorKey: 'id',
    header: '',
    size: 10,
    cell: (props) => <AccessTokenDelete id={props.row.original.id} />,
  },
]
