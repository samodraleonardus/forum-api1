const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.threadCreateHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.threadFetchHandler,
  },
];

module.exports = routes;
