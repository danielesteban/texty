import { Schema } from 'mongoose';

Schema.Types.String.checkRequired(v => typeof v === 'string');

export { Scenario, type ScenarioDocument } from 'models/Scenario';
export { User, type UserDocument } from 'models/User';
