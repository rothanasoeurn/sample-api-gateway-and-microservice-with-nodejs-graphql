const { ENABLE_INTROSPECTION } = process.env;

const ENV = {
  ENABLE_INTROSPECTION: ENABLE_INTROSPECTION === 'true',
};

export default ENV;
