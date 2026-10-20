function AuthScreen({ mode, onSubmit, onSwitch }) {
  const { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Logo } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const signup = mode === 'register';
  const [name, setName] = React.useState(''); const [email, setEmail] = React.useState(''); const [pw, setPw] = React.useState('');
  React.useEffect(() => { setName(''); setEmail(''); setPw(''); }, [mode]);
  const valid = email.trim() && pw && (!signup || name.trim());
  const submit = (e) => { e.preventDefault(); if (valid) onSubmit({ name: name.trim(), email: email.trim() }); };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Logo />
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{signup ? 'Create account' : 'Sign in'}</CardTitle>
          <CardDescription>{signup ? 'Enter your details to get started.' : 'Enter your email to sign in to your account.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="auth-form" onSubmit={submit} className="grid gap-4">
            {signup ? <div className="grid gap-2"><Label htmlFor="auth-name">Name</Label><Input id="auth-name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} /></div> : null}
            <div className="grid gap-2"><Label htmlFor="auth-email">Email</Label><Input id="auth-email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="grid gap-2"><Label htmlFor="auth-pw">Password</Label><Input id="auth-pw" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required value={pw} onChange={(e) => setPw(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={!valid}>{signup ? 'Sign up' : 'Sign in'}</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center gap-1 text-sm">
          <span className="text-muted-foreground">{signup ? 'Already have an account?' : 'Don\u2019t have an account?'}</span>
          <Button variant="link" className="h-auto p-0" href={signup ? '#login' : '#register'} onClick={(e) => { e.preventDefault(); onSwitch(signup ? 'login' : 'register'); }}>{signup ? 'Sign in' : 'Sign up'}</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
Object.assign(window, { AuthScreen });
