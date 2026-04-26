import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { phone, amount } = await req.json()

    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")

    // 1. Get access token
    const tokenRes = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    )

    const token = tokenRes.data.access_token

    // 2. STK Push request
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14)

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64")

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: "Naithorn Bakery",
        TransactionDesc: "Cake Payment"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return NextResponse.json(response.data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "STK Push failed" })
  }
}