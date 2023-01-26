const uuid = require("uuid");
const path = require("path");
const { Flowers, FlowersInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class FlowersController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const flowers = await Flowers.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          FlowersInfo.create({
            title: i.title,
            description: i.description,
            flowersId: flowers.id,
          })
        );
      }

      return res.json(flowers);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let flower;
    if (!brandId && !typeId) {
      flower = await Flowers.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeId) {
      flower = await Flowers.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }
    if (!brandId && typeId) {
      flower = await Flowers.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }
    if (brandId && typeId) {
      flower = await Flowers.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      });
    }
    return res.json(flower);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const flowers = await Flowers.findOne({
      where: { id },
      include: [{ model: FlowersInfo, as: "info" }],
    });
    return res.json(flowers);
  }
}

module.exports = new FlowersController();
