import React, { useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

interface UploadGeoJSONControlProps {
  onUpload: (data: any, fileType: string) => void
}

const UploadGeoJSONControl: React.FC<UploadGeoJSONControlProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const map = useMap()

  React.useEffect(() => {
    const UploadControl = L.Control.extend({
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
        const button = L.DomUtil.create('a', 'leaflet-control-upload', container)
        button.href = '#'
        button.title = 'העלה GeoJSON או TIF'
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>'
        
        L.DomEvent.on(button, 'click', function(e) {
          L.DomEvent.stopPropagation(e)
          L.DomEvent.preventDefault(e)
          fileInputRef.current?.click()
        })

        return container
      }
    })

    const uploadControl = new UploadControl({ position: 'topright' })
    map.addControl(uploadControl)

    return () => {
      map.removeControl(uploadControl)
    }
  }, [map])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase()
      
      if (fileType === 'geojson' || fileType === 'json') {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const geoJSON = JSON.parse(event.target?.result as string)
            onUpload(geoJSON, 'geojson')
          } catch (error) {
            console.error('שגיאה בניתוח קובץ GeoJSON:', error)
            alert('שגיאה בניתוח קובץ GeoJSON. אנא ודא שזהו קובץ GeoJSON תקין.')
          }
        }
        reader.readAsText(file)
      } else if (fileType === 'tif' || fileType === 'tiff') {
        onUpload(file, 'tif')
      } else {
        alert('סוג קובץ לא נתמך. אנא העלה קובץ GeoJSON או TIF.')
      }
    }
  }

  return (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleUpload}
      accept=".geojson,.json,.tif,.tiff"
      className="hidden"
    />
  )
}

export default UploadGeoJSONControl