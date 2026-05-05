require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { config } = require('../src/config/config');
const UsageModel = require('../src/models/usageModel');
const SubscriptionModel = require('../src/models/subscriptionModel');

async function main() {
  await mongoose.connect(config.MONGODB_URI);
  console.log('[db] MongoDB connected');

  const orphanedRecords = await UsageModel.find({
    subscriptionId: { $exists: false },
  });

  console.log(`[migration] Found ${orphanedRecords.length} usage records without subscriptionId`);

  let linked = 0;
  let merged = 0;
  let deleted = 0;

  for (const usageDoc of orphanedRecords) {
    const [year, month] = usageDoc.period.split('-').map(Number);
    const periodStart = new Date(Date.UTC(year, month - 1, 1));
    const periodEnd = new Date(Date.UTC(year, month, 1));

    const matchingSub = await SubscriptionModel.findOne({
      userId: usageDoc.userId,
      currentPeriodStart: { $lt: periodEnd },
      currentPeriodEnd: { $gte: periodStart },
    }).sort({ createdAt: -1 });

    if (!matchingSub) {
      await UsageModel.deleteOne({ _id: usageDoc._id });
      deleted++;
      console.log(`[migration] Deleted orphan ${usageDoc._id} (userId: ${usageDoc.userId}, period: ${usageDoc.period}) — no subscription found`);
      continue;
    }

    const subId = String(matchingSub._id);
    const existingForSub = await UsageModel.findOne({
      userId: usageDoc.userId,
      subscriptionId: subId,
    });

    if (existingForSub) {
      await UsageModel.findOneAndUpdate(
        { _id: existingForSub._id },
        {
          $inc: {
            'metrics.mockInterviewsCreated': usageDoc.metrics?.mockInterviewsCreated || 0,
            'metrics.questionRegenerations': usageDoc.metrics?.questionRegenerations || 0,
            'metrics.aiGenerations': usageDoc.metrics?.aiGenerations || 0,
            'metrics.resumeExports': usageDoc.metrics?.resumeExports || 0,
          },
        },
      );
      await UsageModel.deleteOne({ _id: usageDoc._id });
      merged++;
      console.log(`[migration] Merged ${usageDoc._id} into existing record for subscription ${subId}`);
      continue;
    }

    await UsageModel.findOneAndUpdate(
      { _id: usageDoc._id },
      { $set: { subscriptionId: subId } },
    );
    linked++;
    console.log(`[migration] Linked ${usageDoc._id} → subscription ${subId}`);
  }

  console.log(`\n[migration] Complete. Linked: ${linked}, Merged+Deleted: ${merged}, Deleted (orphan): ${deleted}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('\n[error]', err.message || err);
  process.exit(1);
});
