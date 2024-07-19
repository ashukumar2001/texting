import geoip from "geoip-lite";

class GeoLocationController {
  async getGeoLocation(req, res) {
    const ip = req?.socket?.remoteAddress;
    if (ip) {
      const geo = geoip.lookup(ip);
      res.status(200).send({ status: !!geo, data: geo });
    } else {
      res.status(200).send({ status: true, data: null });
    }
  }
}
export default new GeoLocationController();
