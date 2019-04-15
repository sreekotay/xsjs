/* ==========================================
  touch extend for map
   ========================================== */
L.Map.mergeOptions({
  touchExtend: true
})

L.Map.TouchExtend = L.Handler.extend({

  initialize: function (map) {
    this._map = map
    this._container = map._container
    this._pane = map._panes.overlayPane
  },

  addHooks: function () {
    L.DomEvent.on(this._container, 'touchstart', this._onTouchStart, this)
    L.DomEvent.on(this._container, 'touchend', this._onTouchEnd, this)
  },

  removeHooks: function () {
    L.DomEvent.off(this._container, 'touchstart', this._onTouchStart)
    L.DomEvent.off(this._container, 'touchend', this._onTouchEnd)
  },

  _onTouchStart: function (e) {
    if (!this._map._loaded) { return }

    var type = 'touchstart'

    var containerPoint = this._map.mouseEventToContainerPoint(e)

    var layerPoint = this._map.containerPointToLayerPoint(containerPoint)

    var latlng = this._map.layerPointToLatLng(layerPoint)

    this._map.fire(type, {
      latlng: latlng,
      layerPoint: layerPoint,
      containerPoint: containerPoint,
      originalEvent: e
    })
  },

  _onTouchEnd: function (e) {
    if (!this._map._loaded) { return }

    var type = 'touchend'

    this._map.fire(type, {
      originalEvent: e
    })
  }
})
L.Map.addInitHook('addHandler', 'touchExtend', L.Map.TouchExtend)
/* ==========================================
    end touch extend for map
     ========================================== */

function xs_setupMap (selector) {
  // map
  var mymap = L.map(selector).setView([51.505, -0.09], 13)

  // map layer
  /*
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3JlZWtvdGF5IiwiYSI6ImNqdWdzZnd0MzBzZWc0M3U5eGNmbzBjdXIifQ.01MIYthgese6jQ7oYJtJnw'
    if (opmap.url=='color') 	osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                      else if (opmap.url=='bw')   osmUrl = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            if (!osmUrl) 				osmUrl = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
            */
  if (1) {
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'your.mapbox.access.token'
    }).addTo(mymap)
  }

  // marker (and popup)
  //  var marker = L.marker([51.5, -0.09]).addTo(mymap);
  //  marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

  // click popup
  var popup = L.popup()
  function onMapClick (e) {
    popup
      .setLatLng(e.latlng)
      .setContent('You clicked the map at ' + e.latlng.toString())
      .openOn(mymap)
  }
  mymap.on('click', onMapClick)

  function geoMarker (latlng, radius, popup) {
    if (!mymap.geoMarker) mymap.geoMarker = marker = L.marker()
    if (!mymap.geoCircle) mymap.geoCircle = circle = L.circle()

    marker.setLatLng(latlng)
    marker.addTo(mymap)
    if (popup) marker.bindPopup('You are within ' + radius + ' meters of this point').openPopup()
    else marker.closePopup()

    circle.setLatLng(latlng).setRadius(radius).addTo(mymap)
  }

  // move
  var mousing = false
  var loopProtect = false
  function onMapMove (e) {
    if (loopProtect) return
    loopProtect = true
    if (mousing) geoMarker(mymap.getCenter(), 100)
    loopProtect = false
  }
  function OnMouseDown (e) {
    mousing = true
  }
  function onMouseUp (e) {
    geoMarker(mymap.getCenter(), 100, true)
    mousing = false
  }

  mymap.on('move', onMapMove)
  mymap.on('touchstart', OnMouseDown)
  mymap.on('mousedown', OnMouseDown)
  mymap.on('mouseup', onMouseUp)
  mymap.on('touchend', onMouseUp)
  mymap.on('mouseout', onMouseUp)

  // location binding
  function onLocationFound (e) {
    geoMarker(e.latlng, e.accuracy, true)
  }

  mymap.on('locationfound', onLocationFound)

  // location error
  function onLocationError (e) {
    alert(e.message)
  }

  mymap.on('locationerror', function () {
    alert('we really need your location')
  })

  // locate
  mymap.getLocation = function () {
    mymap.locate({ setView: true, maxZoom: 16 })
  }

  mymap.getLocation()

  return mymap
}
