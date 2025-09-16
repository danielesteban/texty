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
      nodes.push(action.create!);
      break;
    case 'remove': {
      const node = nodes.findIndex(({ id }) => id === action.remove!);
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
    case 'setResolutionStatus':
      getNode(nodes, action.setResolutionStatus!.id!).resolution!.status = action.setResolutionStatus!.value!;
      break;
    case 'setResolutionText':
      getNode(nodes, action.setResolutionText!.id!).resolution!.text = action.setResolutionText!.value!;
      break;
    case 'setScenarioDescription':
      getNode(nodes, action.setScenarioDescription!.id!).scenario!.description = action.setScenarioDescription!.value!;
      break;
    case 'setScenarioName':
      getNode(nodes, action.setScenarioName!.id!).scenario!.name = action.setScenarioName!.value!;
      break;
    case 'setScenarioPhoto':
      getNode(nodes, action.setScenarioPhoto!.id!).scenario!.photo = action.setScenarioPhoto!.value!;
      break;
    case 'setScenarioStart':
      getNode(nodes, action.setScenarioStart!.id!).scenario!.start = action.setScenarioStart!.value!;
      break;
  }
};
