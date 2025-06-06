const API_KEY = "306bba8dc61225d4e7aa1bff";

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.result === "error") {
    console.log("API Error:", data["error-type"]);
    throw new Error("اروری از API برگشت داده شد");
  }

  return data.conversion_result;
}