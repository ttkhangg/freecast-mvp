import { Check, Truck, FileText, Gift, CheckCircle } from 'lucide-react';

const steps = [
  { id: 'PENDING', label: 'Ứng tuyển', icon: FileText },
  { id: 'APPROVED', label: 'Đã duyệt', icon: Check },
  { id: 'SHIPPING', label: 'Vận chuyển', icon: Truck },
  { id: 'RECEIVED', label: 'Đã nhận', icon: Gift },
  { id: 'SUBMITTED', label: 'Đã nộp', icon: FileText },
  { id: 'COMPLETED', label: 'Hoàn tất', icon: CheckCircle },
];

export default function ProgressBar({ status }: { status: string }) {
  const currentIndex = steps.findIndex(s => s.id === status);
  const activeStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-600 -z-10 transition-all duration-500"
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'
              } ${isCurrent ? 'ring-4 ring-indigo-100 scale-110' : ''}`}>
                <step.icon size={14} />
              </div>
              <span className={`text-[10px] mt-2 font-medium ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
