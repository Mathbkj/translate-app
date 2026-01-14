import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: AuthComponent,
})

// Authentication component
function AuthComponent() {
  // return <Navigate from={Route.fullPath} to=".." />
}
