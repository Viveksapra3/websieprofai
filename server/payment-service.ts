
import crypto from "crypto";
import { db } from "./db";
import { coursePricing, userPurchases, paymentTransactions, courseIdMapping } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// CCAvenue configuration
interface CCAvenueConfig {
  merchantId: string;
  accessCode: string;
  workingKey: string;
  redirectUrl: string;
  cancelUrl: string;
  ccavenueUrl: string;
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
      ccavenueUrl: process.env.CCAVENUE_URL || "https://secure.ccavenue.consaction/transaction.do?command=initiateTransaction",
    };
  }

  // Encrypt data for CCAvenue (compatible with their encryption method)
 private encrypt(plainText: string): string {
  try {
    const workingKey = this.config.workingKey;
    const algorithm = 'aes-128-cbc';

    // Generate key from MD5 hash of workingKey
    const key = crypto.createHash('md5').update(workingKey).digest();
    
    // CCAvenue uses a fixed 16-byte IV: [0x00, 0x01, 0x02, ..., 0x0f]
    const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
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
      const workingKey = this.config.workingKey;
      const algorithm = 'aes-128-cbc';
      
      // Generate key from MD5 hash of workingKey
      const key = crypto.createHash('md5').update(workingKey).digest();
      
      // CCAvenue uses a fixed 16-byte IV: [0x00, 0x01, 0x02, ..., 0x0f]
      const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
      
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
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

  // Helper function to get old course ID from new course ID using mapping table
  private async getOldCourseId(newCourseId: string): Promise<string> {
    try {
      const mapping = await db
        .select()
        .from(courseIdMapping)
        .where(eq(courseIdMapping.newCourseId, newCourseId))
        .limit(1);
      
      if (mapping[0]) {
        console.log(`🔄 Mapped course ID: ${newCourseId} → ${mapping[0].oldCourseId}`);
        return mapping[0].oldCourseId;
      }
      
      // If no mapping found, return the original ID (silently)
      return newCourseId;
    } catch (error) {
      console.error(`❌ Error getting course ID mapping for ${newCourseId}:`, error);
      return newCourseId;
    }
  }

  // Check if user has access to course
  async hasAccess(userId: string, courseId: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking access for user ${userId} to course ${courseId}`);
      
      // Map new course ID to old course ID for pricing/purchase lookup
      const oldCourseId = await this.getOldCourseId(courseId);
      
      // Get pricing data using the old course ID
      const pricing = await db
        .select()
        .from(coursePricing)
        .where(eq(coursePricing.courseId, oldCourseId))
        .limit(1);

      if (pricing[0]) {
        // Check if course is free (price is 0 or isFree flag is true)
        const price = parseFloat(pricing[0].price);
        if (pricing[0].isFree || price === 0) {
          console.log(`✅ Course ${courseId} (mapped to ${oldCourseId}) is free (price: ${pricing[0].price}, isFree: ${pricing[0].isFree})`);
          return true;
        }
      } else {
        console.log(`⚠️ No pricing found for course ${courseId} (mapped to ${oldCourseId}) - treating as paid`);
      }

      // Check if user has purchased the course using old course ID
      const purchase = await db
        .select()
        .from(userPurchases)
        .where(
          and(
            eq(userPurchases.userId, userId),
            eq(userPurchases.courseId, oldCourseId),
            eq(userPurchases.status, "completed")
          )
        )
        .limit(1);

      const hasAccess = purchase.length > 0;
      console.log(`${hasAccess ? '✅' : '❌'} User ${userId} ${hasAccess ? 'has' : 'does not have'} purchase access to course ${courseId} (mapped to ${oldCourseId})`);
      return hasAccess;
    } catch (error) {
      console.error("❌ Error checking course access:", error);
      // In case of error, deny access by default
      return false;
    }
  }

  // Get course pricing
  async getCoursePricing(courseId: string) {
    try {
      console.log(`🔍 Getting pricing for course ${courseId}`);
      
      // Map new course ID to old course ID for pricing lookup
      const oldCourseId = await this.getOldCourseId(courseId);
      
      const pricing = await db
        .select()
        .from(coursePricing)
        .where(eq(coursePricing.courseId, oldCourseId))
        .limit(1);

      if (pricing[0]) {
        console.log(`✅ Found pricing for course ${courseId} (mapped to ${oldCourseId}):`, pricing[0]);
        return pricing[0];
      }

      // If no pricing data exists, default to paid course
      const defaultPricing = {
        id: `default_${oldCourseId}`,
        courseId: oldCourseId,
        price: "99.00",
        currency: "INR",
        isFree: false,
        displayOrder: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log(`⚠️ No pricing found for course ${courseId} (mapped to ${oldCourseId}), using default:`, defaultPricing);
      return defaultPricing;
    } catch (error) {
      console.error("❌ Error getting course pricing:", error);
      // Return default paid pricing on error
      return {
        id: `error_${courseId}`,
        courseId: courseId,
        price: "99.00",
        currency: "INR",
        isFree: false,
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
      username: userInfo.username || "",
      email: userInfo.email || "",
      phone: userInfo.phone || "",
      address: userInfo.address || "",
      city: userInfo.city || "",
      state: userInfo.state || "",
      zip: userInfo.zip || ""
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
        upiPaymentFlag:"QR",
        language: "EN",
        billing_name: userInfo.username || "",
        billing_email: userInfo.email || "",
        billing_tel: userInfo.phone || "",
        billing_address: userInfo.address || "",
        billing_city: userInfo.city || "",
        billing_state: userInfo.state || "",
        billing_zip: userInfo.zip || "",
        billing_country: "India",
        delivery_name: userInfo.username || "",
        delivery_address: userInfo.address || "",
        delivery_city: userInfo.city || "",
        delivery_state: userInfo.state || "",
        delivery_zip: userInfo.zip || "",
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
      console.log("🧪 Pre-encryption check:", {
        accessCode: this.config.accessCode,
        ccavenueUrl: this.config.ccavenueUrl,
        queryStringLength: queryString.length
      });

      console.log("🔐 Step 6: Encrypting payment data...");
      const encryptedData = this.encrypt(queryString);
      console.log(`✅ Data encrypted successfully. Encrypted data length: ${encryptedData.length} characters`);


      const result = {
        orderId,
        encryptedData,
        accessCode: this.config.accessCode,
        ccavenueUrl: this.config.ccavenueUrl,
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

  // Sync course pricing from external API
  async syncCoursePricing(apiBase?: string) {
    try {
      console.log("🔄 Starting course pricing sync...");
      
      if (!apiBase) {
        console.log("⚠️ No API base URL provided, skipping sync");
        return { synced: 0, message: "No API base URL configured" };
      }

      // Fetch courses from external API
      const apiUrl = `${apiBase}/api/courses`;
      console.log(`📡 Fetching courses from: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const courses = Array.isArray(data.courses) ? data.courses : Array.isArray(data) ? data : [];
      
      console.log(`📚 Found ${courses.length} courses from API`);

      // Get existing pricing from database
      const existingPricing = await db.select().from(coursePricing);
      const existingCourseIds = new Set(existingPricing.map(p => p.courseId));

      let syncedCount = 0;
      let updatedCount = 0;

      // Sync each course
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        const courseId = String(course.course_id || course.id);
        
        // Get old course ID from mapping table
        const oldCourseId = await this.getOldCourseId(courseId);
        
        // Determine if course should be free (first 3 courses)
        const isFree = i < 3;
        const price = isFree ? 0 : 99; // Default price for paid courses

        if (!existingCourseIds.has(oldCourseId)) {
          // New course - add to database using old course ID
          await this.setCoursePricing(oldCourseId, price, isFree, i + 1);
          syncedCount++;
          console.log(`✅ Added new course: ${courseId} → ${oldCourseId} (${course.course_title || course.title})`);
        } else {
          // Existing course - update display order if needed
          const existing = existingPricing.find(p => p.courseId === oldCourseId);
          if (existing && existing.displayOrder !== i + 1) {
            await db
              .update(coursePricing)
              .set({ displayOrder: i + 1, updatedAt: new Date() })
              .where(eq(coursePricing.courseId, oldCourseId));
            updatedCount++;
            console.log(`🔄 Updated display order for course: ${courseId} → ${oldCourseId}`);
          }
        }
      }

      console.log(`✅ Sync completed: ${syncedCount} new courses added, ${updatedCount} courses updated`);
      return {
        synced: syncedCount,
        updated: updatedCount,
        total: courses.length,
        message: `Successfully synced ${syncedCount} new courses and updated ${updatedCount} existing courses`
      };
    } catch (error) {
      console.error("❌ Error syncing course pricing:", error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
