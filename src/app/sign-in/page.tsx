import { getProviders } from 'next-auth/react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import SignIn from '@/features/auth/components/sign-in'
import { Suspense } from 'react'

export default async function LoginPage() {
    const providers = await getProviders()

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* <SignIn2/> */}
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Welcome
                    </CardTitle>
                    <CardDescription className="text-center">
                        Sign in to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Suspense fallback={<div>載入中...</div>}>
                        <SignIn providers={providers} />
                    </Suspense>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <p className="text-sm text-center text-gray-500">
                        By signing in, you agree to our Terms of Service and
                        Privacy Policy.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
