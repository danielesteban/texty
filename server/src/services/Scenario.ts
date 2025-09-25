import { badRequest, notFound } from '@hapi/boom';
import { type NextFunction, type Request, type Response } from 'express';
import { body, matchedData, param } from 'express-validator';
import { type Types as MongooseTypes } from 'mongoose';
import { v4 as uuid } from 'uuid';
import validator from 'validator';
import { type WebSocket } from 'ws';
import { type AuthorizedRequest } from 'core/Auth';
import { checkValidationResult } from 'core/ErrorHandler';
import { Scenario, User, type UserDocument } from 'models';
import { ProcessAction } from '../../../protocol/Actions';
import { Action, Language, Scenario as Protocol, type IScenario } from '../../../protocol/messages.js';

const defaultName: { [key in Language]: string } = {
  [Language.EN]: 'New Scenario',
  [Language.ES]: 'Nuevo Escenario',
};
const defaultPhoto = Buffer.from('/9j/4AAQSkZJRgABAQACWAJYAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACAAIADASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAEFBAYHAwII/8QAMhAAAgIBAgQDBQgDAQAAAAAAAAECAwQFEQYhMXETQdFRYXKRwRQVIiMkMoGhQlJi8P/EABgBAQADAQAAAAAAAAAAAAAAAAACAwQB/8QAGxEBAQACAwEAAAAAAAAAAAAAAAECEQMSMSH/2gAMAwEAAhEDEQA/AP36AC1iAAAAAAAbpdWAA3T6MAAAAAAAAAAAAAAA9Kabcm2NFFcp2Te0YrqzzN54W0eODiRzLofqL478/wDGHkvqzluksMe10x9L4Ox64q3U5eLN8/Di9oru+rL2nT8HHio04dMEvZBGQCFtrTMZj4x7tOwMiLjdh0zT9sEUOqcG49kZW6ZN1TXPw5PeL7PqjZgJbC4zL1yy6m3HtlRfW4WQe0ovqj4N54p0eObiPNph+oojvy/yh5r6o0YnLtmzx63QADqIAAAAAAADJ03HWXqGNjS/bZbFS7b8/wCjpiSS2RznQZqGs4cpdPFS+fL6nRyGS/h8oACK4AAENJrZrkcz1LHWJqGTjR/bXbKMe2/L+jppzjXpqes5ko9PFa+XIlip5vIwAATUAAAAAAAAPqE5VTjbB7Sg1KL96OmafmV6hh1ZdT5WR3a9j818zmJccP69PSLXVdvLGse8kusX/svqcym1nHl1v1vwPOjIoyqo349sbK5c1KL3R6FbSAHnkZFGLVK/ItjXXHm5SeyA8tQza9Pw7cu18q47pe1+S+ZzSc5WzlbN7ym3KT97LXiDXZ6vaqqt441b3in1k/8AZ/QqCzGaZuTPtfgADqsAAAAAAAAB9003ZFiqoqnZN9IxW7LzD4O1K9KWVOvGi/J/il8ly/sW6dmNy8VOHqGbp8/Ew8mdbfVLmn3XRlxVxrqMIpW41Fj9vOJaUcFabBfn5F9r9zUV/XqZUOFNDh1xHL4rJepG2LccM54obuNdSnHanGorft5yZTZmoZuoT8TMyJ2tdE+i7Lojd58KaHJbLEce1kvUxL+CtNmvyMi+p+9qS/8AfyJY5cM760sF9mcHanjpzxp15MV5L8Mvk/UpLabaLHVfVOua6xktmSl2ruNnr4AAcAAAAAAudE4cyNVavtbqxt/3ec/h9T54d0b72y3K5P7PTs7P+n5R9fcb7CEYRUIRUYxWySWySI5XS3j4+32vDB0/D06rwsSiNa835y7vzMkAg0Sa8AAAAAAxs7TsPUavCy6IzXk/OPZ+RkgHrQdb4cyNKbvqbuxt/wB+3OHxepTnVJwjZBwnFSjJbNNbpo0HiLRvunLUqU/s927r/wCX5xJ43bPycfX7FSACSoHQErqu4HROH8JYGlUVbbTnHxJ/FLn6L+CxIikopLokSVNkmpoAAdAAAAAAAACu4gwVn6VfXtvOEfEh8Uefqv5LE+ZpSi4vo1sHLNzTlfUDo2vYC1jCV1XdEErqu6A6oui7EkLouxJU2wAAAAAAAAAAAh9H2JIfR9gOVvq+7IJfV92QWsT/2Q==', 'base64');

const loadScenario = (id: string) => (
  Scenario
    .findById(id)
    .select('creator collaborators description language name nodes photo private')
    .populate<{ creator: UserDocument }>('creator', '-_id name')
    .populate<{ collaborators: UserDocument[] }>('collaborators', '-_id name')
    .lean()
    .then((scenario) => {
      if (!scenario) {
        throw notFound();
      }
      const data = Protocol.decode(scenario.nodes.buffer);
      const scenarioNode = data.nodes.find(({ scenario }) => !!scenario);
      if (!scenarioNode) {
        throw new Error("Couldn't find the scenario node");
      }
      scenarioNode.scenario!.creator = scenario.creator.name;
      scenarioNode.scenario!.collaborators = scenario.collaborators.map(({ name }) => name);
      scenarioNode.scenario!.description = scenario.description;
      scenarioNode.scenario!.language = scenario.language;
      scenarioNode.scenario!.name = scenario.name;
      scenarioNode.scenario!.photo = scenario.photo.buffer;
      scenarioNode.scenario!.private = scenario.private;
      return data;
    })
);

const saveScenario = async (id: string, data: Protocol) => {
  const scenario: IScenario = Protocol.toObject(data, { defaults: true });
  const scenarioNode = scenario.nodes?.find(({ scenario }) => !!scenario);
  if (!scenarioNode) {
    throw new Error("Couldn't find the scenario node");
  }
  const { collaborators, description, language, name, photo, private: isPrivate } = scenarioNode.scenario!;
  delete scenarioNode.scenario!.creator;
  delete scenarioNode.scenario!.collaborators;
  delete scenarioNode.scenario!.description;
  delete scenarioNode.scenario!.language;
  delete scenarioNode.scenario!.name;
  delete scenarioNode.scenario!.photo;
  delete scenarioNode.scenario!.private;
  const users = collaborators ? (
    await User
      .find({ name: { $in: collaborators } })
      .select('name')
      .exec()
  ) : [];
  return Scenario
    .updateOne({ _id: id }, {
      $set: {
        collaborators: collaborators!.reduce<MongooseTypes.ObjectId[]>((collaborators, name) => {
          const user = users.find((user) => user.name === name);
          if (user) {
            collaborators.push(user._id);
          }
          return collaborators;
        }, []),
        name,
        description,
        language,
        nodes: Buffer.from(Protocol.encode(scenario).finish()),
        photo: Buffer.from(photo!),
        private: isPrivate,
      },
    })
    .exec();
};

export const create = [
  body('language')
    .isIn(Object.values(Language))
    .toInt(),
  (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const { language } = matchedData<{ language: Language }>(req);
    const scenario = new Scenario({
      collaborators: [],
      creator: req.user._id,
      description: '',
      language,
      name: defaultName[language],
      nodes: Buffer.from(Protocol.encode(new Protocol({
        nodes: [
          {
            id: 'scenario',
            position: { x: -150, y: -316 },
            scenario: {},
          },
        ],
      })).finish()),
      photo: defaultPhoto,
      private: true,
    });
    scenario
      .save()
      .then(({ _id }) => (
        res.json(_id)
      ))
      .catch(next);
  },
];

export const load = [
  param('id')
    .isMongoId(),
  checkValidationResult,
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = matchedData<{ id: string }>(req);
    loadScenario(id)
      .then((data) => {
        res.send(Buffer.from(Protocol.encode(data).finish()));
      })
      .catch(next);
  },
];

export const remove = [
  param('id')
    .isMongoId(),
  checkValidationResult,
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = matchedData<{ id: string }>(req);
    Scenario
      .deleteOne({ _id: id })
      .then(() => {
        const editor = editors.get(id);
        if (editor) {
          editor.shutdown();
          editors.delete(id);
        }
        res.status(200).end();
      })
      .catch(next);
  },
];

export const listAll = (_: Request, res: Response, next: NextFunction) => {
  Scenario
    .find({ private: false })
    .select('name description')
    .sort({ createdAt: -1 })
    .lean()
    .then((scenarios) => (
      res.json(scenarios)
    ))
    .catch(next);
};

export const listEditable = [
  (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    Scenario
      .find({ $or: [{ creator: req.user._id }, { collaborators: req.user._id }] })
      .select('name description')
      .sort({ createdAt: -1 })
      .lean()
      .then((scenarios) => (
        res.json(scenarios)
      ))
      .catch(next);
  },
];

export const photo = [
  param('id')
    .isMongoId(),
  checkValidationResult,
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = matchedData<{ id: string }>(req);
    Scenario
      .findById(id)
      .select('updatedAt')
      .lean()
      .then((scenario) => {
        if (!scenario) {
          throw notFound();
        }
        const lastModified = scenario.updatedAt.toUTCString();
        if (req.get('if-modified-since') === lastModified) {
          res.status(304).end();
          return;
        }
        return Scenario
          .findById(scenario._id)
          .select('-_id photo')
          .lean()
          .then((scenario) => {
            if (!scenario) {
              throw notFound();
            }
            res
              .set('Cache-Control', 'must-revalidate')
              .set('Content-Type', 'image/png')
              .set('Last-Modified', lastModified)
              .send(scenario.photo.buffer)
          });
      })
      .catch(next);
  },
];

class Editor {
  private data: Protocol = null!;
  private readonly id;
  private loading?: Promise<void>;
  private readonly peers: (WebSocket & { id: string; isAlive: boolean; })[] = [];
  private saveTimer?: NodeJS.Timeout;
  private saving?: Promise<void>;

  constructor(id: string) {
    this.id = id;
  }

  async addPeer(ws: WebSocket, user: UserDocument) {
    if (this.loading) {
      await this.loading;
    } else if (!this.data) {
      this.loading = loadScenario(this.id).then((data) => {
        this.data = data;
        delete this.loading;
      });
      await this.loading;
    }
    if (ws.readyState !== ws.OPEN) {
      return;
    }
    const { data, peers } = this;
    const scenarioNode = data.nodes.find(({ scenario }) => !!scenario);
    if (!scenarioNode) {
      throw new Error("Couldn't find the scenario node");
    }
    if (!(
      user.name === scenarioNode.scenario!.creator!
      || scenarioNode.scenario!.collaborators!.includes(user.name)
    )) {
      ws.terminate();
      return;
    }
    const peer = ws as unknown as typeof this.peers[0];
    peer.id = uuid();
    peer.isAlive = true;
    peer.once('close', () => {
      const index = peers.findIndex(({ id }) => (id === peer.id));
      if (index !== -1) {
        peers.splice(index, 1);
      }
    });
    peer.on('message', (buffer) => {
      if (!(buffer instanceof Buffer)) {
        return;
      }
      try {
        const action = Action.decode(new Uint8Array(buffer));
        ProcessAction(data.nodes, action);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
        return;
      }
      peers.forEach((p) => {
        if (p.id === peer.id) {
          return;
        }
        p.send(buffer);
      });
      this.debounceSave();
    });
    peer.on('pong', () => {
      peer.isAlive = true;
    });
    peer.send(Protocol.encode(data).finish());
    peers.push(peer);
  }

  ping() {
    this.peers.forEach((peer) => {
      if (peer.isAlive === false) {
        peer.terminate();
        return;
      }
      peer.isAlive = false;
      peer.ping(() => {});
    });
    return !!this.loading || !!this.peers.length || !!this.saveTimer || !!this.saving;
  }

  shutdown() {
    this.peers.forEach((peer) => peer.close());
  }

  private async save() {
    if (!this.data) {
      throw new Error('Data is not loaded');
    }
    this.saving = saveScenario(this.id, this.data).then(() => {
      delete this.saving;
    });
    await this.saving;
  }

  private debounceSave() {
    if (!this.saveTimer) {
      this.saveTimer = setTimeout(() => {
        delete this.saveTimer;
        if (this.saving) {
          this.debounceSave();
        } else {
          this.save();
        }
      }, 1000);
    }
  }

  async forceSave() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      delete this.saveTimer;
      await this.save();
    }
    if (this.saving) {
      await this.saving;
    }
  }
}

const editors = new Map<string, Editor>();
const pingInterval = setInterval(() => (
  editors.forEach((editor, id) => {
    if (!editor.ping()) {
      editors.delete(id);
    }
  })
), 30000);

export const shutdownEditors = async () => {
  clearInterval(pingInterval);
  editors.forEach((editor) => editor.shutdown());
};

export const saveEditors = async () => {
  for (let editor of editors.values()) {
    await editor.forceSave();
  }
};

export const editor = [
  (ws: WebSocket, req: AuthorizedRequest, next: NextFunction) => {
    if (!validator.isMongoId(req.params.id)) {
      next(badRequest());
      return;
    }
    let editor = editors.get(req.params.id);
    if (!editor) {
      editor = new Editor(req.params.id);
      editors.set(req.params.id, editor);
    }
    editor.addPeer(ws, req.user);
  },
];
