import Joi from "joi";
import {
  ErrorHandlerService,
  ProfileService,
  UserService,
} from "../services/index.js";

class ProfileController {
  async activate(req, res) {
    const { fullName } = req.body;

    const profileValdationSchema = Joi.object({
      fullName: Joi.string().max(16).required(),
    });

    const { error } = profileValdationSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .send({ status: false, message: "Validation Error" });
    }

    try {
      const { id } = req.user;

      const user = await UserService.findUser({ _id: id });

      if (!user) {
        return res
          .status(404)
          .send({ status: false, message: "User not found" });
      }

      user.isActivated = true;
      user.fullName = fullName;

      await user.save();

      res.send({
        status: true,
        user,
        message: "Profile successfully updated.",
      });
    } catch (err) {
      next(ErrorHandlerService.serverError());
    }
  }

  async getAvatarSeeds(req, res, next) {
    try {
      const seeds = await ProfileService.generateAvatarSeeds();
      res.send({
        status: true,
        data: {
          seeds,
          extension: ".svg",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
