export const VersionStatus = ({ status }: { status: string }) => {
  switch (status) {
    case 'draft':
      return <div className="w-3 h-3 rounded-full bg-amber-600" />
    case 'published':
      return <div className="w-3 h-3 rounded-full bg-emerald-600" />
    case 'review':
      return <div className="w-3 h-3 rounded-full bg-sky-600" />
    default:
      return <div className="w-3 h-3 rounded-full bg-neutral-600" />
  }
}
