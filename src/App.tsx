import React, { useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, useMap, Marker, Popup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import * as turf from '@turf/turf'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import InfoModal from './components/InfoModal'
import SearchBar from './components/SearchBar'
import UploadGeoJSONControl from './components/UploadGeoJSONControl'
import noFlyZonesData from './data/noFlyZones.json'
import GeoRasterLayer from 'georaster-layer-for-leaflet'
import parseGeoraster from 'georaster'

function SetZoomControl() {
  const map = useMap();
  React.useEffect(() => {
    map.zoomControl.setPosition('bottomleft');
  }, [map]);
  return null;
}

function App() {
  const [showModal, setShowModal] = useState(false)
  const [polygonInfo, setPolygonInfo] = useState<any>(null)
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null)
  const [tifLayer, setTifLayer] = useState<GeoRasterLayer | null>(null)
  const [searchedLocation, setSearchedLocation] = useState<[number, number] | null>(null)
  const [searchedLocationInfo, setSearchedLocationInfo] = useState<string | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  const handleSearch = useCallback(async (query: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        setSearchedLocation([parseFloat(lat), parseFloat(lon)])
        setSearchedLocationInfo(display_name)
        mapRef.current?.setView([parseFloat(lat), parseFloat(lon)], 13)
      } else {
        alert('לא נמצאו תוצאות עבור החיפוש הזה.')
      }
    } catch (error) {
      console.error('שגיאה בחיפוש:', error)
      alert('אירעה שגיאה בעת ביצוע החיפוש. אנא נסה שוב מאוחר יותר.')
    }
  }, [])

  const handleCreated = (e: any) => {
    const { layer } = e
    const geoJSON = layer.toGeoJSON()
    const area = turf.area(geoJSON)
    const perimeter = turf.length(geoJSON)
    const coordinates = geoJSON.geometry.coordinates[0]

    // Check for intersections with no-fly zones
    const noFlyZones = (noFlyZonesData as any).features.filter((feature: any) => {
      return turf.booleanIntersects(geoJSON, feature)
    }).map((feature: any) => feature.properties.name)

    setPolygonInfo({
      coordinates,
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
      noFlyZones,
    })
    setShowModal(true)
  }

  const handleFileUpload = useCallback((data: any, fileType: string) => {
    if (fileType === 'geojson') {
      if (geoJSONLayer) {
        mapRef.current?.removeLayer(geoJSONLayer)
      }
      const newLayer = L.geoJSON(data)
      setGeoJSONLayer(newLayer)
      newLayer.addTo(mapRef.current!)
      mapRef.current?.fitBounds(newLayer.getBounds())
    } else if (fileType === 'tif') {
      parseGeoraster(data).then((georaster: any) => {
        if (tifLayer) {
          mapRef.current?.removeLayer(tifLayer)
        }
        const newLayer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          resolution: 256
        })
        setTifLayer(newLayer)
        newLayer.addTo(mapRef.current!)
        mapRef.current?.fitBounds(newLayer.getBounds())
      })
    }
  }, [geoJSONLayer, tifLayer])

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-blue-900 bg-opacity-70 text-white flex justify-between items-center absolute top-0 left-0 right-0 z-[1000]">
        <h1 className="text-2xl font-bold">שירותי הדמיה של רחפן גיאומרחבי</h1>
        <div className="flex space-x-2 items-center">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="flex-grow relative">
        <MapContainer
          center={[31.7683, 35.2137]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} maxZoom={20} />
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
          <GeoJSON data={noFlyZonesData as any} style={() => ({ color: 'red', weight: 2, fillOpacity: 0.2 })} />
          {geoJSONLayer}
          {tifLayer}
          {searchedLocation && (
            <Marker position={searchedLocation}>
              <Popup>{searchedLocationInfo}</Popup>
            </Marker>
          )}
          <SetZoomControl />
          <UploadGeoJSONControl onUpload={handleFileUpload} />
        </MapContainer>
      </div>
      {showModal && polygonInfo && (
        <InfoModal
          info={polygonInfo}
          onClose={() => setShowModal(false)}
          onSend={() => {
            console.log('שולח לחברת הרחפנים:', polygonInfo)
            setShowModal(false)
            alert('מידע על הפוליגון נשלח לחברת הרחפנים!')
          }}
        />
      )}
    </div>
  )
}

export default App