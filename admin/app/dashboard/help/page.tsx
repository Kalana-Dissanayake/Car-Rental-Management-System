import { HelpCircle, Book, MessageCircle, FileText } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 text-sm mt-1">Get assistance and read documentation for the DriveEase Admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="glass rounded-2xl p-6 hover:border-amber-200 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <Book className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">Documentation</h3>
          <p className="text-gray-500 text-sm">Read guides on how to manage bookings, fleet, and settings.</p>
        </div>

        <div className="glass rounded-2xl p-6 hover:border-amber-200 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">FAQs</h3>
          <p className="text-gray-500 text-sm">Frequently asked questions by administrators.</p>
        </div>

        <div className="glass rounded-2xl p-6 hover:border-amber-200 transition-colors cursor-pointer group md:col-span-2 flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
              <MessageCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">Contact Support</h3>
            <p className="text-gray-500 text-sm max-w-md">Need further help? Reach out to our technical support team for assistance.</p>
          </div>
          <button className="px-5 py-2.5 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 text-sm font-medium rounded-xl transition-colors">
            Open Ticket
          </button>
        </div>

      </div>
    </div>
  );
}
