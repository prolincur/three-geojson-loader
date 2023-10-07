/* eslint-disable import/no-unresolved */
/* eslint-disable no-useless-constructor */

/*
 * Copyright (c) 2020-23 Prolincur Technologies LLP.
 * All Rights Reserved.
 */

import * as THREE from 'three'

class GeoJsonLoader extends THREE.FileLoader {
  constructor(manager) {
    super(manager)
    this.responseType = 'json'
    this.color = 0xffffff
    this.transform = new THREE.Matrix4()
  }

  setColor(color) {
    this.color = color
    return this
  }

  setTransform(transform) {
    if (transform instanceof THREE.Matrix4) {
      this.transform = transform
    }
    return this
  }

  load(url, onLoad, onProgress, onError) {
    const scope = this
    return super.load(
      url,
      (json) => {
        try {
          const entities = scope.parse(json)
          onLoad(entities)
        } catch (error) {
          onError(error)
        }
      },
      onProgress,
      onError
    )
  }

  parse(geojson) {
    if (!geojson) return null

    const scope = this
    const finalizePosition = (coord) => {
      const position = new THREE.Vector3(coord[0], coord[1], 0)
      position.applyMatrix4(scope.transform)
      return position
    }

    const createPointObject = (coordinates) => {
      const geometry = new THREE.BufferGeometry()
      const point = finalizePosition(coordinates)
      const positions = []
      positions.push(point.x, point.y, point.z)
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      const material = new THREE.PointsMaterial({ color: scope.color })
      return new THREE.Points(geometry, material)
    }

    const createLineObject = (coordinates) => {
      const geometry = new THREE.BufferGeometry()
      const positions = []
      coordinates?.forEach((coord) => {
        const position = finalizePosition(coord)
        positions.push(position.x, position.y, position.z)
      })

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      const material = new THREE.LineBasicMaterial({ color: scope.color })
      return new THREE.Line(geometry, material)
    }

    const createPolygonObject = (loops) => {
      let polygon = null
      loops.forEach((loop) => {
        const shape = new THREE.Shape()
        loop.forEach((coord, index) => {
          const [x, y] = coord
          if (index === 0) {
            shape.moveTo(x, y)
          } else {
            shape.lineTo(x, y)
          }
        })
        // close the first and last
        shape.lineTo(loop[0][0], loop[0][1])
        // add inner loops
        if (polygon) {
          polygon.holes.push(shape)
        } else {
          polygon = shape
        }
      })

      const geometry = new THREE.ShapeGeometry(polygon)
      const material = new THREE.MeshBasicMaterial({ color: scope.color, side: THREE.DoubleSide })
      return new THREE.Mesh(geometry, material)
    }

    const convertGeometry = (geometryData) => {
      const objects = []
      switch (geometryData?.type) {
        case 'Point':
          objects.push(createPointObject(geometryData.coordinates))
          break
        case 'LineString':
          objects.push(createLineObject(geometryData.coordinates))
          break
        case 'Polygon':
          objects.push(createPolygonObject(geometryData.coordinates))
          break
        case 'MultiPoint':
          geometryData.coordinates.forEach((coordinates) => {
            objects.push(createPointObject(coordinates))
          })
          break
        case 'MultiPolygon':
          geometryData.coordinates.forEach((coordinates) => {
            objects.push(createPolygonObject(coordinates))
          })
          break
        case 'MultiLineString':
          geometryData.coordinates.forEach((coordinates) => {
            objects.push(createLineObject(coordinates))
          })
          break
        default:
          break
      }

      return objects
    }

    const convertFeature = (feature) => {
      if (feature.geometry) {
        const objects = convertGeometry(feature.geometry)
        objects.forEach((obj) => {
          if (feature.properties) {
            // eslint-disable-next-line no-param-reassign
            obj.userData = {
              ...feature.properties,
            }
          }
        })
        return objects
      }
      return []
    }

    let features = []
    if (Array.isArray(geojson)) {
      features = geojson
    } else if (geojson.type === 'FeatureCollection') {
      features = geojson.features
    } else if (geojson.type === 'Feature') {
      features = [geojson]
    }
    if (features.length) {
      const group = new THREE.Group()
      features.forEach((feature) => {
        convertFeature(feature).forEach((obj) => {
          group.add(obj)
        })
      })
      return group
    }
    return null
  }
}

export { GeoJsonLoader }
