import mongoose from 'mongoose';
import { app } from './app.js';
import { config } from './config.js';
import { GenerationJobModel } from './model.js';

try { await mongoose.connect(config.MONGODB_URI,{serverSelectionTimeoutMS:8000});await GenerationJobModel.updateMany({status:{$in:['generating','queued']}},{$set:{status:'failed',stage:'failed',retryable:true,error:{code:'GENERATION_FAILED',message:'Generation was interrupted. You can safely retry.'}}});app.listen(config.PORT,()=>console.log(`Casefile API listening on port ${config.PORT}`)); }
catch{console.error('Could not connect to MongoDB. Check MONGODB_URI and confirm the database is running.');process.exit(1);}
