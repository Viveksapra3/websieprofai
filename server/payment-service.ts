
import crypto from "crypto";
import { db } from "./db";
import { coursePricing, userPurchases, paymentTransactions } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// CCAvenue configuration
interface CCAvenueConfig {
  merchantId: string;
  accessCode: string;
  workingKey: string;
  redirectUrl: string;
  cancelUrl: string;
}

class PaymentService {
  private config: CCAvenueConfig;

  constructor() {
    this.config = {
      merchantId: process.env.CCAVENUE_MERCHANT_ID || "4407430",
      accessCode: process.env.CCAVENUE_ACCESS_CODE || "ATFW06MK63AF20WFFA",
      workingKey: process.env.CCAVENUE_WORKING_KEY || "YOUR_WORKING_KEY_HERE",
      redirectUrl: process.env.CCAVENUE_REDIRECT_URL || `${process.env.BASE_URL}/api/payment/callback`,
      cancelUrl: process.env.CCAVENUE_CANCEL_URL || `${process.env.BASE_URL}/payment/cancelled`,
    };
  }

  // Encrypt data for CCAvenue (compatible with their encryption method)
  private encrypt(plainText: string): string {
    try {
      const key = this.config.workingKey;
      const algorithm = 'aes-128-cbc';
      
      // Create a hash of the key to ensure it's the right length
      const keyHash = crypto.createHash('md5').update(key, 'utf8').digest();
      const iv = Buffer.alloc(16, 0); // CCAvenue uses zero IV
      
      const cipher = crypto.createCipheriv(algorithm, keyHash, iv);
      cipher.setAutoPadding(true);
      
      let encrypted = cipher.update(plainText, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data for CCAvenue');
    }
  }

  // Decrypt data from CCAvenue
  private decrypt(encText: string): string {
    try {
      const key = this.config.workingKey;
      const algorithm = 'aes-128-cbc';
      
      // Create a hash of the key to ensure it's the right length
      const keyHash = crypto.createHash('md5').update(key, 'utf8').digest();
      const iv = Buffer.alloc(16, 0); // CCAvenue uses zero IV
      
      const decipher = crypto.createDecipheriv(algorithm, keyHash, iv);
      decipher.setAutoPadding(true);
      
      let decrypted = decipher.update(encText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data from CCAvenue');
    }
  }

  // Generate order ID
  private generateOrderId(): string {
    return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check if user has access to course
  async hasAccess(userId: string, courseId: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking access for user ${userId} to course ${courseId}`);
      
      // Always allow access to courses 1, 2, and 3 (free courses)
      const alwaysFreeCourses = ["1", "2", "3", "s-101", "s-201", "s-310"];
      if (alwaysFreeCourses.includes(courseId)) {
        console.log(`✅ Course ${courseId} is in free courses list`);
        return true;
      }

      // Get all pricing data to determine course order
      const allPricing = await db
        .select()
        .from(coursePricing)
        .orderBy(coursePricing.displayOrder);

      // Check if course has explicit pricing
      const pricing = allPricing.find(p => p.courseId === courseId);

      if (pricing) {
        // If course has pricing data, check if it's free
        if (pricing.isFree) {
          console.log(`✅ Course ${courseId} is marked as free in pricing`);
          return true;
        }
      } else {
        // For courses without pricing data, assume first 3 are free
        // This is a fallback for when the system is not fully configured
        const courseIndex = allPricing.length > 0 ? 
          allPricing.findIndex(p => p.courseId === courseId) : 
          -1;
        
        if (courseIndex >= 0 && courseIndex < 3) {
          console.log(`✅ Course ${courseId} is in first 3 courses (fallback)`);
          return true;
        }
      }

      // Check if user has purchased the course
      const purchase = await db
        .select()
        .from(userPurchases)
        .where(
          and(
            eq(userPurchases.userId, userId),
            eq(userPurchases.courseId, courseId),
            eq(userPurchases.status, "completed")
          )
        )
        .limit(1);

      const hasAccess = purchase.length > 0;
      console.log(`${hasAccess ? '✅' : '❌'} User ${userId} ${hasAccess ? 'has' : 'does not have'} purchase access to course ${courseId}`);
      return hasAccess;
    } catch (error) {
      console.error("❌ Error checking course access:", error);
      // In case of error, allow access to default free courses
      const defaultFreeCourses = ["s-101", "s-201", "s-310"];
      return defaultFreeCourses.includes(courseId);
    }
  }

  // Get course pricing
  async getCoursePricing(courseId: string) {
    try {
      console.log(`🔍 Getting pricing for course ${courseId}`);
      
      const pricing = await db
        .select()
        .from(coursePricing)
        .where(eq(coursePricing.courseId, courseId))
        .limit(1);

      if (pricing[0]) {
        console.log(`✅ Found pricing for course ${courseId}:`, pricing[0]);
        return pricing[0];
      }

      // If no pricing data exists, provide default based on course ID
      const defaultFreeCourses = ["1", "2", "3", "s-101", "s-201", "s-310"];
      const isFree = defaultFreeCourses.includes(courseId);
      
      const defaultPricing = {
        id: `default_${courseId}`,
        courseId,
        price: isFree ? "0.00" : "999.00",
        currency: "INR",
        isFree,
        displayOrder: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log(`⚠️ No pricing found for course ${courseId}, using default:`, defaultPricing);
      return defaultPricing;
    } catch (error) {
      console.error("❌ Error getting course pricing:", error);
      // Return default pricing on error
      const defaultFreeCourses = ["1", "2", "3", "s-101", "s-201", "s-310"];
      const isFree = defaultFreeCourses.includes(courseId);
      
      return {
        id: `error_${courseId}`,
        courseId,
        price: isFree ? "0.00" : "999.00",
        currency: "INR",
        isFree,
        displayOrder: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  // Initialize payment
  async initializePayment(userId: string, courseId: string, userInfo: any) {
    console.log("=== PAYMENT INITIALIZATION STARTED ===");
    console.log(`📋 Payment Request Details:`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Course ID: ${courseId}`);
    console.log(`   User Info:`, {
      username: userInfo.username || "Not provided",
      email: userInfo.email || "Not provided",
      phone: userInfo.phone || "Not provided",
      address: userInfo.address || "Not provided",
      city: userInfo.city || "Not provided",
      state: userInfo.state || "Not provided",
      zip: userInfo.zip || "Not provided"
    });
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    
    console.log("🔑 CCAvenue Configuration:");
    console.log(`   Merchant ID: ${this.config.merchantId}`);
    console.log(`   Access Code: ${this.config.accessCode}`);
    console.log(`   Working Key: ${this.config.workingKey ? '***' + this.config.workingKey.slice(-4) : 'Not set'}`);
    console.log(`   Redirect URL: ${this.config.redirectUrl}`);
    console.log(`   Cancel URL: ${this.config.cancelUrl}`);

    try {
      console.log("🔍 Step 1: Fetching course pricing...");
      const pricing = await this.getCoursePricing(courseId);
      
      if (!pricing) {
        console.error("❌ Course pricing not found for courseId:", courseId);
        throw new Error("Course pricing not found");
      }

      console.log("✅ Course pricing retrieved:");
      console.log(`   Price: ${pricing.price} ${pricing.currency}`);
      console.log(`   Is Free: ${pricing.isFree}`);
      console.log(`   Display Order: ${pricing.displayOrder}`);

      if (pricing.isFree) {
        console.log("⚠️  Payment initialization aborted - Course is free");
        throw new Error("This course is free");
      }

      console.log("🔢 Step 2: Generating order ID...");
      const orderId = this.generateOrderId();
      const amount = parseFloat(pricing.price);
      console.log(`✅ Order ID generated: ${orderId}`);
      console.log(`✅ Amount parsed: ${amount}`);

      console.log("💾 Step 3: Creating payment transaction record in database...");
      const transactionData = {
        userId,
        courseId,
        orderId,
        amount: pricing.price,
        currency: pricing.currency,
        status: "initiated" as const,
      };
      console.log("   Transaction data:", transactionData);

      await db.insert(paymentTransactions).values(transactionData);
      console.log("✅ Payment transaction record created successfully");

      console.log("🔧 Step 4: Preparing CCAvenue payment data...");
      const paymentData = {
        merchant_id: this.config.merchantId,
        order_id: orderId,
        amount: amount.toFixed(2),
        currency: pricing.currency,
        redirect_url: this.config.redirectUrl,
        cancel_url: this.config.cancelUrl,
        language: "EN",
        billing_name: userInfo.username || "Customer",
        billing_email: userInfo.email || "",
        billing_tel: userInfo.phone || "",
        billing_address: userInfo.address || "Not Provided",
        billing_city: userInfo.city || "Not Provided",
        billing_state: userInfo.state || "Not Provided",
        billing_zip: userInfo.zip || "000000",
        billing_country: "India",
        delivery_name: userInfo.username || "Customer",
        delivery_address: userInfo.address || "Not Provided",
        delivery_city: userInfo.city || "Not Provided",
        delivery_state: userInfo.state || "Not Provided",
        delivery_zip: userInfo.zip || "000000",
        delivery_country: "India",
        delivery_tel: userInfo.phone || "",
        merchant_param1: courseId,
        merchant_param2: userId,
      };

      console.log("✅ CCAvenue payment data prepared:");
      console.log(`   Merchant ID: ${paymentData.merchant_id}`);
      console.log(`   Order ID: ${paymentData.order_id}`);
      console.log(`   Amount: ${paymentData.amount} ${paymentData.currency}`);
      console.log(`   Redirect URL: ${paymentData.redirect_url}`);
      console.log(`   Cancel URL: ${paymentData.cancel_url}`);
      console.log(`   Billing Name: ${paymentData.billing_name}`);
      console.log(`   Billing Email: ${paymentData.billing_email}`);

      console.log("🔗 Step 5: Converting payment data to query string...");
      const queryString = Object.entries(paymentData)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      console.log(`✅ Query string length: ${queryString.length} characters`);

      console.log("🔐 Step 6: Encrypting payment data...");
      const encryptedData = this.encrypt(queryString);
      console.log(`✅ Data encrypted successfully. Encrypted data length: ${encryptedData.length} characters`);

      const ccavenueUrl =  "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

      const result = {
        orderId,
        encryptedData,
        accessCode: this.config.accessCode,
        ccavenueUrl,
      };

      console.log("🎉 PAYMENT INITIALIZATION COMPLETED SUCCESSFULLY");
      console.log("📤 Final Response:");
      console.log(`   Order ID: ${result.orderId}`);
      console.log(`   Access Code: ${result.accessCode}`);
      console.log(`   CCAvenue URL: ${result.ccavenueUrl}`);
      console.log(`   Environment: ${process.env.CCAVENUE_ENV || "production"}`);
      console.log("=== PAYMENT INITIALIZATION END ===\n");

      return result;
    } catch (error) {
      console.error("❌ PAYMENT INITIALIZATION FAILED");
      console.error("💥 Error Details:");
      console.error(`   Error Message: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`   Error Stack:`, error instanceof Error ? error.stack : 'No stack trace available');
      console.error(`   User ID: ${userId}`);
      console.error(`   Course ID: ${courseId}`);
      console.error(`   Timestamp: ${new Date().toISOString()}`);
      console.error("=== PAYMENT INITIALIZATION ERROR END ===\n");
      throw error;
    }
  }

  // Handle payment callback
  async handlePaymentCallback(encResponse: string) {
    try {
      console.log("🔄 Processing payment callback...");
      
      const decryptedData = this.decrypt(encResponse);
      const responseData = new URLSearchParams(decryptedData);
      
      const orderId = responseData.get("order_id");
      const orderStatus = responseData.get("order_status");
      const trackingId = responseData.get("tracking_id");
      const amount = responseData.get("amount");
      const currency = responseData.get("currency");
      const courseId = responseData.get("merchant_param1");
      const userId = responseData.get("merchant_param2");

      console.log("📋 Payment callback data:");
      console.log(`   Order ID: ${orderId}`);
      console.log(`   Status: ${orderStatus}`);
      console.log(`   Tracking ID: ${trackingId}`);
      console.log(`   Course ID: ${courseId}`);
      console.log(`   User ID: ${userId}`);

      if (!orderId || !courseId || !userId) {
        console.error("❌ Invalid payment response data");
        throw new Error("Invalid payment response data");
      }

      // Update payment transaction
      console.log("💾 Updating payment transaction...");
      await db
        .update(paymentTransactions)
        .set({
          ccavenueOrderId: trackingId || "",
          status: orderStatus === "Success" ? "success" : "failure",
          paymentResponse: decryptedData,
          updatedAt: new Date(),
        })
        .where(eq(paymentTransactions.orderId, orderId));

      // If payment successful, create purchase record
      if (orderStatus === "Success") {
        console.log("✅ Payment successful, creating purchase record...");
        await db.insert(userPurchases).values({
          userId,
          courseId,
          paymentId: trackingId || "",
          amount: amount || "0",
          currency: currency || "INR",
          status: "completed",
          paymentMethod: "ccavenue",
        });
        console.log("✅ Purchase record created successfully");
      } else {
        console.log("❌ Payment failed");
      }

      return {
        success: orderStatus === "Success",
        orderId,
        trackingId,
        courseId,
        userId,
        status: orderStatus,
      };
    } catch (error) {
      console.error("❌ Error handling payment callback:", error);
      throw error;
    }
  }

  // Set course pricing (for admin/setup)
  async setCoursePricing(courseId: string, price: number, isFree: boolean = false, displayOrder?: number) {
    try {
      console.log(`🔧 Setting pricing for course ${courseId}: ${price} INR, free: ${isFree}`);
      
      const existing = await db
        .select()
        .from(coursePricing)
        .where(eq(coursePricing.courseId, courseId))
        .limit(1);

      if (existing.length > 0) {
        // Update existing
        console.log(`📝 Updating existing pricing for course ${courseId}`);
        await db
          .update(coursePricing)
          .set({
            price: price.toFixed(2),
            isFree,
            displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(coursePricing.courseId, courseId));
      } else {
        // Create new
        console.log(`➕ Creating new pricing for course ${courseId}`);
        await db.insert(coursePricing).values({
          courseId,
          price: price.toFixed(2),
          isFree,
          displayOrder,
        });
      }

      console.log(`✅ Pricing set successfully for course ${courseId}`);
      return true;
    } catch (error) {
      console.error("❌ Error setting course pricing:", error);
      throw error;
    }
  }

  // Get user purchases
  async getUserPurchases(userId: string) {
    try {
      console.log(`🔍 Getting purchases for user ${userId}`);
      
      const purchases = await db
        .select()
        .from(userPurchases)
        .where(eq(userPurchases.userId, userId));

      console.log(`✅ Found ${purchases.length} purchases for user ${userId}`);
      return purchases;
    } catch (error) {
      console.error("❌ Error getting user purchases:", error);
      return [];
    }
  }
}

export const paymentService = new PaymentService();
