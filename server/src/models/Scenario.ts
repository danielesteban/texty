
import { model, Schema, type HydratedDocument, type Types } from 'mongoose';
import { Language } from '../../../protocol/messages.js';

interface Scenario {
  collaborators: Types.ObjectId[];
  creator: Types.ObjectId;
  description: string;
  language: Language;
  name: string;
  nodes: Buffer;
  photo: Buffer;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ScenarioDocument = HydratedDocument<Scenario>;

const ScenarioSchema = new Schema<Scenario>({
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  language: {
    type: Number,
    enum: Object.values(Language),
    required: true,
    index: true,
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
  private: {
    type: Boolean,
    required: true,
    index: true,
  },
  createdAt: { type: Date, index: -1 },
  updatedAt: Date,
}, { timestamps: true });

export const Scenario = model<Scenario>('Scenario', ScenarioSchema);
