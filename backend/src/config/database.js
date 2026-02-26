const mongoose = require('mongoose');

/**
 * Converts MongoDB SRV connection string to direct connection string
 * This is useful when DNS SRV resolution fails
 * Returns an array of possible direct connection strings to try
 */
const convertSrvToDirect = (srvUri) => {
  try {
    // Parse the SRV URI
    const uri = new URL(srvUri);
    
    // Extract components
    const username = uri.username;
    const password = uri.password;
    const hostname = uri.hostname; // e.g., cluster0.ukhzl1s.mongodb.net
    const pathname = uri.pathname; // e.g., /admin_auth_email
    const searchParams = uri.searchParams;
    
    // Extract cluster name (e.g., "cluster0" from "cluster0.ukhzl1s.mongodb.net")
    const clusterMatch = hostname.match(/^([^.]+)\.([^.]+)\.mongodb\.net$/);
    if (!clusterMatch) {
      return null;
    }
    
    const clusterName = clusterMatch[1];
    const clusterId = clusterMatch[2];
    
    const directUris = [];
    
    // Option 1: Try standard Atlas shard format (most common)
    // Most Atlas clusters use shard-00-00, shard-00-01, shard-00-02
    const shardHosts = [
      `${clusterName}-shard-00-00.${clusterId}.mongodb.net:27017`,
      `${clusterName}-shard-00-01.${clusterId}.mongodb.net:27017`,
      `${clusterName}-shard-00-02.${clusterId}.mongodb.net:27017`
    ].join(',');
    
    let directUri = `mongodb://${username}:${password}@${shardHosts}${pathname}?ssl=true&replicaSet=atlas-${clusterId}-shard-0&authSource=admin`;
    
    // Preserve important query parameters
    const importantParams = ['retryWrites', 'w', 'appName'];
    importantParams.forEach(param => {
      if (searchParams.has(param)) {
        directUri += `&${param}=${searchParams.get(param)}`;
      }
    });
    
    directUris.push(directUri);
    
    // Option 2: Try single-node connection (simpler, works for some clusters)
    let singleNodeUri = `mongodb://${username}:${password}@${hostname}:27017${pathname}?ssl=true&authSource=admin`;
    importantParams.forEach(param => {
      if (searchParams.has(param)) {
        singleNodeUri += `&${param}=${searchParams.get(param)}`;
      }
    });
    directUris.push(singleNodeUri);
    
    return directUris;
  } catch (error) {
    console.error('⚠️  Error converting SRV to direct URI:', error.message);
    return null;
  }
};

const connectDB = async (retries = 3, delay = 5000) => {
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in environment variables');
    console.error('💡 Please check your .env file and ensure MONGODB_URI is configured');
    process.exit(1);
  }

  let useDirectConnection = false;
  let directUris = null;
  let directUriIndex = 0;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let connectionUri = process.env.MONGODB_URI;
      
      // If SRV failed before, try direct connection
      if (useDirectConnection && directUris && directUriIndex < directUris.length) {
        connectionUri = directUris[directUriIndex];
        console.log(`🔄 Attempting direct connection format ${directUriIndex + 1}/${directUris.length} (bypassing SRV DNS)...`);
      } else {
        console.log(`🔄 Attempting to connect to MongoDB (Attempt ${attempt}/${retries})...`);
      }
      
      const conn = await mongoose.connect(connectionUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4, // Force IPv4
        retryWrites: true,
        retryReads: true
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      if (useDirectConnection) {
        console.log('✅ Used direct connection (SRV DNS bypass)');
      }
      
      await createDefaultAdmin();
      
      return conn;
    } catch (error) {
      console.error(`❌ Database connection error (Attempt ${attempt}/${retries}):`, error.message);
      
      // If SRV DNS fails, try converting to direct connection
      if ((error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) && !useDirectConnection) {
        console.error('🔍 DNS Resolution Error Detected - Attempting direct connection...');
        
        if (process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
          directUris = convertSrvToDirect(process.env.MONGODB_URI);
          if (directUris && directUris.length > 0) {
            console.log(`🔄 Converted SRV connection string to ${directUris.length} direct connection format(s)`);
            useDirectConnection = true;
            directUriIndex = 0;
            // Retry immediately with direct connection (don't increment attempt)
            attempt--; // Decrement to retry on same attempt number
            continue;
          } else {
            console.error('⚠️  Could not convert SRV URI to direct connection format');
          }
        }
        
        console.error('   - Check your internet connection');
        console.error('   - Verify the MongoDB Atlas cluster is active (not paused)');
        console.error('   - Ensure your IP address is whitelisted in MongoDB Atlas');
        console.error('   - Check if your network/firewall blocks DNS queries');
      } else if (useDirectConnection && directUris && directUriIndex < directUris.length - 1) {
        // Try next direct connection format
        directUriIndex++;
        console.log(`🔄 Trying next direct connection format (${directUriIndex + 1}/${directUris.length})...`);
        attempt--; // Retry on same attempt
        continue;
      } else if ((error.message.includes('getaddrinfo ENOTFOUND') || error.message.includes('ENOTFOUND')) && useDirectConnection) {
        // All direct connection attempts failed with DNS errors
        console.error('🔍 DNS RESOLUTION FAILED - Cannot resolve MongoDB Atlas hostnames:');
        console.error('   This can be: (A) Cluster paused, or (B) Network/DNS blocking *.mongodb.net');
        console.error('');
        console.error('   📋 Fix A – Resume cluster (free tier auto-pauses):');
        console.error('      1. Go to https://cloud.mongodb.com/v2#/clusters');
        console.error('      2. If cluster shows "Paused", click "Resume"');
        console.error('      3. Wait 1–2 minutes, then restart your server');
        console.error('');
        console.error('   📋 Fix B – Fix DNS / network:');
        console.error('      1. Try Google DNS: Windows → Network → Adapter → IPv4 → DNS 8.8.8.8, 8.8.4.4');
        console.error('      2. Or Cloudflare DNS: 1.1.1.1, 1.0.0.1');
        console.error('      3. Disable VPN/proxy if you use one (they often block Atlas)');
        console.error('      4. Try another network (e.g. phone hotspot) to confirm');
        console.error('   🔗 Atlas clusters: https://cloud.mongodb.com/v2#/clusters');
      } else if (error.message.includes('whitelist') || error.message.includes('IP') || (error.message.includes('Could not connect') && error.message.includes('whitelist'))) {
        console.error('🚫 IP Whitelist / Network Access Error:');
        console.error('   ⚠️  Your IP address is NOT whitelisted in MongoDB Atlas');
        console.error('   📋 Steps to fix:');
        console.error('      1. Go to https://cloud.mongodb.com');
        console.error('      2. Navigate to: Network Access → IP Access List');
        console.error('      3. Click "Add IP Address"');
        console.error('      4. Click "Add Current IP Address" (or manually add your IP)');
        console.error('      5. For testing, you can temporarily allow: 0.0.0.0/0 (ALLOW ACCESS FROM ANYWHERE)');
        console.error('         ⚠️  WARNING: Only use 0.0.0.0/0 for development, NOT production!');
        console.error('   🔗 Direct link: https://cloud.mongodb.com/v2#/security/network/whitelist');
      } else if (error.message.includes('authentication')) {
        console.error('🔐 Authentication Error:');
        console.error('   - Verify your MongoDB username and password');
        console.error('   - Check if the database user has proper permissions');
      } else if (error.message.includes('timeout')) {
        console.error('⏱️  Connection Timeout:');
        console.error('   - Check your network connection');
        console.error('   - Verify MongoDB Atlas cluster is accessible');
        console.error('   - Check firewall settings');
      }
      
      // If this is the last attempt, exit
      if (attempt === retries) {
        console.error('\n❌ Failed to connect to MongoDB after all retry attempts');
        console.error('\n📋 REQUIRED ACTIONS (in order):');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('🔴 STEP 1: RESUME YOUR CLUSTER (Most Common Issue):');
        console.error('   → Go to https://cloud.mongodb.com/v2#/clusters');
        console.error('   → Find your cluster (cluster0)');
        console.error('   → If it shows "Paused" or has a "Resume" button, CLICK IT');
        console.error('   → Wait 1-2 minutes for cluster to fully start');
        console.error('   → Free tier clusters auto-pause after 1 week of inactivity');
        console.error('');
        console.error('🟡 STEP 2: WHITELIST YOUR IP ADDRESS:');
        console.error('   → Go to https://cloud.mongodb.com/v2#/security/network/whitelist');
        console.error('   → Click "Add IP Address"');
        console.error('   → Click "Add Current IP Address" (recommended)');
        console.error('   → OR for quick testing: Add 0.0.0.0/0 (development only!)');
        console.error('   → Click "Confirm"');
        console.error('');
        console.error('🟢 STEP 3: VERIFY CONNECTION STRING:');
        console.error('   → Check MONGODB_URI in your .env file');
        console.error('   → Ensure username and password are correct');
        console.error('   → Get fresh connection string from Atlas if needed');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('\n💡 ENOTFOUND = DNS cannot resolve Atlas hostnames. Try in order:');
        console.error('   1. Resume cluster at https://cloud.mongodb.com/v2#/clusters (free tier pauses after inactivity)');
        console.error('   2. Switch DNS to 8.8.8.8 / 1.1.1.1; disable VPN/proxy');
        console.error('   3. Add your IP to Atlas Network Access whitelist');
        process.exit(1);
      }
      
      // Wait before retrying
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const createDefaultAdmin = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return; // 1 = connected; skip if connecting/disconnecting
    }
    const Admin = require('../models/Admin');
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (!adminEmail) return;

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      // Use plain password so Admin model pre('save') hashes it once
      const defaultAdmin = new Admin({
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
        isActive: true,
        createdAt: new Date()
      });
      await defaultAdmin.save();
      console.log('👤 Default admin created successfully');
      console.log(`📧 Email: ${adminEmail}`);
    } else {
      console.log('👤 Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📊 Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📊 Mongoose connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing mongoose connection:', error);
    process.exit(1);
  }
});

connectDB.createDefaultAdmin = createDefaultAdmin;
module.exports = connectDB;
