/*! Copyright (c) 2021-23 Prolincur Technologies LLP.
All Rights Reserved.

Please check the provided LICENSE file for licensing details.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
 */
import * as o from "three";
class P extends o.FileLoader {
  constructor(s) {
    super(s), this.responseType = "json", this.color = 16777215, this.transform = new o.Matrix4();
  }
  setColor(s) {
    return this.color = s, this;
  }
  setTransform(s) {
    return s instanceof o.Matrix4 && (this.transform = s), this;
  }
  load(s, c, f, l) {
    const h = this;
    return super.load(
      s,
      (b) => {
        try {
          const u = h.parse(b);
          c(u);
        } catch (u) {
          l(u);
        }
      },
      f,
      l
    );
  }
  parse(s) {
    if (!s)
      return null;
    const c = this, f = (e) => {
      const t = new o.Vector3(e[0], e[1], 0);
      return t.applyMatrix4(c.transform), t;
    }, l = (e) => {
      const t = new o.BufferGeometry(), r = f(e), a = [];
      a.push(r.x, r.y, r.z), t.setAttribute("position", new o.Float32BufferAttribute(a, 3));
      const i = new o.PointsMaterial({ color: c.color });
      return new o.Points(t, i);
    }, h = (e) => {
      const t = new o.BufferGeometry(), r = [];
      e == null || e.forEach((i) => {
        const n = f(i);
        r.push(n.x, n.y, n.z);
      }), t.setAttribute("position", new o.Float32BufferAttribute(r, 3));
      const a = new o.LineBasicMaterial({ color: c.color });
      return new o.Line(t, a);
    }, b = (e) => {
      let t = null;
      e.forEach((i) => {
        const n = new o.Shape();
        i.forEach((d, E) => {
          const [w, y] = d;
          E === 0 ? n.moveTo(w, y) : n.lineTo(w, y);
        }), n.lineTo(i[0][0], i[0][1]), t ? t.holes.push(n) : t = n;
      });
      const r = new o.ShapeGeometry(t), a = new o.MeshBasicMaterial({ color: c.color, side: o.DoubleSide });
      return new o.Mesh(r, a);
    }, u = (e) => {
      const t = [];
      switch (e == null ? void 0 : e.type) {
        case "Point":
          t.push(l(e.coordinates));
          break;
        case "LineString":
          t.push(h(e.coordinates));
          break;
        case "Polygon":
          t.push(b(e.coordinates));
          break;
        case "MultiPoint":
          e.coordinates.forEach((r) => {
            t.push(l(r));
          });
          break;
        case "MultiPolygon":
          e.coordinates.forEach((r) => {
            t.push(b(r));
          });
          break;
        case "MultiLineString":
          e.coordinates.forEach((r) => {
            t.push(h(r));
          });
          break;
      }
      return t;
    }, M = (e) => {
      if (e.geometry) {
        const t = u(e.geometry);
        return t.forEach((r) => {
          e.properties && (r.userData = {
            ...e.properties
          });
        }), t;
      }
      return [];
    };
    let p = [];
    if (Array.isArray(s) ? p = s : s.type === "FeatureCollection" ? p = s.features : s.type === "Feature" && (p = [s]), p.length) {
      const e = new o.Group();
      return p.forEach((t) => {
        M(t).forEach((r) => {
          e.add(r);
        });
      }), e;
    }
    return null;
  }
}
export {
  P as GeoJsonLoader
};
