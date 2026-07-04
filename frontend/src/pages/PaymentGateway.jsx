import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  Landmark,
  CheckCircle2,
  QrCode,
  Wallet,
} from "lucide-react";
import { applicationService, walletService } from "../services/dataService";
import toast from "react-hot-toast";

export default function PaymentGateway() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("upi");
  const [wallet, setWallet] = useState(null);

  const fee = 150;

  useEffect(() => {
    walletService
      .getWallet()
      .then((res) => setWallet(res.data.data))
      .catch(() => {});
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Update application status to payment_completed
      await applicationService.update(id, { status: "payment_completed" });

      toast.success("Payment Successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <ShieldCheck size={28} className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            GovPay Secure Gateway
          </h1>
          <p className="text-sm text-gray-500">
            100% Safe and Encrypted Transaction
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="bg-gov-navy text-white p-6 text-center">
          <p className="text-blue-200 text-sm mb-1">Total Amount Payable</p>
          <h2 className="text-4xl font-bold">₹{fee}.00</h2>
          <p className="text-xs text-blue-300 mt-2">
            Application Ref: {id.substring(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">
            Select Payment Method
          </h3>

          <div className="space-y-3 mb-8">
            <label
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === "upi" ? "border-gov-blue bg-blue-50/50 ring-1 ring-gov-blue" : "border-gray-200 hover:border-gray-300"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={method === "upi"}
                onChange={() => setMethod("upi")}
                className="mr-4 w-5 h-5 text-gov-blue"
              />
              <QrCode className="text-gray-400 mr-3" />
              <div className="flex-1">
                <span className="font-bold text-gray-900 block">
                  UPI (GPay, PhonePe, Paytm)
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  Zero processing fee
                </span>
              </div>
            </label>

            <label
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === "card" ? "border-gov-blue bg-blue-50/50 ring-1 ring-gov-blue" : "border-gray-200 hover:border-gray-300"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={method === "card"}
                onChange={() => setMethod("card")}
                className="mr-4 w-5 h-5 text-gov-blue"
              />
              <CreditCard className="text-gray-400 mr-3" />
              <div className="flex-1">
                <span className="font-bold text-gray-900 block">
                  Credit / Debit Card
                </span>
                <span className="text-xs text-gray-500">
                  Supports RuPay, Visa, Mastercard
                </span>
              </div>
            </label>

            <label
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === "netbanking" ? "border-gov-blue bg-blue-50/50 ring-1 ring-gov-blue" : "border-gray-200 hover:border-gray-300"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="netbanking"
                checked={method === "netbanking"}
                onChange={() => setMethod("netbanking")}
                className="mr-4 w-5 h-5 text-gov-blue"
              />
              <Landmark className="text-gray-400 mr-3" />
              <div className="flex-1">
                <span className="font-bold text-gray-900 block">
                  Net Banking
                </span>
                <span className="text-xs text-gray-500">
                  All major Indian banks
                </span>
              </div>
            </label>
            <label
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === "wallet" ? "border-gov-blue bg-blue-50/50 ring-1 ring-gov-blue" : "border-gray-200 hover:border-gray-300"} ${wallet && wallet.balance < fee ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={method === "wallet"}
                onChange={() => {
                  if (wallet && wallet.balance >= fee) setMethod("wallet");
                }}
                disabled={wallet && wallet.balance < fee}
                className="mr-4 w-5 h-5 text-gov-blue"
              />
              <Wallet className="text-gray-400 mr-3" />
              <div className="flex-1">
                <span className="font-bold text-gray-900 block flex items-center justify-between">
                  Citizen Wallet
                  <span className="text-sm font-bold text-gov-blue">
                    ₹{wallet?.balance || 0}
                  </span>
                </span>
                {wallet && wallet.balance < fee ? (
                  <span className="text-xs text-red-500 font-semibold">
                    Insufficient Balance. Add funds.
                  </span>
                ) : (
                  <span className="text-xs text-green-600 font-semibold">
                    Instant Payment
                  </span>
                )}
              </div>
            </label>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gov-green hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div
                className="spinner"
                style={{ width: "24px", height: "24px", borderWidth: "3px" }}
              ></div>
            ) : (
              <>
                <ShieldCheck size={20} /> Pay Securely ₹{fee}.00
              </>
            )}
          </button>

          <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} /> Payments are processed by RBI authorized
            gateways
          </div>
        </div>
      </div>
    </div>
  );
}
