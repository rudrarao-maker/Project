const { PrismaClient } = require("@prisma/client");
const ApiResponse = require("../utils/apiResponse");

const prisma = new PrismaClient();

/** GET /api/users/profile */
const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.user.id, deletedAt: null },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        mobile: true,
        aadhaarNumber: true,
        panNumber: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        profilePhoto: true,
        status: true,
        emailVerified: true,
        mobileVerified: true,
        emailNotifications: true,
        smsNotifications: true,
        lastLogin: true,
        createdAt: true,
      },
    });
    if (!user) return ApiResponse.error(res, "User not found", 404);
    return ApiResponse.success(res, "Profile retrieved", { user });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/users/profile */
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      mobile,
      address,
      city,
      state,
      pincode,
      dateOfBirth,
      gender,
      panNumber,
      emailNotifications,
      smsNotifications,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(mobile && { mobile }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(pincode !== undefined && { pincode }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(panNumber !== undefined && { panNumber }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(smsNotifications !== undefined && { smsNotifications }),
      },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
      },
    });

    return ApiResponse.success(res, "Profile updated successfully", {
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/** POST /api/users/profile/photo */
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.error(res, "No file uploaded", 400);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePhoto: req.file.path },
      select: { id: true, profilePhoto: true },
    });

    return ApiResponse.success(res, "Profile photo updated", {
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadProfilePhoto };
