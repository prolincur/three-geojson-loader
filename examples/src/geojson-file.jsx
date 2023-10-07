/*
 * Copyright (c) 2020-23 Prolincur Technologies LLP.
 * All Rights Reserved.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { useLoader } from '@react-three/fiber'
import { GeoJsonLoader } from 'three-geojson-loader'

function GeoJsonFile({ url, onRender }) {
  const group = useLoader(GeoJsonLoader, url)
  React.useEffect(() => {
    if (group) {
      onRender(group)
    }
  }, [group, onRender])

  if (!url) return null
  // eslint-disable-next-line react/no-unknown-property
  return <primitive object={group} />
}

GeoJsonFile.propTypes = {
  url: PropTypes.string,
}

GeoJsonFile.defaultProps = {
  url: '',
}

export { GeoJsonFile }
