import { useState, useEffect } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");

  // Load data
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  // 🔹 Get Balance
  const fetchBalance = async () => {
    try {
      const res = await API.get("/account/balance", {
        headers: { Authorization: token },
      });
      setBalance(res.data.balance);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Get Transactions
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/account/history", {
        headers: { Authorization: token },
      });
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Deposit
  const deposit = async () => {
    try {
      await API.post(
        "/account/deposit",
        { amount: Number(amount) },
        { headers: { Authorization: token } }
      );
      fetchBalance();
      fetchTransactions();
      setAmount("");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Withdraw
  const withdraw = async () => {
    try {
      await API.post(
        "/account/withdraw",
        { amount: Number(amount) },
        { headers: { Authorization: token } }
      );
      fetchBalance();
      fetchTransactions();
      setAmount("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold">ATM Dashboard</h1>
        <p className="text-gray-600">Manage your account</p>
      </div>

      {/* Balance Card */}
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg">Current Balance</h2>
        <p className="text-3xl font-bold">₹{balance}</p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />

        <div className="flex gap-4">
          <button
            onClick={deposit}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Deposit
          </button>

          <button
            onClick={withdraw}
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Transactions</h2>

        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((t, i) => (
              <li
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <span>{t.type}</span>
                <span>₹{t.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}