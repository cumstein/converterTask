"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<"USD_TO_IRR" | "IRR_TO_USD">(
    "USD_TO_IRR"
  );
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = direction === "USD_TO_IRR" ? "USD" : "IRR";
  const to = direction === "USD_TO_IRR" ? "IRR" : "USD";

  const toggleDirection = () => {
    setResult(null);
    setAmount("");
    setError(null);
    setDirection((prev) =>
      prev === "USD_TO_IRR" ? "IRR_TO_USD" : "USD_TO_IRR"
    );
  };

  const handleConvert = async () => {
    if (!amount) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, from, to }),
      });

      if (!res.ok) {
        throw new Error("پاسخی از سمت سرور دریافت نشد");
      }

      const data = await res.json();

      if (data?.result === undefined) {
        throw new Error("داده‌ای برای نمایش موجود نیست");
      }

      setResult(data.result);
    } catch (err: any) {
      if (err.message.includes("fetch") || err.message.includes("Failed to fetch")) {
        setError("ارتباط با اینترنت برقرار نشد. لطفاً اتصال خود را بررسی کنید.");
      } else {
        setError(err.message || "خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        تبدیل ارز
      </h2>

      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-600">
          تبدیل {from === "USD" ? "دلار ($)" : "ریال (﷼)"} به{" "}
          {to === "USD" ? "دلار ($)" : "ریال (﷼)"}
        </p>
        <Button variant="outline" onClick={toggleDirection}>
          تغییر جهت
        </Button>
      </div>

      <Input
        type="number"
        min="1"
        className="h-12 text-lg"
        placeholder={`مثلاً ۱۰۰ ${from === "USD" ? "دلار ($)" : "ریال (﷼)"}`}
        value={amount}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value < 1) return;
          setAmount(e.target.value);
        }}
      />

      <div className="flex justify-center">
        <Button
          onClick={handleConvert}
          disabled={loading || !amount}
          className="w-full"
        >
          {loading ? "در حال تبدیل..." : "تبدیل کن"}
        </Button>
      </div>

      {error && (
        <motion.p
          key={error}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-red-500 text-sm text-center"
        >
          {error}
        </motion.p>
      )}

      {result && (
        <motion.p
          key={result}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-xl font-semibold text-blue-600"
        >
          نتیجه: {result.toLocaleString()} {to === "USD" ? "$" : "﷼"}
        </motion.p>
      )}
    </div>
  );
}