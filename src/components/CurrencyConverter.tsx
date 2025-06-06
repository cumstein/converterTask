"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<"USD_TO_IRR" | "IRR_TO_USD">(
    "USD_TO_IRR"
  );
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const from = direction === "USD_TO_IRR" ? "USD" : "IRR";
  const to = direction === "USD_TO_IRR" ? "IRR" : "USD";

  const toggleDirection = () => {
    setResult(null);
    setDirection((prev) =>
      prev === "USD_TO_IRR" ? "IRR_TO_USD" : "USD_TO_IRR"
    );
  };

  const handleConvert = async () => {
    if (!amount) return;
    setLoading(true);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        body: JSON.stringify({ amount, from, to }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("Error:", err);
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
        className="h-12 text-lg"
        placeholder={`مثلاً ۱۰۰ ${from === "USD" ? "دلار ($)" : "ریال (﷼)"}`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
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

      {result !== null && (
        <p className="text-center text-xl font-semibold text-blue-600">
          نتیجه: {result.toLocaleString()} {to === "USD" ? "$" : "﷼"}
        </p>
      )}
    </div>
  );
}
