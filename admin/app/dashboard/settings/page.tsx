import { Settings, User, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin preferences and system configurations.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden divide-y divide-gray-100">
        
        <div className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 font-medium">Profile Details</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Update your name, email, and avatar.</p>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 font-medium">Security & Password</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Change your password and manage two-factor authentication.</p>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-lg transition-colors">
              Update Password
            </button>
          </div>
        </div>

        <div className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 font-medium">Notification Preferences</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Choose which emails and alerts you receive.</p>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-lg transition-colors">
              Manage Alerts
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
