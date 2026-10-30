import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, OctagonX } from 'lucide-react';
import { useAuthViewModel } from '../hooks';
import { SecurityRoute } from '../contracts';
import { Logo } from '../../../components/app';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '../../../components/ui';

export default function LoginScreen() {
  const { email, password, setEmail, setPassword, login, isSubmitting, errorMessage } =
    useAuthViewModel();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full flex-col items-center gap-6">
        <Logo />
        <Card className="w-full max-w-[384px]">
          <CardHeader className="text-center">
            <CardTitle className="text-[28px] leading-8">Sign in</CardTitle>
            <CardDescription>Enter your email to sign in to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <OctagonX />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} aria-label="Login form" className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">
                  Email
                  <span aria-hidden="true" className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  aria-required="true"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">
                  Password
                  <span aria-hidden="true" className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  aria-required="true"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full font-medium" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                Sign in
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center gap-1 text-sm">
            <span className="text-muted-foreground">Don't have an account?</span>
            <Button asChild variant="link" className="h-auto px-0">
              <Link to={SecurityRoute.register}>Sign up</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
