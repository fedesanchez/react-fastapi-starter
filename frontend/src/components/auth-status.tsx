
import { Link } from "react-router-dom"
import useStore from "@/store/useStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthStatus() {
  const { user, logout, isAuthenticated } = useStore()
  const handleSignOut = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Auth Status</CardTitle>
        <CardDescription className="text-zinc-400">
          { isAuthenticated ? "You are signed in" : "You are not signed in"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <div className="text-zinc-400">Loading...</div>
        ) : user ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold text-white mb-2">User Info</h3>
              <p className="text-zinc-300">Email: {user.email}</p>
              <p className="text-zinc-300">Name: {user.name}</p>
              <p className="text-zinc-300">ID: {user.id}</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link to="/auth/login" className="block">
              <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/signup" className="block">
              <Button
                variant="outline"
                className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
