"use client"

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';
import { USER_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';

const PricingPlans = () => {

  const {user} = useUser();
  const [userDetails,setUserDetails] = useState();

  useEffect(()=>{
    user && GetUserDetails();
  },[user])

  const GetUserDetails = async() => {
    const result = await db.select().from(USER_TABLE)
    .where(eq(USER_TABLE.email,user?.primaryEmailAddress?.emailAddress))

    setUserDetails(result[0]);
  }

  const OnCheckoutClick = async() => {
    const result = await axios.post('/api/payment/checkout', {
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY
    });

    console.log(result.data);
    window.open(result.data?.url);
  }

  const onPaymentManage = async () => {
    const result = await axios.post('/api/payment/manage-payment', {
      customerId: userDetails?.customerId,
    });
  
    console.log(result.data);
    
    // Check if the URL exists and is valid
    const url = result.data?.url;
    if (url) {
      // Open the Stripe customer portal in a new tab
      window.open(url, "_blank");
    } else {
      console.error("Failed to retrieve the customer portal URL.");
    }
  }
  

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Plans</h2>
          <p className="text-gray-600">
            Update your plan to generate unlimited courses!
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Free Plan */}
          <div className="border rounded-lg p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Free</h3>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-baseline text-2xl font-bold">
                0<span className="text-sm font-normal text-gray-600">/month</span>
              </div>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Five Course Limit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Unlimited Notes Taking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Help center access</span>
                </li>
              </ul>
              <button className="mt-6 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
                Current Plan
              </button>
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="border rounded-lg p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Montly</h3>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-baseline text-2xl font-bold">
              $10<span className="text-sm font-normal text-gray-600">/Montly</span>
              </div>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Unlimited Course Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Unlimited Notes Taking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Help center access</span>
                </li>
              </ul>
              {userDetails?.isMember==false ? <button onClick={OnCheckoutClick}
              className="mt-6 px-4 py-2 bg-black text-white rounded-md text-sm font-medium">
                Get Started
              </button>: <button onClick={onPaymentManage}
              className="mt-6 px-4 py-2 bg-black text-white rounded-md text-sm font-medium">
                Manage Subscription
              </button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;

