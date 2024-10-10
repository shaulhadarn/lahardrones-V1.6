import React from 'react'
import { X, Send, Square, Ruler, MapPin, AlertTriangle, Phone } from 'lucide-react'

interface InfoModalProps {
  info: {
    coordinates: number[][];
    area: string;
    perimeter: string;
    noFlyZones: string[];
  };
  onClose: () => void;
  onSend: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ info, onClose, onSend }) => {
  const handleCallForQuote = () => {
    // This is a placeholder. In a real application, you might want to
    // integrate with a phone system or show contact information.
    alert('מתקשר לחברה לקבלת הצעת מחיר...');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">מידע על הפוליגון</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4 space-y-2">
          <p className="flex items-center">
            <Square size={18} className="ml-2" />
            <strong>שטח:</strong> {info.area} מ"ר
          </p>
          <p className="flex items-center">
            <Ruler size={18} className="ml-2" />
            <strong>היקף:</strong> {info.perimeter} מ'
          </p>
          <p className="flex items-center">
            <AlertTriangle size={18} className="ml-2" />
            <strong>איזורי איסור טיסה:</strong> {info.noFlyZones.length > 0 ? info.noFlyZones.join(', ') : 'אין'}
          </p>
          <div>
            <p className="flex items-center mb-1">
              <MapPin size={18} className="ml-2" />
              <strong>קואורדינטות:</strong>
            </p>
            <textarea
              className="w-full h-32 p-2 border rounded"
              value={JSON.stringify(info.coordinates, null, 2)}
              readOnly
              dir="ltr"
            />
          </div>
        </div>
        <div className="flex space-x-4 rtl:space-x-reverse">
          <button
            onClick={onSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center ml-4"
          >
            שלח לחברת הרחפנים
            <Send size={18} className="mr-2" />
          </button>
          {info.noFlyZones.length > 0 && (
            <button
              onClick={handleCallForQuote}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
            >
              התקשר להצעת מחיר
              <Phone size={18} className="mr-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoModal