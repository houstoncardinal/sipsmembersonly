import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Shield, KeyRound, Smartphone, Lock } from "lucide-react";

export default function Account() {
  const { user } = useAuth();

  const securityItems = [
    {
      icon: Lock,
      label: "Password",
      description: "Last changed 30 days ago",
      action: "Change",
    },
    {
      icon: KeyRound,
      label: "Access Phrase",
      description: "Set and active",
      action: "Reset",
    },
    {
      icon: Smartphone,
      label: "Two-Factor Authentication",
      description: "Not enabled",
      action: "Enable",
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl text-foreground mb-8 glow-text">Account & Security</h1>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-serif text-lg text-foreground mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
              {user?.name?.[0]}
            </div>
            <div>
              <p className="font-sans font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground font-sans">{user?.email}</p>
              <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-primary mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-lg text-foreground">Security</h2>
          </div>
          <div className="space-y-4">
            {securityItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-sans font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <button className="text-xs font-sans font-medium text-primary hover:underline">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
