const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

const prisma = new PrismaClient();

/**
 * GET /api/wallet
 */
const getWallet = async (req, res, next) => {
  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: req.user.id,
          balance: 0,
        },
        include: { transactions: true },
      });
    }

    return ApiResponse.success(res, "Wallet retrieved", wallet);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/wallet/add-funds
 */
const addFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return ApiResponse.error(res, "Invalid amount", 400);
    }

    // In a real app, this would verify a Razorpay/Stripe payment signature first.
    // For this mock, we just directly add funds.

    const wallet = await prisma.wallet.upsert({
      where: { userId: req.user.id },
      update: { balance: { increment: amount } },
      create: { userId: req.user.id, balance: amount },
    });

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        type: "deposit",
        amount,
        balanceAfter: wallet.balance,
        description: "Wallet top-up (Mock Payment)",
        status: "completed",
      },
    });

    return ApiResponse.success(res, "Funds added successfully", {
      wallet,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWallet, addFunds };
