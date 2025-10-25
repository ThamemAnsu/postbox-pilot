import { useEffect, useState } from 'react';
import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, LayoutDashboard, Target, FileText, Users, Settings } from 'lucide-react';

interface Account {
  id: string;
  account_name: string;
  website: string;
  user_role: string;
}

const AccountWorkspace = () => {
  const { accountId } = useParams();
  const location = useLocation();
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccount();
  }, [accountId]);

  const fetchAccount = async () => {
    try {
      const response = await api.get(`/api/accounts/${accountId}`);
      setAccount(response.data);
    } catch (error) {
      toast.error('Failed to load account');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/destinations')) return 'destinations';
    if (path.includes('/logs')) return 'logs';
    if (path.includes('/members')) return 'members';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading account...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Account not found</h2>
          <Link to="/dashboard">
            <Button variant="link">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <span className="text-xs text-muted-foreground capitalize">
              Role: {account.user_role}
            </span>
          </div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{account.account_name}</h1>
            <p className="text-sm text-muted-foreground">{account.website}</p>
          </div>
          <Tabs value={getCurrentTab()}>
            <TabsList className="w-full justify-start">
              <Link to={`/account/${accountId}`}>
                <TabsTrigger value="dashboard" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
              </Link>
              <Link to={`/account/${accountId}/destinations`}>
                <TabsTrigger value="destinations" className="gap-2">
                  <Target className="h-4 w-4" />
                  Destinations
                </TabsTrigger>
              </Link>
              <Link to={`/account/${accountId}/logs`}>
                <TabsTrigger value="logs" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Logs
                </TabsTrigger>
              </Link>
              <Link to={`/account/${accountId}/members`}>
                <TabsTrigger value="members" className="gap-2">
                  <Users className="h-4 w-4" />
                  Members
                </TabsTrigger>
              </Link>
              <Link to={`/account/${accountId}/settings`}>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet context={{ account, refreshAccount: fetchAccount }} />
      </main>
    </div>
  );
};

export default AccountWorkspace;
