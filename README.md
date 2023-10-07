
# three-geojson-loader

**three-geojson-loader** is a cross platform [GeoJSON](https://www.rfc-editor.org/rfc/rfc7946.html) file loader for THREE.js. It takes URL of a GeoJSON file or object of GeoJSON data as an input and returns THREE.js Object3D entities. This library works out of the box with cross platform react-native and react-three-fibre as well.

#### Install
```
yarn add three-geojson-loader three
```
or
```
npm i three-geojson-loader three
```

#### Usage

```javascript

import * as THREE from 'three'
import { GeoJsonLoader } from 'three-geojson-loader'

const loader = new GeoJsonLoader();
loader.setColor(0xFF0000);
// loader.setTransform(new THREE.Matrix4());
const scene = new THREE.Scene();
onLoad = (data) => {
    scene.add(data);
}
const onError = (error) => {
  console.log(error);
}
const onProgress = (xhr) => {
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}
// url = 'http://to/my/geojson/file.geojson'
loader.load(url, onLoad, onProgress, onError);

```

### Author

[Prolincur Technologies](https://prolincur.com)
