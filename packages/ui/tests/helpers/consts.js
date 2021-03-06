export const additionalOptions = {
  label: 'Async Model',
  fieldName: 'asyncModel',
  options: [{ id: 'request/response', label: 'requestResponse' }, { id: 'request/stream', label: 'requestStream' }],
};

export const data = {
  hello: 'world',
  test: 7777,
  awesome: {
    like: 'this tool',
    howMuch: {
      likeThis: 55555,
    },
  },
};

export const generateBaseProps = ({ onSubmit = () => {} }) => {
  return {
    selectedMethodPath: 'greetingService/hello',
    content: {
      language: 'json',
      requestArgs: JSON.stringify(data, null, 2),
      timestamp: Date.now(),
    },
    onSubmit,
    width: '100%',
    title: 'Message',
    cache: true,
    msgId: 'test',
  };
};
