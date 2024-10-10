import React, { useRef } from 'react'
import { Upload } from 'lucide-react'

interface UploadGeoJSONProps {
  onUpload: (geoJSON: any) => void
}

const UploadGeoJSON: React.FC<UploadGeoJSONProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const geoJSON = JSON.parse(event.target?.result as string)
          onUpload(geoJSON)
        } catch (error) {
          console.error('שגיאה בניתוח קובץ GeoJSON:', error)
          alert('שגיאה בניתוח קובץ GeoJSON. אנא ודא שזהו קובץ GeoJSON תקין.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="h-10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept=".geojson,application/geo+json"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 flex items-center justify-center h-full"
        title="העלה GeoJSON"
      >
        <Upload size={20} />
      </button>
    </div>
  )
}

export default UploadGeoJSON