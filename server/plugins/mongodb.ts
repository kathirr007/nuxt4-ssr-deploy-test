import mongoose from 'mongoose'
import { CategorySchema } from '~~/server/models/category';
import { OwnerSchema } from '~~/server/models/owner';
import { ReviewSchema } from '~~/server/models/review';

export default defineNitroPlugin(async () => {
  // ? Used To Skip DB Connecting While Building
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    const MONGO_URI = process.env.DATABASEURI;

    mongoose.set('strictQuery', false)

    let connected = false
    let attempts = 0
    const maxAttempts = 10 // Adjust as needed

    while (!connected && attempts < maxAttempts) {
      try {
        const dbConnection = await mongoose.connect(MONGO_URI as string)

        dbConnection.model('Owner', OwnerSchema);
        dbConnection.model('Review', ReviewSchema);
        dbConnection.model('Category', CategorySchema);

        /*
          TODO: for prod use

        await mongoose.connect(MONGO_URI, {
          maxPoolSize: 10, // Adjust based on your needs
          serverSelection
        */
        connected = true
        console.log('✅ Successfully connected to MongoDB')
      }
      catch (error) {
        attempts++
        console.error(`❌ MongoDB connection attempt ${attempts} failed:`)

        if (attempts >= maxAttempts) {
          console.error(
            '🔥 All MongoDB connection attempts failed - exiting process',
          )
          process.exit(1)
        }

        console.log(`⏳ Retrying connection in 5 seconds...`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    // Graceful shutdown
    // nitroApp.hooks.hook("close", async () => {
    //   await mongoose.disconnect();
    //   console.log("✅ MongoDB connection closed");
    // });
  } else {
    console.log('⚠️ Skipping MongoDB connection during build phase');
  }
});
