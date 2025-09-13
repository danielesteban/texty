
import { model, Schema, type HydratedDocument } from 'mongoose';

interface Scenario {
  name: string;
  description: string;
  nodes: Buffer;
  photo: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export type ScenarioDocument = HydratedDocument<Scenario>;

const ScenarioSchema = new Schema<Scenario>({
  name: {
    type: String,
    required: true,
  },
  description: {
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
}, { timestamps: true });

export const Scenario = model<Scenario>('Scenario', ScenarioSchema);
