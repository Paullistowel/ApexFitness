import SettingsContent from "./SettingsContent";

export default function SettingsPage() {
  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-2xl mx-auto p-6 space-y-5">
        <div>
          <h1 className="text-xl font-black text-foreground">Settings</h1>
          <p className="text-sm text-muted mt-0.5">Manage your account and preferences</p>
        </div>
        <SettingsContent />
      </div>
    </div>
  );
}
