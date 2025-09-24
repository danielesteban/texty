import { Action, type INode as Node } from './messages.js';

const getNode = (nodes: Node[], id: string) => {
  const node = nodes.find((node) => node.id === id);
  if (!node) {
    throw new Error("Couldn't find node");
  }
  return node;
};

const getMessageResponse = (nodes: Node[], id: string, child: number) => {
  const response = getNode(nodes, id).message!.responses![child];
  if (!response) {
    throw new Error("Couldn't find response");
  }
  return response;
};

export const ProcessAction = (nodes: Node[], action: Action) => {
  switch (action.type) {
    case 'create':
      if (action.create!.scenario) {
        throw new Error("Can't create an scenario node");
      }
      nodes.push(action.create!);
      break;
    case 'remove': {
      const node = nodes.findIndex((node) => node.id === action.remove! && !node.scenario);
      if (node === -1) {
        throw new Error("Couldn't find node");
      }
      nodes.splice(node, 1);
      nodes.forEach((node) => {
        if (node.message) {
          node.message.responses!.forEach((response) => {
            if (response.next === action!.remove!) {
              delete response.next;
            }
          });
        }
        if (node.scenario) {
          if (node.scenario.start === action!.remove!) {
            delete node.scenario.start;
          }
        }
      });
      break;
    }
    case 'setPosition':
      getNode(nodes, action.setPosition!.id!).position = action.setPosition!.value!;
      break;
    case 'setMessageText':
      getNode(nodes, action.setMessageText!.id!).message!.text = action.setMessageText!.value!;
      break;
    case 'setMessageReponseText':
      getMessageResponse(nodes, action.setMessageReponseText!.id!, action.setMessageReponseText!.child!).text = action.setMessageReponseText!.value!;
      break;
    case 'setMessageReponseNext':
      getMessageResponse(nodes, action.setMessageReponseNext!.id!, action.setMessageReponseNext!.child!).next = action.setMessageReponseNext!.value!;
      break;
    case 'setResolutionMessage':
      getNode(nodes, action.setResolutionMessage!.id!).resolution!.message = action.setResolutionMessage!.value!;
      break;
    case 'setResolutionResult':
      getNode(nodes, action.setResolutionResult!.id!).resolution!.result = action.setResolutionResult!.value!;
      break;
    case 'setResolutionStatus':
      getNode(nodes, action.setResolutionStatus!.id!).resolution!.status = action.setResolutionStatus!.value!;
      break;
    case 'addScenarioCollaborator': {
      const node = getNode(nodes, action.addScenarioCollaborator!.id!).scenario!;
      if (node.creator === action.addScenarioCollaborator!.value!) {
        throw new Error("Creator can't be a collaborator");
      }
      if (node.collaborators!.includes(action.addScenarioCollaborator!.value!)) {
        throw new Error('User is already a collaborator');
      }
      node.collaborators!.push(action.addScenarioCollaborator!.value!);
      break;
    }
    case 'removeScenarioCollaborator': {
      const collaborators = getNode(nodes, action.removeScenarioCollaborator!.id!).scenario!.collaborators!;
      const index = collaborators.indexOf(action.removeScenarioCollaborator!.value!);
      if (index === -1) {
        throw new Error("Couldn't find collaborator");
      }
      collaborators.splice(index, 1);
      break;
    }
    case 'setScenarioDescription':
      getNode(nodes, action.setScenarioDescription!.id!).scenario!.description = action.setScenarioDescription!.value!;
      break;
    case 'setScenarioLanguage':
      getNode(nodes, action.setScenarioLanguage!.id!).scenario!.language = action.setScenarioLanguage!.value!;
      break;
    case 'setScenarioName':
      getNode(nodes, action.setScenarioName!.id!).scenario!.name = action.setScenarioName!.value!;
      break;
    case 'setScenarioPhoto':
      getNode(nodes, action.setScenarioPhoto!.id!).scenario!.photo = action.setScenarioPhoto!.value!;
      break;
    case 'setScenarioPrivate':
      getNode(nodes, action.setScenarioPrivate!.id!).scenario!.private = action.setScenarioPrivate!.value!;
      break;
    case 'setScenarioStart':
      getNode(nodes, action.setScenarioStart!.id!).scenario!.start = action.setScenarioStart!.value!;
      break;
  }
};
