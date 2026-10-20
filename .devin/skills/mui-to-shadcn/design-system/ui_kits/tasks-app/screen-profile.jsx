function ProfileScreen({ user, tasks, pref, setPref, onSaveName }) {
  const { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, Avatar, AvatarFallback, Badge, Input, Label, Button, Separator, Tabs, TabsList, TabsTrigger } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const s = window.TasksKitData.stats(tasks);
  const [name, setName] = React.useState(user.name);
  React.useEffect(() => setName(user.name), [user.name]);
  const ini = user.name.split(' ').filter(Boolean); const initials = (ini[0][0] + (ini.length > 1 ? ini[ini.length - 1][0] : '')).toUpperCase();
  const count = (n, l) => <div className="flex-1 text-center"><div className="font-heading text-2xl font-bold tabular-nums">{n}</div><div className="text-muted-foreground text-sm">{l}</div></div>;
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-8 pt-10 pb-16">
      <h1 className="font-heading text-4xl font-bold tracking-tight">Profile</h1>
      <div className="grid items-start gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="items-center px-6 text-center">
          <Avatar className="size-20"><AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback></Avatar>
          <div className="flex flex-col items-center gap-1">
            <div className="font-heading text-xl font-bold tracking-tight">{user.name}</div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
            <Badge variant="secondary" className="mt-2 rounded-full">Joined {user.joined}</Badge>
          </div>
          <Separator />
          <div className="flex w-full">{count(s.total, 'Created')}{count(s.done, 'Completed')}</div>
        </Card>
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader><CardTitle>Account details</CardTitle><CardDescription>Update the name shown across the app.</CardDescription></CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2"><Label htmlFor="full-name">Full name</Label><Input id="full-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" value={user.email} readOnly /></div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="outline" onClick={() => setName(user.name)}>Cancel</Button>
              <Button disabled={!name.trim() || name === user.name} onClick={() => onSaveName(name.trim())}>Save changes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <CardTitle>Appearance</CardTitle><CardDescription>Choose how the app looks.</CardDescription>
              <CardAction><Tabs value={pref} onValueChange={setPref}><TabsList aria-label="Theme"><TabsTrigger value="light" className="px-3">Light</TabsTrigger><TabsTrigger value="dark" className="px-3">Dark</TabsTrigger><TabsTrigger value="system" className="px-3">System</TabsTrigger></TabsList></Tabs></CardAction>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
Object.assign(window, { ProfileScreen });
