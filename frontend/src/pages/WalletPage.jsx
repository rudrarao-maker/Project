import React, { useState, useEffect } from 'react';
import { walletService } from '../services/dataService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Wallet, IndianRupee, ArrowUpRight, ArrowDownRight, Plus, Clock } from 'lucide-react';
import './Dashboard.css';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await walletService.getWallet();
      setWallet(res.data.data);
    } catch (error) {
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      return toast.error('Please enter a valid amount');
    }
    try {
      setIsAdding(true);
      await walletService.addFunds({ amount: parseFloat(amount) });
      toast.success(`Successfully added ₹${amount} to wallet`);
      setAmount('');
      fetchWallet();
    } catch (error) {
      toast.error('Failed to add funds');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;
  }

  return (
    <div className="premium-dashboard">
      <motion.div className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="dashboard-title">Citizen Wallet</h1>
          <p className="dashboard-subtitle">Manage your funds and pay for applications instantly</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div className="md:col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="dashboard-panel bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00508a, #002244)' }}>
            <div className="absolute top-0 right-0 p-4 opacity-20"><Wallet size={100} /></div>
            <h2 className="text-sm font-medium opacity-80 mb-2 uppercase tracking-wider">Available Balance</h2>
            <div className="text-4xl font-bold mb-6">₹{wallet?.balance || '0.00'}</div>
            
            <form onSubmit={handleAddFunds} className="mt-6 pt-6 border-t border-white/20 relative z-10">
              <h3 className="text-sm font-medium mb-3">Quick Top-up</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                  <input 
                    type="number" 
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-2 text-white placeholder-white/50 outline-none focus:border-white/50"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={isAdding} className="bg-white text-blue-900 px-4 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  {isAdding ? <div className="spinner border-blue-900 w-5 h-5"></div> : <Plus size={20} />}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div className="md:col-span-2 dashboard-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="panel-header">
            <h2 className="panel-title"><Clock size={20} className="text-gov-blue" /> Recent Transactions</h2>
          </div>
          <div className="premium-table-wrapper" style={{ maxHeight: '400px' }}>
            {wallet?.transactions?.length === 0 ? (
              <div className="flex-center flex-col py-12 text-gray-500">
                <Wallet size={48} className="mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet?.transactions?.map(tx => (
                    <tr key={tx.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.type === 'deposit' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          </div>
                          <span className="capitalize font-medium">{tx.type}</span>
                        </div>
                      </td>
                      <td className="text-gray-500 text-xs font-mono">{tx.transactionId}</td>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount}
                      </td>
                      <td>
                        <span className={`status-badge ${tx.status === 'completed' ? 'approved' : 'pending'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
