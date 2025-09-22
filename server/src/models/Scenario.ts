
import { model, Schema, type HydratedDocument, type Types } from 'mongoose';

interface Scenario {
  collaborators: Types.ObjectId[];
  creator: Types.ObjectId;
  description: string;
  name: string;
  nodes: Buffer;
  photo: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export type ScenarioDocument = HydratedDocument<Scenario>;

const ScenarioSchema = new Schema<Scenario>({
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nodes: {
    type: Buffer,
    required: true,
  },
  photo: {
    type: Buffer,
    required: true,
  },
  createdAt: { type: Date, index: -1 },
  updatedAt: Date,
}, { timestamps: true });

export const Scenario = model<Scenario>('Scenario', ScenarioSchema);
